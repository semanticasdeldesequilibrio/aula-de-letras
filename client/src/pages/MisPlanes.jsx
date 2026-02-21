import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, PlusCircle, Edit2, Trash2, Eye, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { planesService } from '../services/planesService'
import PlanCard from '../components/planes/PlanCard'

const STATUS_LABELS = {
  borrador: { label: 'Borrador', color: 'bg-gray-100 text-gray-700' },
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  publicado: { label: 'Publicado', color: 'bg-green-100 text-green-700' },
  rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-700' }
}

export default function MisPlanes() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    loadPlanes()
  }, [])

  const loadPlanes = async () => {
    try {
      const data = await planesService.getMisPlanes()
      setPlanes(data)
    } catch (error) {
      console.error('Error cargando planes:', error)
      toast.error('Error al cargar tus planes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Estas seguro de eliminar este plan?')) return

    try {
      await planesService.eliminarPlan(id)
      setPlanes(planes.filter(p => p.id !== id))
      toast.success('Plan eliminado')
    } catch (error) {
      toast.error('Error al eliminar el plan')
    }
  }

  const filteredPlanes = filter === 'todos' 
    ? planes 
    : planes.filter(p => p.estado === filter)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Mis Planes de Clase
        </h1>
        <Link to="/crear-plan" className="btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Plan
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['todos', 'publicado', 'pendiente', 'borrador', 'rechazado'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'todos' ? 'Todos' : STATUS_LABELS[status].label}
            <span className="ml-1">
              ({status === 'todos' ? planes.length : planes.filter(p => p.estado === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Plans list */}
      {filteredPlanes.length > 0 ? (
        <div className="space-y-4">
          {filteredPlanes.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_LABELS[plan.estado].color}`}>
                      {STATUS_LABELS[plan.estado].label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {plan.anio_escolar}° Ano - {plan.tema?.nombre}
                    </span>
                  </div>
                  <Link 
                    to={`/plan/${plan.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {plan.titulo}
                  </Link>
                  {plan.descripcion && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {plan.descripcion}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {plan.descargas || 0} vistas
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/editar-plan/${plan.id}`}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'todos' 
              ? 'Aun no tienes planes de clase'
              : `No tienes planes ${STATUS_LABELS[filter]?.label.toLowerCase()}`
            }
          </h3>
          <p className="text-gray-600 mb-4">
            Comparte tu experiencia creando tu primer plan
          </p>
          <Link to="/crear-plan" className="btn-primary inline-flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" />
            Crear Plan
          </Link>
        </div>
      )}
    </div>
  )
}
