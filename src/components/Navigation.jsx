import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import treeMark from '../assets/noun-tree-with-leaves-6402273.svg'
import './Navigation.css'

// The two ways in are grouped under one "Assessments" dropdown.
const ASSESSMENT_LINKS = [
  { to: '/assessment', label: "What's on fire" },
  { to: '/tpm-self-check', label: 'TPM self-check' },
]

// The remaining flat links. The old Services dropdown (Advisory/Implementation) and
// Values are retired; the offerings now live on the homepage as Design/Build/Ship.
const LINKS = [
  { to: '/office-hours', label: 'Office hours' },
  { to: '/our-work', label: 'Our work' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

// A disclosure dropdown for a group of nav links. On desktop it opens as a popover on
// hover or click; on mobile it expands inline within the stacked menu. Escape closes
// it and returns focus to the button, and a click outside closes it, so keyboard and
// pointer users are never trapped.
function NavDropdown({ label, items, onNavigate }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const { pathname } = useLocation()
  const menuId = 'nav-dropdown-assessments'
  // Hover opens the menu, and leaving it closes after a short grace period, so a
  // pointer moving diagonally from the button to a link doesn't lose the menu.
  const closeTimer = useRef(null)
  // True when the menu was just opened by hover, so the click that usually follows
  // the hover keeps it open instead of toggling it straight back closed.
  const openedByHover = useRef(false)

  const cancelClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const isActive = items.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  )

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSelect = () => {
    cancelClose()
    setOpen(false)
    onNavigate?.()
  }

  return (
    <li
      className="nav-dropdown"
      ref={containerRef}
      onMouseEnter={() => {
        cancelClose()
        if (!open) openedByHover.current = true
        setOpen(true)
      }}
      onMouseLeave={() => {
        cancelClose()
        openedByHover.current = false
        closeTimer.current = setTimeout(() => setOpen(false), 300)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={isActive ? 'nav-link nav-dropdown-toggle active' : 'nav-link nav-dropdown-toggle'}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false
            setOpen(true)
            return
          }
          setOpen((prev) => !prev)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {label}
        <svg
          className="nav-dropdown-caret"
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <ul
        id={menuId}
        className="nav-dropdown-menu"
        role="list"
        data-open={open ? '' : undefined}
      >
        {items.map(({ to, label: itemLabel }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive: linkActive }) =>
                linkActive ? 'nav-dropdown-link active' : 'nav-dropdown-link'
              }
              onClick={handleSelect}
            >
              {itemLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  )
}

function Navigation() {
  const { theme, toggleTheme } = useTheme()
  // On mobile the links collapse behind a menu button. Desktop ignores this state
  // (the links are always shown via CSS).
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the mobile menu, so keyboard users are never trapped in it.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="nav-header">
      <nav className="nav-container" aria-label="Main navigation">
        <Link
          to="/"
          className="nav-logo-link"
          aria-label="Understory Collaborative home"
          onClick={closeMenu}
        >
          <span
            className="nav-logo"
            aria-hidden="true"
            style={{ '--mark': `url(${treeMark})` }}
          />
          <span className="nav-wordmark">Understory Collaborative</span>
        </Link>

        <ul className="nav-links" id="primary-nav" role="list" data-open={menuOpen ? '' : undefined}>
          <NavDropdown label="Assessments" items={ASSESSMENT_LINKS} onNavigate={closeMenu} />
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
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

          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
