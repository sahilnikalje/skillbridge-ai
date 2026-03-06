import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import Loader from '../loader/Loader'
import '../style/Reports.scss'

const ScoreRing = ({ score }) => {
  const safeScore = Math.min(100, Math.max(0, score || 0))

  const color =
    safeScore >= 80 ? 'high' :
    safeScore >= 60 ? 'mid' : 'low'

  const accent =
    color === 'high' ? '#6382ff' :
    color === 'mid'  ? '#f59e0b' : '#f87171'

  const ringStyle = {
    background: `
      radial-gradient(circle at center, var(--bg-card, #13161f) 52%, transparent 53%),
      conic-gradient(from -90deg, ${accent} 0%, ${accent} ${safeScore}%, rgba(255,255,255,0.07) ${safeScore}%)
    `,
    boxShadow: `0 0 18px ${accent}33`
  }

  return (
    <div className={`report-card__ring report-card__ring--${color}`} style={ringStyle}>
      <span>{safeScore}</span>
      <small>%</small>
    </div>
  )
}

const EmptyState = ({ onNew }) => (
  <div className='reports-empty'>
    <div className='reports-empty__icon'>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    </div>
    <h3>No reports yet</h3>
    <p>Generate your first interview report to see it here.</p>
    <button className='button primary-button' onClick={onNew}>
      Generate Report
    </button>
  </div>
)

const Reports = () => {
  const navigate = useNavigate()
  const { reports, getReports, loading } = useInterview()
  const { user, handleLogout } = useAuth()

  const onLogout = useCallback(async () => {
    await handleLogout()
    navigate('/login')
  }, [handleLogout, navigate])

  if (loading) return <Loader />

  return (
    <div className='reports-page'>

      {/* ── Header ── */}
      <header className='reports-header'>
        <div className='reports-header__left'>
          <div className='nav-brand'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>SkillBridge <strong>AI</strong></span>
          </div>
          <div className='reports-header__meta'>
            <h1>My Reports</h1>
            {reports?.length > 0 && (
              <span className='reports-header__count'>
                {reports.length} report{reports.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className='reports-header__right'>
          <button
            className='button primary-button reports-header__cta'
            onClick={() => navigate('/')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.5rem'}}>
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Report
          </button>

          <div className='reports-header__user'>
            <div className='reports-header__avatar'>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className='reports-header__user-info'>
              <span className='reports-header__user-name'>{user?.name || 'User'}</span>
              <button className='reports-header__logout' onClick={onLogout}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='reports-header__divider'/>

      {/* ── Content ── */}
      <main className='reports-content'>
        {!reports || reports.length === 0 ? (
          <EmptyState onNew={() => navigate('/')} />
        ) : (
          <div className='reports-grid'>
            {reports.map((report, i) => (
              <div
                key={report._id}
                className='report-card'
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className='report-card__top'>
                  <div className='report-card__info'>
                    <span className='report-card__badge'>Interview Report</span>
                    <h2 className='report-card__title'>{report.title}</h2>
                    <p className='report-card__date'>
                      {new Date(report.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <ScoreRing score={report.matchScore} />
                </div>

                <div className='report-card__divider' />

                <div className='report-card__footer'>
                  <div className='report-card__stats'>
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      {report.technicalQuestions?.length ?? '—'} technical
                    </span>
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {report.behaviouralQuestions?.length ?? '—'} behavioural
                    </span>
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      {report.preparationPlan?.length ?? '—'}-day plan
                    </span>
                  </div>
                  <span className='report-card__arrow'>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Reports