import React, { useRef, useState } from 'react'
import '../style/Home.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router';
import Loader from '../loader/Loader';

const Home = () => {
  const navigate = useNavigate()
  const { loading, generateReport } = useInterview()

  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")
  const [error, setError] = useState("")
  const resumeInputRef = useRef()

  const handleFileChange = () => {
    const file = resumeInputRef.current.files[0]
    if (file) {
      setResumeFileName(file.name)
      setError("")
    }
  }

  const handleGenerateReport = async () => {
    setError("")

    const resumeFile = resumeInputRef.current.files[0]

    // validate before sending
    if (!resumeFile) {
      setError("Please upload your resume before generating a report.")
      return
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description.")
      return
    }

    const data = await generateReport({ jobDescription, selfDescription, resumeFile })

    // guard against failed request
    if (!data?._id) {
      setError("Something went wrong. Please try again.")
      return
    }

    navigate(`/interview/${data._id}`)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <main className='home'>
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

      {error && (
        <div className="error-banner">{error}</div>
      )}

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