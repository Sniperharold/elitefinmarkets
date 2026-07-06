import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { Icon } from "../components/Icon.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { api } from "../lib/api.js";
import { Link } from "react-router-dom";

function CopyIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

function fmt(n, currency = "USD") {
  return (n || 0).toLocaleString("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAccount(num) {
  if (!num) return "•••• •••• ••••";
  const s = String(num);
  return s.match(/.{1,4}/g)?.join(" ") || s;
}

// Chip SVG for bank card
function ChipIcon() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
      <rect x="1" y="1" width="34" height="26" rx="4" fill="#C9A227" stroke="#E5C158" strokeWidth="0.5" />
      <line x1="1" y1="10" x2="35" y2="10" stroke="#B8902A" strokeWidth="0.8" />
      <line x1="1" y1="18" x2="35" y2="18" stroke="#B8902A" strokeWidth="0.8" />
      <line x1="13" y1="1" x2="13" y2="27" stroke="#B8902A" strokeWidth="0.8" />
      <line x1="23" y1="1" x2="23" y2="27" stroke="#B8902A" strokeWidth="0.8" />
      <rect x="13" y="10" width="10" height="8" rx="1.5" fill="#D4A83A" stroke="#C9A227" strokeWidth="0.5" />
    </svg>
  );
}

