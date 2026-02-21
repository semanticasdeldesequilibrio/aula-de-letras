const express = require('express')
const router = express.Router()
const planesController = require('../controllers/planesController')
const { authenticate, optionalAuth } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

// Public routes
router.get('/', optionalAuth, planesController.getPlanes)
router.get('/favoritos', authenticate, planesController.getFavoritos)
router.get('/mis-planes', authenticate, planesController.getMisPlanes)
router.get('/:id', optionalAuth, planesController.getPlan)
router.get('/:id/comentarios', planesController.getComentarios)

// Protected routes
router.post('/', authenticate, planesController.crearPlan)
router.put('/:id', authenticate, planesController.actualizarPlan)
router.delete('/:id', authenticate, planesController.eliminarPlan)

router.post('/:id/valorar', authenticate, planesController.valorarPlan)
router.post('/:id/favorito', authenticate, planesController.toggleFavorito)
router.post('/:id/comentarios', authenticate, planesController.agregarComentario)
router.post('/:id/archivos', authenticate, upload.single('archivo'), planesController.subirArchivo)

// Comment management
router.delete('/comentarios/:id', authenticate, planesController.eliminarComentario)

module.exports = router
