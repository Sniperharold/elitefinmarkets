import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

const METHOD_ICONS = {
  BANK_TRANSFER: "🏦", USDT: "◈", BITCOIN: "₿", PAYPAL: "Ⓟ", CREDIT_CARD: "💳",
};

const txColors = {
  deposit: { bg: "rgba(26,86,219,0.1)", border: "rgba(26,86,219,0.22)", text: "#60A5FA" },
  withdrawal: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.22)", text: "#FCD34D" },
  transfer: { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.22)", text: "#C084FC" },
  bonus: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", text: "#34D399" },
};

function fmt(n, currency = "USD") {
  return (n || 0).toLocaleString("en-US", { style: "currency", currency, maximumFractionDigits: 2 });
}

export default function WalletPage() {
  const { wallet, user, refreshWallet } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    Promise.all([api.getTransactions(), api.getMyDeposits()])
      .then(([txs, deps]) => {
        setTransactions(txs);
        setDeposits(deps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    refreshWallet();
  }, []);

  const balance = wallet?.balance || 0;
  const cryptoBalance = wallet?.cryptoBalance || 0;
  const totalDeposited = wallet?.totalDeposited || 0;
  const totalWithdrawn = wallet?.totalWithdrawn || 0;
  const currency = user?.currency || "USD";

  const pendingDeposits = deposits.filter((d) => d.status === "pending");
  const rejectedDeposits = deposits.filter((d) => d.status === "rejected");

  const displayTxs = tab === "all" ? transactions
    : tab === "deposits" ? transactions.filter((t) => t.type === "deposit")
    : tab === "withdrawals" ? transactions.filter((t) => t.type === "withdrawal")
    : transactions.filter((t) => t.type === tab);

  const TABS = ["all", "deposits", "withdrawals", "pending"];

  return (
    <AppShell>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "2px" }}>My Finances</div>
        <h1 className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>Accounts</h1>
      </div>

      {/* Balance cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {/* Fiat card */}
        <div style={{ background: "linear-gradient(135deg,#0B1E42,#132D5E)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: "18px", padding: "18px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(201,162,39,0.08)", filter: "blur(20px)", pointerEvents: "none" }} />
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,162,39,0.7)", marginBottom: "6px" }}>Bank Balance</div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "4px", lineHeight: 1 }}>{fmt(balance, currency)}</div>
          <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)" }}>{currency} · Savings</div>
        </div>
        {/* Crypto card */}
        <div style={{ background: "linear-gradient(135deg,#1A0D42,#2D1473)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "18px", padding: "18px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(139,92,246,0.1)", filter: "blur(20px)", pointerEvents: "none" }} />
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(139,92,246,0.8)", marginBottom: "6px" }}>Crypto Balance</div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "4px", lineHeight: 1 }}>{fmt(cryptoBalance)}</div>
          <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)" }}>USD · Digital Assets</div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Total Deposited", value: fmt(totalDeposited), color: "#60A5FA" },
          { label: "Total Withdrawn", value: fmt(totalWithdrawn), color: "#FCD34D" },
        ].map((s) => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
        <Link to="/deposit" style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 16px rgba(26,86,219,0.35)" }}>
            + Fund Account
          </button>
        </Link>
        <button
          onClick={() => setShowWithdrawModal(true)}
          style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
          Withdraw
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto", paddingBottom: "2px" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: tab === t ? "none" : "1px solid rgba(255,255,255,0.08)", background: tab === t ? "linear-gradient(135deg,#1A56DB,#1247C0)" : "rgba(255,255,255,0.04)", color: tab === t ? "white" : "#94A3B8", cursor: "pointer", fontFamily: "Inter, sans-serif", textTransform: "capitalize" }}>
            {t}{t === "pending" && pendingDeposits.length > 0 ? ` (${pendingDeposits.length})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", padding: "40px 20px", fontSize: "14px" }}>Loading…</div>
      ) : (
        <>
          {/* Pending deposits */}
          {tab === "pending" && (
            <>
              {pendingDeposits.length === 0 && rejectedDeposits.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", padding: "40px 20px", fontSize: "14px" }}>No pending deposits.</div>
              ) : (
                [...pendingDeposits, ...rejectedDeposits].map((dep) => {
                  const isPending = dep.status === "pending";
                  return (
                    <div key={dep.id} style={{ background: "linear-gradient(135deg,#0F1629,#111827)", border: `1px solid ${isPending ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <div style={{ width: "40px", height: "40px", flexShrink: 0, borderRadius: "11px", background: isPending ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${isPending ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                        {METHOD_ICONS[dep.paymentMethod] || "⏳"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px" }}>
                          {dep.paymentMethod?.replace("_", " ")} Deposit
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "5px", background: isPending ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", color: isPending ? "#FCD34D" : "#F87171", border: `1px solid ${isPending ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                            {dep.status}
                          </span>
                          <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)" }}>{new Date(dep.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}</span>
                        </div>
                        {dep.adminNote && <div style={{ fontSize: "11px", color: "rgba(239,68,68,0.7)", marginTop: "3px" }}>{dep.adminNote}</div>}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: isPending ? "#FCD34D" : "#F87171", flexShrink: 0 }}>+{fmt(dep.amount)}</div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* Transaction list */}
          {tab !== "pending" && (
            displayTxs.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", padding: "40px 20px", fontSize: "14px" }}>No transactions yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {displayTxs.map((tx) => {
                  const c = txColors[tx.type] || txColors.deposit;
                  const icons = { deposit: "↓", withdrawal: "↑", transfer: "⇄", bonus: "★" };
                  const date = new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                  return (
                    <div key={tx.id} style={{ background: "linear-gradient(135deg,#0F1629,#111827)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", flexShrink: 0, borderRadius: "11px", background: c.bg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: c.text }}>
                        {icons[tx.type] || "↓"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.description}</div>
                        <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)" }}>{date}</div>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: tx.amount >= 0 ? "#34D399" : "#FCD34D", flexShrink: 0 }}>
                        {tx.amount >= 0 ? "+" : ""}{fmt(tx.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}

      <div style={{ height: "16px" }} />

      {showWithdrawModal && (
        <div onClick={() => setShowWithdrawModal(false)} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 24px" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0D1629", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px 24px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#FCD34D" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "10px" }}>No Card on File</h3>
            <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.65)", lineHeight: 1.7, marginBottom: "24px" }}>
              To make withdrawals, you need an <strong style={{ color: "white" }}>EliteFin Markets debit card</strong> delivered to your address. Request your card now to get started.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={() => navigate("/request-card")} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1A56DB,#1247C0)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Request a Card
              </button>
              <button onClick={() => setShowWithdrawModal(false)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94A3B8", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
