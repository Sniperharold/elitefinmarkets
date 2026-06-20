import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg,rgba(37,99,235,0.12),rgba(124,58,237,0.08) 50%,rgba(6,182,212,0.06))',
            border: '1px solid rgba(37,99,235,0.2)',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg,rgba(37,99,235,0.08),rgba(124,58,237,0.04),rgba(6,182,212,0.04))',
            }}
          />

          <div className="relative z-10">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(252,211,77,0.08))',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
            >
              <span>🏦</span>
              <span className="text-yellow-300 tracking-widest uppercase">Open Account — Free</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
              Start Banking Today.
            </h2>
            <p className="text-brand-text text-sm sm:text-base mb-1">
              Join 250,000+ account holders worldwide.
            </p>
            <p className="text-brand-text text-sm sm:text-base mb-8">
              Open your free account in{' '}
              <span className="text-yellow-300 font-bold">under 4 minutes.</span>
            </p>

            <Link
              to="/register"
              className="inline-block w-full sm:w-auto text-base font-bold text-white px-12 py-4 rounded-xl text-center transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                boxShadow: '0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg,#3B82F6,#2563EB)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg,#2563EB,#1D4ED8)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Registration
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
