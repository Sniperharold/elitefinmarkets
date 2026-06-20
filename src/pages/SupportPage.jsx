import { useState, useEffect, useRef } from "react";
import AppShell from "../components/AppShell.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

// ── FAQ Data ──
const FAQ_ITEMS = [
  {
    category: "deposits",
    q: "How long does a deposit take to confirm?",
    a: "Bank transfers are confirmed within 1–3 hours. Crypto deposits (USDT, Bitcoin) typically take 10–30 minutes. PayPal deposits are instant. Our team reviews every deposit before crediting your account.",
  },
  {
    category: "deposits",
    q: "Which deposit methods do you accept?",
    a: "We accept bank transfer (SWIFT/SEPA/ACH), USDT (TRC20/ERC20), Bitcoin (BTC), and PayPal. Credit card deposits are currently unavailable — please use one of the above methods.",
  },
  {
    category: "deposits",
    q: "What is the minimum deposit amount?",
    a: "The minimum deposit is $10 USD (or equivalent). There is no maximum deposit limit.",
  },
  {
    category: "account",
    q: "How do I open an account?",
    a: "Click 'Open Free Account' and complete the 4-step registration: personal details, contact info, account type selection, and security setup. The whole process takes under 4 minutes.",
  },
  {
    category: "account",
    q: "How do I update my profile or password?",
    a: "Account details, profile photo, password, and transaction PIN can all be updated from the Profile page inside the app.",
  },
  {
    category: "account",
    q: "Is my money safe with Elitefinmarkets?",
    a: "Yes. Elitefinmarkets is regulated and audited by independent financial institutions. Client funds are held in segregated accounts and never used for operational expenses.",
  },
  {
    category: "transfers",
    q: "How do I send money internationally?",
    a: "Once your account is funded, contact support for large international transfers. For crypto-to-crypto movement, your wallet address is shown in your account settings.",
  },
  {
    category: "transfers",
    q: "Are there fees for transfers?",
    a: "Elitefinmarkets charges no internal transfer fees. Third-party network fees (e.g. SWIFT charges, crypto gas fees) may apply and are outside our control.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: "◈" },
  { id: "deposits", label: "Deposits", icon: "💰" },
  { id: "account", label: "Account", icon: "👤" },
  { id: "transfers", label: "Transfers", icon: "🌍" },
];

// ── Ticket status colors ──
const statusStyle = {
  open: {
    bg: "rgba(37,99,235,0.12)",
    border: "rgba(37,99,235,0.3)",
    color: "#60A5FA",
    label: "Open",
  },
  in_progress: {
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    color: "#FCD34D",
    label: "In Progress",
  },
  resolved: {
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
    color: "#34D399",
    label: "Resolved",
  },
  closed: {
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
    color: "#94A3B8",
    label: "Closed",
  },
};

function StatusBadge({ status }) {
  const s = statusStyle[status] || statusStyle.open;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ── Accordion FAQ item ──
function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background: open ? "rgba(37,99,235,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "14px",
        marginBottom: "8px",
        cursor: "pointer",
        transition: "all 0.2s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 16px",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13.5px",
            fontWeight: 600,
            color: open ? "#E2E8F0" : "#CBD5E1",
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {item.q}
        </span>
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            flexShrink: 0,
            background: open ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${open ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.1)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="10"
            height="10"
            fill="none"
            stroke={open ? "#60A5FA" : "#64748B"}
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
        </div>
      </div>
      {open && (
        <div
          style={{
            padding: "0 16px 16px",
            fontSize: "13px",
            color: "rgba(148,163,184,0.8)",
            lineHeight: 1.7,
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

// ── Ticket detail view ──
function TicketDetail({ ticket, onBack, onReply }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await onReply(ticket.id, reply);
      setReply("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Back + header */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "rgba(148,163,184,0.7)",
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "18px",
          padding: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to tickets
      </button>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "rgba(148,163,184,0.4)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            #{ticket.id.slice(-8).toUpperCase()}
          </span>
          <StatusBadge status={ticket.status} />
        </div>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.01em",
          }}
        >
          {ticket.subject}
        </h2>
      </div>

      {/* Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {(ticket.messages || []).map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "11px 14px",
                  borderRadius: isUser
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                  background: isUser
                    ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                    : "rgba(255,255,255,0.05)",
                  border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
                  fontSize: "13px",
                  color: isUser ? "white" : "#CBD5E1",
                  lineHeight: 1.6,
                }}
              >
                {msg.body}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: "rgba(148,163,184,0.35)",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {isUser ? "You" : "Support"} ·{" "}
                {new Date(msg.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      {ticket.status !== "closed" && ticket.status !== "resolved" && (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            padding: "12px",
          }}
        >
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            rows={3}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              color: "#E2E8F0",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              resize: "none",
              lineHeight: 1.6,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleReply}
              disabled={!reply.trim() || sending}
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                background: reply.trim()
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "rgba(255,255,255,0.05)",
                color: reply.trim() ? "white" : "#64748B",
                fontSize: "13px",
                fontWeight: 700,
                cursor: reply.trim() ? "pointer" : "not-allowed",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {sending ? "Sending…" : "Send Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──
export default function SupportPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("faq"); // faq | tickets | new
  const [faqCat, setFaqCat] = useState("all");
  const [faqSearch, setFaqSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "normal",
    body: "",
  });

  const TICKET_CATEGORIES = [
    { id: "general", label: "General Inquiry" },
    { id: "deposit", label: "Deposit Issue" },
    { id: "transfer", label: "Transfer / Withdrawal" },
    { id: "account", label: "Account & Security" },
    { id: "technical", label: "Technical Problem" },
  ];

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const data = await api.getMyTickets();
      setTickets(data.length > 0 ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "tickets") loadTickets();
  }, [tab]);

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.body.trim()) {
      setError("Please fill in subject and message.");
      return;
    }
    setSubmitLoading(true);
    setError("");
    try {
      await api.createTicket(newTicket);
      setSuccessMsg("Ticket submitted! We usually respond within a few hours.");
      setNewTicket({
        subject: "",
        category: "general",
        priority: "normal",
        body: "",
      });
      setTimeout(() => {
        setSuccessMsg("");
        setTab("tickets");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReply = async (ticketId, body) => {
    await api.replyToTicket(ticketId, body);
    // Refresh the selected ticket
    const updated = await api.getTicket(ticketId);
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
  };

  const filteredFaq = FAQ_ITEMS.filter((item) => {
    const matchCat = faqCat === "all" || item.category === faqCat;
    const matchSearch =
      !faqSearch ||
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div
          style={{
            color: "rgba(148,163,184,0.6)",
            fontSize: "13px",
            marginBottom: "2px",
          }}
        >
          Need help?
        </div>
        <h1
          className="font-black text-white"
          style={{ fontSize: "26px", letterSpacing: "-0.02em" }}
        >
          Support Center
        </h1>
      </div>

      {/* Quick contact strip */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[
          {
            icon: "💬",
            label: "Live Chat",
            sub: "Avg. 5 min",
            color: "#34D399",
            bg: "rgba(16,185,129,0.08)",
            border: "rgba(16,185,129,0.2)",
          },
          {
            icon: "✉️",
            label: "Email Us",
            sub: "support@elitefinmarkets.com",
            color: "#60A5FA",
            bg: "rgba(37,99,235,0.08)",
            border: "rgba(37,99,235,0.2)",
          },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "14px",
              background: c.bg,
              border: `1px solid ${c.border}`,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>
              {c.icon}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: c.color }}>
              {c.label}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(148,163,184,0.5)",
                marginTop: "1px",
              }}
            >
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "20px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { id: "faq", label: "FAQ" },
          { id: "tickets", label: "My Tickets" },
          { id: "new", label: "+ New Ticket" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSelectedTicket(null);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "9px",
              borderRadius: "9px",
              border: "none",
              background:
                tab === t.id
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "transparent",
              color: tab === t.id ? "white" : "#94A3B8",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
              boxShadow:
                tab === t.id ? "0 2px 12px rgba(37,99,235,0.35)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "14px",
            color: "#F87171",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "14px",
            color: "#34D399",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      {/* ── FAQ Tab ── */}
      {tab === "faq" && (
        <>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <svg
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="15"
              height="15"
              fill="none"
              stroke="rgba(148,163,184,0.5)"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              placeholder="Search frequently asked questions…"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(10,18,40,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "11px 14px 11px 38px",
                color: "#E2E8F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(59,130,246,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.07)")
              }
            />
          </div>

          {/* Category pills */}
          <div
            style={{
              display: "flex",
              gap: "7px",
              marginBottom: "16px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setFaqCat(c.id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border:
                    faqCat === c.id
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    faqCat === c.id
                      ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                      : "rgba(255,255,255,0.04)",
                  color: faqCat === c.id ? "white" : "#94A3B8",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <span style={{ fontSize: "13px" }}>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>

          {filteredFaq.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "rgba(148,163,184,0.4)",
                fontSize: "14px",
              }}
            >
              No results for "{faqSearch}"
            </div>
          ) : (
            filteredFaq.map((item, i) => (
              <FaqItem key={i} item={item} index={i} />
            ))
          )}
        </>
      )}

      {/* ── My Tickets Tab ── */}
      {tab === "tickets" && (
        <>
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onBack={() => setSelectedTicket(null)}
              onReply={handleReply}
            />
          ) : ticketsLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "rgba(148,163,184,0.4)",
                fontSize: "14px",
              }}
            >
              Loading tickets…
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>🎫</div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#E2E8F0",
                  marginBottom: "6px",
                }}
              >
                No tickets yet
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.5)",
                  marginBottom: "20px",
                }}
              >
                Can't find your answer in the FAQ?
              </div>
              <button
                onClick={() => setTab("new")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Open a Ticket
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {tickets &&
                tickets?.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      background: "linear-gradient(135deg,#0F1629,#111827)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px",
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.13)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.07)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#E2E8F0",
                          flex: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {ticket.subject}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(148,163,184,0.4)",
                          textTransform: "capitalize",
                        }}
                      >
                        {ticket.category}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(148,163,184,0.35)",
                        }}
                      >
                        {new Date(ticket.updatedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                    {ticket.messages?.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "rgba(148,163,184,0.55)",
                          lineHeight: 1.4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.messages[ticket.messages.length - 1].body}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* ── New Ticket Tab ── */}
      {tab === "new" && (
        <>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94A3B8",
                marginBottom: "8px",
              }}
            >
              Category
            </label>
            <select
              value={newTicket.category}
              onChange={(e) =>
                setNewTicket((t) => ({ ...t, category: e.target.value }))
              }
              style={{
                width: "100%",
                background: "rgba(10,18,40,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "12px 14px",
                color: "#E2E8F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
              }}
            >
              {TICKET_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94A3B8",
                marginBottom: "8px",
              }}
            >
              Priority
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { id: "low", label: "Low", color: "#94A3B8" },
                { id: "normal", label: "Normal", color: "#60A5FA" },
                { id: "urgent", label: "Urgent", color: "#F87171" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setNewTicket((t) => ({ ...t, priority: p.id }))
                  }
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "10px",
                    border:
                      newTicket.priority === p.id
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                    background:
                      newTicket.priority === p.id
                        ? "rgba(37,99,235,0.15)"
                        : "rgba(255,255,255,0.03)",
                    color: newTicket.priority === p.id ? p.color : "#64748B",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    outline:
                      newTicket.priority === p.id
                        ? `1px solid ${p.color}40`
                        : "none",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94A3B8",
                marginBottom: "8px",
              }}
            >
              Subject
            </label>
            <input
              placeholder="Brief description of your issue"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket((t) => ({ ...t, subject: e.target.value }))
              }
              style={{
                width: "100%",
                background: "rgba(10,18,40,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "12px 14px",
                color: "#E2E8F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(59,130,246,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#94A3B8",
                marginBottom: "8px",
              }}
            >
              Message
            </label>
            <textarea
              placeholder="Describe your issue in detail. Include any relevant transaction IDs, amounts, or dates."
              value={newTicket.body}
              onChange={(e) =>
                setNewTicket((t) => ({ ...t, body: e.target.value }))
              }
              rows={5}
              style={{
                width: "100%",
                background: "rgba(10,18,40,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "12px 14px",
                color: "#E2E8F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                outline: "none",
                resize: "none",
                lineHeight: 1.6,
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(59,130,246,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
          </div>

          <button
            onClick={handleSubmitTicket}
            disabled={
              submitLoading ||
              !newTicket.subject.trim() ||
              !newTicket.body.trim()
            }
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background:
                newTicket.subject && newTicket.body
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "rgba(255,255,255,0.05)",
              color: newTicket.subject && newTicket.body ? "white" : "#64748B",
              fontSize: "15px",
              fontWeight: 700,
              cursor:
                newTicket.subject && newTicket.body ? "pointer" : "not-allowed",
              fontFamily: "Inter, sans-serif",
              boxShadow:
                newTicket.subject && newTicket.body
                  ? "0 4px 24px rgba(37,99,235,0.35)"
                  : "none",
            }}
          >
            {submitLoading ? "Submitting…" : "Submit Ticket"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              justifyContent: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="rgba(148,163,184,0.35)"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
            </svg>
            <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.4)" }}>
              Typical response time: 1–4 hours
            </span>
          </div>
        </>
      )}
    </AppShell>
  );
}