// Contactless icon
function ContactlessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
      <path d="M8.5 8.5a7.5 7.5 0 010 7M11.5 6a10.5 10.5 0 010 12M14.5 3.5a13.5 13.5 0 010 17" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, wallet, refreshWallet } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const balance = wallet?.balance || 0;
  const cryptoBalance = wallet?.cryptoBalance || 0;
  const currency = user?.currency || "USD";
  const accountType = user?.accountType || "savings";
  const accountNumber = user?.accountNumber || "0000000000";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = user?.fullName?.split(" ")[0] || "Customer";
  const fullNameUpper = (user?.fullName || "Account Holder").toUpperCase();

  useEffect(() => {
    api.getTransactions()
      .then((txs) => setTransactions(txs.slice(0, 5)))
      .catch(() => {})
      .finally(() => setTxLoading(false));
    refreshWallet();
  }, []);

  const photoUrl = user?.photoUrl ? `${API_BASE}${user.photoUrl}` : null;

  const typeColor = {
    deposit: "#34D399",
    withdrawal: "#F87171",
    transfer: "#60A5FA",
    adjustment: "#C9A227",
  };

  const typeIcon = {
    deposit: "↓",
    withdrawal: "↑",
    transfer: "→",
    adjustment: "~",
  };

  return (
    <div className="min-h-screen font-inter" style={{ background: "#060B18", color: "#E2E8F0" }}>
      <div className="mx-auto flex flex-col" style={{ maxWidth: "430px", minHeight: "100vh", background: "#070D1C", boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}>
        <div className="flex-1 overflow-y-auto pb-28 px-5 pt-8" style={{ scrollbarWidth: "none" }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "2px" }}>
                {greeting},
              </div>
              <div className="font-black text-white" style={{ fontSize: "26px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {firstName}
              </div>
            </div>
            <Link to="/profile" style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(26,86,219,0.4)", flexShrink: 0, background: "rgba(26,86,219,0.15)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="22" height="22" fill="none" stroke="#60A5FA" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </Link>
          </div>

          {/* Card Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ overflow: "hidden", borderRadius: "20px" }}>
              <div style={{ display: "flex", transition: "transform 0.4s cubic-bezier(0.34,1.1,0.64,1)", transform: `translateX(${-activeCard * 50}%)`, width: "200%" }}>

                {/* Card 1: Fiat Account */}
                <div style={{ width: "50%", flexShrink: 0, padding: "1px", cursor: "pointer" }} onClick={() => setActiveCard(1)}>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #0B1E42 0%, #132D5E 50%, #0E2248 100%)",
                      borderRadius: "20px",
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "1.586",
                      border: "1px solid rgba(201,162,39,0.2)",
                    }}
                  >
                    {/* Decorative circles */}
                    <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", border: "1px solid rgba(201,162,39,0.12)" }} />
                    <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", border: "1px solid rgba(201,162,39,0.08)" }} />
                    <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", height: "2px", background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                      <Icon.LogoMark size={32} />
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#C9A227", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {accountType}
                        </div>
                        <ContactlessIcon />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <ChipIcon />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
                        Available Balance
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); setBalanceVisible(!balanceVisible); }}
                        style={{ fontSize: "28px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                      >
                        {balanceVisible ? fmt(balance, currency) : "••••••"}
                        <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24" strokeWidth="2">
                          {balanceVisible
                            ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          }
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginBottom: "2px", letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: "6px" }}>
                          {formatAccount(accountNumber)}
                          <button onClick={handleCopyAccount} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#34D399" : "rgba(255,255,255,0.4)", padding: 0, display: "flex", alignItems: "center" }}>
                            {copied ? <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : <CopyIcon />}
                          </button>
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          {fullNameUpper.substring(0, 22)}
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#C9A227", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        ELITEFINMARKETS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Crypto Account */}
                <div style={{ width: "50%", flexShrink: 0, padding: "1px", cursor: "pointer" }} onClick={() => setActiveCard(0)}>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #1A0D42 0%, #2D1473 50%, #1A0A3A 100%)",
                      borderRadius: "20px",
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "1.586",
                      border: "1px solid rgba(139,92,246,0.25)",
                    }}
                  >
                    <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", border: "1px solid rgba(139,92,246,0.15)" }} />
                    <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", height: "2px", background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                      <Icon.LogoMark size={32} />
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          CRYPTO
                        </div>
                        <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)" }}>◈</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                      {["₿", "◈", "⟠"].map((icon, i) => (
                        <div key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#C4B5FD" }}>
                          {icon}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
                        Crypto Balance
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); setBalanceVisible(!balanceVisible); }}
                        style={{ fontSize: "28px", fontWeight: 900, color: "white", letterSpacing: "-0.02em", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                      >
                        {balanceVisible ? fmt(cryptoBalance, currency) : "••••••"}
                        <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24" strokeWidth="2">
                          {balanceVisible
                            ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          }
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "2px", letterSpacing: "0.12em" }}>
                          CRYPTO ACCOUNT
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          {fullNameUpper.substring(0, 22)}
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        ELITEFINMARKETS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
              {[0, 1].map((i) => (
                <button key={i} onClick={() => setActiveCard(i)}
                  style={{ width: activeCard === i ? "20px" : "8px", height: "8px", borderRadius: "4px", background: activeCard === i ? "#1A56DB" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: "11px", color: "rgba(148,163,184,0.4)", marginTop: "6px" }}>
              {activeCard === 0 ? "Bank Account" : "Crypto Account"} · Tap to switch
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginBottom: "24px" }}>
            {[
              { label: "Fund", icon: "↓", to: "/deposit", color: "#1A56DB" },
              { label: "Transfer", icon: "→", to: "/transfer", color: "#10B981" },
              { label: "History", icon: "≡", to: "/wallet", color: "#C9A227" },
              { label: "Support", icon: "?", to: "/support", color: "#8B5CF6" },
            ].map((action) => (
              <Link key={action.label} to={action.to} style={{ textDecoration: "none" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "14px 8px", textAlign: "center", cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${action.color}22`, border: `1px solid ${action.color}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "16px", fontWeight: 700, color: action.color }}>
                    {action.icon}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(148,163,184,0.7)", letterSpacing: "0.04em" }}>{action.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Account Summary */}
          <div style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px", padding: "18px 20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>Account Overview</div>
              <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", fontWeight: 600 }}>Acc: {formatAccount(accountNumber)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Bank Balance", value: fmt(balance, currency), color: "#34D399" },
                { label: "Crypto Balance", value: fmt(cryptoBalance, currency), color: "#A78BFA" },
                { label: "Total Deposited", value: fmt((wallet?.totalDeposited || 0), currency), color: "#60A5FA" },
                { label: "Total Withdrawn", value: fmt((wallet?.totalWithdrawn || 0), currency), color: "#FCD34D" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: s.color, marginBottom: "3px" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>Recent Transactions</div>
              <Link to="/wallet" style={{ fontSize: "12px", color: "#60A5FA", textDecoration: "none", fontWeight: 600 }}>View All</Link>
            </div>

            {txLoading ? (
              <div style={{ textAlign: "center", color: "rgba(148,163,184,0.4)", padding: "30px", fontSize: "13px" }}>Loading…</div>
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(148,163,184,0.35)", padding: "30px", fontSize: "13px" }}>No transactions yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {transactions.map((tx) => {
                  const color = typeColor[tx.type] || "#60A5FA";
                  const icon = typeIcon[tx.type] || "·";
                  return (
                    <div key={tx.id} style={{ background: "linear-gradient(135deg,#0D1F3C,#0A1628)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "10px", background: `${color}20`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.description}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)" }}>
                          {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: tx.amount >= 0 ? "#34D399" : "#F87171", flexShrink: 0 }}>
                        {tx.amount >= 0 ? "+" : ""}{fmt(tx.amount, currency)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
