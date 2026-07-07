import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingOverlay from './LoadingOverlay.jsx'

function SparkleIcon({ spinning }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
      style={{ animation: spinning ? 'spin-icon 0.7s linear infinite' : 'none', flexShrink: 0 }}
    >
      <path d="M12 2L13.5 8.5H20L14.75 12.5L16.5 19L12 15L7.5 19L9.25 12.5L4 8.5H10.5L12 2Z" />
    </svg>
  )
}

function ServicesDropdown() {
  const [open, setOpen] = useState(false)
  const items = ['Deposit Accounts', 'Credit Cards', 'Loans', 'Business Banking', 'Wealth & Retire']
  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#1a2b4a', fontWeight: 500, padding: '8px 0' }}>
        Services
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a2b4a" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, minWidth: 190,
          background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #e8eef6', padding: '8px 0', zIndex: 600,
        }}>
          {items.map(item => (
            <a key={item} href="#" style={{ display: 'block', padding: '9px 18px', fontSize: 13, color: '#1a2b4a', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f5fb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{item}</a>
          ))}
        </div>
      )}
    </div>
  )
}

function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2b4a" strokeWidth="2.2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleOpenAccount = (e) => {
    e.preventDefault()
    setMobileOpen(false)
    setClicking(true)
    setTimeout(() => {
      setClicking(false)
      setShowOverlay(true)
      setTimeout(() => navigate('/register'), 1500)
    }, 2000)
  }

  const isSpinning = hovering || clicking

  const navLinks = ['Home', 'About', 'Contact']

  return (
    <>
      <LoadingOverlay visible={showOverlay} />
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        background: '#ffffff',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
      }}>
        {/* Main bar */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#1A56DB" />
              <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#1a2b4a', letterSpacing: '0.04em', lineHeight: 1.1 }}>ELITEFIN</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#0b97a8', letterSpacing: '0.08em', lineHeight: 1.2 }}>MARKETS</div>
            </div>
          </Link>

          {/* Desktop nav links — className controls display, NO inline display override */}
          <div className="hidden md:flex items-center" style={{ gap: 32 }}>
            {navLinks.map(item => (
              <a key={item} href="#" style={{ fontSize: 14, color: '#1a2b4a', fontWeight: 500, textDecoration: 'none' }}>{item}</a>
            ))}
            <ServicesDropdown />
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center" style={{ gap: 12 }}>
            <button
              onClick={() => setDarkMode(d => !d)}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e0e8f0', background: '#f5f8fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Toggle dark mode"
            >
              {darkMode
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><circle cx="12" cy="12" r="5"/><path stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a2b4a"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <Link to="/signin" style={{ fontSize: 14, fontWeight: 600, color: '#0b97a8', textDecoration: 'none', padding: '8px 4px' }}>
              Login
            </Link>
            <button
              onClick={handleOpenAccount}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 8,
                background: '#0b97a8', border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 14, fontWeight: 600,
                boxShadow: '0 4px 14px rgba(11,151,168,0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              <SparkleIcon spinning={isSpinning} />
              Open Account
            </button>
          </div>

          {/* Mobile right: dark toggle + hamburger */}
          <div className="flex md:hidden items-center" style={{ gap: 8 }}>
            <button
              onClick={() => setDarkMode(d => !d)}
              style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e0e8f0', background: '#f5f8fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {darkMode
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b"><circle cx="12" cy="12" r="5"/><path stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="#1a2b4a"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid #e0e8f0', background: '#f5f8fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div style={{
            background: '#fff',
            borderTop: '1px solid #e8eef6',
            padding: '16px 20px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
              {navLinks.map(item => (
                <a key={item} href="#" onClick={() => setMobileOpen(false)}
                  style={{ fontSize: 15, color: '#1a2b4a', fontWeight: 500, textDecoration: 'none', padding: '11px 12px', borderRadius: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f5fb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{item}</a>
              ))}
              {/* Services links flat on mobile */}
              <details style={{ padding: '2px 0' }}>
                <summary style={{ fontSize: 15, color: '#1a2b4a', fontWeight: 500, padding: '11px 12px', cursor: 'pointer', borderRadius: 8, listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Services
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a2b4a" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </summary>
                <div style={{ paddingLeft: 16, paddingTop: 4 }}>
                  {['Deposit Accounts', 'Credit Cards', 'Loans', 'Business Banking', 'Wealth & Retire'].map(item => (
                    <a key={item} href="#" onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', fontSize: 14, color: '#4a6080', padding: '9px 12px', textDecoration: 'none', borderRadius: 6 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5fb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{item}</a>
                  ))}
                </div>
              </details>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#e8eef6', marginBottom: 16 }} />

            {/* Auth actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/signin" onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#0b97a8', textDecoration: 'none', border: '1px solid #0b97a8' }}
              >
                Login
              </Link>
              <button
                onClick={handleOpenAccount}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '#0b97a8', color: '#fff', fontSize: 15, fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(11,151,168,0.35)',
                }}
              >
                <SparkleIcon spinning={clicking} />
                Open Account
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
