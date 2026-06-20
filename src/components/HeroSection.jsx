import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ALERTS = [
  { text: "NEW ACCOUNT: Emily just opened a Premium Savings account in minutes." },
  { text: "TRANSFER: Marcus completed an international wire to London — settled instantly." },
  { text: "MILESTONE: Sophia reached $100,000 in her savings account." },
  { text: "DEPOSIT: James funded his account via crypto — confirmed in under 10 minutes." },
  { text: "SECURITY: Your account is protected by 256-bit bank-grade encryption." },
  { text: "NEW ACCOUNT: Valentina opened a Checking account from her phone in 3 minutes." },
  { text: "TRANSFER: Benjamin sent $5,000 internationally — zero hidden fees." },
  { text: "MILESTONE: Rodrigo's portfolio reached $250,000 across his accounts." },
  { text: "DEPOSIT: Catherine's bank transfer confirmed — funds available immediately." },
  { text: "SECURITY: 2-factor authentication activated on 12,400+ accounts today." },
  { text: "NEW ACCOUNT: Alexander joined Elitefinmarkets — welcome!" },
  { text: "TRANSFER: Elena sent funds to 3 countries in a single afternoon." },
];

export default function HeroSection() {
  const [alertIdx, setAlertIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => { setAlertIdx((i) => (i + 1) % ALERTS.length); setVisible(true); }, 600);
    }, 4000);
    return () => clearTimeout(timer);
  }, [alertIdx]);

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(26,86,219,0.28), transparent),
          radial-gradient(rgba(59,130,246,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "auto, 30px 30px",
      }}>
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(26,86,219,0.05)", filter: "blur(80px)" }} />
      <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(201,162,39,0.04)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "linear-gradient(135deg,rgba(201,162,39,0.15),rgba(252,211,77,0.08))", border: "1px solid rgba(201,162,39,0.3)" }}>
            <span>🏦</span>
            <span className="text-yellow-300 tracking-widest uppercase text-xs">Trusted Digital Bank</span>
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white mb-2">
            Modern Banking
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight gradient-text mb-6">
            Built for Everyone.
          </h1>
          <p className="text-brand-text text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Elitefinmarkets gives you bank-grade security, instant global transfers, multi-currency accounts, and 24/7 support — all from your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg,#1A56DB,#1247C0)", boxShadow: "0 8px 32px rgba(26,86,219,0.45)" }}>
              Open Free Account
              <span style={{ fontSize: "18px" }}>→</span>
            </Link>
            <Link to="/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#E2E8F0", background: "rgba(255,255,255,0.04)" }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Live alerts ticker */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(26,86,219,0.08)", border: "1px solid rgba(26,86,219,0.2)" }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0 live-dot" style={{ background: "#34D399" }} />
            <p className="text-xs text-brand-text font-medium transition-opacity duration-300 truncate"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}>
              {ALERTS[alertIdx].text}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "250K+", label: "Active Accounts" },
            { value: "$4.2B", label: "Deposits Processed" },
            { value: "180+", label: "Countries Served" },
            { value: "99.98%", label: "Uptime SLA" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-brand-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
