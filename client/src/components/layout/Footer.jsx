import { Link } from 'react-router-dom'
import { BookOpen, Mail, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">A</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Aula de Letras
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Plataforma colaborativa donde docentes de Lengua y Literatura comparten 
              planes de clase y actividades para todos los anos de secundaria.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contacto@auladeletras.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Enlaces Rapidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explorar" className="text-gray-400 hover:text-white transition-colors">
                  Explorar Planes
                </Link>
              </li>
              <li>
                <Link to="/explorar?year=1" className="text-gray-400 hover:text-white transition-colors">
                  1er Ano
                </Link>
              </li>
              <li>
                <Link to="/explorar?year=2" className="text-gray-400 hover:text-white transition-colors">
                  2do Ano
                </Link>
              </li>
              <li>
                <Link to="/explorar?year=3" className="text-gray-400 hover:text-white transition-colors">
                  3er Ano
                </Link>
              </li>
              <li>
                <Link to="/explorar?year=4" className="text-gray-400 hover:text-white transition-colors">
                  4to Ano
                </Link>
              </li>
              <li>
                <Link to="/explorar?year=5" className="text-gray-400 hover:text-white transition-colors">
                  5to Ano
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/guia-docentes" className="text-gray-400 hover:text-white transition-colors">
                  Guia para Docentes
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-gray-400 hover:text-white transition-colors">
                  Terminos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                  Politica de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {currentYear} Aula de Letras. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0 flex items-center">
            Hecho con <span className="text-red-500 mx-1">&#9829;</span> para docentes
          </p>
        </div>
      </div>
    </footer>
  )
}
