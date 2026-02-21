const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const temas = [
  { nombre: 'Narrativa', descripcion: 'Cuentos y relatos', anio_escolar: 1, orden: 1 },
  { nombre: 'Poesia', descripcion: 'Poesia y rimas', anio_escolar: 1, orden: 2 },
  { nombre: 'Gramatica Basica', descripcion: 'Gramatica basica', anio_escolar: 1, orden: 3 },
  { nombre: 'Comprension Lectora', descripcion: 'Estrategias de lectura', anio_escolar: 1, orden: 4 },
  { nombre: 'Ortografia', descripcion: 'Reglas ortograficas', anio_escolar: 1, orden: 5 },
  { nombre: 'Expresion Oral', descripcion: 'Comunicacion oral', anio_escolar: 1, orden: 6 },
  { nombre: 'Novela', descripcion: 'Introduccion a la novela', anio_escolar: 2, orden: 1 },
  { nombre: 'Teatro', descripcion: 'Genero dramatico', anio_escolar: 2, orden: 2 },
  { nombre: 'Texto Expositivo', descripcion: 'Textos expositivos', anio_escolar: 2, orden: 3 },
  { nombre: 'Gramatica Intermedia', descripcion: 'Sintaxis', anio_escolar: 2, orden: 4 },
  { nombre: 'Literatura Argentina', descripcion: 'Autores argentinos', anio_escolar: 3, orden: 1 },
  { nombre: 'Texto Argumentativo', descripcion: 'Argumentacion', anio_escolar: 3, orden: 2 },
  { nombre: 'Analisis Literario', descripcion: 'Analisis de obras', anio_escolar: 3, orden: 3 },
  { nombre: 'Literatura Latinoamericana', descripcion: 'Boom latinoamericano', anio_escolar: 4, orden: 1 },
  { nombre: 'Ensayo', descripcion: 'Genero ensayistico', anio_escolar: 4, orden: 2 },
  { nombre: 'Literatura Universal', descripcion: 'Grandes obras', anio_escolar: 5, orden: 1 },
  { nombre: 'Monografia', descripcion: 'Trabajo de investigacion', anio_escolar: 5, orden: 2 },
]

async function main() {
  try {
    console.log('Seeding database...')
    
    for (const tema of temas) {
      await prisma.tema.upsert({
        where: { id: `${tema.anio_escolar}-${tema.orden}` },
        update: tema,
        create: { id: `${tema.anio_escolar}-${tema.orden}`, ...tema }
      })
    }
    console.log('Created themes')

    const adminPassword = await bcrypt.hash('admin123', 10)
    await prisma.usuario.upsert({
      where: { email: 'admin@auladeletras.com' },
      update: {},
      create: {
        email: 'admin@auladeletras.com',
        password_hash: adminPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        rol: 'admin',
        verificado: true
      }
    })
    console.log('Admin user created')
    console.log('Seeding completed!')
  } catch (error) {
    console.error('Seed error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
