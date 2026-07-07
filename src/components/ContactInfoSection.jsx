const contacts = [
  {
    iconBg: '#1565c0',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Banking Hours',
    lines: ['Mon-Fri: 9AM-5PM', 'Sat: 9AM-1PM', 'Sun: Closed'],
  },
  {
    iconBg: '#0b97a8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.38 5.38l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Phone Banking',
    lines: ['Available 24/7', 'Call: 1-800-BANKING', 'International: +1-718-555-0100'],
  },
  {
    iconBg: '#1e5ba8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Email Support',
    lines: ['Response within 24hrs', 'support@elitefinmarkets.info'],
  },
  {
    iconBg: '#7b1fa2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Visit Us',
    lines: ['36 Paerdegat 10th St', 'Brooklyn, New York 11236'],
  },
]

export default function ContactInfoSection() {
  return (
    <section style={{ background: '#f5f8fd', padding: '64px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {contacts.map(c => (
            <div key={c.title} className="contact-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2b4a', marginBottom: 8 }}>{c.title}</div>
                {c.lines.map((line, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#5a7090', lineHeight: 1.7 }}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
