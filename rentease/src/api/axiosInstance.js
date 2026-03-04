import axios from 'axios'

// Create a reusable axios instance with base config
const api = axios.create({
  baseURL: '/api',           // proxied to http://localhost:5000/api via vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentease_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: handle 401 (token expired) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rentease_token')
      localStorage.removeItem('rentease_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
