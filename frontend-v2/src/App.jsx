import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Questionnaire from './pages/Questionnaire'
import Recommendations from './pages/Recommendations'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App