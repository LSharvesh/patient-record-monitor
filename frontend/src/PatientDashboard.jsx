import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function PatientDashboard({ user, onLogout }) {
  const [coughSeverity, setCoughSeverity] = useState(3)
  const [breathingIssues, setBreathingIssues] = useState(false)
  const [chestPain, setChestPain] = useState(false)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    fetchHealthLogs()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  const fetchHealthLogs = async () => {
    try {
      const response = await axios.get(`/api/health/logs/${user.id}`, getAuthHeaders())
      if (response.data.success) {
        const logs = response.data.data.slice(0, 7).reverse() // Get last 7 days, reverse for chronological order
        const formattedData = logs.map(log => ({
          date: new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          severity: log.cough_severity
        }))
        setChartData(formattedData)
      }
    } catch (err) {
      console.error('Error fetching health logs:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('/api/health/logs', {
        cough_severity: coughSeverity,
        breathing_issues: breathingIssues,
        chest_pain: chestPain
      }, getAuthHeaders())

      if (response.data.success) {
        setMessage('Health log submitted successfully!')
        // Reset form
        setCoughSeverity(3)
        setBreathingIssues(false)
        setChestPain(false)
        // Refresh chart data
        fetchHealthLogs()
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting health log')
    } finally {
      setLoading(false)
    }
  }

  const handleEmergencyAlert = async () => {
    try {
      const response = await axios.post('/api/emergency/alert', {}, getAuthHeaders())
      if (response.data.success) {
        setShowEmergencyModal(true)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending emergency alert')
    }
  }

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('/api/reports/generate', {}, getAuthHeaders())
      if (response.data.success) {
        setShowReportModal(true)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error generating report')
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Patient Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <span className="membership-badge">{user.membership_type}</span>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Health Input Form */}
          <section className="dashboard-card">
            <h2>Daily Health Input</h2>
            <form onSubmit={handleSubmit} className="health-form">
              <div className="form-group">
                <label htmlFor="cough-severity">
                  Cough Severity (1-5): {coughSeverity}
                </label>
                <input
                  type="range"
                  id="cough-severity"
                  min="1"
                  max="5"
                  value={coughSeverity}
                  onChange={(e) => setCoughSeverity(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>1 (Mild)</span>
                  <span>5 (Severe)</span>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={breathingIssues}
                    onChange={(e) => setBreathingIssues(e.target.checked)}
                  />
                  <span>Breathing Issues</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={chestPain}
                    onChange={(e) => setChestPain(e.target.checked)}
                  />
                  <span>Chest Pain</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Health Log'}
              </button>
            </form>
          </section>

          {/* Progress Chart */}
          <section className="dashboard-card chart-card">
            <h2>7-Day Progress Chart</h2>
            <div className="chart-container">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="severity" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Cough Severity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No health log data available. Submit your first health log to see progress.</div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <section className="dashboard-card actions-card">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={handleEmergencyAlert} 
                className="btn btn-emergency"
              >
                🚨 Emergency Alert
              </button>
              <button 
                onClick={handleGenerateReport} 
                className="btn btn-primary"
              >
                📊 Generate Report
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Emergency Alert Modal */}
      {showEmergencyModal && (
        <div className="modal-overlay" onClick={() => setShowEmergencyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Emergency Alert Sent</h3>
            <p>Medical personnel have been notified. Help is on the way.</p>
            <button onClick={() => setShowEmergencyModal(false)} className="btn btn-primary">
              OK
            </button>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Report Generated Successfully</h3>
            <p>Your health report has been generated and is ready for download.</p>
            <button onClick={() => setShowReportModal(false)} className="btn btn-primary">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDashboard

