import { Link } from 'react-router-dom'
import { Users, Calendar, MapPin, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  // Manejar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cerrar el menú móvil al cambiar de página
  useEffect(() => {
    setIsMenuOpen(false)
  }, [window.location.pathname])

  return (
    <div className="min-h-screen bg-[#FCF5E5] w-full">
      {/* Navbar */}
      <nav className="bg-white shadow-sm w-full">
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl sm:text-2xl font-sans text-[#FF4D1C] font-bold tracking-tight hover:text-[#FFB800] transition-colors">
                Social Recommender
              </Link>
            </div>

            {/* Botón de menú móvil */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#FF4D1C] p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Menú de navegación escritorio */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link 
                to="/" 
                className="text-[#FFB800] hover:text-[#FF9500] px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link 
                to="/questionnaire" 
                className="text-[#FF4D1C] hover:text-[#E63900] px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Cuestionario
              </Link>
              <Link 
                to="/activities" 
                className="text-[#8BC34A] hover:text-[#689F38] px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Actividades
              </Link>
            </div>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white pb-3 px-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-[#FFB800] hover:text-[#FF9500] px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link 
                to="/questionnaire" 
                className="text-[#FF4D1C] hover:text-[#E63900] px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Cuestionario
              </Link>
              <Link 
                to="/activities" 
                className="text-[#8BC34A] hover:text-[#689F38] px-4 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Actividades
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section solo para la página de inicio */}
      {window.location.pathname === '/' && (
        <div className="bg-gradient-to-br from-[#FCF5E5] to-[#FFF9E6] py-8 sm:py-16 w-full">
          <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Círculos decorativos */}
              <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-[#FF4D1C]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-56 sm:w-72 h-56 sm:h-72 bg-[#FFB800]/10 rounded-full blur-3xl"></div>
              
              {/* Grid de tarjetas */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF4D1C] mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Encuentra tu grupo</h3>
                  <p className="text-sm sm:text-base text-gray-600">Conéctate con personas que comparten tus intereses</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFB800] mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Eventos cercanos</h3>
                  <p className="text-sm sm:text-base text-gray-600">Descubre actividades en tu área</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-[#8BC34A] mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Lugares recomendados</h3>
                  <p className="text-sm sm:text-base text-gray-600">Explora sitios que te encantarán</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="min-h-[calc(100vh-8rem)] w-full">
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm mt-auto w-full">
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-gray-600 text-xs sm:text-sm">
            © 2025 Social Recommender • Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout