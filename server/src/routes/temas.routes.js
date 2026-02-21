const express = require('express')
const router = express.Router()
const prisma = require('../config/database')

router.get('/', async (req, res, next) => {
  try {
    const { year } = req.query

    const where = {}
    if (year) {
      where.anio_escolar = parseInt(year)
    }

    const temas = await prisma.tema.findMany({
      where,
      orderBy: [
        { anio_escolar: 'asc' },
        { orden: 'asc' }
      ]
    })

    res.json(temas)
  } catch (error) {
    next(error)
  }
})

module.exports = router
