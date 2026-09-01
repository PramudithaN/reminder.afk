import { useState } from 'react'
import { useTheme } from '@mui/material'
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
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main
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
          border: open ? `1px solid ${primaryColor}` : '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          cursor: 'pointer',
          background: '#1a1a1a',
          fontSize: '0.875rem',
          color: '#f3f4f6',
          fontFamily: 'inherit',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          boxShadow: open ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
        }}
      >
        <span>{selected?.name ?? 'Select…'}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            color: '#9ca3af',
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
          background: 'rgba(16, 16, 16, 0.96)',
          padding: '0 4px',
          color: open ? primaryColor : '#9ca3af',
          fontSize: '1rem',
          transition: 'all 0.15s',
          pointerEvents: 'none',
          borderRadius: '2px',
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
            background: '#181818',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
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
                fontSize: '0.9rem',
                color: o.id === value ? primaryColor : '#e5e7eb',
                background: o.id === value ? `${primaryColor}25` : 'transparent',
                fontWeight: o.id === value ? 600 : 400,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => {
                if (o.id !== value) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.08)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = o.id === value ? `${primaryColor}25` : 'transparent'
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
