import { useState } from 'react'
import type { ShortenResponse } from '../api/client'

interface Props {
  result: ShortenResponse
  onDelete: () => void
}

export default function ResultCard({ result, onDelete }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.short_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createdDate = new Date(result.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="animate-up grad-border" style={{
      width: '100%', maxWidth: 640, marginTop: 28,
      background: 'var(--surface)',
    }}>
      <div style={{ padding: 24 }}>
        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 10,
        }}>
          ✦ Your short link is ready
        </div>

        {/* Short URL row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <a
            href={result.short_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600,
              color: 'var(--cyan)', flex: 1, wordBreak: 'break-all',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {result.short_url}
          </a>
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0, padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
              background: 'var(--surface2)',
              color: copied ? 'var(--green)' : 'var(--text)',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all .2s',
            }}
          >
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

        {/* Stats boxes */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { val: '0',         col: 'var(--cyan)',   key: 'Total clicks' },
            { val: createdDate, col: 'var(--violet)', key: 'Created' },
            { val: '∞',         col: 'var(--coral)',  key: 'Expires' },
          ].map(({ val, col, key }) => (
            <div key={key} style={{
              flex: 1, background: 'var(--surface2)',
              borderRadius: 'var(--radius-sm)', padding: '14px 16px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600,
                color: col, marginBottom: 4,
              }}>{val}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{key}</div>
            </div>
          ))}
        </div>

        {/* Original URL row */}
        <div style={{
          padding: '12px 14px', background: 'var(--surface2)',
          borderRadius: 'var(--radius-sm)', display: 'flex',
          gap: 8, alignItems: 'flex-start',
        }}>
          <span style={{ color: 'var(--violet)', flexShrink: 0 }}>↗</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--muted)', wordBreak: 'break-all',
          }}>
            {result.original_url}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          style={{
            marginTop: 16, padding: '8px 16px',
            borderRadius: 8, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--muted)',
            fontSize: 12, fontFamily: 'var(--font-mono)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--coral)'
            e.currentTarget.style.color = 'var(--coral)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--muted)'
          }}
        >
          ✕ Delete this link
        </button>
      </div>
    </div>
  )
}