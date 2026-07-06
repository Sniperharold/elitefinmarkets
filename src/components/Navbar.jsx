import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "white", borderBottom: "1px solid #E5E7EB", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "linear-gradient(135deg,#1A56DB,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="white" strokeWidth="1.8"/>
              <path d="M3 10h18" stroke="white" strokeWidth="1.8"/>
              <rect x="6" y="14" width="4" height="2" rx="0.5" fill="white"/>
            </svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif" }}>ELITEFIN</div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#0EA5E9", letterSpacing: "0.14em", fontFamily: "Inter, sans-serif" }}>MARKETS</div>
          </div>
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
          {["Home", "About", "Contact"].map((item) => (
            <a key={item} href="#" style={{ fontSize: "14px", fontWeight: 500, color: "#374151", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>
              {item}
            </a>
          ))}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setServicesOpen((v) => !v)}
              style={{ fontSize: "14px", fontWeight: 500, color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontFamily: "Inter, sans-serif", padding: 0 }}
            >
              Services
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {servicesOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", minWidth: "200px", padding: "6px 0", zIndex: 100 }}>
                {["Savings Account", "Investments", "International Transfer", "Business Banking"].map((s) => (
                  <a key={s} href="#" style={{ display: "block", padding: "10px 16px", fontSize: "13px", color: "#374151", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>
                    {s}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid #E5E7EB", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <Link to="/signin" style={{ padding: "8px 18px", borderRadius: "8px", border: "1.5px solid #0EA5E9", color: "#0EA5E9", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
            Login
          </Link>
          <Link to="/register" style={{ padding: "8px 16px", borderRadius: "8px", background: "#0D9488", color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "11px" }}>★</span> Open Account
          </Link>
        </div>

      </div>
    </nav>
  );
}
