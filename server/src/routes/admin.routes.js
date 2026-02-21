const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authenticate, isModerador, isAdmin } = require('../middleware/auth')

router.use(authenticate)
router.use(isModerador)

router.get('/estadisticas', adminController.getEstadisticas)
router.get('/pendientes', adminController.getPendientes)
router.get('/reportes', adminController.getReportes)

router.post('/aprobar/:id', adminController.aprobarPlan)
router.post('/rechazar/:id', adminController.rechazarPlan)

module.exports = router
