const prisma = require('../config/database')

const getPlanes = async (req, res, next) => {
  try {
    const { 
      q, years, tema, minRating, orderBy = 'reciente', 
      page = 1, limit = 12 
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Build where clause
    const where = {
      estado: 'publicado'
    }

    if (q) {
      where.OR = [
        { titulo: { contains: q } },
        { descripcion: { contains: q } },
        { contenido: { contains: q } }
      ]
    }

    if (years) {
      const yearArray = years.split(',').map(Number)
      where.anio_escolar = { in: yearArray }
    }

    if (tema) {
      where.tema_id = tema
    }

    // Order by
    let orderByClause = { created_at: 'desc' }
    if (orderBy === 'valoracion') {
      orderByClause = { valoraciones: { _count: 'desc' } }
    } else if (orderBy === 'descargas') {
      orderByClause = { descargas: 'desc' }
    } else if (orderBy === 'antiguo') {
      orderByClause = { created_at: 'asc' }
    }

    const [planes, total] = await Promise.all([
      prisma.plan.findMany({
        where,
        include: {
          tema: { select: { id: true, nombre: true } },
          autor: { select: { id: true, nombre: true, avatar_url: true } },
          _count: { select: { archivos: true, valoraciones: true, comentarios: true } }
        },
        orderBy: orderByClause,
        skip,
        take: parseInt(limit)
      }),
      prisma.plan.count({ where })
    ])

    // Calculate average rating for each plan
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

    // Filter by minimum rating if specified
    let filteredPlanes = planesWithRating
    if (minRating) {
      filteredPlanes = planesWithRating.filter(
        p => p.promedio_valoracion >= parseInt(minRating)
      )
    }

    res.json({
      planes: filteredPlanes,
      total: minRating ? filteredPlanes.length : total,
      page: parseInt(page),
      totalPages: Math.ceil((minRating ? filteredPlanes.length : total) / parseInt(limit))
    })
  } catch (error) {
    next(error)
  }
}

const getPlan = async (req, res, next) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        tema: true,
        autor: { 
          select: { id: true, nombre: true, apellido: true, avatar_url: true } 
        },
        archivos: true,
        _count: { 
          select: { valoraciones: true, comentarios: true } 
        }
      }
    })

    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' })
    }

    // Parse objetivos from JSON string
    const planWithParsedObjetivos = {
      ...plan,
      objetivos: plan.objetivos ? JSON.parse(plan.objetivos) : []
    }

    // Get average rating
    const avgRating = await prisma.valoracion.aggregate({
      where: { plan_id: id },
      _avg: { estrellas: true }
    })

    // Check if user has favorited and rated
    let is_favorito = false
    let user_rating = null

    if (req.user) {
      const favorito = await prisma.favorito.findUnique({
        where: {
          usuario_id_plan_id: {
            usuario_id: req.user.id,
            plan_id: id
          }
        }
      })
      is_favorito = !!favorito

      const valoracion = await prisma.valoracion.findUnique({
        where: {
          plan_id_usuario_id: {
            plan_id: id,
            usuario_id: req.user.id
          }
        }
      })
      user_rating = valoracion?.estrellas
    }

    // Increment downloads
    await prisma.plan.update({
      where: { id },
      data: { descargas: { increment: 1 } }
    })

    res.json({
      ...planWithParsedObjetivos,
      promedio_valoracion: avgRating._avg.estrellas,
      is_favorito,
      user_rating
    })
  } catch (error) {
    next(error)
  }
}

const crearPlan = async (req, res, next) => {
  try {
    const { 
      titulo, descripcion, contenido, anio_escolar, 
      tema_id, duracion_estimada, objetivos, 
      recursos_necesarios, estado 
    } = req.body

    // Determine estado based on user verification
    let finalEstado = estado || 'pendiente'
    if (req.user.verificado || req.user.rol === 'admin' || req.user.rol === 'moderador') {
      finalEstado = estado === 'borrador' ? 'borrador' : 'publicado'
    }

    const plan = await prisma.plan.create({
      data: {
        titulo,
        descripcion,
        contenido,
        anio_escolar: parseInt(anio_escolar),
        tema_id,
        autor_id: req.user.id,
        duracion_estimada,
        objetivos: JSON.stringify(objetivos || []),
        recursos_necesarios,
        estado: finalEstado
      },
      include: {
        tema: true,
        autor: { select: { id: true, nombre: true } }
      }
    })

    res.status(201).json(plan)
  } catch (error) {
    next(error)
  }
}

const actualizarPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const { 
      titulo, descripcion, contenido, anio_escolar, 
      tema_id, duracion_estimada, objetivos, 
      recursos_necesarios 
    } = req.body

    // Check ownership
    const existingPlan = await prisma.plan.findUnique({
      where: { id }
    })

    if (!existingPlan) {
      return res.status(404).json({ message: 'Plan no encontrado' })
    }

    if (existingPlan.autor_id !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar este plan' })
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        titulo,
        descripcion,
        contenido,
        anio_escolar: parseInt(anio_escolar),
        tema_id,
        duracion_estimada,
        objetivos: JSON.stringify(objetivos || []),
        recursos_necesarios
      },
      include: {
        tema: true,
        autor: { select: { id: true, nombre: true } }
      }
    })

    res.json(plan)
  } catch (error) {
    next(error)
  }
}

const eliminarPlan = async (req, res, next) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.findUnique({
      where: { id }
    })

    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' })
    }

    if (plan.autor_id !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este plan' })
    }

    await prisma.plan.delete({ where: { id } })

    res.json({ message: 'Plan eliminado' })
  } catch (error) {
    next(error)
  }
}

const getMisPlanes = async (req, res, next) => {
  try {
    const planes = await prisma.plan.findMany({
      where: { autor_id: req.user.id },
      include: {
        tema: { select: { id: true, nombre: true } },
        _count: { select: { archivos: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    res.json(planes)
  } catch (error) {
    next(error)
  }
}

const valorarPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const { estrellas } = req.body

    if (estrellas < 1 || estrellas > 5) {
      return res.status(400).json({ message: 'La valoracion debe ser entre 1 y 5' })
    }

    const valoracion = await prisma.valoracion.upsert({
      where: {
        plan_id_usuario_id: {
          plan_id: id,
          usuario_id: req.user.id
        }
      },
      update: { estrellas },
      create: {
        plan_id: id,
        usuario_id: req.user.id,
        estrellas
      }
    })

    res.json(valoracion)
  } catch (error) {
    next(error)
  }
}

const toggleFavorito = async (req, res, next) => {
  try {
    const { id } = req.params

    const existingFavorito = await prisma.favorito.findUnique({
      where: {
        usuario_id_plan_id: {
          usuario_id: req.user.id,
          plan_id: id
        }
      }
    })

    if (existingFavorito) {
      await prisma.favorito.delete({
        where: {
          usuario_id_plan_id: {
            usuario_id: req.user.id,
            plan_id: id
          }
        }
      })
      res.json({ favorito: false })
    } else {
      await prisma.favorito.create({
        data: {
          usuario_id: req.user.id,
          plan_id: id
        }
      })
      res.json({ favorito: true })
    }
  } catch (error) {
    next(error)
  }
}

const getFavoritos = async (req, res, next) => {
  try {
    const favoritos = await prisma.favorito.findMany({
      where: { usuario_id: req.user.id },
      include: {
        plan: {
          include: {
            tema: { select: { id: true, nombre: true } },
            autor: { select: { id: true, nombre: true, avatar_url: true } },
            _count: { select: { valoraciones: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    const planes = favoritos.map(f => f.plan)
    res.json(planes)
  } catch (error) {
    next(error)
  }
}

const getComentarios = async (req, res, next) => {
  try {
    const { id } = req.params

    const comentarios = await prisma.comentario.findMany({
      where: { plan_id: id },
      include: {
        usuario: { 
          select: { id: true, nombre: true, avatar_url: true } 
        }
      },
      orderBy: { created_at: 'desc' }
    })

    res.json(comentarios)
  } catch (error) {
    next(error)
  }
}

const agregarComentario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { contenido } = req.body

    const comentario = await prisma.comentario.create({
      data: {
        plan_id: id,
        usuario_id: req.user.id,
        contenido
      },
      include: {
        usuario: { 
          select: { id: true, nombre: true, avatar_url: true } 
        }
      }
    })

    res.status(201).json(comentario)
  } catch (error) {
    next(error)
  }
}

const eliminarComentario = async (req, res, next) => {
  try {
    const { id } = req.params

    const comentario = await prisma.comentario.findUnique({
      where: { id }
    })

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' })
    }

    if (comentario.usuario_id !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos' })
    }

    await prisma.comentario.delete({ where: { id } })

    res.json({ message: 'Comentario eliminado' })
  } catch (error) {
    next(error)
  }
}

const subirArchivo = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!req.file) {
      return res.status(400).json({ message: 'No se proporciono archivo' })
    }

    // Determine file type
    let tipo = 'otro'
    if (req.file.mimetype.includes('pdf')) tipo = 'pdf'
    else if (req.file.mimetype.includes('image')) tipo = 'imagen'
    else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('document')) tipo = 'documento'

    const archivo = await prisma.archivo.create({
      data: {
        plan_id: id,
        nombre_original: req.file.originalname,
        url: req.file.path,
        tipo,
        tamano_bytes: req.file.size
      }
    })

    res.status(201).json(archivo)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getPlanes,
  getPlan,
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  getMisPlanes,
  valorarPlan,
  toggleFavorito,
  getFavoritos,
  getComentarios,
  agregarComentario,
  eliminarComentario,
  subirArchivo
}
