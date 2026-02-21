import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, BookOpen, ArrowUpDown } from 'lucide-react'
import { planesService } from '../services/planesService'
import PlanCard from '../components/planes/PlanCard'
import PlanFilters from '../components/planes/PlanFilters'

const SORT_OPTIONS = [
  { value: 'reciente', label: 'Mas recientes' },
  { value: 'valoracion', label: 'Mejor valorados' },
  { value: 'descargas', label: 'Mas descargados' },
  { value: 'antiguo', label: 'Mas antiguos' },
]

export default function Explorar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlanes, setTotalPlanes] = useState(0)
  
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    years: searchParams.get('year') ? [parseInt(searchParams.get('year'))] : [],
    tema: searchParams.get('tema') || null,
    minRating: null,
    orderBy: 'reciente',
    page: 1
  })

  useEffect(() => {
    loadPlanes()
  }, [filters])

  const loadPlanes = async () => {
    setLoading(true)
    try {
      const params = {
        q: filters.q,
        years: filters.years?.join(','),
        tema: filters.tema,
        minRating: filters.minRating,
        orderBy: filters.orderBy,
        page: filters.page,
        limit: 12
      }
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })

      const data = await planesService.getPlanes(params)
      setPlanes(data.planes || [])
      setTotalPages(data.totalPages || 1)
      setTotalPlanes(data.total || 0)
    } catch (error) {
      console.error('Error cargando planes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const q = formData.get('q')
    setFilters(prev => ({ ...prev, q, page: 1 }))
    if (q) {
      setSearchParams({ q })
    } else {
      setSearchParams({})
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleClearFilters = () => {
    setFilters({
      q: '',
      years: [],
      tema: null,
      minRating: null,
      orderBy: 'reciente',
      page: 1
    })
    setSearchParams({})
  }

  const handleSortChange = (orderBy) => {
    setFilters(prev => ({ ...prev, orderBy, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          Explorar Planes de Clase
        </h1>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={filters.q}
              placeholder="Buscar por titulo, contenido, tema..."
              className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-4 py-1.5"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <PlanFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <p className="text-gray-600">
              {totalPlanes} {totalPlanes === 1 ? 'plan encontrado' : 'planes encontrados'}
            </p>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={filters.orderBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plans grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-2 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : planes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {planes.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= filters.page - 1 && page <= filters.page + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm rounded-lg ${
                              filters.page === page
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (
                        page === filters.page - 2 ||
                        page === filters.page + 2
                      ) {
                        return <span key={page} className="px-2">...</span>
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron planes
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros o buscar con otros terminos
              </p>
              <button 
                onClick={handleClearFilters}
                className="btn-outline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
