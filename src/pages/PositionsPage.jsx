import { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

// ── XAU/USD constants ──
const TICK = 0.1;
const POINT_VALUE = 10;
const VOLATILITY = 5;
const DECIMAL = 2;
const LOT = 0.2;
const OPEN_PRICE = 4900.0;

const DAILY_RATE = 0.042;

// Tiered bonus — mirrors deposit logic
function getBonusPct(deposited) {
  if (deposited >= 5000) return 100;
  if (deposited >= 2000) return 70;
  if (deposited >= 500) return 50;
  return 0;
}

// Returns true if right now is within 10:00 AM – 12:00 PM US Eastern time
function isWithinTradingWindow() {
  const now = new Date();
  const etStr = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const [hStr, mStr] = etStr.split(":");
  const total = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
  return total >= 10 * 60 && total < 12 * 60;
}

// Ms until next 10:00 AM ET
function msUntilNextOpen() {
  const now = new Date();
  const etNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const next = new Date(etNow);
  next.setHours(10, 0, 0, 0);
  if (etNow >= next) next.setDate(next.getDate() + 1);
  return next - etNow;
}

// Ms until 12:00 PM ET today
function msUntilClose() {
  const now = new Date();
  const etNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const close = new Date(etNow);
  close.setHours(12, 0, 0, 0);
  return close - etNow;
}

function nowLabel() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `Today, ${h}:${m}`;
}

function calcPnl(current) {
  const ticks = (current - OPEN_PRICE) / TICK;
  const rawPnl = ticks * POINT_VALUE * LOT;
  const pnlPct = ((current - OPEN_PRICE) / OPEN_PRICE) * 100;
  return { pnl: rawPnl, pnlPct };
}

const INITIAL_CLOSED = [
  {
    id: "P-4399",
    pair: "EUR/GBP",
    type: "BUY",
    pnl: +128.5,
    closeTime: "Today, 09:12",
  },
  {
    id: "P-4392",
    pair: "NAS100",
    type: "SELL",
    pnl: +892.0,
    closeTime: "Today, 07:44",
  },
  {
    id: "P-4381",
    pair: "GBP/USD",
    type: "BUY",
    pnl: -43.2,
    closeTime: "Yesterday, 22:11",
  },
  {
    id: "P-4374",
    pair: "USD/JPY",
    type: "BUY",
    pnl: +317.8,
    closeTime: "Yesterday, 18:30",
  },
];

const EXTRA_PAIRS = [
  { pair: "AUD/USD", type: "BUY" },
  { pair: "EUR/JPY", type: "SELL" },
  { pair: "USD/CHF", type: "SELL" },
  { pair: "GBP/USD", type: "BUY" },
  { pair: "NAS100", type: "BUY" },
  { pair: "BTC/USD", type: "BUY" },
];

let nextId = 4000;

