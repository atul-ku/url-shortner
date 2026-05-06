import { useState, useEffect } from 'react'

export default function Navbar() {
  const [healthy, setHealthy] = useState<boolean | null>(null)

  // Poll the /health endpoint every 30s to show a live status dot
  useEffect(() => {
    const check = () =>
      fetch('/health')
        .then(r => setHealthy(r.ok))
        .catch(() => setHealthy(false))
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  const dotColor =
    healthy === null ? '#5A6A8A' : healthy ? '#00E5A0' : '#FF5F7E'

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', borderBottom: '1px solid var(--border)',
      position: 'relative', zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
        }}>⚡</div>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.5px' }}>
          Snip
          <span style={{
            background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>ly</span>
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        padding: '6px 14px', borderRadius: 20,
        border: '1px solid var(--border)', color: 'var(--muted)',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: dotColor, display: 'inline-block',
          boxShadow: healthy ? `0 0 6px ${dotColor}` : 'none',
          transition: 'all .3s',
        }}/>
        {healthy === null ? 'checking...' : healthy ? 'API online' : 'API offline'}
      </div>
    </nav>
  )
}