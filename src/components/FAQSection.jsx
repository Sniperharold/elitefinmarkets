import { useState } from 'react'
import SectionLabel from './SectionLabel.jsx'

const faqs = [
  {
    q: 'How do I open an account?',
    a: 'Click "Open Free Account" and complete our 4-step registration — personal info, contact details, account type, and security setup. It takes under 4 minutes.',
  },
  {
    q: 'What is the minimum deposit?',
    a: 'The minimum deposit is $10. You can fund your account via bank transfer, USDT, Bitcoin, or PayPal — all with no hidden fees.',
  },
  {
    q: 'How quickly are deposits confirmed?',
    a: 'Bank transfers are confirmed within 1–3 hours. Crypto deposits (USDT, Bitcoin) are typically confirmed within 10–30 minutes. PayPal transfers are instant.',
  },
  {
    q: 'Is my money safe with Elitefinmarkets?',
    a: 'Your funds are held in segregated accounts and never used for operational expenses. We use 256-bit SSL encryption, 2FA, and real-time fraud monitoring to protect your account.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>Got Questions?</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">FAQs</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg,#0F1629,#111827)',
                  border: isOpen ? '1px solid rgba(59,130,246,0.3)' : '1px solid #1E2A47',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-5 py-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-brand-blueLight flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-brand-text text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
