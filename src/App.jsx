import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './views/Home'
import About from './views/About'
import AuthorProfile from './views/AuthorProfile'
import OurWork from './views/OurWork'
import Contact from './views/Contact'
import Privacy from './views/Privacy'
import Unsubscribe from './views/Unsubscribe'
import Accessibility from './views/Accessibility'
import Quiz from './views/Quiz'
import TpmSelfCheck from './views/TpmSelfCheck'
import TpmTypes from './views/TpmTypes'
import TpmTypeDetail from './views/TpmTypeDetail'
import OfferPage from './views/OfferPage'
import OfficeHours from './views/OfficeHours'
import Questions from './views/Questions'
import Blog from './views/Blog'
import BlogPost from './views/BlogPost'
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
            <Route path="about/:slug" element={<AuthorProfile />} />
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
            <Route path="assessment" element={<Quiz />} />
            {/* Renamed quiz → assessment; keep the old path as a redirect so existing links don't 404 */}
            <Route path="quiz" element={<Navigate to="/assessment" replace />} />
            {/* The three doors — one offer page per door, data-driven from offersData.js */}
            <Route path="offers/:slug" element={<OfferPage />} />
            {/* Apply retired; the Contact form is the single intake. Old links redirect,
                carrying the door through so the topic stays preselected. */}
            <Route path="apply" element={<Navigate to="/contact" replace />} />
            {/* Low-commitment paid rung: $50 group office hours */}
            <Route path="office-hours" element={<OfficeHours />} />
            {/* Free async rung: public Q&A */}
            <Route path="questions" element={<Questions />} />
            {/* Blog — index plus one page per post. Posts are markdown files in
                content/posts, and drafts render (noindex) at their own URL for preview. */}
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            {/* Consumer-facing TPM self-check: maps the six durable skills and names the
                archetype the shape is closest to. Framework in review/tpm-hexagon-model.md. */}
            <Route path="tpm-self-check" element={<TpmSelfCheck />} />
            {/* The archetype explorer: index of every type, plus a page per type. */}
            <Route path="tpm-types" element={<TpmTypes />} />
            <Route path="tpm-types/:slug" element={<TpmTypeDetail />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
