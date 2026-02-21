import api from './api'

export const mensajesService = {
  async getConversaciones() {
    const response = await api.get('/mensajes')
    return response.data
  },

  async getConversacion(usuarioId) {
    const response = await api.get(`/mensajes/${usuarioId}`)
    return response.data
  },

  async enviarMensaje(receptorId, contenido) {
    const response = await api.post('/mensajes', { 
      receptor_id: receptorId, 
      contenido 
    })
    return response.data
  },

  async marcarComoLeido(mensajeId) {
    const response = await api.put(`/mensajes/${mensajeId}/leer`)
    return response.data
  },

  async getMensajesNoLeidos() {
    const response = await api.get('/mensajes/no-leidos/count')
    return response.data
  }
}
