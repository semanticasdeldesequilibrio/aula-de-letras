import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Send, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { planesService } from '../../services/planesService'
import { useAuth } from '../../context/AuthContext'

export default function CommentSection({ planId }) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [comentarios, setComentarios] = useState([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    loadComentarios()
  }, [planId])

  const loadComentarios = async () => {
    try {
      const data = await planesService.getComentarios(planId)
      setComentarios(data)
    } catch (error) {
      console.error('Error cargando comentarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesion para comentar')
      navigate('/login')
      return
    }

    if (!nuevoComentario.trim()) return

    setSubmitting(true)
    try {
      const comentario = await planesService.agregarComentario(planId, nuevoComentario)
      setComentarios([comentario, ...comentarios])
      setNuevoComentario('')
      toast.success('Comentario agregado')
    } catch (error) {
      toast.error('Error al agregar comentario')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (comentarioId) => {
    if (!confirm('Estas seguro de eliminar este comentario?')) return

    try {
      await planesService.eliminarComentario(comentarioId)
      setComentarios(comentarios.filter(c => c.id !== comentarioId))
      toast.success('Comentario eliminado')
    } catch (error) {
      toast.error('Error al eliminar comentario')
    }
    setMenuOpen(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.nombre}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder={isAuthenticated ? "Escribe un comentario..." : "Inicia sesion para comentar"}
              disabled={!isAuthenticated}
              rows={3}
              className="input resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!nuevoComentario.trim() || submitting || !isAuthenticated}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {comentarios.length > 0 ? (
        <div className="space-y-6">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="flex gap-3">
              <Link to={`/perfil/${comentario.usuario.id}`}>
                {comentario.usuario.avatar_url ? (
                  <img 
                    src={comentario.usuario.avatar_url} 
                    alt={comentario.usuario.nombre}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </Link>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Link 
                      to={`/perfil/${comentario.usuario.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {comentario.usuario.nombre}
                    </Link>
                    <span className="text-sm text-gray-500 ml-2">
                      {format(new Date(comentario.created_at), "d MMM yyyy", { locale: es })}
                    </span>
                  </div>
                  
                  {user?.id === comentario.usuario.id && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === comentario.id ? null : comentario.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {menuOpen === comentario.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                          <button
                            onClick={() => handleDelete(comentario.id)}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mt-1">{comentario.contenido}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          Aun no hay comentarios. Se el primero en comentar!
        </p>
      )}
    </div>
  )
}
