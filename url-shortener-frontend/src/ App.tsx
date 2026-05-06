import { useState } from 'react'
import Navbar from './components/Navbar'
import ResultCard from './components/ResultCard'
import { useUrlShortener } from './hooks/useUrlShortener'
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [inputError, setInputError] = useState(false)
  const { result, loading, error, shorten, remove, reset } = useUrlShortener()

  const handleShorten = async () => {
    try { new URL(inputUrl) } catch {
      setInputError(true)
      setTimeout(() => setInputError(false), 1000)
      toast.error('Please enter a valid URL.')
      return
    }
    await shorten(inputUrl)
    setInputUrl('');
    toast.success('URL shortened successfully!')
  }

  const handleDelete = async () => {
    if (result) {
      await remove(result.short_code)
      setInputUrl('')
      reset()
      toast.success('URL deleted successfully!')
    }
  }

  return (
    <>
      <Toaster />

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        {/* Hero section */}
        <main style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 24px 40px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.15em',
            color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 20, opacity: .85,
          }}>
            ✦ Open Source URL Shortener
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 6vw, 70px)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 40,
          }}>
            Shorten. Share.<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 50%, var(--coral) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Track everything.
            </span>
          </h1>

          {/* Input card */}
          <div style={{
            width: '100%', maxWidth: 640,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 8,
            display: 'flex', gap: 8, alignItems: 'center',
            boxShadow: '0 0 0 1px rgba(0,217,255,.04), 0 24px 60px rgba(0,0,0,.5)',
            outline: inputError ? '1.5px solid var(--coral)' : 'none',
            transition: 'outline .2s',
          }}>
            <input
              type="url"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleShorten()}
              placeholder="https://your-very-long-url.com/goes/here..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 14,
                color: 'var(--text)', padding: '14px 16px',
                caretColor: 'var(--cyan)',
              }}
            />
            <button
              onClick={handleShorten}
              disabled={loading || !inputUrl.trim()}
              style={{
                flexShrink: 0, padding: '14px 28px',
                borderRadius: 'var(--radius-md)', border: 'none',
                background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
                color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '.02em',
                opacity: loading || !inputUrl.trim() ? .6 : 1,
                transition: 'opacity .2s, transform .1s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {loading ? 'Shortening...' : 'Shorten →'}
            </button>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--muted)', opacity: .7, marginTop: 14,
          }}>
            No account needed · Links never expire by default
          </div>

          {error && (
            <div className="animate-up" style={{
              marginTop: 16, padding: '12px 20px',
              background: 'rgba(255,95,126,.08)', border: '1px solid rgba(255,95,126,.3)',
              borderRadius: 'var(--radius-sm)', color: 'var(--coral)',
              fontFamily: 'var(--font-mono)', fontSize: 13,
            }}>
              ⚠ {error}
            </div>
          )}

          {result && <ResultCard result={result} onDelete={handleDelete} />}
        </main>

        {/* Features section */}
        <section style={{
          padding: '40px 24px', background: 'var(--surface)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em' }}>
            Built for developers, by a developer.
          </h2>
        </section>

        <footer style={{
          padding: '24px', textAlign: 'center',
          fontSize: 14, color: 'var(--muted)',
        }}>
          Made with 💖 by <a href="https://www.linkedin.com/in/atul-kumar-mnnit/" target="_blank" rel="noopener noreferrer">Atul</a>
        </footer>
      </div>
    </>
  )
}