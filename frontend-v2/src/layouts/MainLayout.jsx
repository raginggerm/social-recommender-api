import { Link } from 'react-router-dom'
import { Users, Calendar, MapPin } from 'lucide-react'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FCF5E5]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-sans text-[#FF4D1C] font-bold tracking-tight hover:text-[#FFB800] transition-colors">
                Social Recommender
              </Link>
            </div>
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
      </nav>

      {/* Hero Section solo para la página de inicio */}
      {window.location.pathname === '/' && (
        <div className="bg-gradient-to-br from-[#FCF5E5] to-[#FFF9E6] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Círculos decorativos */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF4D1C]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#FFB800]/10 rounded-full blur-3xl"></div>
              
              {/* Grid de tarjetas */}
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-10 h-10 text-[#FF4D1C] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Encuentra tu grupo</h3>
                  <p className="text-gray-600">Conéctate con personas que comparten tus intereses</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Calendar className="w-10 h-10 text-[#FFB800] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Eventos cercanos</h3>
                  <p className="text-gray-600">Descubre actividades en tu área</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="w-10 h-10 text-[#8BC34A] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Lugares recomendados</h3>
                  <p className="text-gray-600">Explora sitios que te encantarán</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Social Recommender • Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout