import { useState } from 'react'
import type { Model } from '../../constants/models'

interface InlineSelectProps {
  value: string
  onChange: (v: string) => void
  options: Model[]
  label?: string
}

/**
 * A portal-free dropdown that renders its list inline in the DOM tree.
 * MUI's Select uses a Portal (appended to document.body), which breaks
 * click handling in Electron transparent overlay windows.
 */
export function InlineSelect({ value, onChange, options, label = 'Select' }: InlineSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.id === value)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8.5px 14px',
          border: open ? '2px solid #6366f1' : '1px solid rgba(0,0,0,0.23)',
          borderRadius: '8px',
          cursor: 'pointer',
          background: '#fff',
          fontSize: '0.875rem',
          color: '#1f2937',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
          userSelect: 'none',
        }}
      >
        <span>{selected?.name ?? 'Select…'}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            color: '#6b7280',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {/* Floating label */}
      <label
        style={{
          position: 'absolute',
          top: open || value ? '-9px' : '50%',
          left: '10px',
          transform: open || value ? 'translateY(0) scale(0.75)' : 'translateY(-50%) scale(1)',
          transformOrigin: 'left',
          background: '#fff',
          padding: '0 4px',
          color: open ? '#6366f1' : 'rgba(0,0,0,0.6)',
          fontSize: '1rem',
          transition: 'all 0.15s',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>

      {/* Inline option list */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {options.map(o => (
            <div
              key={o.id}
              onClick={() => { onChange(o.id); setOpen(false) }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#1f2937',
                background: o.id === value ? '#f0f0ff' : 'transparent',
                fontWeight: o.id === value ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (o.id !== value) (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = o.id === value ? '#f0f0ff' : 'transparent'
              }}
            >
              {o.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
