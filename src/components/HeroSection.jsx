import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingOverlay from './LoadingOverlay.jsx'

function InfoCard({ bg, icon, label, value, sub }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg, borderRadius: 14, padding: '22px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flex: 1, minWidth: 0,
        transition: 'transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        opacity: hovered ? 0.88 : 1,
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em', marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{sub}</div>}
      </div>
      <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const [clicking, setClicking] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const navigate = useNavigate()

  const handleOpenAccount = (e) => {
    e.preventDefault()
    setClicking(true)
    setTimeout(() => {
      setClicking(false)
      setShowOverlay(true)
      setTimeout(() => navigate('/register'), 1500)
    }, 2000)
  }

  return (
    <>
      <LoadingOverlay visible={showOverlay} />
      <section style={{
        position: 'relative',
        backgroundImage: 'url(/images/hero-banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: 68,
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,25,60,0.78) 0%, rgba(10,25,60,0.55) 60%, rgba(10,25,60,0.2) 100%)' }} />

        {/* Mobile-only dark overlay (stronger) */}
        <div className="hero-bank-icon-mobile" style={{ display: 'none', position: 'absolute', inset: 0, background: 'rgba(10,22,50,0.55)' }} />

        {/* Mobile: bank icon + centered layout */}
        <div className="hero-bank-icon-mobile" style={{
          display: 'none', position: 'relative', zIndex: 1,
          flexDirection: 'column', alignItems: 'center', padding: '40px 24px 0', textAlign: 'center',
        }}>
          {/* Bank icon */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#1A56DB" />
              <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
            EliteFin Markets
          </h1>
          <p style={{ fontSize: 17, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
            Your Digital Banking Partner
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 28, maxWidth: 320 }}>
            We believe people come first. Everyone deserves a great banking experience every step of the way.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
            <button
              onClick={handleOpenAccount}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                padding: '15px 28px', borderRadius: 8, width: '100%',
                background: '#0b97a8', border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 15, fontWeight: 700,
                boxShadow: '0 4px 20px rgba(11,151,168,0.5)',
                animation: clicking ? 'spin-icon 0.7s linear infinite' : 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Open Account Today
            </button>
            <Link to="/signin" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              padding: '15px 28px', borderRadius: 8, width: '100%',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              backdropFilter: 'blur(4px)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Login to Banking
            </Link>
          </div>
          {/* Mobile stats */}
          <div className="hero-stats" style={{ display: 'none', gap: 24, marginTop: 36, marginBottom: 24, justifyContent: 'center' }}>
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '$2.5B+', label: 'Assets Managed' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop content */}
        <div className="hero-desktop-content" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div className="hero-content-wrap" style={{ maxWidth: 620, paddingBottom: 60 }}>
            <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 8 }}>
              EliteFin Markets
            </h1>
            <p style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
              Your Digital Banking Partner
            </p>
            <p className="hero-desc" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.87)', lineHeight: 1.65, marginBottom: 32, maxWidth: 500 }}>
              We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleOpenAccount}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '14px 28px', borderRadius: 8,
                  background: '#0b97a8', border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(11,151,168,0.5)',
                  animation: clicking ? 'spin-icon 0.7s linear infinite' : 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Open Account Today
              </button>
              <Link to="/signin" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '14px 28px', borderRadius: 8,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
                backdropFilter: 'blur(4px)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Login to Banking
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards — hidden on mobile */}
        <div className="hero-info-cards" style={{ position: 'relative', zIndex: 1, background: 'transparent', paddingBottom: 0 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 0', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <InfoCard
              bg="#1565c0"
              label="ROUTING #"
              value="251480576"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              }
            />
            <InfoCard
              bg="#00897b"
              label="BRANCH HOURS"
              value="Mon-Fri: 9AM-5PM"
              sub="Sat: 9AM-1PM"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              }
            />
            <InfoCard
              bg="#7b1fa2"
              label="24/7 SUPPORT"
              value="1-800-BANKING"
              sub="Always here to help"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.38 5.38l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}
