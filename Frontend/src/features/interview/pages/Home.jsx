import React, { useRef, useState, useCallback } from 'react'
import '../style/Home.scss'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import Loader from '../loader/Loader'

const Home = () => {
  const navigate = useNavigate()
  const { loading, generateReport } = useInterview()
  const { user, handleLogout } = useAuth()

  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")
  const [error, setError] = useState("")
  const resumeInputRef = useRef()

  const handleFileChange = useCallback(() => {
    const file = resumeInputRef.current?.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      setError("")
    }
  }, [])

  const handleGenerateReport = useCallback(async () => {
    setError("")
    const resumeFile = resumeInputRef.current?.files?.[0]

    if (!resumeFile) {
      setError("Please upload your resume before generating a report.")
      return
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.")
      return
    }

    const data = await generateReport({ jobDescription, selfDescription, resumeFile })

    if (!data?._id) {
      setError("Something went wrong. Please try again.")
      return
    }

    navigate(`/interview/${data._id}`)
  }, [jobDescription, selfDescription, generateReport, navigate])

  const onLogout = useCallback(async () => {
    await handleLogout()
    navigate('/login')
  }, [handleLogout, navigate])

  if (loading) return <Loader />

  return (
    <main className='home'>

      {/* ── Top bar ── */}
      <div className='home-topbar'>
        <div className='home-topbar__left'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span className='home-topbar__brand'>SkillBridge <strong>AI</strong></span>
        </div>
        <div className='home-topbar__right'>
          <button onClick={() => navigate('/reports')} className='home-topbar__btn'>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            My Reports
          </button>
          <div className='home-topbar__divider'/>
          <div className='home-topbar__user'>
            <div className='home-topbar__avatar'>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className='home-topbar__user-info'>
              <span className='home-topbar__user-name'>{user?.name || 'User'}</span>
              <button className='home-topbar__logout' onClick={onLogout}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="home-hero">
        <div className="home-hero__badge">AI-Powered Career Tool</div>
        <h1 className="home-hero__title">
          SkillBridge <span className="home-hero__title--accent">AI</span>
        </h1>
        <p className="home-hero__subtitle">
          Upload your resume, match it against any job description, and get a personalized report
          that <em>sharpens your skills</em> and <em>maximises your chances</em> of clearing interviews.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="interview-input-group">
        <div className="left">
          <label>Job Description</label>
          <textarea
            onChange={(e) => setJobDescription(e.target.value)}
            name='jobDescription'
            id='jobDescription'
            placeholder="Enter job description here"
          />
        </div>

        <div className="right">
          <div className="input-group">
            <p>Resume <small className='highlight'>(Use resume and self description together for best result)</small></p>
            <label className='file-label' htmlFor='resume'>
              {resumeFileName ? resumeFileName : "Upload Resume"}
            </label>
            <input
              hidden
              ref={resumeInputRef}
              id='resume'
              accept='.pdf'
              type='file'
              name='resume'
              onChange={handleFileChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor='selfDescription'>Self Description</label>
            <textarea
              onChange={(e) => setSelfDescription(e.target.value)}
              name='selfDescription'
              id='selfDescription'
              placeholder='Describe yourself in a few sentences'
            />
          </div>

          <button onClick={handleGenerateReport} className='button primary-button'>
            Generate Interview Report
          </button>
        </div>
      </div>
    </main>
  )
}

export default Home