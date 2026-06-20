export default function PrimaryButton({ children, className = '', onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-bold text-white rounded-xl transition-all duration-200 ${className}`}
      style={{
        background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
        boxShadow: '0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'linear-gradient(135deg,#3B82F6,#2563EB)'
        e.currentTarget.style.boxShadow = '0 6px 32px rgba(37,99,235,0.6), inset 0 1px 0 rgba(255,255,255,0.15)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'linear-gradient(135deg,#2563EB,#1D4ED8)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </button>
  )
}
