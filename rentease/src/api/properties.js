import api from './axiosInstance'

export const propertiesAPI = {
  // GET /api/properties
  getAll: async (filters = {}) => {
    const response = await api.get('/properties', { params: filters })
    return response.data
  },

  // GET /api/properties/:id
  getOne: async (id) => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },

  // POST /api/properties
  create: async (propertyData) => {
    const response = await api.post('/properties', propertyData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // PUT /api/properties/:id
  update: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData)
    return response.data
  },

  // DELETE /api/properties/:id
  remove: async (id) => {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },
}