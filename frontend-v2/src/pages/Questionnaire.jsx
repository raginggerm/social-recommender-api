import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuestions, submitResponses } from '../services/api'

// Opciones de respuesta personalizadas por pregunta
const customAnswers = {
  1: [
    { value: "5", label: "Eventos sociales como festivales o antros" },
    { value: "4", label: "Eventos sociales no tan grandes como conciertos pequeños o bares" },
    { value: "3", label: "Pueden ser ambas, depende mi humor" },
    { value: "2", label: "Eventos pequeños como cafes" },
    { value: "1", label: "Eventos muy pequeños, caseros" }
  ],
  2: [
    { value: "5", label: "Todos los días" },
    { value: "4", label: "Solo entre semana" },
    { value: "3", label: "Tres veces por semana" },
    { value: "2", label: "Una vez a la semana" },
    { value: "1", label: "Nunca" }
  ],
  3: [
    { value: "5", label: "Me encanta" },
    { value: "4", label: "Cuando tengo ganas de salir me gusta" },
    { value: "3", label: "A veces me gusta" },
    { value: "2", label: "Si me presentan a alguien, si me gusta" },
    { value: "1", label: "No me gusta" }
  ],
  4: [
    { value: "5", label: "Me encanta ese tipo de planes!" },
    { value: "4", label: "Si el evento me llama la atención si me gusta" },
    { value: "3", label: "A veces me gusta" },
    { value: "2", label: "Con eventos muy específicos me gusta" },
    { value: "1", label: "No me gusta" }
  ],
  5: [
    { value: "5", label: "Me encanta al aire libre siempre" },
    { value: "4", label: "Depende de el clima prefiero aire libre" },
    { value: "3", label: "Depende de mi humor" },
    { value: "2", label: "Prefiero lugares cerrados con terraza" },
    { value: "1", label: "Lugares cerrados siempre" }
  ]
}

const Questionnaire = () => {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions()
        setQuestions(data)
        const initialAnswers = data.reduce((acc, question) => {
          acc[question.id] = ''
          return acc
        }, {})
        setAnswers(initialAnswers)
      } catch (err) {
        setError('Error al cargar las preguntas. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Verifica que todas las preguntas tengan respuesta
    if (Object.values(answers).some(answer => answer === '')) {
      alert('Por favor responde todas las preguntas')
      return
    }

    try {
      setLoading(true)
      
      // Formatea las respuestas según la estructura requerida
      const formattedResponses = Object.entries(answers).map(([questionId, value]) => ({
        question_id: parseInt(questionId),
        response_value: parseInt(value)
      }))
      
      console.log('Respuestas antes de enviar:', formattedResponses)
      
      const result = await submitResponses(formattedResponses)
      console.log('Respuesta del servidor:', result)
      
      // Forzar la navegación y añadir un console.log para debug
      console.log('Intentando navegar a recomendaciones')
      navigate('/recommendations', { replace: true })
      console.log('Navegación completada')

    } catch (err) {
      console.error('Error completo:', err)
      setError(`Error al enviar las respuestas: ${err.response?.data?.detail || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Cuestionario de Preferencias
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              {question.text}
            </label>
            <select
              value={answers[question.id]}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option value="">Selecciona una respuesta</option>
              {customAnswers[question.id]?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Respuestas'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Questionnaire