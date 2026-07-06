import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    to: "/dashboard",
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? "#1A56DB" : "rgba(100,116,139,0.7)"} strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Accounts",
    to: "/wallet",
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? "#1A56DB" : "rgba(100,116,139,0.7)"} strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: "Fund",
    to: "/deposit",
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? "#1A56DB" : "rgba(100,116,139,0.7)"} strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Support",
    to: "/support",
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? "#1A56DB" : "rgba(100,116,139,0.7)"} strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Cards",
    to: "/cards",
    icon: (active) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={active ? "#1A56DB" : "rgba(100,116,139,0.7)"} strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 15h4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 flex items-center justify-around"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "430px",
        background: "rgba(6,11,24,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 0 20px",
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.to || (item.to === "/deposit" && pathname === "/deposit");
        return (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center gap-1 px-2 py-1"
            style={{ textDecoration: "none" }}
          >
            <div style={active ? { filter: "drop-shadow(0 0 6px rgba(26,86,219,0.6))" } : {}}>
              {item.icon(active)}
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: active ? "#1A56DB" : "rgba(100,116,139,0.7)",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
