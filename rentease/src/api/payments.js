import api from './axiosInstance'

export const paymentsAPI = {
  // POST /api/payments/initialize
  initialize: async ({ propertyId, amount, type }) => {
    const response = await api.post('/payments/initialize', { propertyId, amount, type })
    return response.data
  },

  // GET /api/payments/verify/:reference
  verify: async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`)
    return response.data
  },

  // GET /api/payments/history
  getHistory: async () => {
    const response = await api.get('/payments/history')
    return response.data
  },
}
