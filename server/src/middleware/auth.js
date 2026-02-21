const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        avatar_url: true,
        rol: true,
        verificado: true,
        activo: true
      }
    })

    if (!user || !user.activo) {
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' })
    }
    next(error)
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          nombre: true,
          rol: true,
          verificado: true
        }
      })
      
      if (user && user.activo !== false) {
        req.user = user
      }
    }
    next()
  } catch (error) {
    // Continue without auth
    next()
  }
}

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' })
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para esta accion' })
    }
    
    next()
  }
}

const isAdmin = requireRole('admin')
const isModerador = requireRole('admin', 'moderador')

module.exports = { 
  authenticate, 
  optionalAuth, 
  requireRole, 
  isAdmin, 
  isModerador 
}
