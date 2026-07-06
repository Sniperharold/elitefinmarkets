import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/api$/, "");

function fmt(n) {
  return (n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
function fmtFull(n) {
  return (n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function Badge({ status }) {
  const colors = {
    pending: {
      bg: "rgba(245,158,11,0.15)",
      color: "#FCD34D",
      border: "rgba(245,158,11,0.3)",
    },
    confirmed: {
      bg: "rgba(16,185,129,0.15)",
      color: "#34D399",
      border: "rgba(16,185,129,0.3)",
    },
    rejected: {
      bg: "rgba(239,68,68,0.15)",
      color: "#F87171",
      border: "rgba(239,68,68,0.3)",
    },
    open: {
      bg: "rgba(37,99,235,0.15)",
      color: "#60A5FA",
      border: "rgba(37,99,235,0.3)",
    },
    in_progress: {
      bg: "rgba(245,158,11,0.15)",
      color: "#FCD34D",
      border: "rgba(245,158,11,0.3)",
    },
    resolved: {
      bg: "rgba(16,185,129,0.15)",
      color: "#34D399",
      border: "rgba(16,185,129,0.3)",
    },
    closed: {
      bg: "rgba(148,163,184,0.1)",
      color: "#94A3B8",
      border: "rgba(148,163,184,0.2)",
    },
  };
  const c = colors[status] || colors.pending;
  return (
    <span
      style={{
        padding: "3px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {status?.replace("_", " ")}
    </span>
  );
}

function ScreenshotThumb({ url }) {
  const [open, setOpen] = useState(false);
  const src = resolveUrl(url);
  if (!src)
    return (
      <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.3)" }}>
        —
      </span>
    );
  return (
    <>
      <img
        src={src}
        alt="Proof"
        onClick={() => setOpen(true)}
        style={{
          width: "48px",
          height: "36px",
          objectFit: "cover",
          borderRadius: "6px",
          border: "1px solid rgba(26,86,219,0.35)",
          cursor: "zoom-in",
          display: "block",
        }}
      />
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "88vh",
            }}
          >
            <img
              src={src}
              alt="Full"
              style={{
                maxWidth: "100%",
                maxHeight: "88vh",
                borderRadius: "12px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
              }}
            />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "#F87171",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const TABS = ["Users", "Deposits", "Channels", "Cards", "Support"];

// ── Channel editor fields per method ──
const CHANNEL_FIELDS = {
  BANK_TRANSFER: [
    { key: "bankName", label: "Bank Name" },
    { key: "accountName", label: "Account Name" },
    { key: "accountNumber", label: "Account Number" },
    { key: "routingNumber", label: "Routing Number (ACH)" },
    { key: "swiftCode", label: "SWIFT / BIC" },
    { key: "iban", label: "IBAN (optional)" },
  ],
  USDT: [
    { key: "network", label: "Network (e.g. TRC20)" },
    { key: "address", label: "Wallet Address" },
  ],
  BITCOIN: [{ key: "address", label: "BTC Wallet Address" }],
  PAYPAL: [{ key: "paypalEmail", label: "PayPal Email" }],
};

const METHOD_LABELS = {
  BANK_TRANSFER: "🏦 Bank Transfer",
  USDT: "◈ USDT",
  BITCOIN: "₿ Bitcoin",
  PAYPAL: "Ⓟ PayPal",
};

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Users");

  // Stats
  const [stats, setStats] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [walletEdits, setWalletEdits] = useState({});
  const [codeEdits, setCodeEdits] = useState({});
  const [dateJoinedEdits, setDateJoinedEdits] = useState({});

  // Deposits
  const [deposits, setDeposits] = useState([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositFilter, setDepositFilter] = useState("pending");
  const [depositNote, setDepositNote] = useState({});

  // Channels
  const [channels, setChannels] = useState({});
  const [channelEdits, setChannelEdits] = useState({});
  const [channelMethod, setChannelMethod] = useState("BANK_TRANSFER");
  const [channelLoading, setChannelLoading] = useState(false);

  // Credit Cards
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  // Support
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [ticketReply, setTicketReply] = useState({});

  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // useEffect(() => {
  //   if (user?.role !== "admin") { navigate("/dashboard"); return; }
  // }, [user]);

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "Users" && !users.length) loadUsers();
    if (tab === "Deposits") loadDeposits();
    if (tab === "Channels" && !Object.keys(channels).length) loadChannels();
    if (tab === "Cards" && !cards.length) loadCards();
    if (tab === "Support" && !tickets.length) loadTickets();
  }, [tab]);

  const loadUsers = () => {
    setUsersLoading(true);
    api
      .adminGetUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  };
  const loadDeposits = () => {
    setDepositsLoading(true);
    api
      .adminGetDeposits()
      .then(setDeposits)
      .catch(() => {})
      .finally(() => setDepositsLoading(false));
  };
  const loadChannels = () => {
    setChannelLoading(true);
    api
      .adminGetChannels()
      .then((list) => {
        const map = {};
        list.forEach((ch) => {
          map[ch.method] = ch;
        });
        setChannels(map);
        // Pre-fill edit state
        const edits = {};
        list.forEach((ch) => {
          edits[ch.method] = { ...ch.details };
        });
        setChannelEdits(edits);
      })
      .catch(() => {})
      .finally(() => setChannelLoading(false));
  };
  const loadCards = () => {
    setCardsLoading(true);
    api
      .adminGetCreditCards()
      .then(setCards)
      .catch(() => {})
      .finally(() => setCardsLoading(false));
  };
  const loadTickets = () => {
    setTicketsLoading(true);
    api
      .adminGetTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setTicketsLoading(false));
  };

  const handleConfirmDeposit = async (id) => {
    try {
      await api.adminConfirmDeposit(id, { adminNote: depositNote[id] || "" });
      setDeposits((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "confirmed" } : d)),
      );
      showToast("✅ Deposit confirmed.");
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const handleRejectDeposit = async (id) => {
    try {
      await api.adminRejectDeposit(id, { adminNote: depositNote[id] || "" });
      setDeposits((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "rejected" } : d)),
      );
      showToast("✅ Deposit rejected.");
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const handleAdjustWallet = async (userId) => {
    const edits = walletEdits[userId] || {};
    const balance =
      edits.balance !== undefined ? parseFloat(edits.balance) : undefined;
    const cryptoBalance =
      edits.cryptoBalance !== undefined
        ? parseFloat(edits.cryptoBalance)
        : undefined;

    let date;
    if (edits.txDay && edits.txMonth && edits.txYear) {
      date = new Date(
        parseInt(edits.txYear),
        parseInt(edits.txMonth) - 1,
        parseInt(edits.txDay),
        12, 0, 0,
      ).toISOString();
    }

    try {
      await api.adminAdjustWallet(
        userId,
        balance,
        cryptoBalance,
        edits.note || "Admin adjustment",
        date,
      );
      showToast("✅ Wallet updated.");
      loadUsers();
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const handleSaveChannel = async (method) => {
    const details = channelEdits[method] || {};
    setChannelLoading(true);
    try {
      await api.adminSetChannel({ method, details });
      showToast("✅ Channel saved.");
      loadChannels();
    } catch (err) {
      showToast("❌ " + err.message);
    } finally {
      setChannelLoading(false);
    }
  };

  const handleSaveCodes = async (userId) => {
    const codes = codeEdits[userId] || {};
    try {
      await api.adminSetCodes(userId, { cotCode: codes.cotCode ?? null, imtCode: codes.imtCode ?? null, tacCode: codes.tacCode ?? null });
      showToast("✅ Codes saved.");
      loadUsers();
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const handleSaveDateJoined = async (userId) => {
    const date = dateJoinedEdits[userId];
    if (!date) return;
    try {
      await api.adminSetDateJoined(userId, date);
      showToast("✅ Date joined updated.");
      loadUsers();
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const handleTicketReply = async (id, status) => {
    const reply = ticketReply[id] || "";
    try {
      await api.adminUpdateTicket(id, { status, adminReply: reply });
      showToast("✅ Ticket updated.");
      loadTickets();
    } catch (err) {
      showToast("❌ " + err.message);
    }
  };

  const filteredDeposits =
    depositFilter === "all"
      ? deposits
      : deposits.filter((d) => d.status === depositFilter);

  const bg = "linear-gradient(180deg,#060B18 0%,#050910 100%)";
  const card = {
    background: "linear-gradient(135deg,#0F1629,#111827)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        paddingBottom: "80px",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: toast.startsWith("✅")
              ? "rgba(16,185,129,0.15)"
              : "rgba(239,68,68,0.15)",
            border: `1px solid ${toast.startsWith("✅") ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
            borderRadius: "10px",
            padding: "10px 18px",
            color: toast.startsWith("✅") ? "#34D399" : "#F87171",
            fontWeight: 600,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{ maxWidth: "430px", margin: "0 auto", padding: "24px 16px 0" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(148,163,184,0.5)",
              letterSpacing: "0.1em",
              marginBottom: "2px",
            }}
          >
            ADMIN
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Control Panel
          </h1>
        </div>

        {/* Stat cards */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            {[
              { label: "Total Users", value: stats.totalUsers, color: "#60A5FA" },
              { label: "Total Deposited", value: fmtFull(stats.totalDeposited), color: "#34D399" },
              { label: "Pending Deposits", value: stats.pendingDeposits, color: "#FCD34D" },
              { label: "This Week", value: fmtFull(stats.week?.amount || 0), color: "#A78BFA" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "6px" }}>{s.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "20px",
            overflowX: "auto",
            paddingBottom: "2px",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                border: tab === t ? "none" : "1px solid rgba(255,255,255,0.08)",
                background:
                  tab === t
                    ? "linear-gradient(135deg,#1A56DB,#1247C0)"
                    : "rgba(255,255,255,0.04)",
                color: tab === t ? "white" : "#94A3B8",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {tab === "Users" &&
          (usersLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "rgba(148,163,184,0.4)",
              }}
            >
              Loading…
            </div>
          ) : (
            users.map((u) => {
              const isExp = expandedUser === u.id;
              const we = walletEdits[u.id] || {};
              return (
                <div key={u.id} style={card}>
                  <div
                    onClick={() => setExpandedUser(isExp ? null : u.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#1A56DB,#1247C0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "white",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {u.photoUrl ? (
                        <img
                          src={resolveUrl(u.photoUrl)}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        (u.fullName || "?")
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "white",
                          marginBottom: "1px",
                        }}
                      >
                        {u.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(148,163,184,0.5)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {u.email}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#34D399",
                        }}
                      >
                        {fmt(u.wallet?.balance)}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "rgba(139,92,246,0.8)",
                        }}
                      >
                        +{fmt(u.wallet?.cryptoBalance)} crypto
                      </div>
                    </div>
                    <div
                      style={{
                        color: "rgba(148,163,184,0.4)",
                        fontSize: "12px",
                        marginLeft: "4px",
                      }}
                    >
                      {isExp ? "▲" : "▼"}
                    </div>
                  </div>

                  {isExp && (
                    <div
                      style={{
                        marginTop: "14px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "14px",
                      }}
                    >
                      {/* User info */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                          marginBottom: "14px",
                        }}
                      >
                        {[
                          ["Account #", u.accountNumber],
                          ["Account Type", u.accountType],
                          ["Currency", u.currency],
                          ["Country", u.country],
                          ["Phone", u.phone],
                          [
                            "Joined",
                            u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "—",
                          ],
                        ].map(([k, v]) => (
                          <div
                            key={k}
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              borderRadius: "8px",
                              padding: "8px 10px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "10px",
                                color: "rgba(148,163,184,0.4)",
                                marginBottom: "3px",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                fontWeight: 700,
                              }}
                            >
                              {k}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#E2E8F0",
                                fontFamily:
                                  k === "Account #" ? "monospace" : "inherit",
                              }}
                            >
                              {v || "—"}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Wallet adjustment */}
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "rgba(148,163,184,0.5)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "8px",
                        }}
                      >
                        Adjust Wallet
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        {[
                          {
                            key: "balance",
                            label: "Bank Balance ($)",
                            placeholder: fmtFull(u.wallet?.balance || 0),
                          },
                          {
                            key: "cryptoBalance",
                            label: "Crypto Balance ($)",
                            placeholder: fmtFull(u.wallet?.cryptoBalance || 0),
                          },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key}>
                            <label
                              style={{
                                display: "block",
                                fontSize: "10px",
                                color: "rgba(148,163,184,0.5)",
                                marginBottom: "4px",
                                fontWeight: 700,
                              }}
                            >
                              {label}
                            </label>
                            <input
                              type="number"
                              placeholder={placeholder}
                              value={we[key] ?? ""}
                              onChange={(e) =>
                                setWalletEdits((prev) => ({
                                  ...prev,
                                  [u.id]: {
                                    ...(prev[u.id] || {}),
                                    [key]: e.target.value,
                                  },
                                }))
                              }
                              style={{
                                width: "100%",
                                background: "rgba(10,18,40,0.7)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "8px",
                                padding: "8px 10px",
                                color: "#E2E8F0",
                                fontSize: "13px",
                                outline: "none",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Note (optional)"
                        value={we.note ?? ""}
                        onChange={(e) =>
                          setWalletEdits((prev) => ({
                            ...prev,
                            [u.id]: {
                              ...(prev[u.id] || {}),
                              note: e.target.value,
                            },
                          }))
                        }
                        style={{
                          width: "100%",
                          background: "rgba(10,18,40,0.7)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          color: "#E2E8F0",
                          fontSize: "13px",
                          outline: "none",
                          boxSizing: "border-box",
                          marginBottom: "8px",
                        }}
                      />

                      {/* Transaction date */}
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", fontSize: "10px", color: "rgba(148,163,184,0.5)", marginBottom: "5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Transaction Date (optional)
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: "6px" }}>
                          <input
                            type="number"
                            placeholder="Day"
                            min={1} max={31}
                            value={we.txDay ?? ""}
                            onChange={(e) =>
                              setWalletEdits((prev) => ({
                                ...prev,
                                [u.id]: { ...(prev[u.id] || {}), txDay: e.target.value },
                              }))
                            }
                            style={{ background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#E2E8F0", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%" }}
                          />
                          <select
                            value={we.txMonth ?? ""}
                            onChange={(e) =>
                              setWalletEdits((prev) => ({
                                ...prev,
                                [u.id]: { ...(prev[u.id] || {}), txMonth: e.target.value },
                              }))
                            }
                            style={{ background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 6px", color: we.txMonth ? "#E2E8F0" : "rgba(148,163,184,0.45)", fontSize: "12px", outline: "none", boxSizing: "border-box", width: "100%" }}
                          >
                            <option value="">Month</option>
                            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                              <option key={i} value={i + 1} style={{ color: "#E2E8F0", background: "#0D1629" }}>{m}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Year"
                            min={2000} max={2099}
                            value={we.txYear ?? ""}
                            onChange={(e) =>
                              setWalletEdits((prev) => ({
                                ...prev,
                                [u.id]: { ...(prev[u.id] || {}), txYear: e.target.value },
                              }))
                            }
                            style={{ background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#E2E8F0", fontSize: "13px", outline: "none", boxSizing: "border-box", width: "100%" }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdjustWallet(u.id)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "none",
                          background: "linear-gradient(135deg,#1A56DB,#1247C0)",
                          color: "white",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Save Wallet
                      </button>

                      {/* Transfer Verification Codes */}
                      <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                          Transfer Verification Codes
                        </div>
                        {[
                          { key: "cotCode", label: "COT (Commission on Turnover)", current: u.cotCode },
                          { key: "imtCode", label: "IMT (Intl. Money Transfer)", current: u.imtCode },
                          { key: "tacCode", label: "TAC (Transfer Auth. Code)", current: u.tacCode },
                        ].map(({ key, label, current }) => (
                          <div key={key} style={{ marginBottom: "8px" }}>
                            <label style={{ display: "block", fontSize: "10px", color: "rgba(148,163,184,0.5)", marginBottom: "4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {label} {current && <span style={{ color: "#FCD34D" }}>· Set</span>}
                            </label>
                            <input
                              type="text"
                              placeholder={current ? "Leave blank to clear" : "Set code…"}
                              value={(codeEdits[u.id] || {})[key] ?? ""}
                              onChange={(e) => setCodeEdits(prev => ({ ...prev, [u.id]: { ...(prev[u.id] || {}), [key]: e.target.value } }))}
                              style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#E2E8F0", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => handleSaveCodes(u.id)}
                          style={{ width: "100%", padding: "9px", borderRadius: "9px", border: "1px solid rgba(26,86,219,0.4)", background: "rgba(26,86,219,0.12)", color: "#60A5FA", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        >
                          Save Codes
                        </button>
                      </div>

                      {/* Update Date Joined */}
                      <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                          Update Date Joined
                        </div>
                        <input
                          type="date"
                          value={dateJoinedEdits[u.id] ?? ""}
                          onChange={(e) => setDateJoinedEdits(prev => ({ ...prev, [u.id]: e.target.value }))}
                          style={{ width: "100%", background: "rgba(10,18,40,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 10px", color: "#E2E8F0", fontSize: "13px", outline: "none", boxSizing: "border-box", marginBottom: "8px" }}
                        />
                        <button
                          onClick={() => handleSaveDateJoined(u.id)}
                          style={{ width: "100%", padding: "9px", borderRadius: "9px", border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34D399", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        >
                          Update Date Joined
                        </button>
                      </div>

                      {/* Credit cards on this user */}
                      {u.creditCards?.length > 0 && (
                        <div style={{ marginTop: "12px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "rgba(148,163,184,0.5)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: "8px",
                            }}
                          >
                            Saved Cards ({u.creditCards.length})
                          </div>
                          {u.creditCards.map((cc) => (
                            <div
                              key={cc.id}
                              style={{
                                background: "rgba(139,92,246,0.07)",
                                border: "1px solid rgba(139,92,246,0.18)",
                                borderRadius: "8px",
                                padding: "10px 12px",
                                marginBottom: "6px",
                                fontSize: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: "#E2E8F0",
                                  marginBottom: "2px",
                                }}
                              >
                                {cc.cardHolder}
                              </div>
                              <div
                                style={{
                                  color: "rgba(148,163,184,0.6)",
                                  fontFamily: "monospace",
                                }}
                              >
                                •••• •••• •••• {cc.cardNumber?.slice(-4)}
                              </div>
                              <div
                                style={{
                                  color: "rgba(148,163,184,0.45)",
                                  marginTop: "2px",
                                }}
                              >
                                {cc.expiryMonth}/{cc.expiryYear}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ))}

        {/* ── DEPOSITS TAB ── */}
        {tab === "Deposits" && (
          <>
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "14px",
                overflowX: "auto",
              }}
            >
              {["pending", "confirmed", "rejected", "all"].map((f) => (
                <button
                  key={f}
                  onClick={() => setDepositFilter(f)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    border:
                      depositFilter === f
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                    background:
                      depositFilter === f
                        ? "linear-gradient(135deg,#1A56DB,#1247C0)"
                        : "rgba(255,255,255,0.04)",
                    color: depositFilter === f ? "white" : "#94A3B8",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            {depositsLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                }}
              >
                Loading…
              </div>
            ) : filteredDeposits.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                  fontSize: "14px",
                }}
              >
                No deposits.
              </div>
            ) : (
              filteredDeposits.map((dep) => (
                <div key={dep.id} style={card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                      gap: "8px",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "white",
                          marginBottom: "3px",
                        }}
                      >
                        {dep.user?.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "rgba(148,163,184,0.45)",
                          marginBottom: "4px",
                        }}
                      >
                        {dep.user?.email}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Badge status={dep.status} />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "rgba(148,163,184,0.4)",
                          }}
                        >
                          {dep.paymentMethod?.replace("_", " ")}
                        </span>
                        {dep.paymentRef && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "rgba(148,163,184,0.4)",
                              fontFamily: "monospace",
                            }}
                          >
                            Ref: {dep.paymentRef}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#34D399",
                        }}
                      >
                        {fmtFull(dep.amount)}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(148,163,184,0.4)",
                          marginTop: "2px",
                        }}
                      >
                        {new Date(dep.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {dep.screenshotUrl && (
                    <div style={{ marginBottom: "10px" }}>
                      <ScreenshotThumb url={dep.screenshotUrl} />
                    </div>
                  )}
                  {dep.adminNote && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(148,163,184,0.5)",
                        marginBottom: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      {dep.adminNote}
                    </div>
                  )}

                  {dep.status === "pending" && (
                    <>
                      <input
                        type="text"
                        placeholder="Admin note (optional)"
                        value={depositNote[dep.id] || ""}
                        onChange={(e) =>
                          setDepositNote((p) => ({
                            ...p,
                            [dep.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          background: "rgba(10,18,40,0.7)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          color: "#E2E8F0",
                          fontSize: "12px",
                          outline: "none",
                          boxSizing: "border-box",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => handleConfirmDeposit(dep.id)}
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "none",
                            background:
                              "linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.9))",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Confirm
                        </button>
                        <button
                          onClick={() => handleRejectDeposit(dep.id)}
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid rgba(239,68,68,0.3)",
                            background: "rgba(239,68,68,0.1)",
                            color: "#F87171",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* ── CHANNELS TAB ── */}
        {tab === "Channels" && (
          <>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(148,163,184,0.6)",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              Configure the payment details shown to users for each deposit
              method.
            </p>
            {/* Method selector */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              {Object.keys(CHANNEL_FIELDS).map((m) => (
                <button
                  key={m}
                  onClick={() => setChannelMethod(m)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border:
                      channelMethod === m
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                    background:
                      channelMethod === m
                        ? "linear-gradient(135deg,#1A56DB,#1247C0)"
                        : "rgba(255,255,255,0.04)",
                    color: channelMethod === m ? "white" : "#94A3B8",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {METHOD_LABELS[m]}
                </button>
              ))}
            </div>

            <div style={card}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                {METHOD_LABELS[channelMethod]} — Payment Details
              </div>
              {(CHANNEL_FIELDS[channelMethod] || []).map(({ key, label }) => {
                const val = (channelEdits[channelMethod] || {})[key] || "";
                return (
                  <div key={key} style={{ marginBottom: "12px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#94A3B8",
                        marginBottom: "6px",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      value={val}
                      onChange={(e) =>
                        setChannelEdits((prev) => ({
                          ...prev,
                          [channelMethod]: {
                            ...(prev[channelMethod] || {}),
                            [key]: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: "100%",
                        background: "rgba(10,18,40,0.7)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        color: "#E2E8F0",
                        fontFamily:
                          key === "address" || key === "iban"
                            ? "monospace"
                            : "Inter, sans-serif",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(26,86,219,0.5)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                    />
                  </div>
                );
              })}
              <button
                onClick={() => handleSaveChannel(channelMethod)}
                disabled={channelLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg,#1A56DB,#1247C0)",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: channelLoading ? "not-allowed" : "pointer",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 4px 16px rgba(26,86,219,0.35)",
                  marginTop: "4px",
                }}
              >
                {channelLoading ? "Saving…" : "Save Channel"}
              </button>
            </div>
          </>
        )}

        {/* ── CREDIT CARDS TAB ── */}
        {tab === "Cards" && (
          <>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(148,163,184,0.6)",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              Credit card details submitted by users during deposit attempts.
            </p>
            {cardsLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                }}
              >
                Loading…
              </div>
            ) : cards.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                  fontSize: "14px",
                }}
              >
                No cards yet.
              </div>
            ) : (
              cards.map((cc) => {
                const isExp = expandedCard === cc.id;
                return (
                  <div
                    key={cc.id}
                    style={{
                      ...card,
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    <div
                      onClick={() => setExpandedCard(isExp ? null : cc.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg,#4C1D95,#7C3AED)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          flexShrink: 0,
                        }}
                      >
                        💳
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {cc.cardHolder}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "rgba(148,163,184,0.5)",
                            fontFamily: "monospace",
                          }}
                        >
                          •••• •••• •••• {cc.cardNumber?.slice(-4)}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(148,163,184,0.35)",
                          }}
                        >
                          {cc.user?.fullName} · {cc.user?.email}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(148,163,184,0.4)",
                          }}
                        >
                          {cc.expiryMonth}/{cc.expiryYear}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "rgba(148,163,184,0.3)",
                            marginTop: "2px",
                          }}
                        >
                          {new Date(cc.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        style={{
                          color: "rgba(148,163,184,0.4)",
                          fontSize: "12px",
                          marginLeft: "4px",
                        }}
                      >
                        {isExp ? "▲" : "▼"}
                      </div>
                    </div>
                    {isExp && (
                      <div
                        style={{
                          marginTop: "12px",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          paddingTop: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                          }}
                        >
                          {[
                            ["Full Number", cc.cardNumber],
                            ["CVV", cc.cvv],
                            ["Expiry Month", cc.expiryMonth],
                            ["Expiry Year", cc.expiryYear],
                          ].map(([k, v]) => (
                            <div
                              key={k}
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                borderRadius: "8px",
                                padding: "8px 10px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "rgba(148,163,184,0.4)",
                                  marginBottom: "3px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  fontWeight: 700,
                                }}
                              >
                                {k}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#E2E8F0",
                                  fontFamily: "monospace",
                                }}
                              >
                                {v || "—"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ── SUPPORT TAB ── */}
        {tab === "Support" && (
          <>
            {ticketsLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                }}
              >
                Loading…
              </div>
            ) : tickets.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(148,163,184,0.4)",
                  fontSize: "14px",
                }}
              >
                No tickets.
              </div>
            ) : (
              tickets.map((t) => {
                const isExp = expandedTicket === t.id;
                return (
                  <div key={t.id} style={card}>
                    <div
                      onClick={() => setExpandedTicket(isExp ? null : t.id)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "4px",
                          }}
                        >
                          <Badge status={t.status} />
                          <span
                            style={{
                              fontSize: "10px",
                              color: "rgba(148,163,184,0.35)",
                            }}
                          >
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "white",
                            marginBottom: "2px",
                          }}
                        >
                          {t.subject}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(148,163,184,0.5)",
                          }}
                        >
                          {t.user?.fullName} · {t.user?.email}
                        </div>
                      </div>
                      <div
                        style={{
                          color: "rgba(148,163,184,0.4)",
                          fontSize: "12px",
                        }}
                      >
                        {isExp ? "▲" : "▼"}
                      </div>
                    </div>

                    {isExp && (
                      <div
                        style={{
                          marginTop: "12px",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          paddingTop: "12px",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgba(148,163,184,0.4)",
                              marginBottom: "6px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Message
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#E2E8F0",
                              lineHeight: 1.6,
                            }}
                          >
                            {t.message}
                          </div>
                        </div>
                        {t.adminReply && (
                          <div
                            style={{
                              background: "rgba(26,86,219,0.07)",
                              border: "1px solid rgba(26,86,219,0.18)",
                              borderRadius: "10px",
                              padding: "12px 14px",
                              marginBottom: "12px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: "rgba(96,165,250,0.7)",
                                marginBottom: "6px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Your Reply
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#E2E8F0",
                                lineHeight: 1.6,
                              }}
                            >
                              {t.adminReply}
                            </div>
                          </div>
                        )}
                        <textarea
                          rows={3}
                          placeholder="Type a reply…"
                          value={ticketReply[t.id] || ""}
                          onChange={(e) =>
                            setTicketReply((p) => ({
                              ...p,
                              [t.id]: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            background: "rgba(10,18,40,0.7)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px",
                            padding: "10px 12px",
                            color: "#E2E8F0",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            outline: "none",
                            resize: "vertical",
                            marginBottom: "8px",
                            boxSizing: "border-box",
                          }}
                        />
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "6px",
                          }}
                        >
                          {["open", "in_progress", "resolved"].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleTicketReply(t.id, s)}
                              style={{
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "rgba(255,255,255,0.04)",
                                color: "#94A3B8",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                                textTransform: "capitalize",
                              }}
                            >
                              {s.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
