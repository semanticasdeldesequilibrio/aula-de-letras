const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const temas = [
  // 1er Anio
  { nombre: 'Narrativa', descripcion: 'Cuentos, fabulas y relatos cortos', anio_escolar: 1, orden: 1 },
  { nombre: 'Poesia', descripcion: 'Introduccion a la poesia y rimas', anio_escolar: 1, orden: 2 },
  { nombre: 'Gramatica Basica', descripcion: 'Sustantivos, adjetivos, verbos', anio_escolar: 1, orden: 3 },
  { nombre: 'Comprension Lectora', descripcion: 'Estrategias de lectura', anio_escolar: 1, orden: 4 },
  { nombre: 'Ortografia', descripcion: 'Reglas ortograficas basicas', anio_escolar: 1, orden: 5 },
  { nombre: 'Expresion Oral', descripcion: 'Tecnicas de comunicacion oral', anio_escolar: 1, orden: 6 },
  
  // 2do Anio
  { nombre: 'Novela', descripcion: 'Introduccion a la novela', anio_escolar: 2, orden: 1 },
  { nombre: 'Teatro', descripcion: 'El genero dramatico', anio_escolar: 2, orden: 2 },
  { nombre: 'Texto Expositivo', descripcion: 'Estructura y produccion', anio_escolar: 2, orden: 3 },
  { nombre: 'Gramatica Intermedia', descripcion: 'Sintaxis y oraciones', anio_escolar: 2, orden: 4 },
  { nombre: 'Comunicacion Oral', descripcion: 'Debate y argumentacion oral', anio_escolar: 2, orden: 5 },
  { nombre: 'Leyendas y Mitos', descripcion: 'Tradicion oral y literatura', anio_escolar: 2, orden: 6 },
  
  // 3er Anio
  { nombre: 'Literatura Argentina', descripcion: 'Autores y obras nacionales', anio_escolar: 3, orden: 1 },
  { nombre: 'Texto Argumentativo', descripcion: 'Estructura y produccion', anio_escolar: 3, orden: 2 },
  { nombre: 'Analisis Literario', descripcion: 'Tecnicas de analisis', anio_escolar: 3, orden: 3 },
  { nombre: 'Medios de Comunicacion', descripcion: 'Periodismo y medios', anio_escolar: 3, orden: 4 },
  { nombre: 'Poesia Argentina', descripcion: 'Poetas nacionales', anio_escolar: 3, orden: 5 },
  { nombre: 'Cronica', descripcion: 'El genero cronistico', anio_escolar: 3, orden: 6 },
  
  // 4to Anio
  { nombre: 'Literatura Latinoamericana', descripcion: 'Boom latinoamericano y mas', anio_escolar: 4, orden: 1 },
  { nombre: 'Ensayo', descripcion: 'El genero ensayistico', anio_escolar: 4, orden: 2 },
  { nombre: 'Generos Periodisticos', descripcion: 'Noticia, editorial, opinion', anio_escolar: 4, orden: 3 },
  { nombre: 'Retorica', descripcion: 'Figuras retoricas y discurso', anio_escolar: 4, orden: 4 },
  { nombre: 'Realismo Magico', descripcion: 'Caracteristicas y autores', anio_escolar: 4, orden: 5 },
  { nombre: 'Investigacion', descripcion: 'Metodologia de investigacion', anio_escolar: 4, orden: 6 },
  
  // 5to Anio
  { nombre: 'Literatura Universal', descripcion: 'Grandes obras de la humanidad', anio_escolar: 5, orden: 1 },
  { nombre: 'Monografia', descripcion: 'Trabajo de investigacion final', anio_escolar: 5, orden: 2 },
  { nombre: 'Critica Literaria', descripcion: 'Teoria y practica critica', anio_escolar: 5, orden: 3 },
  { nombre: 'Literatura Contemporanea', descripcion: 'Autores del siglo XXI', anio_escolar: 5, orden: 4 },
  { nombre: 'Proyecto Final', descripcion: 'Integracion de conocimientos', anio_escolar: 5, orden: 5 },
  { nombre: 'Vanguardias', descripcion: 'Movimientos literarios del siglo XX', anio_escolar: 5, orden: 6 },
]

async function main() {
  console.log('Seeding database...')

  // Create themes
  console.log('Creating themes...')
  for (const tema of temas) {
    await prisma.tema.upsert({
      where: { 
        id: `${tema.anio_escolar}-${tema.orden}` 
      },
      update: tema,
      create: {
        id: `${tema.anio_escolar}-${tema.orden}`,
        ...tema
      }
    })
  }
  console.log(`Created ${temas.length} themes`)

  // Create admin user
  console.log('Creating admin user...')
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
  console.log('Admin user created: admin@auladeletras.com / admin123')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
