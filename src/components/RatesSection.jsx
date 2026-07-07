const rates = [
  {
    iconBg: '#e3f0ff',
    iconColor: '#1565c0',
    rate: '3.75%',
    rateColor: '#1565c0',
    type: 'APY*',
    title: 'HIGH YIELD SAVINGS',
    desc: 'High Yield Savings Rate',
    badgeBg: '#e8eeff',
    badgeColor: '#3d5afe',
    badgeIcon: '★',
    badge: 'FEATURED',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    iconBg: '#e0f7f4',
    iconColor: '#00897b',
    rate: '3.65%',
    rateColor: '#00897b',
    type: 'APY*',
    title: '18 MONTH CERTIFICATE',
    desc: 'EliteFin Markets Certificate Rates',
    badgeBg: '#e0f4ef',
    badgeColor: '#00897b',
    badgeIcon: '💰',
    badge: 'SAVINGS',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00897b" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
  {
    iconBg: '#f3e8ff',
    iconColor: '#7b1fa2',
    rate: '4.00%',
    rateColor: '#c2185b',
    type: 'APR*',
    title: 'CREDIT CARDS',
    desc: 'EliteFin Markets Credit Card Rates',
    badgeBg: '#fce4ec',
    badgeColor: '#c2185b',
    badgeIcon: '💳',
    badge: 'CREDIT',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    iconBg: '#fff3e0',
    iconColor: '#e65100',
    rate: '15.49%',
    rateColor: '#e65100',
    type: 'APR*',
    title: 'LOANS',
    desc: 'EliteFin Markets Standard Loan Rates',
    badgeBg: '#fbe9e7',
    badgeColor: '#e65100',
    badgeIcon: '%',
    badge: 'MORTGAGE',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
]

export default function RatesSection() {
  return (
    <section style={{ background: '#f5f8fd', padding: '72px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 999,
            background: '#e8f4f8', color: '#0b97a8', fontSize: 13, fontWeight: 700,
            border: '1px solid #b2e0e8',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b97a8" strokeWidth="2.5">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            EliteFin Markets Rates
          </span>
        </div>

        {/* Heading */}
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#1a2b4a', marginBottom: 12 }}>
          EliteFin Markets Member Care
        </h2>
        <p style={{ textAlign: 'center', fontSize: 15, color: '#5a7090', marginBottom: 52 }}>
          Discover competitive rates designed to help your money grow faster
        </p>

        {/* Rate cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {rates.map(r => (
            <div key={r.title} style={{
              background: '#fff', borderRadius: 16, padding: '32px 24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: r.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {r.icon}
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: r.rateColor, lineHeight: 1, marginBottom: 2 }}>
                {r.rate}
              </div>
              <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 12 }}>{r.type}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1a2b4a', marginBottom: 6, letterSpacing: '0.02em' }}>{r.title}</div>
              <div style={{ fontSize: 12, color: '#7a90a8', marginBottom: 20, lineHeight: 1.5 }}>{r.desc}</div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 999,
                background: r.badgeBg, color: r.badgeColor,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              }}>
                {r.badgeIcon} {r.badge}
              </span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#8a9ab0', marginTop: 32 }}>
          *Annual Percentage Yield. Rates subject to change. Terms and conditions apply.
        </p>
      </div>
    </section>
  )
}
