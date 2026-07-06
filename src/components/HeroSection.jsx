import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/hero-banner.jpg')", backgroundSize: "cover", backgroundPosition: "center top", zIndex: 0 }} />
      {/* Dark overlay — stronger on left, fades right */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 100%)", zIndex: 1 }} />

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", padding: "120px 6% 60px" }}>
        <div style={{ maxWidth: "560px" }}>
          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "white", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "14px", fontFamily: "Inter, sans-serif" }}>
            EliteFin Markets
          </h1>
          <h2 style={{ fontSize: "clamp(1.05rem, 2.4vw, 1.45rem)", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: "18px", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
            Your Digital Banking Partner
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.62)", lineHeight: 1.78, marginBottom: "36px", fontFamily: "Inter, sans-serif", maxWidth: "460px" }}>
            We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "10px", background: "#0D9488", color: "white", fontSize: "15px", fontWeight: 700, textDecoration: "none", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Open Account Today
            </Link>
            <Link
              to="/signin"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "15px", fontWeight: 600, textDecoration: "none", fontFamily: "Inter, sans-serif", border: "1px solid rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}
            >
              Login to Banking
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Info cards — full width at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ position: "relative", zIndex: 2 }}>

        {/* Routing # */}
        <div style={{ background: "#1A56DB", padding: "26px 28px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "9px", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.6">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginBottom: "5px", fontFamily: "Inter, sans-serif" }}>ROUTING #</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "white", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>251480576</div>
          </div>
        </div>

        {/* Branch Hours */}
        <div style={{ background: "#0D9488", padding: "26px 28px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "9px", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.6">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginBottom: "5px", fontFamily: "Inter, sans-serif" }}>BRANCH HOURS</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "white", fontFamily: "Inter, sans-serif" }}>Mon-Fri: 9AM-5PM</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif", marginTop: "2px" }}>Sat: 9AM-1PM</div>
          </div>
        </div>

        {/* 24/7 Support */}
        <div style={{ background: "#7C3AED", padding: "26px 28px", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "9px", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.6">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginBottom: "5px", fontFamily: "Inter, sans-serif" }}>24/7 SUPPORT</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "white", fontFamily: "Inter, sans-serif" }}>1-800-BANKING</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif", marginTop: "2px" }}>Always here to help</div>
          </div>
        </div>

      </div>
    </section>
  );
}