export default function PositionsPage() {
  const { wallet } = useAuth();

  const balance = wallet?.balance || 0;
  const totalDeposited = wallet?.totalDeposited || 0;
  const bonusBalance = wallet?.bonusBalance || 0;
  const hasBalance = balance > 0;

  // Closed PNL = 4.2% of (totalDeposited + bonusBalance)
  const closedPnl = parseFloat((balance * DAILY_RATE).toFixed(2));

  const [tab, setTab] = useState("open");
  const [windowOpen, setWindowOpen] = useState(isWithinTradingWindow());
  const [current, setCurrent] = useState(OPEN_PRICE);
  const [elapsed, setElapsed] = useState("0h 00m");
  const [closed, setClosed] = useState([]);
  const closedRef = useRef(false);
  const closedPnlRef = useRef(closedPnl);

  // Keep ref in sync so the close handler always uses the latest value
  useEffect(() => {
    closedPnlRef.current = closedPnl;
  }, [closedPnl]);

  const { pnl, pnlPct } = calcPnl(current);
  const pnlPositive = pnl >= 0;

  // ── Window open/close scheduler ──
  useEffect(() => {
    let openTimer = null;
    let closeTimer = null;

    function handleClose() {
      if (closedRef.current) return;
      closedRef.current = true;
      setWindowOpen(false);
      setTab("closed");
      setClosed((prev) => {
        const entry = {
          id: `P-${--nextId}`,
          pair: "XAU/USD",
          type: "BUY",
          pnl: closedPnlRef.current,
          closeTime: nowLabel(),
        };
        return [entry, ...prev].slice(0, 12);
      });
      // Schedule next open
      openTimer = setTimeout(() => {
        closedRef.current = false;
        setCurrent(OPEN_PRICE);
        setWindowOpen(true);
        closeTimer = setTimeout(handleClose, 2 * 60 * 60 * 1000);
      }, msUntilNextOpen());
    }

    if (!isWithinTradingWindow()) {
      // Outside window — wait for 10 AM
      openTimer = setTimeout(() => {
        closedRef.current = false;
        setCurrent(OPEN_PRICE);
        setWindowOpen(true);
        closeTimer = setTimeout(handleClose, 2 * 60 * 60 * 1000);
      }, msUntilNextOpen());
    } else {
      // Already inside window — schedule close for remaining time
      const remaining = msUntilClose();
      if (remaining > 0) {
        closeTimer = setTimeout(handleClose, remaining);
      } else {
        handleClose();
      }
    }

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []); // runs once on mount; closedPnlRef keeps value current

  // ── Price tick ──
  useEffect(() => {
    if (!windowOpen) return;
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const bias =
          prev > OPEN_PRICE + 5 ? -0.3 : prev < OPEN_PRICE - 5 ? 0.3 : 0;
        const move =
          (Math.random() * VOLATILITY * 2 - VOLATILITY + bias) * TICK;
        return parseFloat((prev + move).toFixed(DECIMAL));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [windowOpen]);

  // ── Elapsed time counter ──
  useEffect(() => {
    if (!windowOpen) return;
    const start = Date.now();
    setElapsed("0h 00m");
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60)
        .toString()
        .padStart(2, "0");
      setElapsed(`${h}h ${m}m`);
    }, 10000);
    return () => clearInterval(interval);
  }, [windowOpen]);

  // ── Occasional auto-closed entries ──
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Math.random() < 0.45) {
  //       const src = EXTRA_PAIRS[Math.floor(Math.random() * EXTRA_PAIRS.length)];
  //       const entry = {
  //         id: `P-${--nextId}`,
  //         pair: src.pair,
  //         type: src.type,
  //         pnl: parseFloat((Math.random() * 600 - 100).toFixed(2)),
  //         closeTime: nowLabel(),
  //       };
  //       setClosed((prev) => [entry, ...prev].slice(0, 12));
  //     }
  //   }, 14000);
  //   return () => clearInterval(interval);
  // }, []);

  const totalOpenPnl = windowOpen && hasBalance ? pnl : 0;
  const openPositive = totalOpenPnl >= 0;

  return (
    <AppShell>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div
            style={{
              color: "rgba(148,163,184,0.6)",
              fontSize: "13px",
              marginBottom: "2px",
            }}
          >
            Live Trading
          </div>
          <h1
            className="font-black text-white"
            style={{ fontSize: "26px", letterSpacing: "-0.02em" }}
          >
            Positions
          </h1>
        </div>
        <div
          style={{
            background: openPositive
              ? "rgba(16,185,129,0.12)"
              : "rgba(239,68,68,0.1)",
            border: `1px solid ${openPositive ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)"}`,
            borderRadius: "12px",
            padding: "8px 14px",
            textAlign: "right",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "rgba(148,163,184,0.5)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "2px",
            }}
          >
            Open P&amp;L
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: openPositive ? "#34D399" : "#F87171",
              transition: "color 0.3s",
            }}
          >
            {openPositive ? "+" : "-"}${Math.abs(totalOpenPnl).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2 mb-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          padding: "4px",
        }}
      >
        {["open", "closed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 font-semibold transition-all duration-200"
            style={{
              padding: "9px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              background:
                tab === t
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "transparent",
              color: tab === t ? "white" : "#64748B",
              boxShadow: tab === t ? "0 2px 12px rgba(37,99,235,0.35)" : "none",
            }}
          >
            {t === "open"
              ? `Open (${windowOpen && hasBalance ? 1 : 0})`
              : `Closed (${closed.length})`}
          </button>
        ))}
      </div>

      {/* ── Open tab ── */}
      {tab === "open" && (
        <div className="space-y-3">
          {/* No deposit yet */}
          {!hasBalance && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "linear-gradient(135deg,#0F1629,#111827)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🤖</div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "8px",
                }}
              >
                No open positions yet
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.55)",
                  lineHeight: 1.7,
                  maxWidth: "260px",
                  margin: "0 auto",
                }}
              >
                Make a deposit and the AI bot will start working for you the
                next day.
              </div>
            </div>
          )}

          {/* Has balance but outside 10 AM – 12 PM ET */}
          {hasBalance && !windowOpen && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "linear-gradient(135deg,#0F1629,#111827)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "8px",
                }}
              >
                Market opens at 10:00 AM ET
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.55)",
                  lineHeight: 1.7,
                  maxWidth: "260px",
                  margin: "0 auto",
                }}
              >
                The AI trades XAU/USD daily from 10:00 AM – 12:00 PM Eastern
                Time.
              </div>
            </div>
          )}

          {/* Active XAU/USD position */}
          {hasBalance && windowOpen && (
            <div
              style={{
                background: "linear-gradient(135deg,#0F1629,#111827)",
                border: "1px solid #1E2A47",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-bold text-white"
                      style={{ fontSize: "15px" }}
                    >
                      XAU/USD
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "5px",
                        background: "rgba(16,185,129,0.15)",
                        color: "#34D399",
                        border: "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      BUY
                    </span>
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)" }}
                  >
                    Alpn · {elapsed} · {LOT} lot
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: pnlPositive ? "#34D399" : "#F87171",
                      transition: "color 0.3s",
                    }}
                  >
                    {pnlPositive ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: pnlPositive
                        ? "rgba(52,211,153,0.6)"
                        : "rgba(248,113,113,0.6)",
                      transition: "color 0.3s",
                    }}
                  >
                    {pnlPositive ? "+" : ""}
                    {pnlPct.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    padding: "7px 10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(148,163,184,0.45)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "2px",
                    }}
                  >
                    Open
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#CBD5E1",
                    }}
                  >
                    {OPEN_PRICE.toFixed(DECIMAL)}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    padding: "7px 10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(148,163,184,0.45)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "2px",
                    }}
                  >
                    Current
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#CBD5E1",
                      transition: "color 0.3s",
                    }}
                  >
                    {current.toFixed(DECIMAL)}
                  </div>
                </div>
                {/* Disabled — AI manages the position */}
                <button
                  disabled
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: "1px solid rgba(239,68,68,0.1)",
                    background: "rgba(239,68,68,0.04)",
                    color: "rgba(248,113,113,0.3)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "not-allowed",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Closed tab ── */}
      {tab === "closed" && (
        <div className="space-y-3">
          {closed.map((p, idx) => (
            <div
              key={p.id}
              style={{
                background: "linear-gradient(135deg,#0F1629,#111827)",
                border: "1px solid #1E2A47",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                animation: idx === 0 ? "fadeIn 0.4s ease" : "none",
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-bold text-white"
                    style={{ fontSize: "15px" }}
                  >
                    {p.pair}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "5px",
                      background:
                        p.type === "BUY"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                      color: p.type === "BUY" ? "#34D399" : "#F87171",
                      border: `1px solid ${p.type === "BUY" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    {p.type}
                  </span>
                </div>
                <div
                  style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)" }}
                >
                  {p.closeTime} · {p.id}
                </div>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: p.pnl >= 0 ? "#34D399" : "#F87171",
                }}
              >
                {p.pnl >= 0 ? "+" : "-"}${Math.abs(p.pnl).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
