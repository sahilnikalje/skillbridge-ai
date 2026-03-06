import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import Toast from '../components/Toast'
import { useAuth } from '../hooks/useAuth'
import AuthLoader from '../authLoader/AuthLoader'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister, loading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await handleRegister({ name, email, password })
    if (data?.success) {
      setToast({ message: "Registered successfully", type: "success" })
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
          <p className="brand-tagline">Practice interviews with AI</p>
        </div>

        {/* Inner nested card — matches the design exactly */}
        <div className="inner-card">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Password"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Confirm Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="button primary-button">Register</button>
          </form>
        </div>

        <p>Already have an account? <Link to="/login">Log in</Link></p>

      </div>
    </main>
  )
}

export default Register