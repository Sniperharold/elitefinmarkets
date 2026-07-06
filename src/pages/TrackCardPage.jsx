import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

const STEPS = [
  { key: "received", label: "Card Request Received", desc: "Your card application has been received." },
  { key: "verification", label: "Identity Verification", desc: "Your identity has been verified successfully." },
  { key: "production", label: "Card Production", desc: "Your card is being produced at our secure facility." },
  { key: "quality", label: "Quality Control", desc: "Your card is undergoing quality and security checks." },
  { key: "dispatch", label: "Ready for Dispatch", desc: "Awaiting dispatch to courier partner." },
  { key: "assigned", label: "Assigned to Courier", desc: "Card has been handed off to delivery courier." },
  { key: "transit", label: "In Transit", desc: "Your card is on its way to your address." },
  { key: "delivery", label: "Out for Delivery", desc: "Card out for delivery in your area." },
];

function getStepStatus(stepIndex, cardRequest) {
  if (!cardRequest) return "pending";
  const hoursElapsed = (Date.now() - new Date(cardRequest.createdAt)) / 3600000;
  if (stepIndex === 0) return "done";
  if (stepIndex === 1) return "done";
  if (stepIndex === 2) return hoursElapsed >= 4 ? "done" : "in_progress";
  if (stepIndex === 3) return "in_progress";
  return "pending";
}

export default function TrackCardPage() {
  const navigate = useNavigate();
  const [cardRequest, setCardRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyCard()
      .then(setCardRequest)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#060B18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(148,163,184,0.4)", fontSize: "14px" }}>Loading…</div>
      </div>
    );
  }

  if (!cardRequest) {
    return (
      <div style={{ minHeight: "100vh", background: "#060B18", color: "#E2E8F0", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "8px" }}>No Card Request Found</div>
          <div style={{ fontSize: "13px", color: "rgba(148,163,184,0.5)", marginBottom: "24px" }}>You haven't requested a card yet.</div>
          <button onClick={() => navigate("/request-card")} style={{ padding: "12px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Request a Card
          </button>
        </div>
      </div>
    );
  }

  const requestDate = new Date(cardRequest.createdAt);

  return (
    <div style={{ minHeight: "100vh", background: "#060B18", color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", padding: "0 0 40px" }}>

        <div style={{ padding: "32px 20px 0", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => navigate(-1)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.1em" }}>CARD DELIVERY</div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>Track Your Card</h1>
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "16px", padding: "18px 20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Delivering to</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{cardRequest.fullName}</div>
                <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)", marginTop: "2px" }}>
                  {cardRequest.deliveryAddress}, {cardRequest.city}{cardRequest.state ? `, ${cardRequest.state}` : ""} {cardRequest.zipCode}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>{cardRequest.country}</div>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399", whiteSpace: "nowrap" }}>
                {cardRequest.status === "processing" ? "In Progress" : cardRequest.status}
              </div>
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "12px" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", marginBottom: "2px" }}>Request Date</div>
                <div style={{ fontSize: "12px", color: "#E2E8F0", fontWeight: 600 }}>
                  {requestDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", marginBottom: "2px" }}>Est. Delivery</div>
                <div style={{ fontSize: "12px", color: "#FCD34D", fontWeight: 600 }}>5–10 Business Days</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            Delivery Progress
          </div>

          <div style={{ position: "relative" }}>
            {STEPS.map((step, idx) => {
              const status = getStepStatus(idx, cardRequest);
              const isDone = status === "done";
              const isActive = status === "in_progress";
              const dotBorder = isDone ? "rgba(52,211,153,0.4)" : isActive ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.1)";
              const lineColor = isDone ? "#34D399" : "rgba(255,255,255,0.07)";
              return (
                <div key={step.key} style={{ display: "flex", gap: "16px", marginBottom: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isDone ? "rgba(52,211,153,0.12)" : isActive ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${dotBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isDone ? (
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : isActive ? (
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#60A5FA" }} />
                      ) : (
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                      )}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div style={{ width: "1.5px", flex: 1, minHeight: "28px", background: lineColor, margin: "3px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: idx < STEPS.length - 1 ? "20px" : 0, paddingTop: "4px" }}>
                    <div style={{ fontSize: "14px", fontWeight: isDone || isActive ? 700 : 500, color: isDone ? "white" : isActive ? "#60A5FA" : "rgba(148,163,184,0.35)", marginBottom: "2px" }}>
                      {step.label}
                      {isActive && <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 700, color: "#60A5FA", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", padding: "1px 6px", borderRadius: "8px" }}>In Progress</span>}
                    </div>
                    {(isDone || isActive) && (
                      <div style={{ fontSize: "12px", color: isDone ? "rgba(148,163,184,0.5)" : "rgba(96,165,250,0.6)" }}>{step.desc}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "12px", padding: "14px 16px", marginTop: "28px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FCD34D" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)", lineHeight: 1.6, margin: 0 }}>
              Our courier partner will contact you via phone before delivery. Please ensure your phone number on file is reachable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
