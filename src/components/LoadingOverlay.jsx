export default function LoadingOverlay({ visible }) {
  if (!visible) return null

  const rings = [
    { delay: '0s',    size: '100%' },
    { delay: '0.3s',  size: '80%'  },
    { delay: '0.6s',  size: '60%'  },
    { delay: '0.9s',  size: '40%'  },
    { delay: '1.2s',  size: '20%'  },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {rings.map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: r.size, height: r.size,
            borderRadius: '50%',
            border: '2px solid rgba(11, 151, 168, 0.5)',
            animation: `ring-expand 2s ease-out ${r.delay} infinite`,
          }} />
        ))}

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#1A56DB" />
              <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0b97a8', letterSpacing: '0.04em' }}>
            EliteFin Markets
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span>Secure Banking Platform</span>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0b97a8', display: 'inline-block' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
