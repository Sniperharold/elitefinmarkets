const services = [
  {
    iconBg: '#1e4f8c',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Deposit Accounts',
    desc: 'Secure your money with our high-yield savings and checking accounts designed for growth.',
  },
  {
    iconBg: '#0b7b8e',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Credit Cards',
    desc: 'Find the perfect credit card for your lifestyle and spending habits with competitive rates.',
  },
  {
    iconBg: '#2e4a7a',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    ),
    title: 'Loans',
    desc: 'Get competitive rates on personal, auto, and home loans tailored to your financial goals.',
  },
  {
    iconBg: '#1a6b7a',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    title: 'Business Banking',
    desc: 'Comprehensive banking solutions designed to help your business thrive and grow.',
  },
  {
    iconBg: '#5a3a8e',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
      </svg>
    ),
    title: 'Wealth & Retire',
    desc: 'Plan for your future with our expert investment and retirement planning services.',
  },
  {
    iconBg: '#0b6e80',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'About EliteFin Markets',
    desc: 'Learn more about our commitment to exceptional banking services and community support.',
  },
]

export default function BankingServicesSection() {
  return (
    <section style={{ background: 'linear-gradient(135deg, #1a4878 0%, #0e8a9e 100%)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            fontSize: 13, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
            </svg>
            Our Services
          </span>
        </div>

        <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: 14 }}>
          How Can We Help You Today?
        </h2>
        <p style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.78)', marginBottom: 56 }}>
          Comprehensive banking solutions tailored to your needs
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {services.map(s => (
            <div key={s.title} style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 16, padding: '32px 24px',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer', transition: 'background 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 14, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
