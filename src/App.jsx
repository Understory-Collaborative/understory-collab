import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Advisory from './pages/Advisory'
import Implementation from './pages/Implementation'
import About from './pages/About'
import Values from './pages/Values'
import OurWork from './pages/OurWork'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Unsubscribe from './pages/Unsubscribe'
import Accessibility from './pages/Accessibility'
import Quiz from './pages/Quiz'
import Newsletter from './pages/Newsletter'
import NewsletterPost from './pages/NewsletterPost'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="advisory" element={<Advisory />} />
            <Route path="implementation" element={<Implementation />} />
            <Route path="about" element={<About />} />
            <Route path="values" element={<Values />} />
            <Route path="our-work" element={<OurWork />} />
            {/* Old route kept as a redirect so existing links don't 404 */}
            <Route path="portfolios" element={<Navigate to="/our-work" replace />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="newsletter/:slug" element={<NewsletterPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="unsubscribe" element={<Unsubscribe />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="quiz" element={<Quiz />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
