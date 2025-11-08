import { useState, useEffect } from 'react'
import axios from 'axios'

function DoctorDashboard({ user, onLogout }) {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientLogs, setPatientLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients', getAuthHeaders())
      if (response.data.success) {
        setPatients(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching patients')
    }
  }

  const fetchPatientLogs = async (patientId) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`/api/health/logs/${patientId}`, getAuthHeaders())
      if (response.data.success) {
        setPatientLogs(response.data.data)
        setSelectedPatient(patientId)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching patient logs')
    } finally {
      setLoading(false)
    }
  }

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId)
    return patient ? patient.name : 'Unknown'
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Doctor Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {error && (
          <div className="message error">{error}</div>
        )}

        <div className="dashboard-grid">
          {/* Patient List */}
          <section className="dashboard-card">
            <h2>All Patients</h2>
            <div className="patient-list">
              {patients.length > 0 ? (
                patients.map(patient => (
                  <div 
                    key={patient.id} 
                    className={`patient-item ${selectedPatient === patient.id ? 'selected' : ''}`}
                    onClick={() => fetchPatientLogs(patient.id)}
                  >
                    <div className="patient-info">
                      <h3>{patient.name}</h3>
                      <p className="patient-details">
                        <span>ID: {patient.id}</span>
                        <span className="membership-badge">{patient.membership_type}</span>
                      </p>
                    </div>
                    <div className="patient-arrow">→</div>
                  </div>
                ))
              ) : (
                <div className="no-data">No patients found</div>
              )}
            </div>
          </section>

          {/* Patient Health Logs */}
          <section className="dashboard-card logs-card">
            <h2>
              {selectedPatient ? `${getPatientName(selectedPatient)}'s Health Logs` : 'Select a Patient'}
            </h2>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : selectedPatient && patientLogs.length > 0 ? (
              <div className="logs-list">
                {patientLogs.map(log => (
                  <div key={log.id} className="log-item">
                    <div className="log-header">
                      <span className="log-date">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="log-details">
                      <div className="log-detail">
                        <strong>Cough Severity:</strong> {log.cough_severity}/5
                      </div>
                      <div className="log-detail">
                        <strong>Breathing Issues:</strong> {log.breathing_issues ? 'Yes' : 'No'}
                      </div>
                      <div className="log-detail">
                        <strong>Chest Pain:</strong> {log.chest_pain ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedPatient ? (
              <div className="no-data">No health logs available for this patient</div>
            ) : (
              <div className="no-data">Click on a patient to view their health logs</div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard

