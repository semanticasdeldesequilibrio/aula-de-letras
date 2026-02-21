const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const authController = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Routes
router.post('/registro', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email invalido'),
  body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  validate
], authController.registro)

router.post('/login', [
  body('email').isEmail().withMessage('Email invalido'),
  body('password').notEmpty().withMessage('La contrasena es requerida'),
  validate
], authController.login)

router.get('/perfil', authenticate, authController.getPerfil)
router.put('/perfil', authenticate, authController.updatePerfil)

module.exports = router
