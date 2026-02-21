import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, BookOpen, Users, Star, ArrowRight } from 'lucide-react'
import { planesService } from '../services/planesService'
import PlanCard from '../components/planes/PlanCard'

const YEARS = [
  { num: 1, label: '1er Ano', color: 'bg-blue-500' },
  { num: 2, label: '2do Ano', color: 'bg-green-500' },
  { num: 3, label: '3er Ano', color: 'bg-yellow-500' },
  { num: 4, label: '4to Ano', color: 'bg-orange-500' },
  { num: 5, label: '5to Ano', color: 'bg-red-500' },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planesDestacados, setPlanesDestacados] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPlanesDestacados()
  }, [])

  const loadPlanesDestacados = async () => {
    try {
      const data = await planesService.getPlanes({ 
        limit: 4, 
        orderBy: 'valoracion' 
      })
      setPlanesDestacados(data.planes || [])
    } catch (error) {
      console.error('Error cargando planes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Comparte y descubre 
              <span className="text-secondary-400"> planes de clase</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              La comunidad de docentes de Lengua y Literatura mas grande. 
              Encuentra recursos para todos los anos de secundaria.
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar planes de clase, actividades, temas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-lg text-gray-900 rounded-full focus:outline-none focus:ring-4 focus:ring-secondary-400 shadow-lg"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-secondary px-6 py-2 rounded-full"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Year buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {YEARS.map((year) => (
                <Link
                  key={year.num}
                  to={`/explorar?year=${year.num}`}
                  className={`${year.color} hover:opacity-90 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105`}
                >
                  {year.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="relative h-16 -mb-1">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none">
            <path fill="#f9fafb" d="M0,64 C480,0 960,0 1440,64 L1440,64 L0,64 Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
                <BookOpen className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-gray-600">Planes de Clase</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-100 rounded-full mb-4">
                <Users className="w-7 h-7 text-secondary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">200+</p>
              <p className="text-gray-600">Docentes Activos</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
                <Star className="w-7 h-7 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">4.8</p>
              <p className="text-gray-600">Valoracion Promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              Planes Destacados
            </h2>
            <Link 
              to="/explorar" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : planesDestacados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {planesDestacados.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aun no hay planes publicados.</p>
              <Link to="/crear-plan" className="btn-primary mt-4 inline-flex">
                Se el primero en crear uno
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 text-center mb-12">
            Como Funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Registrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta gratuita como docente y accede a todos los recursos de la comunidad.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Explora o Comparte</h3>
              <p className="text-gray-600">
                Busca planes por ano y tema, o sube tus propios materiales para ayudar a otros docentes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecta</h3>
              <p className="text-gray-600">
                Valora los planes, deja comentarios y conecta con otros docentes de Lengua y Literatura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Unete a la comunidad de docentes
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Comparte tu experiencia y aprende de otros profesionales de la educacion.
          </p>
          <Link to="/registro" className="btn-secondary text-lg px-8 py-3">
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
