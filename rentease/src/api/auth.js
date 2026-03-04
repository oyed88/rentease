import api from './axiosInstance'

export const authAPI = {
  // POST /api/auth/register
  register: async ({ name, email, password, role }) => {
    const response = await api.post('/auth/register', { name, email, password, role })
    return response.data
  },

  // POST /api/auth/login
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // GET /api/auth/me
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}