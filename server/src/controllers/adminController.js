const prisma = require('../config/database')

const getEstadisticas = async (req, res, next) => {
  try {
    const [
      totalPlanes,
      totalUsuarios,
      pendientes,
      reportes,
      planesRecientes,
      usuariosRecientes
    ] = await Promise.all([
      prisma.plan.count({ where: { estado: 'publicado' } }),
      prisma.usuario.count(),
      prisma.plan.count({ where: { estado: 'pendiente' } }),
      prisma.comentario.count({ where: { reportado: true } }),
      prisma.plan.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          autor: { select: { nombre: true } }
        }
      }),
      prisma.usuario.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: { id: true, nombre: true, email: true, created_at: true }
      })
    ])

    res.json({
      totalPlanes,
      totalUsuarios,
      pendientes,
      reportes,
      planesRecientes,
      usuariosRecientes
    })
  } catch (error) {
    next(error)
  }
}

const getPendientes = async (req, res, next) => {
  try {
    const planes = await prisma.plan.findMany({
      where: { estado: 'pendiente' },
      include: {
        tema: { select: { nombre: true } },
        autor: { select: { id: true, nombre: true, verificado: true } },
        _count: { select: { archivos: true } }
      },
      orderBy: { created_at: 'asc' }
    })

    res.json(planes)
  } catch (error) {
    next(error)
  }
}

const aprobarPlan = async (req, res, next) => {
  try {
    const { id } = req.params

    const plan = await prisma.plan.update({
      where: { id },
      data: { estado: 'publicado' }
    })

    // Mark author as verified after first approval
    await prisma.usuario.update({
      where: { id: plan.autor_id },
      data: { verificado: true }
    })

    res.json({ message: 'Plan aprobado', plan })
  } catch (error) {
    next(error)
  }
}

const rechazarPlan = async (req, res, next) => {
  try {
    const { id } = req.params
    const { motivo } = req.body

    const plan = await prisma.plan.update({
      where: { id },
      data: { estado: 'rechazado' }
    })

    // TODO: Send email notification with rejection reason

    res.json({ message: 'Plan rechazado', plan })
  } catch (error) {
    next(error)
  }
}

const getReportes = async (req, res, next) => {
  try {
    const comentarios = await prisma.comentario.findMany({
      where: { reportado: true },
      include: {
        usuario: { select: { id: true, nombre: true } },
        plan: { select: { id: true, titulo: true } }
      }
    })

    res.json(comentarios)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getEstadisticas,
  getPendientes,
  aprobarPlan,
  rechazarPlan,
  getReportes
}
