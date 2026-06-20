import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useAuth } from "../lib/AuthContext.jsx";

const BG = `radial-gradient(ellipse 70% 55% at 40% 10%, rgba(26,86,219,0.3) 0%, transparent 65%), linear-gradient(180deg,#060B18 0%,#050910 100%)`;
const inputBase = {
  width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px", padding: "16px 18px", color: "#E2E8F0", fontFamily: "Inter, sans-serif",
  fontSize: "15px", outline: "none", transition: "all 0.2s", WebkitAppearance: "none", boxSizing: "border-box",
};

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.user?.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-inter flex items-center justify-center" style={{ background: BG, color: "#E2E8F0" }}>
      <div className="w-full max-w-md mx-auto px-5 sm:px-8 py-12">
        <Icon.Logo />

        <div className="mb-8">
          <h1 className="font-black text-white leading-tight tracking-tight mb-2" style={{ fontSize: "clamp(1.8rem,7vw,2.5rem)" }}>
            Welcome Back
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>Sign in to access your Elitefinmarkets account.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#F87171", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
                Email Address
              </label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} style={inputBase}
                onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} placeholder="Your password" value={form.password} onChange={set("password")}
                  style={{ ...inputBase, paddingRight: "48px" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)" }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: loading ? "rgba(26,86,219,0.6)" : "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 24px rgba(26,86,219,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              {loading ? (
                <><svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" /><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in…</>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(148,163,184,0.5)", fontSize: "13px", whiteSpace: "nowrap" }}>don't have an account?</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        <Link to="/register" className="w-full flex items-center justify-center font-semibold"
          style={{ padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,18,40,0.7)", color: "#E2E8F0", textDecoration: "none", fontSize: "15px" }}>
          Open a New Account
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "28px", padding: "14px 16px", borderRadius: "12px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.18)" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C9A227" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "12px", lineHeight: 1.5 }}>
            Your data is encrypted with 256-bit SSL. We never share your information.
          </p>
        </div>
      </div>
    </div>
  );
}
