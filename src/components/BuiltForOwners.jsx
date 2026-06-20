import SectionLabel from './SectionLabel.jsx'

const features = [
  {
    icon: '🏦',
    color: '#60A5FA',
    title: 'Multi-Currency Accounts',
    desc: 'Hold and manage funds in USD, GBP, EUR, CAD, AUD and more — all from a single dashboard.',
  },
  {
    icon: '💸',
    color: '#A78BFA',
    title: 'Zero-Fee Transfers',
    desc: 'Send money locally or internationally with no hidden charges. What you see is what you pay.',
  },
  {
    icon: '🛡️',
    color: '#F87171',
    title: 'Fraud Protection',
    desc: 'Real-time transaction monitoring and instant alerts keep unauthorized access out of your account.',
  },
  {
    icon: '⚡',
    color: '#34D399',
    title: 'Instant Fund Access',
    desc: 'Your deposited funds are available as soon as confirmed. No waiting periods, no lock-ins.',
  },
]

const cardStyle = {
  background: 'linear-gradient(135deg,rgba(15,22,41,0.9),rgba(21,28,52,0.8))',
  border: '1px solid rgba(30,42,71,0.8)',
  boxShadow: '0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
}

export default function BuiltForOwners() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel>Features</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
          Built for People,
        </h2>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-text mb-3">
          Not Institutions.
        </h2>
        <p className="text-brand-text mb-12 max-w-lg">Everything you need from a modern bank — none of what you don't.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 flex items-start gap-4" style={cardStyle}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(124,58,237,0.1))',
                  border: '1px solid rgba(37,99,235,0.2)',
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-brand-text text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}

          {/* Full-width card */}
          <div className="rounded-2xl p-6 flex items-start gap-4 sm:col-span-2" style={cardStyle}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{
                background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(124,58,237,0.1))',
                border: '1px solid rgba(37,99,235,0.2)',
              }}
            >
              🌐
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Global Reach</h3>
              <p className="text-brand-text text-sm leading-relaxed">
                Banking without borders — send and receive funds across 180+ countries via SWIFT, SEPA, ACH, USDT, Bitcoin, and PayPal in a single unified platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
