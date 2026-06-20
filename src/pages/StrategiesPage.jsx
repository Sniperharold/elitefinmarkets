import AppShell from '../components/AppShell.jsx'

const strategies = [
  {
    id: 1,
    icon: '❄️',
    name: 'Cold Specialist',
    tag: 'FOREX',
    tagColor: '#60A5FA',
    return180: '+214%',
    returnColor: '#34D399',
    winRate: '87%',
    trades: 1243,
    drawdown: '4.2%',
    status: 'Active',
    description: 'Low-frequency mean-reversion strategy targeting major forex pairs during volatility compression.',
    barWidth: '85%',
    barColor: 'linear-gradient(90deg,#10B981,#34D399)',
    subscribed: true,
  },
  {
    id: 2,
    icon: '⚡',
    name: 'VIX Volatility',
    tag: 'INDICES',
    tagColor: '#A78BFA',
    return180: '+187%',
    returnColor: '#34D399',
    winRate: '79%',
    trades: 2891,
    drawdown: '6.8%',
    status: 'Active',
    description: 'Exploits VIX spikes on US equity indices. Thrives in high-uncertainty market regimes.',
    barWidth: '78%',
    barColor: 'linear-gradient(90deg,#7C3AED,#A78BFA)',
    subscribed: true,
  },
  {
    id: 3,
    icon: '🔷',
    name: 'Alpn',
    tag: 'MULTI',
    tagColor: '#22D3EE',
    return180: '+68%',
    returnColor: '#34D399',
    winRate: '72%',
    trades: 430,
    drawdown: '3.1%',
    status: 'Active',
    description: 'Alpha generation across uncorrelated assets. Low drawdown, steady compounding.',
    barWidth: '45%',
    barColor: 'linear-gradient(90deg,#06B6D4,#60A5FA)',
    subscribed: false,
  },
  {
    id: 4,
    icon: '🔥',
    name: 'Momentum Pro',
    tag: 'COMMODITIES',
    tagColor: '#F97316',
    return180: '+142%',
    returnColor: '#34D399',
    winRate: '81%',
    trades: 1670,
    drawdown: '7.4%',
    status: 'Active',
    description: 'Trend-following across energy and metals markets using proprietary momentum signals.',
    barWidth: '70%',
    barColor: 'linear-gradient(90deg,#EA580C,#FB923C)',
    subscribed: false,
  },
  {
    id: 5,
    icon: '🌙',
    name: 'Night Scalper',
    tag: 'FOREX',
    tagColor: '#818CF8',
    return180: '+93%',
    returnColor: '#34D399',
    winRate: '91%',
    trades: 4200,
    drawdown: '2.1%',
    status: 'Active',
    description: 'Asian session scalper. High win-rate, small targets, minimal overnight risk exposure.',
    barWidth: '60%',
    barColor: 'linear-gradient(90deg,#4F46E5,#818CF8)',
    subscribed: false,
  },
]

const cardStyle = {
  background: 'linear-gradient(135deg,#0F1629,#111827)',
  border: '1px solid #1E2A47',
  borderRadius: '18px',
}

function StatPill({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '7px 10px', minWidth: 0 }}>
      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>{value}</div>
    </div>
  )
}

export default function StrategiesPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div style={{ color: 'rgba(148,163,184,0.6)', fontSize: '13px', marginBottom: '2px' }}>AI Strategies</div>
          <h1 className="font-black text-white" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>Strategies</h1>
        </div>
        <div style={{
          background: 'rgba(37,99,235,0.12)',
          border: '1px solid rgba(37,99,235,0.25)',
          borderRadius: '10px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#60A5FA',
        }}>
          5 Active
        </div>
      </div>

      {/* Filter pills */}
      {['All', 'Subscribed', 'Forex', 'Indices', 'Commodities'].map((f, i) => (
        <span
          key={f}
          style={{
            display: 'inline-block',
            marginRight: '8px',
            marginBottom: '16px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            background: i === 0 ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : 'rgba(255,255,255,0.04)',
            border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
            color: i === 0 ? 'white' : '#94A3B8',
            boxShadow: i === 0 ? '0 2px 12px rgba(37,99,235,0.35)' : 'none',
          }}
        >
          {f}
        </span>
      ))}

      {/* Strategy cards */}
      <div className="space-y-4">
        {strategies.map((s) => (
          <div key={s.id} style={cardStyle} className="p-5">
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
                <div>
                  <div className="font-bold text-white" style={{ fontSize: '15px' }}>{s.name}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: s.tagColor, letterSpacing: '0.1em' }}>{s.tag}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ fontSize: '22px', fontWeight: 900, color: s.returnColor }}>{s.return180}</div>
                {s.subscribed ? (
                  <div style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#34D399',
                  }}>ON</div>
                ) : (
                  <div style={{
                    background: 'rgba(37,99,235,0.12)',
                    border: '1px solid rgba(37,99,235,0.25)',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#60A5FA',
                    cursor: 'pointer',
                  }}>ADD</div>
                )}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'rgba(148,163,184,0.65)', lineHeight: 1.55, marginBottom: '12px' }}>{s.description}</p>

            {/* Stats */}
            <div className="flex gap-2 mb-3">
              <StatPill label="Win Rate" value={s.winRate} />
              <StatPill label="Trades" value={s.trades.toLocaleString()} />
              <StatPill label="Max DD" value={s.drawdown} />
            </div>

            {/* Progress bar */}
            <div style={{ height: '3px', background: '#1E2A47', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: s.barWidth, background: s.barColor, borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
