import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function AdminModeracion() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(null)

  useEffect(() => {
    loadPendientes()
  }, [])

  const loadPendientes = async () => {
    try {
      const response = await api.get('/admin/pendientes')
      setPlanes(response.data)
    } catch (error) {
      console.error('Error cargando pendientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async (id) => {
    setProcesando(id)
    try {
      await api.post(`/admin/aprobar/${id}`)
      setPlanes(planes.filter(p => p.id !== id))
      toast.success('Plan aprobado')
    } catch (error) {
      toast.error('Error al aprobar')
    } finally {
      setProcesando(null)
    }
  }

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo (opcional):')
    if (motivo === null) return // Cancelled

    setProcesando(id)
    try {
      await api.post(`/admin/rechazar/${id}`, { motivo })
      setPlanes(planes.filter(p => p.id !== id))
      toast.success('Plan rechazado')
    } catch (error) {
      toast.error('Error al rechazar')
    } finally {
      setProcesando(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Moderacion de Planes
        </h1>
      </div>

      {planes.length > 0 ? (
        <div className="space-y-4">
          {planes.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
                      Pendiente
                    </span>
                    <span className="text-sm text-gray-500">
                      {plan.anio_escolar}° Ano - {plan.tema?.nombre}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.titulo}
                  </h3>
                  
                  {plan.descripcion && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {plan.descripcion}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link 
                      to={`/perfil/${plan.autor.id}`}
                      className="flex items-center hover:text-primary-600"
                    >
                      <User className="w-4 h-4 mr-1" />
                      {plan.autor.nombre}
                    </Link>
                    <span>
                      {format(new Date(plan.created_at), "d MMM yyyy", { locale: es })}
                    </span>
                    <span>
                      {plan._count?.archivos || 0} archivos
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/plan/${plan.id}`}
                    className="btn-ghost flex items-center"
                    target="_blank"
                  >
                    <Eye className="w-5 h-5 mr-1" />
                    Ver
                  </Link>
                  <button
                    onClick={() => handleAprobar(plan.id)}
                    disabled={procesando === plan.id}
                    className="btn bg-green-600 text-white hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazar(plan.id)}
                    disabled={procesando === plan.id}
                    className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
                  >
                    <XCircle className="w-5 h-5 mr-1" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Todo al dia!
          </h3>
          <p className="text-gray-600">
            No hay planes pendientes de moderacion
          </p>
          <Link to="/admin" className="btn-outline mt-4 inline-flex">
            Volver al Dashboard
          </Link>
        </div>
      )}
    </div>
  )
}
