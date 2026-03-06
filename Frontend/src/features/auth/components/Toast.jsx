import { useEffect, useState } from 'react'

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M6 6L12 12M12 6L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L16.5 15H1.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.3" />
      <path d="M9 7V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="12.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path d="M9 8V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="0.8" fill="currentColor" />
    </svg>
  ),
}

const THEMES = {
  success: {
    color: '#34d399',
    glow: 'rgba(52,211,153,0.18)',
    bg: 'rgba(52,211,153,0.07)',
    border: 'rgba(52,211,153,0.18)',
    label: 'Success',
  },
  error: {
    color: '#f87171',
    glow: 'rgba(248,113,113,0.18)',
    bg: 'rgba(248,113,113,0.07)',
    border: 'rgba(248,113,113,0.18)',
    label: 'Error',
  },
  warning: {
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.18)',
    bg: 'rgba(251,191,36,0.07)',
    border: 'rgba(251,191,36,0.18)',
    label: 'Warning',
  },
  info: {
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.18)',
    bg: 'rgba(129,140,248,0.07)',
    border: 'rgba(129,140,248,0.18)',
    label: 'Info',
  },
}

const Toast = ({ message, type = 'error', onClose }) => {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const t = THEMES[type] || THEMES.error

  useEffect(() => {
    // Slight delay so enter animation always fires
    const enterTimer = setTimeout(() => setVisible(true), 10)
    const exitTimer = setTimeout(() => handleClose(), 3800)
    return () => { clearTimeout(enterTimer); clearTimeout(exitTimer) }
  }, [])

  const handleClose = () => {
    setExiting(true)
    setTimeout(onClose, 400)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        @keyframes toastIn {
          0%   { transform: translateX(calc(100% + 32px)) scale(0.94); opacity: 0; }
          60%  { transform: translateX(-6px) scale(1.01); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes toastOut {
          0%   { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(calc(100% + 32px)) scale(0.94); opacity: 0; }
        }
        @keyframes drainBar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        @keyframes iconPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .toast-root {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          width: clamp(280px, 90vw, 380px);
          font-family: 'Poppins', sans-serif;
          animation: ${exiting ? 'toastOut' : visible ? 'toastIn' : 'none'} 
                     ${exiting ? '0.4s' : '0.5s'} 
                     cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .toast-inner {
          position: relative;
          overflow: hidden;
          background: rgba(8, 7, 18, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid ${t.border};
          border-radius: 18px;
          padding: 14px 14px 14px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 8px 32px rgba(0,0,0,0.6),
            0 0 40px ${t.glow},
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* Top shimmer line */
        .toast-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, ${t.color}, transparent);
          opacity: 0.7;
          animation: pulseGlow 2.5s ease-in-out infinite;
        }

        /* Subtle corner glow */
        .toast-inner::after {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, ${t.glow} 0%, transparent 70%);
          pointer-events: none;
        }

        .toast-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: ${t.bg};
          border: 1px solid ${t.border};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${t.color};
          flex-shrink: 0;
          box-shadow: 0 0 16px ${t.glow};
          animation: iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
          position: relative;
          z-index: 1;
        }

        .toast-body {
          flex: 1;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .toast-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${t.color};
          margin-bottom: 2px;
          opacity: 0.9;
        }

        .toast-msg {
          font-size: 0.82rem;
          color: rgba(200, 205, 230, 0.9);
          font-weight: 400;
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .toast-close {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          color: rgba(150,155,185,0.6);
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          padding: 0;
          position: relative;
          z-index: 1;
        }

        .toast-close:hover {
          color: rgba(200,205,230,0.9);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
          transform: scale(1.08);
        }

        .toast-bar-track {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.04);
        }

        .toast-bar {
          height: 100%;
          width: 100%;
          transform-origin: left;
          background: linear-gradient(90deg, ${t.color}aa, ${t.color});
          animation: drainBar 3.8s linear forwards;
          border-radius: 0 2px 2px 0;
        }
      `}</style>

      <div className="toast-root" role="alert" aria-live="polite">
        <div className="toast-inner">
          <div className="toast-icon-wrap">
            {ICONS[type] || ICONS.error}
          </div>

          <div className="toast-body">
            <div className="toast-label">{t.label}</div>
            <div className="toast-msg" title={message}>{message}</div>
          </div>

          <button className="toast-close" onClick={handleClose} aria-label="Close notification">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div className="toast-bar-track">
            <div className="toast-bar" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Toast