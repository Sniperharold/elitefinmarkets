import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from './LoadingOverlay.jsx'

export default function AccountCTASection() {
  const [showOverlay, setShowOverlay] = useState(false)
  const navigate = useNavigate()

  const handleOpenAccount = () => {
    setShowOverlay(true)
    setTimeout(() => navigate('/register'), 1500)
  }

  return (
    <>
      <LoadingOverlay visible={showOverlay} />
      <section style={{ background: '#ffffff', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            {/* Image */}
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', lineHeight: 0 }}>
              <img src="/images/section-image.jpg" alt="Banking" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 380 }} />
            </div>

            {/* Text */}
            <div>
              {/* Pill */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 999, marginBottom: 24,
                background: '#e6f9ef', color: '#1a7a4a', fontSize: 13, fontWeight: 700,
                border: '1px solid #b2e6ce',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7a4a" strokeWidth="2.5">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Get $200* With a Checking Account Built for You
              </span>

              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 18 }}>
                <span style={{ color: '#1a2b4a' }}>Start Building Your</span>
                <br />
                <span style={{ color: '#1a7a4a' }}>Financial Strength</span>
              </h2>

              <p style={{ fontSize: 15, color: '#5a7090', lineHeight: 1.7, marginBottom: 28 }}>
                For a limited time, get a $200 when you open any new account, and what helps you reach your financial goals.
                You can open a new account online or in person at any of our locations.
              </p>

              {/* Checklist */}
              {[
                'No minimum balance required',
                'Free online and mobile banking',
                '24/7 customer support',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#e6f9ef"/>
                    <path d="M7 12l3.5 3.5L17 8" stroke="#1a7a4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 14, color: '#2a3f5a', fontWeight: 500 }}>{item}</span>
                </div>
              ))}

              <button
                onClick={handleOpenAccount}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  marginTop: 20, padding: '14px 30px', borderRadius: 8,
                  background: '#0d3b5e', border: 'none', cursor: 'pointer',
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 4px 18px rgba(13,59,94,0.28)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#092d4a'}
                onMouseLeave={e => e.currentTarget.style.background = '#0d3b5e'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
                Open Account Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
