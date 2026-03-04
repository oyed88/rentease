import api from './axiosInstance'

export const reviewsAPI = {
  // GET /api/reviews/:propertyId
  getAll: async (propertyId) => {
    const response = await api.get(`/reviews/${propertyId}`)
    return response.data
  },

  // POST /api/reviews/:propertyId
  add: async (propertyId, { rating, comment }) => {
    const response = await api.post(`/reviews/${propertyId}`, { rating, comment })
    return response.data
  },

  // DELETE /api/reviews/:reviewId
  remove: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  },
}
