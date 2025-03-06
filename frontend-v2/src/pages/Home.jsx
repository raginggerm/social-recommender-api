import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center px-2 sm:px-4 lg:px-6 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">
        Encuentra tu próxima actividad social
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 w-full max-w-2xl mx-auto">
        Responde algunas preguntas y te recomendaremos actividades sociales 
        perfectas para ti.
      </p>
      <Link
        to="/questionnaire"
        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Comenzar Cuestionario
      </Link>
    </div>
  )
}

export default Home