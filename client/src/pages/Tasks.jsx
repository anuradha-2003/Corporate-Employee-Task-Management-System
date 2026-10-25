
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await axios.get(
        'http://localhost:5000/api/tasks',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = response.data
      setTasks(Array.isArray(data) ? data : data.tasks || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')

      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      await fetchTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task.')
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      const token = localStorage.getItem('token')

      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      await fetchTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.')
    }
  }

  const pending = tasks.filter((task) => task.status === 'To Do').length
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length
  const completed = tasks.filter((task) => task.status === 'Completed').length

  return (
    <main className="task-page">
      <header className="task-page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Organize your work and track your daily productivity.</p>
        </div>
        <Link className="task-primary-btn" to="/tasks/new">
          + Create New Task
        </Link>
      </header>

      <Link className="task-back-link" to="/">← Back to Dashboard</Link>

      <section className="task-summary-grid">
        <div className="task-summary-card">
          <p>Total Tasks</p>
          <h2>{tasks.length}</h2>
        </div>
        <div className="task-summary-card">
          <p>Pending Tasks</p>
          <h2>{pending}</h2>
        </div>
        <div className="task-summary-card">
          <p>Completed Tasks</p>
          <h2>{completed}</h2>
        </div>
      </section>

      <section className="task-panel">
        <div className="task-panel-heading">
          <h2>Task Overview</h2>
          <span>{inProgress} in progress</span>
        </div>

        {error && <div className="task-error" role="alert">{error}</div>}

        {loading ? (
          <div className="task-empty-state">Loading your tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="task-empty-state">
            <h3>No tasks yet</h3>
            <p>Create your first task to get started.</p>
            <Link className="task-primary-btn" to="/tasks/new">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="task-table-wrap">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task Details</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.description}</div>
                    </td>
                    <td>{task.priority}</td>
                    <td>
                      <select
                        className="task-select"
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        aria-label={`Status for ${task.title}`}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <button
                        className="task-delete-btn"
                        type="button"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default Tasks
