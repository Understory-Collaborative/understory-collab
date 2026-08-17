import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import OurWork from './pages/OurWork'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Unsubscribe from './pages/Unsubscribe'
import Accessibility from './pages/Accessibility'
import Quiz from './pages/Quiz'
import OfferPage from './pages/OfferPage'
import Apply from './pages/Apply'
import OfficeHours from './pages/OfficeHours'
import Questions from './pages/Questions'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Advisory + Implementation retired into the homepage Design/Build/Ship offerings */}
            <Route path="advisory" element={<Navigate to="/" replace />} />
            <Route path="implementation" element={<Navigate to="/" replace />} />
            <Route path="about" element={<About />} />
            {/* Values folded into About */}
            <Route path="values" element={<Navigate to="/about" replace />} />
            <Route path="our-work" element={<OurWork />} />
            {/* Old route kept as a redirect so existing links don't 404 */}
            <Route path="portfolios" element={<Navigate to="/our-work" replace />} />
            {/* The Ghost-fed newsletter is retired; redirect old links home instead of 404ing */}
            <Route path="newsletter/*" element={<Navigate to="/" replace />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="unsubscribe" element={<Unsubscribe />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="quiz" element={<Quiz />} />
            {/* The three doors — one offer page per door, data-driven from offersData.js */}
            <Route path="offers/:slug" element={<OfferPage />} />
            {/* Short application — the conversation step; door prefilled via ?door=<slug> */}
            <Route path="apply" element={<Apply />} />
            {/* Low-commitment paid rung: $50 group office hours */}
            <Route path="office-hours" element={<OfficeHours />} />
            {/* Free async rung: public Q&A */}
            <Route path="questions" element={<Questions />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
