import { useState, useEffect } from 'react'
import { getRecommendations, getNearbyPlaces } from '../services/api'
import useGeolocation from '../hooks/useGeolocation'
import { Link } from 'react-router-dom'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { location, error: locationError, loading: locationLoading, retry, usingFallback } = useGeolocation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const recommendationsData = await getRecommendations(1)
        setRecommendations(recommendationsData)

        if (location) {
          const places = await getNearbyPlaces(1, location.latitude, location.longitude)
          const topPlaces = places
            .sort((a, b) => b.compatibility_score - a.compatibility_score)
            .slice(0, 3)
          setNearbyPlaces(topPlaces)
        }
      } catch (err) {
        console.error('Error específico:', err)
        setError('Error al cargar las recomendaciones. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location])

  if (loading || locationLoading) {
    return (
      <div className="min-h-screen bg-[#FFF7E3] flex justify-center items-center">
        <div className="text-lg sm:text-xl text-gray-600 px-4 text-center">Cargando recomendaciones...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF7E3] w-full">
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Recomendaciones Personalizadas
        </h1>

        {/* Mensaje de ubicación */}
        {(locationError || usingFallback) && (
          <div className="mb-6 sm:mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="sm:ml-3">
                <p className="text-sm text-yellow-700">
                  {usingFallback ? 
                    "Usando ubicación predeterminada. Para mejores recomendaciones, permite el acceso a tu ubicación." : 
                    locationError
                  }
                </p>
                <button
                  onClick={retry}
                  className="mt-2 text-sm font-medium text-[#3A6ECF] hover:text-[#2d5ab0]"
                >
                  Intentar obtener ubicación nuevamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actividades recomendadas */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Actividades Sugeridas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendations.map((activity, index) => (
              <div 
                key={activity.id || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {activity.name || activity.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {activity.description}
                  </p>
                  {activity.match_score && (
                    <div className="mt-3 sm:mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">
                          Compatibilidad
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#3A6ECF]">
                          {Math.round(activity.match_score)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-[#3A6ECF] h-1.5 sm:h-2 rounded-full" 
                          style={{ width: `${activity.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lugares Recomendados */}
        {nearbyPlaces.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Lugares Cercanos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {nearbyPlaces.map((place) => (
                <div 
                  key={place.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {place.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      {place.description}
                    </p>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="inline-block bg-[#3A6ECF]/10 text-[#3A6ECF] text-xs font-medium px-2 py-0.5 rounded">
                        {place.category}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {place.address}
                      </div>
                      <div className="text-xs sm:text-sm text-[#3A6ECF]">
                        {Math.round(place.distance * 10) / 10} km de distancia
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">
                            Compatibilidad
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-[#3A6ECF]">
                            {Math.round(place.compatibility_score)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-[#3A6ECF] h-1.5 sm:h-2 rounded-full" 
                            style={{ width: `${place.compatibility_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de reinicio */}
        <div className="text-center mt-8 sm:mt-12 pb-4 sm:pb-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#FF4D1C] text-white rounded-lg hover:bg-[#E63900] transition-colors duration-200 text-base sm:text-lg font-medium"
          >
            Busca tu próxima actividad
          </Link>
        </div>

        {/* Mensaje de error general */}
        {error && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-red-600 mb-4 px-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#3A6ECF] text-white rounded hover:bg-[#2d5ab0]"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations