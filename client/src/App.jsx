
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateTask from './pages/CreateTask'
import './App.css'
import Tasks from './pages/Tasks'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/tasks/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setStats(response.data)
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
          return
        }

        setError(
          err.response?.data?.message ||
          'Unable to load task statistics.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const cards = [
    ['Total Tasks', stats.totalTasks, 'blue'],
    ['Pending Tasks', stats.pendingTasks, 'orange'],
    ['In Progress', stats.inProgressTasks, 'purple'],
    ['Completed', stats.completedTasks, 'green'],
    ['Overdue Tasks', stats.overdueTasks, 'red'],
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>TaskFlow</h2>
        <p className="company">Employee Productivity</p>

        <nav>
          <Link className="active" to="/">Dashboard</Link>
          <Link to="/tasks">My Tasks</Link>
          <Link to="/tasks/new">Create Task</Link>
          <button type="button" onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Employee Dashboard</h1>
            <p>Manage your tasks and track your productivity.</p>
          </div>
        </header>

        <section className="welcome">
          <div>
            <h2>Welcome Back!</h2>
            <p>Here is an overview of your daily work.</p>
          </div>
        </section>

        {error && <p role="alert">{error}</p>}

        <section className="stats-grid">
          {cards.map(([title, count, color]) => (
            <div className={`stat-card ${color}`} key={title}>
              <p>{title}</p>
              <h2>{loading ? '...' : count}</h2>
              <span>{loading ? 'Loading...' : 'Tasks overview'}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
