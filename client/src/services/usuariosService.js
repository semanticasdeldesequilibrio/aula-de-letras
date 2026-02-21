import api from './api'

export const usuariosService = {
  async getPerfil(id) {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  async getPlanesByUsuario(id) {
    const response = await api.get(`/usuarios/${id}/planes`)
    return response.data
  },

  async seguir(id) {
    const response = await api.post(`/usuarios/${id}/seguir`)
    return response.data
  },

  async dejarDeSeguir(id) {
    const response = await api.delete(`/usuarios/${id}/seguir`)
    return response.data
  },

  async getSeguidores(id) {
    const response = await api.get(`/usuarios/${id}/seguidores`)
    return response.data
  },

  async getSiguiendo(id) {
    const response = await api.get(`/usuarios/${id}/siguiendo`)
    return response.data
  },

  async getFeed() {
    const response = await api.get('/feed')
    return response.data
  },

  async buscarUsuarios(query) {
    const response = await api.get('/usuarios/buscar', { params: { q: query } })
    return response.data
  }
}
