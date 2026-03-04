import request from 'supertest'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from '../routes/authRoutes.js'
import propertyRoutes from '../routes/propertyRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)

let authToken = ''
let propertyId = ''

const landlord = {
  name: 'Test Landlord',
  email: 'landlord.test@rentease.ng',
  password: 'password123',
  role: 'landlord',
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  await request(app).post('/api/auth/register').send(landlord)
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: landlord.email, password: landlord.password })
  authToken = res.body.token
})

afterAll(async () => {
  const { default: User }     = await import('../models/User.js')
  const { default: Property } = await import('../models/Property.js')
  await User.deleteOne({ email: landlord.email })
  if (propertyId) await Property.deleteOne({ _id: propertyId })
  await mongoose.connection.close()
})

describe('Property API', () => {
  test('GET /api/properties - returns list of properties', async () => {
    const res = await request(app).get('/api/properties')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.properties)).toBe(true)
    expect(res.body).toHaveProperty('total')
  })

  test('GET /api/properties - supports city filter', async () => {
    const res = await request(app).get('/api/properties?city=Lagos')
    expect(res.statusCode).toBe(200)
  })

  test('POST /api/properties - creates property when authenticated', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '3 Bedroom Flat in Lekki',
        description: 'A beautiful flat with modern amenities',
        type: 'apartment',
        purpose: 'rent',
        price: 1500000,
        address: '12 Admiralty Way',
        city: 'Lekki',
        state: 'Lagos',
        bedrooms: 3,
        bathrooms: 2,
      })
    expect(res.statusCode).toBe(201)
    expect(res.body.property.title).toBe('3 Bedroom Flat in Lekki')
    propertyId = res.body.property._id
  })

  test('POST /api/properties - fails without authentication', async () => {
    const res = await request(app)
      .post('/api/properties')
      .send({ title: 'Unauthorized Property' })
    expect(res.statusCode).toBe(401)
  })

  test('GET /api/properties/:id - returns single property', async () => {
    if (!propertyId) return
    const res = await request(app).get(`/api/properties/${propertyId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.property._id).toBe(propertyId)
  })

  test('PUT /api/properties/:id - updates a property', async () => {
    if (!propertyId) return
    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Title' })
    expect(res.statusCode).toBe(200)
  })

  test('DELETE /api/properties/:id - deletes a property', async () => {
    if (!propertyId) return
    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/deleted/i)
  })
})