import request from 'supertest'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../routes/authRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

const testUser = {
  name: 'Test User',
  email: 'testuser@rentease.ng',
  password: 'password123',
  role: 'tenant',
}

let authToken = ''

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

afterAll(async () => {
  const { default: User } = await import('../models/User.js')
  await User.deleteOne({ email: testUser.email })
  await mongoose.connection.close()
})

describe('Auth API', () => {
  test('POST /api/auth/register - registers new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })

  test('POST /api/auth/register - fails with duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.statusCode).toBe(400)
  })

  test('POST /api/auth/register - fails with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' })
    expect(res.statusCode).toBe(400)
  })

  test('POST /api/auth/login - logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    authToken = res.body.token
  })

  test('POST /api/auth/login - fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
    expect(res.statusCode).toBe(401)
  })

  test('GET /api/auth/me - returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe(testUser.email)
  })

  test('GET /api/auth/me - fails without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.statusCode).toBe(401)
  })
})
