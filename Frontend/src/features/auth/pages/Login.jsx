import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import Toast from '../components/Toast'
import { useAuth } from '../hooks/useAuth'
import AuthLoader from '../authLoader/AuthLoader'

const Login = () => {
  const navigate = useNavigate()
  const { loading, handleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await handleLogin({ email, password })
    if (data?.success) {
      setToast({ message: "Logged in successfully", type: 'success' })
      setTimeout(() => navigate('/'), 1000)
    } else {
      setToast({ message: data?.message })
    }
  }

  if (loading) {
    return (
       <AuthLoader/>
    )
  }

  return (
    <main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="form-container">

        {/* Brand */}
        <div className="brand-header">
          <h1 className="brand-name">
            <span>SkillBridge</span> <span>AI</span>
          </h1>
        </div>

        {/* Title */}
        <div>
          <h1>Welcome Back</h1>
          <p className="form-subtitle">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email here"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password here"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="#" className="forgot-link">Forgot password?</a>

          <button type="submit" className="button primary-button">Log In</button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login