export const Icon = {
  Logo: ({ size = 40, showText = true }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#1A56DB" />
        <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
      </svg>
      {showText && (
        <div>
          <div style={{ fontSize: "13px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>
            ELITE
          </div>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "#C9A227", letterSpacing: "0.12em", lineHeight: 1.3 }}>
            FINMARKETS
          </div>
        </div>
      )}
    </div>
  ),
  LogoMark: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1A56DB" />
      <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 32C16.686 32 14 29.314 14 26V14H20C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26H14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.5" fill="#C9A227" />
    </svg>
  ),
};
