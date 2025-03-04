import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getQuestions = async () => {
  try {
    const response = await api.get('/questions/')
    return response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

export const submitResponses = async (responses) => {
  try {
    const formattedData = {
      user_id: 1,
      responses: responses.map(resp => ({
        question_id: resp.question_id,
        response_value: resp.response_value
      }))
    }
    
    const response = await api.post('/responses/submit', formattedData)
    return response.data
  } catch (error) {
    console.error('Error completo:', error)
    throw error
  }
}

export const getRecommendations = async (userId = 1) => {
  try {
    const response = await api.get(`/recommendations/user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

export const getNearbyPlaces = async (userId = 1, latitude, longitude) => {
  try {
    const search = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: 15.0
    }

    console.log('Enviando búsqueda:', search)
    
    const response = await api.get(`/api/places/nearby/${userId}`, {
      params: search
    })

    console.log('Lugares encontrados:', response.data)
    return response.data
  } catch (error) {
    // Mostrar el error detallado incluyendo la respuesta del servidor
    console.error('Error detallado:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params
    })
    throw error
  }
}