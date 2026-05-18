import { useState, useEffect, useCallback } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'
import './styles/app.css'

const API_URL = import.meta.env.VITE_API_URL || ''
const ALLOWED_EMAIL = 'thdwld@gmail.com'

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      setLoginError('')
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login failed:', error)
      setLoginError(`${error.code}: ${error.message}`)
    }
  }

  const handleLogout = () => signOut(auth)

  if (authLoading) {
    return <div className="login-screen"><p>로딩 중...</p></div>
  }

  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h1>📋 업무 관리</h1>
          <p>Google 계정으로 로그인해주세요</p>
          <button className="btn-google" onClick={handleLogin}>
            Google 로그인
          </button>
          {loginError && <p style={{color:'red', marginTop:'12px', fontSize:'0.85rem', wordBreak:'break-all'}}>{loginError}</p>}
        </div>
      </div>
    )
  }

  if (user.email !== ALLOWED_EMAIL) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h1>⛔ 접근 불가</h1>
          <p>허용되지 않은 계정입니다: {user.email}</p>
          <button className="btn-google" onClick={handleLogout}>
            다른 계정으로 로그인
          </button>
        </div>
      </div>
    )
  }

  return <TaskManager user={user} onLogout={handleLogout} />
}

function TaskManager({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    showArchived: false,
  })
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [categories, setCategories] = useState(['개발', '회의', '문서', '기타'])

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters.status !== 'all') params.set('status', filters.status)
    if (filters.priority !== 'all') params.set('priority', filters.priority)
    if (filters.category !== 'all') params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.showArchived) params.set('showArchived', 'true')

    try {
      const res = await fetch(`${API_URL}/api/tasks?${params}`)
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`)
      const data = await res.json()
      if (data.length > 0) {
        setCategories([...new Set([...data, '개발', '회의', '문서', '기타'])])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchCategories()
  }, [fetchTasks])

  const createTask = async (task) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (res.ok) {
        setShowForm(false)
        fetchTasks()
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const updateTask = async (id, updates) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      setEditingTask(null)
      fetchTasks()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' })
      fetchTasks()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const reorderTasks = async (orderedIds) => {
    try {
      await fetch(`${API_URL}/api/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      })
    } catch (error) {
      console.error('Failed to reorder:', error)
    }
  }

  const uploadFile = async (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/upload`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) fetchTasks()
    } catch (error) {
      console.error('Failed to upload:', error)
    }
  }

  const addDriveLink = async (taskId, name, url) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/drive-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url }),
      })
      if (res.ok) fetchTasks()
    } catch (error) {
      console.error('Failed to add drive link:', error)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 업무 관리</h1>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button className="btn-logout" onClick={onLogout}>로그아웃</button>
          <button className="btn-add" onClick={() => { setEditingTask(null); setShowForm(true) }}>
            + 새 할일
          </button>
        </div>
      </header>

      <SearchBar
        value={filters.search}
        onChange={(search) => setFilters(prev => ({ ...prev, search }))}
      />

      <FilterBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />

      {showForm && (
        <TaskForm
          categories={categories}
          onSubmit={createTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      <TaskList
        tasks={tasks}
        editingTask={editingTask}
        categories={categories}
        onEdit={setEditingTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onReorder={reorderTasks}
        onUpload={uploadFile}
        onAddDriveLink={addDriveLink}
      />
    </div>
  )
}

export default App
