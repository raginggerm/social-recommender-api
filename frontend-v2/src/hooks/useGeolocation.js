import { useState, useEffect } from 'react'

const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const getFallbackLocation = () => {
    // Coordenadas de Monterrey centro
    setLocation({
      latitude: 25.6866,
      longitude: -100.3161
    })
    setUsingFallback(true)
    setLoading(false)
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en tu navegador')
      getFallbackLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
        setError(null)
        setUsingFallback(false)
      },
      (error) => {
        let errorMessage = 'Error al obtener la ubicación'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Por favor habilita el acceso a tu ubicación para recomendaciones más precisas'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'La información de ubicación no está disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Se agotó el tiempo para obtener la ubicación'
            break
          default:
            errorMessage = 'Ha ocurrido un error al obtener tu ubicación'
        }
        setError(errorMessage)
        getFallbackLocation()
      },
      {
        enableHighAccuracy: false, // Cambiamos a false para una respuesta más rápida
        timeout: 5000, // Reducimos a 5 segundos
        maximumAge: 60000 // Permitimos cache de 1 minuto
      }
    )
  }

  useEffect(() => {
    getLocation()
  }, [])

  const retry = () => {
    setLoading(true)
    setError(null)
    setUsingFallback(false)
    getLocation()
  }

  return { location, error, loading, retry, usingFallback }
}

export default useGeolocation