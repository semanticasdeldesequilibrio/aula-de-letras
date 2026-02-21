const prisma = require('../config/database')

const getPerfil = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        avatar_url: true,
        bio: true,
        institucion: true,
        created_at: true,
        _count: {
          select: {
            planes: { where: { estado: 'publicado' } },
            seguidores: true,
            siguiendo: true
          }
        }
      }
    })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Check if current user is following
    let is_following = false
    if (req.user) {
      const seguidor = await prisma.seguidor.findUnique({
        where: {
          seguidor_id_seguido_id: {
            seguidor_id: req.user.id,
            seguido_id: id
          }
        }
      })
      is_following = !!seguidor
    }

    res.json({ ...usuario, is_following })
  } catch (error) {
    next(error)
  }
}

const getPlanesByUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const whereClause = { autor_id: id }
    
    // Only show published plans unless viewing own profile
    if (!req.user || req.user.id !== id) {
      whereClause.estado = 'publicado'
    }

    const planes = await prisma.plan.findMany({
      where: whereClause,
      include: {
        tema: { select: { id: true, nombre: true } },
        autor: { select: { id: true, nombre: true, avatar_url: true } },
        _count: { select: { valoraciones: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    // Add average rating
    const planesWithRating = await Promise.all(planes.map(async (plan) => {
      const avgRating = await prisma.valoracion.aggregate({
        where: { plan_id: plan.id },
        _avg: { estrellas: true }
      })
      return {
        ...plan,
        promedio_valoracion: avgRating._avg.estrellas
      }
    }))

    res.json(planesWithRating)
  } catch (error) {
    next(error)
  }
}

const seguir = async (req, res, next) => {
  try {
    const { id } = req.params

    if (id === req.user.id) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo' })
    }

    await prisma.seguidor.create({
      data: {
        seguidor_id: req.user.id,
        seguido_id: id
      }
    })

    res.json({ message: 'Ahora sigues a este usuario' })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Ya sigues a este usuario' })
    }
    next(error)
  }
}

const dejarDeSeguir = async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.seguidor.delete({
      where: {
        seguidor_id_seguido_id: {
          seguidor_id: req.user.id,
          seguido_id: id
        }
      }
    })

    res.json({ message: 'Dejaste de seguir a este usuario' })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ message: 'No sigues a este usuario' })
    }
    next(error)
  }
}

const getSeguidores = async (req, res, next) => {
  try {
    const { id } = req.params

    const seguidores = await prisma.seguidor.findMany({
      where: { seguido_id: id },
      include: {
        seguidor: {
          select: { id: true, nombre: true, avatar_url: true }
        }
      }
    })

    res.json(seguidores.map(s => s.seguidor))
  } catch (error) {
    next(error)
  }
}

const getSiguiendo = async (req, res, next) => {
  try {
    const { id } = req.params

    const siguiendo = await prisma.seguidor.findMany({
      where: { seguidor_id: id },
      include: {
        seguido: {
          select: { id: true, nombre: true, avatar_url: true }
        }
      }
    })

    res.json(siguiendo.map(s => s.seguido))
  } catch (error) {
    next(error)
  }
}

const getFeed = async (req, res, next) => {
  try {
    // Get users the current user is following
    const siguiendo = await prisma.seguidor.findMany({
      where: { seguidor_id: req.user.id },
      select: { seguido_id: true }
    })

    const siguiendoIds = siguiendo.map(s => s.seguido_id)

    // Get recent plans from followed users
    const planes = await prisma.plan.findMany({
      where: {
        autor_id: { in: siguiendoIds },
        estado: 'publicado'
      },
      include: {
        tema: { select: { id: true, nombre: true } },
        autor: { select: { id: true, nombre: true, avatar_url: true } },
        _count: { select: { valoraciones: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 20
    })

    res.json(planes)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPerfil,
  getPlanesByUsuario,
  seguir,
  dejarDeSeguir,
  getSeguidores,
  getSiguiendo,
  getFeed
}
