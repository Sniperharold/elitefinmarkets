import SectionLabel from './SectionLabel.jsx'
import { Link } from 'react-router-dom'

const methods = [
  {
    icon: '🏦',
    name: 'Bank Transfer',
    color: '#1A56DB',
    desc: 'Wire or ACH transfer directly from your bank. Supports SWIFT, SEPA, and domestic transfers.',
    time: 'Confirmed in 1–3 hrs',
    badge: 'Most Popular',
  },
  {
    icon: '◈',
    name: 'USDT',
    color: '#26A17B',
    desc: 'Deposit using Tether (USDT) via TRC20 or ERC20 network — fast, borderless, low fees.',
    time: 'Confirmed in ~10 min',
    badge: 'Fastest',
  },
  {
    icon: '₿',
    name: 'Bitcoin',
    color: '#F7931A',
    desc: 'Fund your account with Bitcoin on the main BTC network. Secure and globally accepted.',
    time: 'Confirmed in ~30 min',
    badge: null,
  },
  {
    icon: 'Ⓟ',
    name: 'PayPal',
    color: '#009CDE',
    desc: 'Send from your PayPal balance or linked card. Instant transfer with email confirmation.',
    time: 'Instant',
    badge: null,
  },
]

const cardStyle = {
  background: 'linear-gradient(135deg,#0F1629,#111827)',
  border: '1px solid #1E2A47',
}

export default function StrategiesSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionLabel>Fund Your Account</SectionLabel>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Deposit Methods</h2>
          </div>
          <Link to="/register" className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1">
            Open Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl p-5 sm:p-6 transition-all duration-300"
              style={cardStyle}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(26,86,219,0.4)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,86,219,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1E2A47'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}40` }}>
                    {m.icon}
                  </div>
                  <span className="font-bold text-white">{m.name}</span>
                </div>
                {m.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs text-yellow-300 font-semibold"
                    style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(252,211,77,0.08))', border: '1px solid rgba(245,158,11,0.3)' }}>
                    ⭐ {m.badge}
                  </span>
                )}
              </div>
              <p className="text-brand-text text-sm leading-relaxed mb-3">{m.desc}</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
                <span className="text-xs font-medium" style={{ color: '#34D399' }}>{m.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
