import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import ucLogo from '../assets/UC_Logo.png'
import './Navigation.css'

const SERVICES = [
  { to: '/advisory', label: 'Advisory' },
  { to: '/implementation', label: 'Implementation' },
  { to: '/quiz', label: 'Assessment' },
]

function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesRef = useRef(null)
  const servicesButtonRef = useRef(null)

  const servicesActive = SERVICES.some(({ to }) => pathname === to)

  // A click or focus outside the Services group closes it.
  useEffect(() => {
    if (!servicesOpen) return
    const onOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [servicesOpen])

  const onServicesKeyDown = (e) => {
    if (e.key === 'Escape' && servicesOpen) {
      setServicesOpen(false)
      servicesButtonRef.current?.focus()
    }
  }

  return (
    <header className="nav-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link to="/" className="nav-logo-link" aria-label="Understory Collaborative home">
          <img src={ucLogo} alt="" className="nav-logo" aria-hidden="true" />
          <span className="nav-wordmark">Understory Collaborative</span>
        </Link>

        <ul className="nav-links" role="list">
          <li className="nav-dropdown" ref={servicesRef} onKeyDown={onServicesKeyDown}>
            <button
              type="button"
              ref={servicesButtonRef}
              className={servicesActive ? 'nav-link nav-dropdown-toggle active' : 'nav-link nav-dropdown-toggle'}
              aria-expanded={servicesOpen}
              aria-controls="services-submenu"
              aria-current={servicesActive ? 'true' : undefined}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services
              <svg
                className={servicesOpen ? 'nav-caret open' : 'nav-caret'}
                aria-hidden="true"
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <ul id="services-submenu" className="nav-submenu" role="list" hidden={!servicesOpen}>
              {SERVICES.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? 'nav-sublink active' : 'nav-sublink')}
                    onClick={() => setServicesOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/our-work" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Our Work
            </NavLink>
          </li>
          <li>
            <NavLink to="/values" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Values
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Contact Us
            </NavLink>
          </li>
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
