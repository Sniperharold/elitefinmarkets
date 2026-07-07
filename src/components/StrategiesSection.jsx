import { Link } from "react-router-dom";

const rates = [
  {
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    iconColor: "#2563EB", iconBg: "#EFF6FF",
    rate: "3.75%", rateColor: "#1D4ED8", label: "APY*",
    name: "HIGH YIELD SAVINGS", desc: "High Yield Savings Rate",
    badge: "★ FEATURED", badgeBg: "#EFF6FF", badgeColor: "#1D4ED8",
  },
  {
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    iconColor: "#0D9488", iconBg: "#F0FDFA",
    rate: "3.65%", rateColor: "#0D9488", label: "APY*",
    name: "18 MONTH CERTIFICATE", desc: "EliteFin Markets Certificate Rates",
    badge: "💰 SAVINGS", badgeBg: "#F0FDFA", badgeColor: "#0D9488",
  },
  {
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    iconColor: "#E11D48", iconBg: "#FFF1F2",
    rate: "4.00%", rateColor: "#E11D48", label: "APR*",
    name: "CREDIT CARDS", desc: "EliteFin Markets Credit Card Rates",
    badge: "💳 CREDIT", badgeBg: "#FFF1F2", badgeColor: "#E11D48",
  },
  {
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    iconColor: "#D97706", iconBg: "#FFFBEB",
    rate: "15.49%", rateColor: "#D97706", label: "APR*",
    name: "LOANS", desc: "EliteFin Markets Standard Loan Rates",
    badge: "% MORTGAGE", badgeBg: "#FFFBEB", badgeColor: "#D97706",
  },
];

export default function StrategiesSection() {
  return (
    <section style={{ background: "white", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: "10px", fontFamily: "Inter, sans-serif" }}>
            EliteFin Markets Member Care
          </h2>
          <p style={{ fontSize: "15px", color: "#64748B", fontFamily: "Inter, sans-serif" }}>
            Discover competitive rates designed to help your money grow faster
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "24px" }}>
          {rates.map((r) => (
            <div key={r.name} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "28px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: r.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: r.iconColor }}>
                {r.icon}
              </div>
              <div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: r.rateColor, lineHeight: 1, fontFamily: "Inter, sans-serif" }}>{r.rate}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif", marginTop: "2px" }}>{r.label}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#0F172A", letterSpacing: "0.06em", marginBottom: "4px", fontFamily: "Inter, sans-serif" }}>{r.name}</div>
                <div style={{ fontSize: "13px", color: "#64748B", fontFamily: "Inter, sans-serif" }}>{r.desc}</div>
              </div>
              <div style={{ marginTop: "auto" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: r.badgeBg, color: r.badgeColor, fontFamily: "Inter, sans-serif" }}>
                  {r.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#94A3B8", marginTop: "32px", fontFamily: "Inter, sans-serif" }}>
          *Annual Percentage Yield. Rates subject to change. Terms and conditions apply.
        </p>
      </div>
    </section>
  );
}
