import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Users, Star, Clock, 
  TrendingUp, AlertTriangle, CheckCircle
} from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/estadisticas')
      setStats(response.data)
    } catch (error) {
      console.error('Error cargando estadisticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Panel de Administracion
        </h1>
        <Link to="/admin/moderacion" className="btn-primary">
          <Clock className="w-5 h-5 mr-2" />
          Moderacion ({stats?.pendientes || 0})
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Planes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPlanes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsuarios || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendientes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Reportes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.reportes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Planes Recientes
          </h2>
          {stats?.planesRecientes?.length > 0 ? (
            <div className="space-y-4">
              {stats.planesRecientes.map((plan) => (
                <Link 
                  key={plan.id}
                  to={`/plan/${plan.id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{plan.titulo}</p>
                    <p className="text-sm text-gray-500">
                      por {plan.autor?.nombre} - {plan.anio_escolar}° Ano
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    plan.estado === 'publicado' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {plan.estado}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay planes recientes</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usuarios Recientes
          </h2>
          {stats?.usuariosRecientes?.length > 0 ? (
            <div className="space-y-4">
              {stats.usuariosRecientes.map((usuario) => (
                <Link 
                  key={usuario.id}
                  to={`/perfil/${usuario.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {usuario.nombre?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{usuario.nombre}</p>
                    <p className="text-sm text-gray-500">{usuario.email}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay usuarios recientes</p>
          )}
        </div>
      </div>
    </div>
  )
}
