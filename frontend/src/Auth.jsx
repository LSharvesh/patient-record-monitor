import { useState } from 'react'
import axios from 'axios'

function Auth({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      })

      if (response.data.success) {
        onLogin(response.data.token, response.data.user)
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Breathe Right AI</h1>
        <p className="auth-subtitle">Lung Health Monitoring System</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-demo">
          <p className="demo-title">Demo Accounts:</p>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Patient:</strong> patient1 / password123
            </div>
            <div className="demo-account">
              <strong>Doctor:</strong> doctor1 / doctor123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth

