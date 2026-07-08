import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

function fmt(n, currency = "USD") {
  return (n || 0).toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 2 });
}

const CODE_LABELS = {
  cot: { name: "COT", full: "Commission on Turnover" },
  imt: { name: "IMT", full: "International Money Transfer" },
  tac: { name: "TAC", full: "Transfer Authorization Code" },
};

const BLANK_FORM = {
  accountType: "bank",
  recipientName: "", bankName: "", recipientAccount: "", routingNumber: "", swiftCode: "", iban: "",
  network: "", walletAddress: "",
  amount: "", description: "",
};

export default function TransferPage() {
  const navigate = useNavigate();
  const { user, wallet, refreshWallet } = useAuth();
  const [step, setStep] = useState("form");
  const [progress, setProgress] = useState(0);
  const [codeStep, setCodeStep] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [form, setForm] = useState(BLANK_FORM);
  const [error, setError] = useState("");
  const [newBalance, setNewBalance] = useState(null);
  const intervalRef = useRef(null);

  // Codes are only enforced from the user's 2nd transfer onward — their first
  // ever transfer always goes through, even if COT/IMT/TAC codes are set.
  const hasCodes = (user?.cotCode || user?.imtCode || user?.tacCode) && (wallet?.transferCount || 0) > 0;
  const currency = user?.currency || "USD";
  const balance = form.accountType === "bank" ? (wallet?.balance || 0) : (wallet?.cryptoBalance || 0);

  const animateTo = (target, onDone) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= target) {
          clearInterval(intervalRef.current);
          onDone && onDone();
          return target;
        }
        return p + 1;
      });
    }, 20);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startTransfer = () => {
    const amount = parseFloat(form.amount);
    const isCrypto = form.accountType === "crypto";
    if (!form.recipientName || !amount || amount <= 0) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isCrypto && !form.walletAddress) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isCrypto && !form.recipientAccount) {
      setError("Please fill in all required fields.");
      return;
    }
    if (amount > balance) {
      setError("Insufficient balance.");
      return;
    }
    setError("");
    setStep("loading");
    setProgress(0);

    if (hasCodes) {
      animateTo(30, () => setCodeStep("cot"));
    } else {
      animateTo(95, () => {
        doTransfer();
      });
    }
  };

  const doTransfer = async () => {
    try {
      const res = await api.createTransfer({
        amount: parseFloat(form.amount),
        accountType: form.accountType,
        recipientName: form.recipientName,
        description: form.description || `Transfer to ${form.recipientName}`,
        ...(form.accountType === "crypto"
          ? { network: form.network, walletAddress: form.walletAddress }
          : { bankName: form.bankName, recipientAccount: form.recipientAccount, routingNumber: form.routingNumber, swiftCode: form.swiftCode, iban: form.iban }),
      });
      setNewBalance(res.wallet?.balance ?? res.balance);
      animateTo(100, () => {
        setStep("success");
        refreshWallet();
      });
    } catch (err) {
      setStep("error");
      setError(err.message);
    }
  };

  const submitCode = () => {
    setCodeError("");
    const expected = codeStep === "cot" ? user?.cotCode : codeStep === "imt" ? user?.imtCode : user?.tacCode;
    if (codeInput.trim() !== expected) {
      setCodeError("Invalid code. Please try again.");
      return;
    }
    setCodeInput("");
    if (codeStep === "cot") {
      animateTo(60, () => {
        if (user?.imtCode) setCodeStep("imt");
        else if (user?.tacCode) setCodeStep("tac");
        else { setCodeStep(null); animateTo(95, doTransfer); }
      });
    } else if (codeStep === "imt") {
      animateTo(90, () => {
        if (user?.tacCode) setCodeStep("tac");
        else { setCodeStep(null); animateTo(95, doTransfer); }
      });
    } else if (codeStep === "tac") {
      setCodeStep(null);
      animateTo(95, doTransfer);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontSize: "14px",
    fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060B18", color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "430px", margin: "0 auto", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ padding: "32px 20px 0", display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <button onClick={() => navigate(-1)} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.1em" }}>BANKING</div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>Transfer Funds</h1>
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>

          {/* ── FORM STEP ── */}
          {step === "form" && (
            <>
              {/* Account type selector */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                {[{ v: "bank", label: "Bank Balance", val: fmt(wallet?.balance || 0, currency) },
                  { v: "crypto", label: "Crypto Balance", val: fmt(wallet?.cryptoBalance || 0) }].map(({ v, label, val }) => (
                  <button key={v} onClick={() => setForm(p => ({ ...p, accountType: v }))}
                    style={{ padding: "14px", borderRadius: "12px", border: form.accountType === v ? "1px solid rgba(26,86,219,0.5)" : "1px solid rgba(255,255,255,0.07)", background: form.accountType === v ? "rgba(26,86,219,0.15)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}>
                    <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: form.accountType === v ? "#60A5FA" : "white" }}>{val}</div>
                  </button>
                ))}
              </div>

              {(form.accountType === "crypto"
                ? [
                    { key: "recipientName", label: "Wallet Label / Owner Name", placeholder: "e.g. My Binance Wallet", required: true },
                    { key: "network", label: "Network", placeholder: "e.g. TRC20, ERC20, BTC", required: true },
                    { key: "walletAddress", label: "Wallet Address", placeholder: "Destination wallet address", required: true },
                    { key: "amount", label: "Amount", placeholder: "0.00", type: "number", required: true },
                    { key: "description", label: "Description (optional)", placeholder: "What's this for?" },
                  ]
                : [
                    { key: "recipientName", label: "Account Name", placeholder: "Recipient's full name", required: true },
                    { key: "bankName", label: "Bank Name", placeholder: "Recipient's bank", required: true },
                    { key: "recipientAccount", label: "Account Number", placeholder: "Account number", required: true },
                    { key: "routingNumber", label: "Routing Number (ACH)", placeholder: "Routing number" },
                    { key: "swiftCode", label: "SWIFT / BIC", placeholder: "SWIFT / BIC code" },
                    { key: "iban", label: "IBAN (optional)", placeholder: "IBAN" },
                    { key: "amount", label: "Amount", placeholder: "0.00", type: "number", required: true },
                    { key: "description", label: "Description (optional)", placeholder: "What's this for?" },
                  ]
              ).map(({ key, label, placeholder, type, required }) => (
                <div key={key} style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: "6px" }}>{label}</label>
                  <input type={type || "text"} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required={required} style={inputStyle} />
                </div>
              ))}

              {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "10px 14px", color: "#F87171", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

              <button onClick={startTransfer} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 16px rgba(26,86,219,0.3)" }}>
                Transfer Funds
              </button>
            </>
          )}

          {/* ── LOADING / CODE STEP ── */}
          {step === "loading" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "8px" }}>
                {codeStep ? `Verification Required` : "Processing Transfer…"}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(148,163,184,0.5)", marginBottom: "28px" }}>
                {codeStep ? `Enter your ${CODE_LABELS[codeStep]?.full}` : "Please wait while we process your transaction"}
              </div>

              {/* Progress bar */}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "99px", height: "8px", marginBottom: "10px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#1A56DB,#60A5FA)", borderRadius: "99px", transition: "width 0.1s linear" }} />
              </div>
              <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.4)", marginBottom: "32px" }}>{progress}%</div>

              {/* Code input */}
              {codeStep && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px 20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#60A5FA", marginBottom: "6px" }}>
                    {CODE_LABELS[codeStep]?.name} Code
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(148,163,184,0.5)", marginBottom: "16px" }}>
                    {CODE_LABELS[codeStep]?.full}
                  </div>
                  <input
                    type="text"
                    placeholder={`Enter ${CODE_LABELS[codeStep]?.name} code`}
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitCode()}
                    style={{ ...inputStyle, marginBottom: "12px", textAlign: "center", fontSize: "18px", letterSpacing: "0.15em", fontWeight: 700 }}
                    autoFocus
                  />
                  {codeError && <div style={{ color: "#F87171", fontSize: "12px", marginBottom: "12px" }}>{codeError}</div>}
                  <button onClick={submitCode} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    Verify & Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "8px" }}>Transfer Successful</h2>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#34D399", marginBottom: "6px" }}>
                -{fmt(parseFloat(form.amount), currency)}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(148,163,184,0.5)", marginBottom: "6px" }}>
                Sent to {form.recipientName}
              </div>
              {newBalance !== null && (
                <div style={{ fontSize: "12px", color: "rgba(148,163,184,0.4)", marginBottom: "28px" }}>
                  New balance: {fmt(newBalance, currency)}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => navigate("/wallet")} style={{ padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  View Transactions
                </button>
                <button onClick={() => { setStep("form"); setProgress(0); setForm(BLANK_FORM); }} style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94A3B8", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  New Transfer
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR STEP ── */}
          {step === "error" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "white", marginBottom: "8px" }}>Transfer Failed</h2>
              <p style={{ fontSize: "14px", color: "rgba(148,163,184,0.6)", marginBottom: "28px" }}>{error}</p>
              <button onClick={() => { setStep("form"); setProgress(0); setCodeStep(null); setError(""); }} style={{ padding: "13px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
