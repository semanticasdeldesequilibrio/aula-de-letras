import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Star, Heart, Download, FileText, 
  User, Calendar, Clock, MessageCircle, Share2, Flag
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { planesService } from '../services/planesService'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/social/StarRating'
import CommentSection from '../components/social/CommentSection'

const YEAR_COLORS = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
}

export default function PlanDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorito, setIsFavorito] = useState(false)
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    loadPlan()
  }, [id])

  const loadPlan = async () => {
    try {
      const data = await planesService.getPlan(id)
      setPlan(data)
      setIsFavorito(data.is_favorito)
      setUserRating(data.user_rating || 0)
    } catch (error) {
      console.error('Error cargando plan:', error)
      toast.error('Error al cargar el plan')
      navigate('/explorar')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorito = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesion para guardar favoritos')
      navigate('/login')
      return
    }

    try {
      await planesService.toggleFavorito(id)
      setIsFavorito(!isFavorito)
      toast.success(isFavorito ? 'Eliminado de favoritos' : 'Agregado a favoritos')
    } catch (error) {
      toast.error('Error al actualizar favoritos')
    }
  }

  const handleRating = async (estrellas) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesion para valorar')
      navigate('/login')
      return
    }

    try {
      await planesService.valorarPlan(id, estrellas)
      setUserRating(estrellas)
      loadPlan() // Reload to get updated average
      toast.success('Valoracion guardada')
    } catch (error) {
      toast.error('Error al valorar')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: plan.titulo,
        text: plan.descripcion,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!plan) return null

  const yearColor = YEAR_COLORS[plan.anio_escolar] || 'bg-gray-500'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Volver
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`${yearColor} text-white text-sm font-medium px-3 py-1 rounded-full`}>
            {plan.anio_escolar}° Ano
          </span>
          {plan.tema && (
            <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
              {plan.tema.nombre}
            </span>
          )}
          {plan.duracion_estimada && (
            <span className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {plan.duracion_estimada}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          {plan.titulo}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-medium">
              {plan.promedio_valoracion?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-gray-500 ml-1">
              ({plan._count?.valoraciones || 0} valoraciones)
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 flex items-center">
            <Download className="w-4 h-4 mr-1" />
            {plan.descargas || 0} descargas
          </span>
        </div>

        {/* Author */}
        <Link 
          to={`/perfil/${plan.autor.id}`}
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {plan.autor.avatar_url ? (
            <img 
              src={plan.autor.avatar_url} 
              alt={plan.autor.nombre}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {plan.autor.nombre} {plan.autor.apellido}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Publicado el {format(new Date(plan.created_at), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-200">
        <button
          onClick={handleToggleFavorito}
          className={`btn flex items-center gap-2 ${
            isFavorito 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'btn-outline'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorito ? 'fill-red-600' : ''}`} />
          {isFavorito ? 'Guardado' : 'Guardar'}
        </button>
        <button onClick={handleShare} className="btn-outline flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Compartir
        </button>
        <button className="btn-ghost flex items-center gap-2 text-gray-500">
          <Flag className="w-5 h-5" />
          Reportar
        </button>
      </div>

      {/* Description */}
      {plan.descripcion && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Descripcion</h2>
          <p className="text-gray-700 leading-relaxed">{plan.descripcion}</p>
        </section>
      )}

      {/* Objectives */}
      {plan.objetivos?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Objetivos</h2>
          <ul className="space-y-2">
            {plan.objetivos.map((objetivo, index) => (
              <li key={index} className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700">{objetivo}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Content */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Contenido de la Clase</h2>
        <div 
          className="prose prose-lg max-w-none bg-white p-6 rounded-lg border border-gray-200"
          dangerouslySetInnerHTML={{ __html: plan.contenido }}
        />
      </section>

      {/* Resources */}
      {plan.recursos_necesarios && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Recursos Necesarios</h2>
          <p className="text-gray-700">{plan.recursos_necesarios}</p>
        </section>
      )}

      {/* Attachments */}
      {plan.archivos?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Archivos Adjuntos ({plan.archivos.length})
          </h2>
          <div className="space-y-2">
            {plan.archivos.map((archivo) => (
              <a
                key={archivo.id}
                href={archivo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{archivo.nombre_original}</p>
                    <p className="text-sm text-gray-500">
                      {(archivo.tamaño_bytes / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Rating section */}
      <section className="mb-8 p-6 bg-primary-50 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Valora este plan</h2>
        <p className="text-gray-600 mb-4">
          Tu opinion ayuda a otros docentes a encontrar los mejores recursos
        </p>
        <StarRating 
          rating={userRating} 
          onRate={handleRating}
          size="lg"
        />
      </section>

      {/* Comments */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comentarios ({plan._count?.comentarios || 0})
        </h2>
        <CommentSection planId={id} />
      </section>
    </div>
  )
}
