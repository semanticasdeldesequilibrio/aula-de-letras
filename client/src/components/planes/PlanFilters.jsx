import { useState, useEffect } from 'react'
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { planesService } from '../../services/planesService'

const YEARS = [
  { value: 1, label: '1er Ano' },
  { value: 2, label: '2do Ano' },
  { value: 3, label: '3er Ano' },
  { value: 4, label: '4to Ano' },
  { value: 5, label: '5to Ano' },
]

const RATINGS = [
  { value: 4, label: '4 estrellas o mas' },
  { value: 3, label: '3 estrellas o mas' },
  { value: 2, label: '2 estrellas o mas' },
]

export default function PlanFilters({ filters, onFilterChange, onClearFilters }) {
  const [temas, setTemas] = useState([])
  const [expanded, setExpanded] = useState({
    year: true,
    tema: true,
    rating: false
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    loadTemas()
  }, [filters.year])

  const loadTemas = async () => {
    try {
      const data = await planesService.getTemas(filters.year)
      setTemas(data)
    } catch (error) {
      console.error('Error cargando temas:', error)
    }
  }

  const handleYearChange = (year) => {
    const newYears = filters.years?.includes(year)
      ? filters.years.filter(y => y !== year)
      : [...(filters.years || []), year]
    onFilterChange({ ...filters, years: newYears, tema: null })
  }

  const handleTemaChange = (temaId) => {
    onFilterChange({ 
      ...filters, 
      tema: filters.tema === temaId ? null : temaId 
    })
  }

  const handleRatingChange = (rating) => {
    onFilterChange({ 
      ...filters, 
      minRating: filters.minRating === rating ? null : rating 
    })
  }

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFiltersCount = 
    (filters.years?.length || 0) + 
    (filters.tema ? 1 : 0) + 
    (filters.minRating ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={onClearFilters}
          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
        >
          <X className="w-4 h-4 mr-1" />
          Limpiar filtros ({activeFiltersCount})
        </button>
      )}

      {/* Year filter */}
      <div>
        <button
          onClick={() => toggleSection('year')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Ano Escolar
          {expanded.year ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.year && (
          <div className="space-y-2">
            {YEARS.map((year) => (
              <label key={year.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.years?.includes(year.value)}
                  onChange={() => handleYearChange(year.value)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">{year.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tema filter */}
      <div>
        <button
          onClick={() => toggleSection('tema')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Tema
          {expanded.tema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.tema && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {temas.length > 0 ? (
              temas.map((tema) => (
                <label key={tema.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={filters.tema === tema.id}
                    onChange={() => handleTemaChange(tema.id)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{tema.nombre}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Selecciona un ano para ver temas</p>
            )}
          </div>
        )}
      </div>

      {/* Rating filter */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Valoracion
          {expanded.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expanded.rating && (
          <div className="space-y-2">
            {RATINGS.map((rating) => (
              <label key={rating.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={filters.minRating === rating.value}
                  onChange={() => handleRatingChange(rating.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">{rating.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden lg:block">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        <FilterContent />
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline w-full flex items-center justify-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </h3>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full mt-6"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </>
  )
}
