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

describe('POST /api/register', () => {
  it('Successful registration', async () => {
    const payload = {
      userEmail: 'test@example.com',
      userPassword: 'password123',
      fullName: { firstName: 'John', lastName: 'Doe' }
    }

    const res = await request(app).post('/api/register').send(payload)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('User registered successfully')
    expect(res.body.User).toBeDefined()
    expect(res.body.User.email).toBe(payload.userEmail)
  })

  it('User already exists', async () => {
    const payload = {
      userEmail: 'exist@example.com',
      userPassword: 'password123',
      fullName: { firstName: 'Jane', lastName: 'Doe' }
    }

    await request(app).post('/api/register').send(payload)
    const res = await request(app).post('/api/register').send(payload)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('User already exists')
  })

  it('Validation errors for invalid input', async () => {
    const payload = {
      userEmail: 'not-an-email',
      userPassword: '123',
      fullName: { firstName: '', lastName: 123 }
    }

    const res = await request(app).post('/api/register').send(payload)

    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.errors)).toBe(true)

    const params = res.body.errors.map(e => e.path)
    expect(params).toEqual(expect.arrayContaining(['userEmail', 'userPassword', 'fullName.firstName', 'fullName.lastName']))
  })
})

describe('POST /api/login', () => {
  it('Successful login with valid email and password', async () => {
    const registerPayload = {
      userEmail: 'login@example.com',
      userPassword: 'password123',
      fullName: { firstName: 'Alice', lastName: 'Smith' }
    }

    await request(app).post('/api/register').send(registerPayload)

    const res = await request(app).post('/api/login').send({
      userEmail: registerPayload.userEmail,
      userPassword: registerPayload.userPassword
    })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('login successfully')
    expect(res.body.User).toBeDefined()
    expect(res.body.User.email).toBe(registerPayload.userEmail)
  })

  it('Login fails when user does not exist', async () => {
    const res = await request(app).post('/api/login').send({
      userEmail: 'doesnotexist@example.com',
      userPassword: 'password123'
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('user is not registered')
  })

  it('Login fails with incorrect password', async () => {
    const registerPayload = {
      userEmail: 'wrongpass@example.com',
      userPassword: 'correctpassword',
      fullName: { firstName: 'Bob', lastName: 'Jones' }
    }

    await request(app).post('/api/register').send(registerPayload)

    const res = await request(app).post('/api/login').send({
      userEmail: registerPayload.userEmail,
      userPassword: 'incorrect'
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Password is invalid')
  })

  it('Validation error when email or password is missing or invalid', async () => {
    // missing password
    const resMissing = await request(app).post('/api/login').send({
      userEmail: 'some@example.com'
    })

    expect(resMissing.status).toBe(400)
    expect(Array.isArray(resMissing.body.errors)).toBe(true)
    const paramsMissing = resMissing.body.errors.map(e => e.path)
    expect(paramsMissing).toEqual(expect.arrayContaining(['userPassword']))

    // invalid email (not a string)
    const resInvalidEmail = await request(app).post('/api/login').send({
      userEmail: {},
      userPassword: 'password123'
    })

    expect(resInvalidEmail.status).toBe(400)
    expect(Array.isArray(resInvalidEmail.body.errors)).toBe(true)
    const paramsInvalidEmail = resInvalidEmail.body.errors.map(e => e.path)
    expect(paramsInvalidEmail).toEqual(expect.arrayContaining(['userEmail']))
  })

  it('Token cookie is set on successful login', async () => {
    const registerPayload = {
      userEmail: 'cookie@example.com',
      userPassword: 'password123',
      fullName: { firstName: 'Cookie', lastName: 'Tester' }
    }

    await request(app).post('/api/register').send(registerPayload)

    const res = await request(app).post('/api/login').send({
      userEmail: registerPayload.userEmail,
      userPassword: registerPayload.userPassword
    })

    expect(res.status).toBe(200)
    const setCookie = res.headers['set-cookie']
    expect(setCookie).toBeDefined()
    expect(setCookie[0]).toEqual(expect.stringContaining('token='))
  })
})
