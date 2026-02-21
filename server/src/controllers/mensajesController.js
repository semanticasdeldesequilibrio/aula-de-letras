const prisma = require('../config/database')

const getConversaciones = async (req, res, next) => {
  try {
    // Get all unique conversations
    const mensajes = await prisma.mensaje.findMany({
      where: {
        OR: [
          { emisor_id: req.user.id },
          { receptor_id: req.user.id }
        ]
      },
      include: {
        emisor: { select: { id: true, nombre: true, avatar_url: true } },
        receptor: { select: { id: true, nombre: true, avatar_url: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    // Group by conversation partner
    const conversaciones = {}
    for (const mensaje of mensajes) {
      const partnerId = mensaje.emisor_id === req.user.id 
        ? mensaje.receptor_id 
        : mensaje.emisor_id
      const partner = mensaje.emisor_id === req.user.id 
        ? mensaje.receptor 
        : mensaje.emisor

      if (!conversaciones[partnerId]) {
        conversaciones[partnerId] = {
          usuario: partner,
          ultimo_mensaje: mensaje.contenido,
          fecha: mensaje.created_at,
          no_leidos: 0
        }
      }

      if (!mensaje.leido && mensaje.receptor_id === req.user.id) {
        conversaciones[partnerId].no_leidos++
      }
    }

    res.json(Object.values(conversaciones))
  } catch (error) {
    next(error)
  }
}

const getConversacion = async (req, res, next) => {
  try {
    const { usuarioId } = req.params

    // Get user info
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nombre: true, avatar_url: true }
    })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Get messages
    const mensajes = await prisma.mensaje.findMany({
      where: {
        OR: [
          { emisor_id: req.user.id, receptor_id: usuarioId },
          { emisor_id: usuarioId, receptor_id: req.user.id }
        ]
      },
      orderBy: { created_at: 'asc' }
    })

    // Mark messages as read
    await prisma.mensaje.updateMany({
      where: {
        emisor_id: usuarioId,
        receptor_id: req.user.id,
        leido: false
      },
      data: { leido: true }
    })

    res.json({ usuario, mensajes })
  } catch (error) {
    next(error)
  }
}

const enviarMensaje = async (req, res, next) => {
  try {
    const { receptor_id, contenido } = req.body

    if (receptor_id === req.user.id) {
      return res.status(400).json({ message: 'No puedes enviarte mensajes a ti mismo' })
    }

    const mensaje = await prisma.mensaje.create({
      data: {
        emisor_id: req.user.id,
        receptor_id,
        contenido
      }
    })

    res.status(201).json(mensaje)
  } catch (error) {
    next(error)
  }
}

const marcarComoLeido = async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.mensaje.update({
      where: { id },
      data: { leido: true }
    })

    res.json({ message: 'Mensaje marcado como leido' })
  } catch (error) {
    next(error)
  }
}

const getMensajesNoLeidos = async (req, res, next) => {
  try {
    const count = await prisma.mensaje.count({
      where: {
        receptor_id: req.user.id,
        leido: false
      }
    })

    res.json({ count })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getConversaciones,
  getConversacion,
  enviarMensaje,
  marcarComoLeido,
  getMensajesNoLeidos
}
