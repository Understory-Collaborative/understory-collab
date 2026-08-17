import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import ucLogo from '../assets/UC_Logo.png'
import './Navigation.css'

// Flat nav for the funnel IA. The old Services dropdown (Advisory/Implementation)
// and Values are retired; the offerings now live on the homepage as Design/Build/Ship.
const LINKS = [
  { to: '/quiz', label: 'Assessment' },
  { to: '/office-hours', label: 'Office hours' },
  { to: '/our-work', label: 'Our work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navigation() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="nav-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link to="/" className="nav-logo-link" aria-label="Understory Collaborative home">
          <img src={ucLogo} alt="" className="nav-logo" aria-hidden="true" />
          <span className="nav-wordmark">Understory Collaborative</span>
        </Link>

        <ul className="nav-links" role="list">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? (
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </nav>
    </header>
  )
}

export default Navigation
