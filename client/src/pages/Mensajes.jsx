import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { User, Send, ArrowLeft, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { mensajesService } from '../services/mensajesService'
import { useAuth } from '../context/AuthContext'

export default function Mensajes() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  
  const [conversaciones, setConversaciones] = useState([])
  const [mensajes, setMensajes] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadConversaciones()
  }, [])

  useEffect(() => {
    const userId = searchParams.get('user')
    if (userId) {
      selectConversation(userId)
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversaciones = async () => {
    try {
      const data = await mensajesService.getConversaciones()
      setConversaciones(data)
    } catch (error) {
      console.error('Error cargando conversaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (userId) => {
    try {
      const data = await mensajesService.getConversacion(userId)
      setMensajes(data.mensajes)
      setSelectedUser(data.usuario)
    } catch (error) {
      toast.error('Error al cargar la conversacion')
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!nuevoMensaje.trim() || !selectedUser) return

    setSending(true)
    try {
      const mensaje = await mensajesService.enviarMensaje(selectedUser.id, nuevoMensaje)
      setMensajes([...mensajes, mensaje])
      setNuevoMensaje('')
    } catch (error) {
      toast.error('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        Mensajes
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations list */}
          <div className={`w-full md:w-80 border-r border-gray-200 ${selectedUser ? 'hidden md:block' : ''}`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversaciones</h2>
            </div>
            
            {conversaciones.length > 0 ? (
              <div className="overflow-y-auto h-[calc(600px-57px)]">
                {conversaciones.map((conv) => (
                  <button
                    key={conv.usuario.id}
                    onClick={() => selectConversation(conv.usuario.id)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                      selectedUser?.id === conv.usuario.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    {conv.usuario.avatar_url ? (
                      <img 
                        src={conv.usuario.avatar_url} 
                        alt={conv.usuario.nombre}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {conv.usuario.nombre}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.ultimo_mensaje}
                      </p>
                    </div>
                    {conv.no_leidos > 0 && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {conv.no_leidos}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes conversaciones</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : ''}`}>
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden p-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Link to={`/perfil/${selectedUser.id}`} className="flex items-center gap-3">
                    {selectedUser.avatar_url ? (
                      <img 
                        src={selectedUser.avatar_url} 
                        alt={selectedUser.nombre}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">
                      {selectedUser.nombre}
                    </span>
                  </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensajes.map((mensaje) => {
                    const isOwn = mensaje.emisor_id === user.id
                    return (
                      <div
                        key={mensaje.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          isOwn 
                            ? 'bg-primary-600 text-white rounded-l-lg rounded-tr-lg' 
                            : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                        } px-4 py-2`}>
                          <p>{mensaje.contenido}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
                            {format(new Date(mensaje.created_at), 'HH:mm', { locale: es })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="input flex-1"
                    />
                    <button
                      type="submit"
                      disabled={!nuevoMensaje.trim() || sending}
                      className="btn-primary"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Selecciona una conversacion</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
