import SectionLabel from './SectionLabel.jsx'

const testimonials = [
  {
    initial: 'M',
    name: 'Merrylyn T.',
    badge: 'Verified Customer',
    gradient: 'linear-gradient(135deg,#1A56DB,#1247C0)',
    text: '"Opening an account took 4 minutes. Deposited via bank transfer and funds were available within the hour. Elitefinmarkets is the most seamless banking experience I have had."',
  },
  {
    initial: 'S',
    name: 'Sebastian K.',
    badge: 'Premium Account',
    gradient: 'linear-gradient(135deg,#059669,#0D9488)',
    text: '"I transferred funds internationally three times this month — zero issues, zero hidden fees. The transparency is exactly what I needed from a bank."',
  },
  {
    initial: 'V',
    name: 'Valentina R.',
    badge: 'Savings Account',
    gradient: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
    text: '"The crypto deposit option is a game-changer. I funded my account with USDT in under 10 minutes. Support responded within 5 minutes when I had a question."',
  },
]

const badgeStyle = {
  background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))',
  border: '1px solid rgba(16,185,129,0.3)',
}

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>Customer Stories</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Trusted by Thousands.</h2>
          <p className="text-brand-text text-sm">Real feedback from our account holders worldwide.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: 'linear-gradient(135deg,#0F1629,#151C34)',
                border: '1px solid #1E2A47',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1E2A47'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: t.gradient }}
                  >
                    {t.initial}
                  </div>
                  <span className="font-semibold text-white text-sm">{t.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs text-green-400 font-medium" style={badgeStyle}>
                  {t.badge}
                </span>
              </div>
              <p className="text-brand-text text-xs sm:text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex text-yellow-400 text-sm gap-0.5">★★★★★</div>
            </div>
          ))}
        </div>

        {/* Award note */}
        <div className="mt-8 text-center">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-yellow-300 font-semibold"
            style={{
              background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(252,211,77,0.05))',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            🏦 Elitefinmarkets — Trusted by 250,000+ account holders in 180+ countries
          </span>
        </div>
      </div>
    </section>
  )
}
