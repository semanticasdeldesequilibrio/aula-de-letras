require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

// Routes
const authRoutes = require('./routes/auth.routes')
const planesRoutes = require('./routes/planes.routes')
const usuariosRoutes = require('./routes/usuarios.routes')
const mensajesRoutes = require('./routes/mensajes.routes')
const adminRoutes = require('./routes/admin.routes')
const temasRoutes = require('./routes/temas.routes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/planes', planesRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/mensajes', mensajesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/temas', temasRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
