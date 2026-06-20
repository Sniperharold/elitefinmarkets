import SectionLabel from './SectionLabel.jsx'

const steps = [
  {
    n: '1',
    title: 'Open Your Account in Minutes',
    desc: 'Complete our 4-step registration — personal details, contact info, account type, and security setup. No branch visit required.',
  },
  {
    n: '2',
    title: 'Fund via Your Preferred Method',
    desc: 'Deposit using bank transfer, USDT, Bitcoin, or PayPal. Your funds are confirmed and available in your account within minutes.',
  },
  {
    n: '3',
    title: 'Bank from Anywhere, Anytime',
    desc: 'Check balances, send money globally, view transaction history, and manage your account from any device — 24/7.',
  },
]

const cardStyle = {
  background: 'linear-gradient(135deg,rgba(15,22,41,0.9),rgba(21,28,52,0.8))',
  border: '1px solid rgba(30,42,71,0.8)',
  boxShadow: '0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
}

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Up &amp; Running
          </h2>
          <h2 className="text-3xl sm:text-4xl font-black gradient-text">in 3 Steps.</h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="rounded-2xl p-6 flex items-start gap-5" style={cardStyle}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg"
                  style={{
                    background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                    boxShadow: '0 0 20px rgba(37,99,235,0.4)',
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">{s.title}</h3>
                  <p className="text-brand-text text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {/* Connector line between steps */}
              {i < steps.length - 1 && (
                <div
                  className="absolute w-px h-4"
                  style={{
                    left: '2.9rem',
                    bottom: '-1rem',
                    background: 'linear-gradient(to bottom,#2563EB,transparent)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
