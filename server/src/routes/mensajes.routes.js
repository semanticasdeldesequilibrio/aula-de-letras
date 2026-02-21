const express = require('express')
const router = express.Router()
const mensajesController = require('../controllers/mensajesController')
const { authenticate } = require('../middleware/auth')

router.use(authenticate) // All routes require authentication

router.get('/', mensajesController.getConversaciones)
router.get('/no-leidos/count', mensajesController.getMensajesNoLeidos)
router.get('/:usuarioId', mensajesController.getConversacion)
router.post('/', mensajesController.enviarMensaje)
router.put('/:id/leer', mensajesController.marcarComoLeido)

module.exports = router
