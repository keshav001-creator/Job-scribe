const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')

let mongod

beforeAll(async () => {
  process.env.JWT_SECRET_KEY = 'testsecret'
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// helper to register and login a user and return cookie header
async function getAuthCookie(email = 'user@example.com') {
  const payload = {
    userEmail: email,
    userPassword: 'password123',
    fullName: { firstName: 'Test', lastName: 'User' }
  }

  await request(app).post('/api/register').send(payload)
  const res = await request(app).post('/api/login').send({
    userEmail: payload.userEmail,
    userPassword: payload.userPassword
  })

  const setCookie = res.headers['set-cookie']
  return Array.isArray(setCookie) ? setCookie.join(';') : setCookie
}

describe('Job APIs', () => {
  describe('POST /api/job', () => {
    it('creates a job successfully', async () => {
      const cookie = await getAuthCookie('post-success@example.com')

      const payload = {
        company: 'Acme Corp',
        JobDescription: 'A'.repeat(100),
        role: 'Engineer',
        status: 'applied',
        appliedDate: '2025-01-01'
      }

      const res = await request(app).post('/api/job').set('Cookie', cookie).send(payload)

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('job created successfully')
      expect(res.body.Job).toBeDefined()
      expect(res.body.Job.company).toBe(payload.company)
    })

    it('returns 409 for duplicate company for same user', async () => {
      const cookie = await getAuthCookie('post-dup@example.com')

      const payload = {
        company: 'Unique Co',
        JobDescription: 'B'.repeat(100),
        role: 'Developer',
        status: 'applied',
        appliedDate: '2025-01-02'
      }

      await request(app).post('/api/job').set('Cookie', cookie).send(payload)
      const res = await request(app).post('/api/job').set('Cookie', cookie).send(payload)

      expect(res.status).toBe(409)
      expect(res.body.message).toBe('already created the job with this company')
    })

    it('returns 400 for missing required fields', async () => {
      const cookie = await getAuthCookie('post-missing@example.com')

      const res = await request(app).post('/api/job').set('Cookie', cookie).send({})

      expect(res.status).toBe(400)
      expect(Array.isArray(res.body.errors)).toBe(true)
    })

    it('returns 401 for missing token', async () => {
      const payload = {
        company: 'NoAuth Co',
        JobDescription: 'C'.repeat(100),
        role: 'Dev',
        status: 'applied',
        appliedDate: '2025-01-03'
      }

      const res = await request(app).post('/api/job').send(payload)

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })

    it('returns 401 for invalid token', async () => {
      const payload = {
        company: 'BadToken Co',
        JobDescription: 'D'.repeat(100),
        role: 'Dev',
        status: 'applied',
        appliedDate: '2025-01-04'
      }

      const res = await request(app).post('/api/job').set('Cookie', 'token=invalid').send(payload)

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Invalid or expired token, plesase login again')
    })
  })

  describe('GET /api/job', () => {
    it('fetches all jobs successfully', async () => {
      const cookie = await getAuthCookie('get-all@example.com')

      const payload1 = {
        company: 'G1',
        JobDescription: 'E'.repeat(100),
        role: 'Role1',
        status: 'applied',
        appliedDate: '2025-02-01'
      }
      const payload2 = {
        company: 'G2',
        JobDescription: 'F'.repeat(100),
        role: 'Role2',
        status: 'interview',
        appliedDate: '2025-02-02'
      }

      await request(app).post('/api/job').set('Cookie', cookie).send(payload1)
      await request(app).post('/api/job').set('Cookie', cookie).send(payload2)

      const res = await request(app).get('/api/job').set('Cookie', cookie)

      expect(res.status).toBe(200)
      expect(res.body.jobs).toBeDefined()
      expect(Array.isArray(res.body.jobs)).toBe(true)
      expect(res.body.jobs.length).toBe(2)
    })

    it('returns 401 for missing token', async () => {
      const res = await request(app).get('/api/job')
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })
  })

  describe('GET /api/job/:id', () => {
    it('fetches job by valid ID', async () => {
      const cookie = await getAuthCookie('get-by-id@example.com')

      const payload = {
        company: 'GBI Co',
        JobDescription: 'G'.repeat(100),
        role: 'Engineer',
        status: 'applied',
        appliedDate: '2025-03-01'
      }

      const createRes = await request(app).post('/api/job').set('Cookie', cookie).send(payload)
      const id = createRes.body.Job._id

      const res = await request(app).get(`/api/job/${id}`).set('Cookie', cookie)

      expect(res.status).toBe(200)
      expect(res.body.Job).toBeDefined()
      expect(res.body.Job._id).toBe(id)
    })

    it('returns 404 for invalid job ID', async () => {
      const cookie = await getAuthCookie('get-invalid-id@example.com')
      const res = await request(app).get('/api/job/invalid-id').set('Cookie', cookie)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Job not found')
    })

    it('returns 404 for non-existing job ID', async () => {
      const cookie = await getAuthCookie('get-nonexist@example.com')
      const nonExistId = new mongoose.Types.ObjectId().toString()
      const res = await request(app).get(`/api/job/${nonExistId}`).set('Cookie', cookie)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('no job found')
    })

    it('returns 401 for missing token', async () => {
      const res = await request(app).get(`/api/job/${new mongoose.Types.ObjectId().toString()}`)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })
  })

  describe('PATCH /api/job/:id', () => {
    it('updates job successfully', async () => {
      const cookie = await getAuthCookie('patch-success@example.com')

      const payload = {
        company: 'PatchCo',
        JobDescription: 'H'.repeat(100),
        role: 'Dev',
        status: 'applied',
        appliedDate: '2025-04-01'
      }

      const createRes = await request(app).post('/api/job').set('Cookie', cookie).send(payload)
      const id = createRes.body.Job._id

      const updateRes = await request(app).patch(`/api/job/${id}`).set('Cookie', cookie).send({ role: 'Senior Dev' })

      expect(updateRes.status).toBe(200)
      expect(updateRes.body.updateJob).toBeDefined()
      expect(updateRes.body.updateJob.role).toBe('Senior Dev')
    })

    it('returns 404 for invalid job ID', async () => {
      const cookie = await getAuthCookie('patch-invalid-id@example.com')
      const res = await request(app).patch('/api/job/invalid-id').set('Cookie', cookie).send({ role: 'X' })
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Job not found')
    })

    it('returns 404 for non-existing job', async () => {
      const cookie = await getAuthCookie('patch-nonexist@example.com')
      const nonExistId = new mongoose.Types.ObjectId().toString()
      const res = await request(app).patch(`/api/job/${nonExistId}`).set('Cookie', cookie).send({ role: 'X' })
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Job not found')
    })

    it('returns 401 for missing token', async () => {
      const res = await request(app).patch(`/api/job/${new mongoose.Types.ObjectId().toString()}`).send({ role: 'X' })
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })
  })

  describe('DELETE /api/job/:id', () => {
    it('deletes job successfully', async () => {
      const cookie = await getAuthCookie('delete-success@example.com')

      const payload = {
        company: 'DelCo',
        JobDescription: 'I'.repeat(100),
        role: 'Engineer',
        status: 'applied',
        appliedDate: '2025-05-01'
      }

      const createRes = await request(app).post('/api/job').set('Cookie', cookie).send(payload)
      const id = createRes.body.Job._id

      const res = await request(app).delete(`/api/job/${id}`).set('Cookie', cookie)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('job deleted successfully')
    })

    it('returns 404 for invalid job ID', async () => {
      const cookie = await getAuthCookie('delete-invalid-id@example.com')
      const res = await request(app).delete('/api/job/invalid-id').set('Cookie', cookie)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Job not found')
    })

    it('returns 404 for non-existing job', async () => {
      const cookie = await getAuthCookie('delete-nonexist@example.com')
      const nonExistId = new mongoose.Types.ObjectId().toString()
      const res = await request(app).delete(`/api/job/${nonExistId}`).set('Cookie', cookie)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe('job not found')
    })

    it('returns 401 for missing token', async () => {
      const res = await request(app).delete(`/api/job/${new mongoose.Types.ObjectId().toString()}`)
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('unauthorised user')
    })
  })
})
