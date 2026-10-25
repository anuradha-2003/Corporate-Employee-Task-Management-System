
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function CreateTask() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    deadline: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      await axios.post(
        'http://localhost:5000/api/tasks',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      navigate('/tasks')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="task-page">
      <header className="task-page-header">
        <div>
          <h1>Create New Task</h1>
          <p>Plan your work, set priorities and manage your deadline.</p>
        </div>
      </header>

      <Link className="task-back-link" to="/tasks">
        ← Back to My Tasks
      </Link>

      <section className="task-form-panel">
        <div className="task-panel-heading">
          <h2>Task Information</h2>
          <span>Fill in the details below</span>
        </div>

        {error && <div className="task-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="task-form-grid">
            <div className="task-form-group full-width">
              <label htmlFor="title">Task Title *</label>
              <input
                className="task-input"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete MERN project frontend"
                required
                maxLength={100}
              />
            </div>

            <div className="task-form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                className="task-textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task and what needs to be completed..."
                required
              />
            </div>

            <div className="task-form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                className="task-input"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="task-form-group">
              <label htmlFor="status">Task Status *</label>
              <select
                className="task-input"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="task-form-group full-width">
              <label htmlFor="deadline">Deadline *</label>
              <input
                className="task-input"
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toLocaleDateString('en-CA')}
                required
              />
            </div>
          </div>

          <div className="task-form-actions">
            <Link className="task-secondary-btn" to="/tasks">
              Cancel
            </Link>
            <button
              className="task-primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreateTask
