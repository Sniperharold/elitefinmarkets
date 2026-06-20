import BottomNav from './BottomNav.jsx'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen font-inter" style={{ background: '#070A12', color: '#E2E8F0' }}>
      <div
        className="mx-auto flex flex-col"
        style={{
          maxWidth: '430px',
          minHeight: '100vh',
          background: '#0A0D14',
          boxShadow: '0 0 80px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex-1 overflow-y-auto pb-28 px-5 pt-8" style={{ scrollbarWidth: 'none' }}>
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
