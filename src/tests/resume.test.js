const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const jwt = require('jsonwebtoken')

// ------------------- MOCKS -------------------
// Must mock before requiring modules that import them
jest.mock('pdf-parse', () => jest.fn())
jest.mock('../models/resume.model', () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}))
jest.mock('../models/form.model', () => ({
  findOne: jest.fn()
}))
jest.mock('../models/user.model', () => ({
  findById: jest.fn()
}))
jest.mock('../services/ai.service', () => jest.fn())

// ------------------- MODULE IMPORTS -------------------
const pdf = require('pdf-parse')
const resumeModel = require('../models/resume.model')
const formModel = require('../models/form.model')
const userModel = require('../models/user.model')
const generateResponse = require('../services/ai.service')

// Load app after mocks
const app = require('../app')

let mongod

// ------------------- SETUP -------------------
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = 'testsecret' // Must be set before creating tokens
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

afterEach(async () => {
  jest.clearAllMocks()
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// ------------------- TEST SUITE -------------------
describe('Resume routes', () => {
  const userId = 'userId123'
  let token

  beforeAll(() => {
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY)
  })

  beforeEach(() => {
    // default auth user lookup
    userModel.findById.mockResolvedValue({ id: userId })
  })

  // ------------------- POST /upload -------------------
  describe('POST /api/upload', () => {
    it('returns 401 when token missing', async () => {
      const res = await request(app).post('/api/upload')
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })

    it('rejects non-pdf files', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Cookie', [`token=${token}`])
        .attach('resume', Buffer.from('not a pdf'), { filename: 'file.txt', contentType: 'text/plain' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('only pdf resumes are supported')
    })

    it('returns 400 when file missing', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Cookie', [`token=${token}`])
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Resume file is required')
    })

    it('returns 400 when extracted resume content is empty', async () => {
      pdf.mockResolvedValue({ text: '   ' })

      const res = await request(app)
        .post('/api/upload')
        .set('Cookie', [`token=${token}`])
        .attach('resume', Buffer.from('%PDF-1.4 fake'), { filename: 'resume.pdf', contentType: 'application/pdf' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('resume content is empty')
    })

    it('uploads resume successfully for valid pdf and token', async () => {
      const extracted = 'This is a parsed resume content'
      pdf.mockResolvedValue({ text: extracted })
      const savedResume = { userId, content: extracted }
      resumeModel.findOneAndUpdate.mockResolvedValue(savedResume)

      const res = await request(app)
        .post('/api/upload')
        .set('Cookie', [`token=${token}`])
        .attach('resume', Buffer.from('%PDF-1.4 real'), { filename: 'resume.pdf', contentType: 'application/pdf' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('resume uploaded successfully')
      expect(res.body.resume).toBeDefined()
      expect(res.body.resume.content).toBe(extracted)
    })
  })

  // ------------------- GET /resume -------------------
  describe('GET /api/resume', () => {
    it('returns 401 when token missing', async () => {
      const res = await request(app).get('/api/resume')
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })

    it('returns 404 when resume not found', async () => {
      resumeModel.findOne.mockResolvedValue(null)
      const res = await request(app).get('/api/resume').set('Cookie', [`token=${token}`])
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Resume not found, upload resume')
    })

    it('fetches resume successfully', async () => {
      const savedResume = { userId, content: 'resume content' }
      resumeModel.findOne.mockResolvedValue(savedResume)

      const res = await request(app).get('/api/resume').set('Cookie', [`token=${token}`])

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Resume fetched successfully')
      expect(res.body.resume).toBeDefined()
      expect(res.body.resume.content).toBe(savedResume.content)
    })
  })

  // ------------------- POST /resume/optimize/:id -------------------
  describe('POST /api/resume/optimize/:id', () => {
    const jobId = new mongoose.Types.ObjectId().toString()

    it('returns 401 when token missing', async () => {
      const res = await request(app).post(`/api/resume/optimize/${jobId}`)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })

    it('returns 400 when job not found', async () => {
      formModel.findOne.mockResolvedValue(null)
      const res = await request(app)
        .post(`/api/resume/optimize/${jobId}`)
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('job not found')
    })

    it('returns 400 when resume not uploaded', async () => {
      formModel.findOne.mockResolvedValue({ _id: jobId, userId, JobDescription: 'JD', role: 'Dev' })
      resumeModel.findOne.mockResolvedValue(null)

      const res = await request(app)
        .post(`/api/resume/optimize/${jobId}`)
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Resume not found, upload your resume')
    })

    it('optimizes resume successfully', async () => {
      const job = { _id: jobId, userId, JobDescription: 'Some job description', role: 'Developer' }
      const baseResume = { userId, content: 'base resume content' }
      formModel.findOne.mockResolvedValue(job)
      resumeModel.findOne.mockResolvedValue(baseResume)
      generateResponse.mockResolvedValue('- Bullet 1\n- Bullet 2')

      const res = await request(app)
        .post(`/api/resume/optimize/${jobId}`)
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Resume optimization successfull')
      expect(res.body.OptimizedResume).toBeDefined()
      expect(res.body.OptimizedResume.split('\n')[0]).toMatch(/^- /)
      expect(res.body.OptimizedResume).toContain('Bullet 1')
      expect(res.body.OptimizedResume).toContain('Bullet 2')
    })

    it('handles AI service failure', async () => {
      const job = { _id: jobId, userId, JobDescription: 'JD', role: 'Dev' }
      const baseResume = { userId, content: 'base resume content' }
      formModel.findOne.mockResolvedValue(job)
      resumeModel.findOne.mockResolvedValue(baseResume)
      generateResponse.mockRejectedValue(new Error('AI service failed'))

      const res = await request(app)
        .post(`/api/resume/optimize/${jobId}`)
        .set('Cookie', [`token=${token}`])

      expect(res.status).toBe(500)
      expect(res.body.message).toBe('error while optimizing resume')
      expect(res.body.error).toBe('AI service failed')
    })
  })
})
