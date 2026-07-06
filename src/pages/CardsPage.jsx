import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

const CARD_OPTIONS = [
  {
    key: "blocked",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
    title: "Blocked Card",
    subtitle: "Tap here to unblock and delete",
    disabled: true,
  },
  {
    key: "manage",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: "Manage Card",
    subtitle: "Card pin and limits",
    disabled: true,
  },
  {
    key: "faqs",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Card FAQs",
    subtitle: "Learn more about EliteFin Markets card",
    disabled: true,
  },
  {
    key: "track",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Track Your Card",
    subtitle: "See live delivery progress",
    disabled: false,
    to: "/track-card",
  },
];

export default function CardsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cardRequest, setCardRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyCard()
      .then(setCardRequest)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasCard = !!cardRequest;

  return (
    <AppShell>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "2px" }}>My Account</div>
        <h1 className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>Cards</h1>
      </div>

      {/* Card visual */}
      <div style={{ marginBottom: "24px" }}>
        {loading ? (
          <div style={{ height: "140px", borderRadius: "18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "rgba(148,163,184,0.3)", fontSize: "13px" }}>Loading…</div>
          </div>
        ) : hasCard ? (
          <div style={{ background: "linear-gradient(135deg,#0B1E42,#132D5E)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: "18px", padding: "22px 24px", position: "relative", overflow: "hidden", aspectRatio: "1.586" }}>
            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(201,162,39,0.1)" }} />
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#C9A227", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "auto" }}>EliteFin Markets</div>
            <div style={{ position: "absolute", bottom: "22px", left: "24px", right: "24px" }}>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", letterSpacing: "0.1em" }}>DEBIT CARD</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{cardRequest.fullName}</div>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "#34D399", marginTop: "4px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: "20px", display: "inline-block", padding: "2px 10px" }}>
                {cardRequest.status === "processing" ? "In Progress" : cardRequest.status}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "linear-gradient(135deg,#0D1629,#111827)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "18px", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(26,86,219,0.1)", border: "1px solid rgba(26,86,219,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth="1.8">
                <rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" /><path d="M6 15h4" />
              </svg>
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "6px" }}>No Card Yet</div>
            <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)", marginBottom: "20px", lineHeight: 1.6 }}>
              Request a physical debit card delivered to your address.
            </div>
            <button
              onClick={() => navigate("/request-card")}
              style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              Request for Card
            </button>
          </div>
        )}
      </div>

      {/* Options list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {CARD_OPTIONS.map((opt) => {
          const isTrackDisabled = opt.key === "track" && !hasCard;
          const disabled = opt.disabled || isTrackDisabled;
          return (
            <button
              key={opt.key}
              disabled={disabled}
              onClick={() => !disabled && opt.to && navigate(opt.to)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                transition: "opacity 0.2s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{opt.title}</div>
                <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>{opt.subtitle}</div>
              </div>
              <svg width="16" height="16" fill="none" stroke="rgba(148,163,184,0.3)" viewBox="0 0 24 24" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          );
        })}
      </div>

      {!hasCard && !loading && (
        <button
          onClick={() => navigate("/request-card")}
          style={{ width: "100%", marginTop: "20px", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 16px rgba(26,86,219,0.3)" }}
        >
          Request for Card
        </button>
      )}
    </AppShell>
  );
}
