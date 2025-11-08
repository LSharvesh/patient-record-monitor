import { useState } from 'react'
import axios from 'axios'

function Chatbot({ user }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm Breathe Right AI assistant. How can I help you with your lung health today?" }
  ])
  const [loading, setLoading] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = message.trim()
    setMessage('')
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post('/api/chatbot/query', {
        message: userMessage
      }, getAuthHeaders())

      if (response.data.success) {
        setMessages(prev => [...prev, { type: 'bot', text: response.data.data.response }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>AI Health Assistant</h3>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="message-bubble loading">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="chatbot-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  )
}

export default Chatbot

