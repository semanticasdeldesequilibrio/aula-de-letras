import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async registro(userData) {
    const response = await api.post('/auth/registro', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/perfil')
    return response.data
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/perfil', userData)
    return response.data
  },

  async recuperarPassword(email) {
    const response = await api.post('/auth/recuperar', { email })
    return response.data
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset', { token, password })
    return response.data
  },

  async verificarEmail(token) {
    const response = await api.get(`/auth/verificar/${token}`)
    return response.data
  }
}
