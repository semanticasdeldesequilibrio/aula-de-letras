import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { planesService } from '../services/planesService'
import PlanCard from '../components/planes/PlanCard'

export default function Favoritos() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavoritos()
  }, [])

  const loadFavoritos = async () => {
    try {
      const data = await planesService.getFavoritos()
      setPlanes(data)
    } catch (error) {
      console.error('Error cargando favoritos:', error)
      toast.error('Error al cargar favoritos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-2 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Mis Favoritos
        </h1>
      </div>

      {planes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes favoritos guardados
          </h3>
          <p className="text-gray-600 mb-4">
            Explora planes de clase y guarda los que mas te gusten
          </p>
          <Link to="/explorar" className="btn-primary inline-flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Explorar Planes
          </Link>
        </div>
      )}
    </div>
  )
}
