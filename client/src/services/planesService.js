import api from './api'

export const planesService = {
  async getPlanes(params = {}) {
    const response = await api.get('/planes', { params })
    return response.data
  },

  async getPlan(id) {
    const response = await api.get(`/planes/${id}`)
    return response.data
  },

  async crearPlan(planData) {
    const response = await api.post('/planes', planData)
    return response.data
  },

  async actualizarPlan(id, planData) {
    const response = await api.put(`/planes/${id}`, planData)
    return response.data
  },

  async eliminarPlan(id) {
    const response = await api.delete(`/planes/${id}`)
    return response.data
  },

  async subirArchivo(planId, archivo) {
    const formData = new FormData()
    formData.append('archivo', archivo)
    
    const response = await api.post(`/planes/${planId}/archivos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async eliminarArchivo(planId, archivoId) {
    const response = await api.delete(`/planes/${planId}/archivos/${archivoId}`)
    return response.data
  },

  async valorarPlan(planId, estrellas) {
    const response = await api.post(`/planes/${planId}/valorar`, { estrellas })
    return response.data
  },

  async getComentarios(planId) {
    const response = await api.get(`/planes/${planId}/comentarios`)
    return response.data
  },

  async agregarComentario(planId, contenido) {
    const response = await api.post(`/planes/${planId}/comentarios`, { contenido })
    return response.data
  },

  async eliminarComentario(comentarioId) {
    const response = await api.delete(`/comentarios/${comentarioId}`)
    return response.data
  },

  async toggleFavorito(planId) {
    const response = await api.post(`/planes/${planId}/favorito`)
    return response.data
  },

  async getFavoritos() {
    const response = await api.get('/planes/favoritos')
    return response.data
  },

  async getMisPlanes() {
    const response = await api.get('/planes/mis-planes')
    return response.data
  },

  async getTemas(year = null) {
    const params = year ? { year } : {}
    const response = await api.get('/temas', { params })
    return response.data
  }
}
