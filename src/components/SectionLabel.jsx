export default function SectionLabel({ children }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
      style={{
        background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(59,130,246,0.08))',
        border: '1px solid rgba(37,99,235,0.25)',
        color: '#60A5FA',
        letterSpacing: '0.12em',
      }}
    >
      {children}
    </span>
  )
}
