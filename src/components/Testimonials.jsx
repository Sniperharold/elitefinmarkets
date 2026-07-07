const testimonials = [
  {
    stars: 5,
    quote: '"I am impressed with the customer service and speed of payout."',
    name: 'Sarah Morris',
    role: 'Verified Customer',
  },
  {
    stars: 5,
    quote: '"Excellent service and competitive rates. Highly recommended!"',
    name: 'John Davis',
    role: 'Business Owner',
  },
  {
    stars: 5,
    quote: '"The mobile app is fantastic and customer support is top-notch."',
    name: 'Emily Johnson',
    role: 'Personal Banking',
  },
]

function PersonIcon() {
  return (
    <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e0e8f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a90b0" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section style={{ background: '#ffffff', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: '#1a2b4a', marginBottom: 52 }}>
          Hear From Our Customers
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{
              background: '#fff', borderRadius: 16, padding: '32px 28px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
              border: '1px solid #eef2f8',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize: 14, color: '#4a6080', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 24, flex: 1 }}>
                {t.quote}
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <PersonIcon />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2b4a' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#8a9ab0' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
