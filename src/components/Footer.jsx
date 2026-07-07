import { Link } from 'react-router-dom'

function SocialIcon({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', textDecoration: 'none', transition: 'background 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
    >
      {children}
    </a>
  )
}

const cols = [
  {
    heading: 'Quick Links',
    links: ['About Us', 'Services', 'Grants & Aid', 'Contact'],
  },
  {
    heading: 'Services',
    links: ['Personal Banking', 'Business Banking', 'Loans & Credit', 'Cards'],
  },
  {
    heading: 'Member Services',
    links: ['Online Banking', 'Mobile App', 'ATM Locations', 'Security Center'],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0a1628', fontFamily: 'Inter, sans-serif' }}>
      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#1A56DB" />
                <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
              </svg>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>ELITEFIN</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#0b97a8', letterSpacing: '0.08em', lineHeight: 1.3 }}>MARKETS</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#7a90b0', lineHeight: 1.7, marginBottom: 22, maxWidth: 220 }}>
              Building financial strength together with personalized banking solutions for every member. Your trusted partner in financial growth.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <SocialIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18, paddingLeft: 12, borderLeft: '3px solid #0b97a8' }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map(link => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 13, color: '#7a90b0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#7a90b0'}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0b97a8" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{ background: '#060e1c', padding: '18px 20px' }}>
        <div className="footer-bottom-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#5a7090', margin: 0 }}>
            © 2026 EliteFin Markets. All rights reserved.
          </p>
          <div className="footer-bottom-links" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#5a7090' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0b97a8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              FDIC Insured
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#5a7090' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0b97a8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              256-bit SSL
            </span>
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((link, i) => (
              <a key={i} href="#" style={{ fontSize: 12, color: '#5a7090', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0b97a8'}
                onMouseLeave={e => e.currentTarget.style.color = '#5a7090'}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
