const features = [
  {
    iconBg: '#e3f0ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Competitive Rates',
    desc: 'Better rates on savings, loans, and credit cards designed to maximize your financial growth.',
  },
  {
    iconBg: '#e0f4ef',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00897b" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Member-Focused',
    desc: "We're owned by our members, not shareholders. Your success is our priority.",
  },
  {
    iconBg: '#f3e8ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7b1fa2" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Community Committed',
    desc: 'Supporting local communities and causes that matter to our members.',
  },
]

export default function AboutBankSection() {
  return (
    <section style={{ background: '#f0f5fb', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Text side */}
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
              <span style={{ color: '#1a2b4a' }}>Building Strength</span>
              <br />
              <span style={{ color: '#1a7a4a' }}>Together</span>
            </h2>
            <p style={{ fontSize: 15, color: '#5a7090', lineHeight: 1.75, marginBottom: 36 }}>
              EliteFin Markets is a full-service credit union built on the foundation of providing our members with every step
              of their financial journey. We're committed to helping our members achieve their financial goals through
              personalized service and competitive rates.
            </p>

            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2b4a', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#6a85a0', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <img src="/images/gizem-nikomedi-JcSashYYarE-unsplash.jpg" alt="Banking" style={{ width: '100%', borderRadius: 14, objectFit: 'cover', aspectRatio: '4/5', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <img src="/images/section-image.jpg" alt="Banking team" style={{ width: '100%', borderRadius: 14, objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <img src="/images/image-collage.png" alt="Community" style={{ width: '100%', borderRadius: 14, objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
