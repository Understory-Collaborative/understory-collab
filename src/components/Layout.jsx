import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import './Layout.css'

function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)

  // On client-side route change, move focus to the main region so screen-reader
  // users are told the page changed and keyboard focus doesn't get stranded up top.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (mainRef.current) {
      // preventScroll so focusing <main> doesn't yank its top under the sticky
      // nav; scrollTo then puts us cleanly at the top of the page.
      mainRef.current.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <div className="layout">
      <button
        className="skip-link"
        onClick={() => {
          const main = document.getElementById('main-content')
          if (main) {
            main.focus()
            main.scrollIntoView()
          }
        }}
      >
        Skip to main content
      </button>
      <Navigation />
      <main id="main-content" className="main-content" tabIndex="-1" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
