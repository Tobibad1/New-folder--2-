import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_URL || '/api'

  useEffect(() => {
    const controller = new AbortController()

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiBase}/tasks`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to load tasks from backend')
        }

        const data = await response.json()
        setTasks(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()

    return () => {
      controller.abort()
    }
  }, [apiBase])

  const createTask = async (event) => {
    event.preventDefault()

    if (!newTitle.trim()) {
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const response = await fetch(`${apiBase}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          completed: false
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const createdTask = await response.json()
      setTasks((prevTasks) => [createdTask, ...prevTasks])
      setNewTitle('')
    } catch (createError) {
      setError(createError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTask = async (task) => {
    try {
      setError('')

      const response = await fetch(`${apiBase}/tasks/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !task.completed })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((currentTask) =>
          currentTask._id === updatedTask._id ? updatedTask : currentTask
        )
      )
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setError('')

      const response = await fetch(`${apiBase}/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <main className="task-app">
      <header className="task-header">
        <h1>Task Board</h1>
        <p>Frontend is now connected to your backend API.</p>
      </header>

      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Write a task title"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {error ? <p className="task-error">{error}</p> : null}
      {loading ? <p className="task-state">Loading tasks...</p> : null}

      {!loading && tasks.length === 0 ? (
        <p className="task-state">No tasks yet. Add your first one.</p>
      ) : null}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <label>
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => toggleTask(task)}
              />
              <span className={task.completed ? 'done' : ''}>{task.title}</span>
            </label>
            <button
              type="button"
              className="danger"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
