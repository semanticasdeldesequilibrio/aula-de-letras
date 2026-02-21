import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, MapPin, Calendar, BookOpen, Users, MessageCircle, Edit2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { usuariosService } from '../services/usuariosService'
import { useAuth } from '../context/AuthContext'
import PlanCard from '../components/planes/PlanCard'

export default function Perfil() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  
  const [usuario, setUsuario] = useState(null)
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [siguiendo, setSiguiendo] = useState(false)
  const [activeTab, setActiveTab] = useState('planes')

  const isOwnProfile = currentUser?.id === id

  useEffect(() => {
    loadPerfil()
  }, [id])

  const loadPerfil = async () => {
    try {
      const [perfilData, planesData] = await Promise.all([
        usuariosService.getPerfil(id),
        usuariosService.getPlanesByUsuario(id)
      ])
      setUsuario(perfilData)
      setPlanes(planesData)
      setSiguiendo(perfilData.is_following)
    } catch (error) {
      console.error('Error cargando perfil:', error)
      toast.error('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSeguir = async () => {
    try {
      if (siguiendo) {
        await usuariosService.dejarDeSeguir(id)
        setUsuario(prev => ({
          ...prev,
          _count: { ...prev._count, seguidores: prev._count.seguidores - 1 }
        }))
      } else {
        await usuariosService.seguir(id)
        setUsuario(prev => ({
          ...prev,
          _count: { ...prev._count, seguidores: prev._count.seguidores + 1 }
        }))
      }
      setSiguiendo(!siguiendo)
    } catch (error) {
      toast.error('Error al actualizar')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          {usuario.avatar_url ? (
            <img 
              src={usuario.avatar_url} 
              alt={usuario.nombre}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-primary-600" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {usuario.nombre} {usuario.apellido}
                </h1>
                {usuario.institucion && (
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {usuario.institucion}
                  </p>
                )}
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Miembro desde {format(new Date(usuario.created_at), "MMMM yyyy", { locale: es })}
                </p>
              </div>

              {/* Actions */}
              {isOwnProfile ? (
                <Link to="/editar-perfil" className="btn-outline flex items-center">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Link>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleSeguir}
                    className={siguiendo ? 'btn-outline' : 'btn-primary'}
                  >
                    {siguiendo ? 'Siguiendo' : 'Seguir'}
                  </button>
                  <Link to={`/mensajes?user=${id}`} className="btn-outline">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Bio */}
            {usuario.bio && (
              <p className="text-gray-700 mt-4">{usuario.bio}</p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{usuario._count?.planes || 0}</p>
                <p className="text-sm text-gray-500">Planes</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{usuario._count?.seguidores || 0}</p>
                <p className="text-sm text-gray-500">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{usuario._count?.siguiendo || 0}</p>
                <p className="text-sm text-gray-500">Siguiendo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('planes')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'planes'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Planes ({usuario._count?.planes || 0})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'planes' && (
        planes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {planes.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {isOwnProfile 
                ? 'Aun no has publicado planes. Crea tu primero!'
                : 'Este usuario aun no ha publicado planes.'
              }
            </p>
            {isOwnProfile && (
              <Link to="/crear-plan" className="btn-primary mt-4 inline-flex">
                Crear Plan
              </Link>
            )}
          </div>
        )
      )}
    </div>
  )
}
