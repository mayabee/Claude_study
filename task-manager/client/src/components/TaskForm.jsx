import { useState } from 'react'

function TaskForm({ categories, onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || '기타',
    dueDate: initialData?.dueDate || '',
  })
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return alert('할일을 입력하세요')
    onSubmit({
      ...form,
      category: showNewCategory ? newCategory : form.category,
      dueDate: form.dueDate || null,
    })
  }

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form className="task-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{initialData ? '할일 수정' : '새 할일 등록'}</h2>

        <label>할일 *</label>
        <input
          type="text"
          placeholder="할일을 입력하세요"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          autoFocus
        />

        <label>상세설명</label>
        <textarea
          placeholder="상세 내용을 입력하세요"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
        />

        <div className="form-row">
          <div>
            <label>우선순위</label>
            <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
              <option value="high">🔴 높음</option>
              <option value="medium">🟡 중간</option>
              <option value="low">🟢 낮음</option>
            </select>
          </div>

          <div>
            <label>
              카테고리
              <button type="button" className="btn-link" onClick={() => setShowNewCategory(!showNewCategory)}>
                {showNewCategory ? '목록에서 선택' : '+ 새 카테고리'}
              </button>
            </label>
            {showNewCategory ? (
              <input
                type="text"
                placeholder="새 카테고리 입력"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            ) : (
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <label>마감일 (선택)</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
        />

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? '수정' : '등록'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
