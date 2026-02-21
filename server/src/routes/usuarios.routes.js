const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')
const { authenticate, optionalAuth } = require('../middleware/auth')

router.get('/feed', authenticate, usuariosController.getFeed)
router.get('/:id', optionalAuth, usuariosController.getPerfil)
router.get('/:id/planes', optionalAuth, usuariosController.getPlanesByUsuario)
router.get('/:id/seguidores', usuariosController.getSeguidores)
router.get('/:id/siguiendo', usuariosController.getSiguiendo)

router.post('/:id/seguir', authenticate, usuariosController.seguir)
router.delete('/:id/seguir', authenticate, usuariosController.dejarDeSeguir)

module.exports = router
