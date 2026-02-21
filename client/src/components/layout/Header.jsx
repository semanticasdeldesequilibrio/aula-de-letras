import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  BookOpen, 
  Heart, 
  MessageCircle, 
  LogOut,
  PlusCircle,
  Settings
} from 'lucide-react'

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">A</span>
            </div>
            <span className="font-serif font-bold text-xl text-primary-800 hidden sm:block">
              Aula de Letras
            </span>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar planes de clase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/explorar" 
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Explorar
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/crear-plan" 
                  className="btn-primary flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Crear Plan</span>
                </Link>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.nombre}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {user.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.nombre}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link 
                        to={`/perfil/${user.id}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link 
                        to="/mis-planes"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Mis Planes</span>
                      </Link>
                      <Link 
                        to="/favoritos"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Favoritos</span>
                      </Link>
                      <Link 
                        to="/mensajes"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Mensajes</span>
                      </Link>
                      
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link 
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Administracion</span>
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesion</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Iniciar Sesion
                </Link>
                <Link 
                  to="/registro" 
                  className="btn-primary"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar planes de clase..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            
            <nav className="space-y-2">
              <Link 
                to="/explorar" 
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-primary-600"
              >
                Explorar
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/crear-plan" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Crear Plan
                  </Link>
                  <Link 
                    to={`/perfil/${user.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/mis-planes"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Mis Planes
                  </Link>
                  <Link 
                    to="/favoritos"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Favoritos
                  </Link>
                  <Link 
                    to="/mensajes"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Mensajes
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-600 hover:text-primary-600"
                    >
                      Administracion
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block py-2 text-red-600"
                  >
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-primary-600"
                  >
                    Iniciar Sesion
                  </Link>
                  <Link 
                    to="/registro" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-primary-600 font-medium"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
