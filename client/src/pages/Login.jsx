
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      )

      const data = response.data
      const token =
        data.token || data.data?.token || data.accessToken

      if (!token) {
        setError(
          data.message ||
            'Login response did not contain an authentication token.'
        )
        return
      }

      localStorage.setItem('token', token)

      const user = data.user || data.data?.user

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Unable to login. Please check your email and password, and make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">TaskFlow</div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Sign in to manage your tasks and productivity.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
