import { Link } from 'react-router-dom'
import { Star, FileText, User } from 'lucide-react'

const YEAR_COLORS = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
}

const YEAR_LABELS = {
  1: '1er Ano',
  2: '2do Ano',
  3: '3er Ano',
  4: '4to Ano',
  5: '5to Ano'
}

export default function PlanCard({ plan }) {
  const {
    id,
    titulo,
    descripcion,
    anio_escolar,
    tema,
    autor,
    _count,
    promedio_valoracion,
    archivos_count
  } = plan

  const yearColor = YEAR_COLORS[anio_escolar] || 'bg-gray-500'
  const yearLabel = YEAR_LABELS[anio_escolar] || `${anio_escolar}° Ano`

  return (
    <Link to={`/plan/${id}`} className="card group">
      {/* Header with year badge */}
      <div className={`${yearColor} h-2`}></div>
      
      <div className="p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`${yearColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
            {yearLabel}
          </span>
          {tema && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {tema.nombre}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
          {titulo}
        </h3>

        {/* Description */}
        {descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {descripcion}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center">
            {autor?.avatar_url ? (
              <img 
                src={autor.avatar_url} 
                alt={autor.nombre}
                className="w-6 h-6 rounded-full object-cover mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                <User className="w-3 h-3 text-primary-600" />
              </div>
            )}
            <span className="text-xs text-gray-600 truncate max-w-[100px]">
              {autor?.nombre || 'Anonimo'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Files count */}
            {(archivos_count > 0 || _count?.archivos > 0) && (
              <div className="flex items-center text-gray-500">
                <FileText className="w-4 h-4 mr-1" />
                <span className="text-xs">{archivos_count || _count?.archivos}</span>
              </div>
            )}
            
            {/* Rating */}
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-xs text-gray-600">
                {promedio_valoracion ? promedio_valoracion.toFixed(1) : 'N/A'}
              </span>
              {_count?.valoraciones > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  ({_count.valoraciones})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
