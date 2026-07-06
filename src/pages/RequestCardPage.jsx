import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export default function RequestCardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    deliveryAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: user?.country || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.requestCard(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(10,18,40,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#E2E8F0",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box",
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#060B18", color: "#E2E8F0", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "10px" }}>Card Request Submitted!</h2>
          <p style={{ fontSize: "14px", color: "rgba(148,163,184,0.65)", lineHeight: 1.7, marginBottom: "28px" }}>
            Your card request has been received. A courier will contact you to arrange delivery to your address.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={() => navigate("/track-card")} style={{ padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              Track My Card
            </button>
            <button onClick={() => navigate("/dashboard")} style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94A3B8", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060B18", color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ padding: "32px 20px 0", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => navigate(-1)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.1em" }}>CARD DELIVERY</div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>Request a Card</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "0 20px" }}>
          {[
            { key: "fullName", label: "Full Name", placeholder: "As it should appear on card" },
            { key: "deliveryAddress", label: "Delivery Address", placeholder: "Street address" },
            { key: "city", label: "City", placeholder: "City" },
            { key: "state", label: "State / Province (optional)", placeholder: "State or province" },
            { key: "zipCode", label: "ZIP / Postal Code", placeholder: "ZIP code" },
            { key: "country", label: "Country", placeholder: "Country" },
            { key: "phone", label: "Phone Number", placeholder: "+1 000 000 0000" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>
                {label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                value={form[key]}
                onChange={set(key)}
                required={key !== "state"}
                style={inputStyle}
              />
            </div>
          ))}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "10px 14px", color: "#F87171", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: loading ? "rgba(26,86,219,0.5)" : "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", marginTop: "8px" }}
          >
            {loading ? "Submitting…" : "Submit Card Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
