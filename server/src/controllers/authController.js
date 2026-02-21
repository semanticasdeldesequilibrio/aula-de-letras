const bcrypt = require('bcryptjs')
const prisma = require('../config/database')
const { generateToken } = require('../utils/jwt')

const registro = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, institucion } = req.body

    // Check if user exists
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya esta registrado' })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        password_hash,
        institucion
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        avatar_url: true,
        rol: true,
        verificado: true
      }
    })

    const token = generateToken(user.id)

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user,
      token
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: 'Credenciales invalidas' })
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Cuenta desactivada' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales invalidas' })
    }

    const token = generateToken(user.id)

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        avatar_url: user.avatar_url,
        rol: user.rol,
        verificado: user.verificado
      },
      token
    })
  } catch (error) {
    next(error)
  }
}

const getPerfil = async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        avatar_url: true,
        bio: true,
        institucion: true,
        rol: true,
        verificado: true,
        created_at: true
      }
    })

    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updatePerfil = async (req, res, next) => {
  try {
    const { nombre, apellido, bio, institucion } = req.body

    const user = await prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        nombre,
        apellido,
        bio,
        institucion
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        avatar_url: true,
        bio: true,
        institucion: true,
        rol: true,
        verificado: true
      }
    })

    res.json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registro,
  login,
  getPerfil,
  updatePerfil
}
