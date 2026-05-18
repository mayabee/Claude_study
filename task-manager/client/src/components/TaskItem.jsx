import { useState } from 'react'
import { FiEdit2, FiTrash2, FiMenu } from 'react-icons/fi'
import FileUpload from './FileUpload'
import TaskForm from './TaskForm'

const STATUS_ICONS = {
  not_started: '⬜',
  in_progress: '🔄',
  completed: '✅',
}

const STATUS_LABELS = {
  not_started: '시작안함',
  in_progress: '진행중',
  completed: '완료',
}

const PRIORITY_ICONS = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
}

function TaskItem({ task, index, isEditing, categories, onEdit, onUpdate, onDelete, onUpload, onAddDriveLink }) {
  const [expanded, setExpanded] = useState(false)

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  const cycleStatus = () => {
    const order = ['not_started', 'in_progress', 'completed']
    const current = order.indexOf(task.status)
    const next = order[(current + 1) % order.length]
    onUpdate(task.id, { status: next })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString('ko-KR')
    }
    return new Date(timestamp).toLocaleDateString('ko-KR')
  }

  if (isEditing) {
    return (
      <TaskForm
        categories={categories}
        initialData={task}
        onSubmit={(updates) => onUpdate(task.id, updates)}
        onCancel={() => onEdit(null)}
      />
    )
  }

  return (
    <div className={`task-item ${task.status} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-main" onClick={() => setExpanded(!expanded)}>
        <FiMenu className="drag-handle" />

        <span className="task-number">#{index + 1}</span>

        <button className="status-btn" onClick={(e) => { e.stopPropagation(); cycleStatus() }}
          title={`상태: ${STATUS_LABELS[task.status]} (클릭하여 변경)`}>
          {STATUS_ICONS[task.status]}
        </button>

        <span className="priority-icon" title={`우선순위: ${task.priority}`}>
          {PRIORITY_ICONS[task.priority]}
        </span>

        <div className="task-info">
          <span className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>
            {task.title}
          </span>
          <div className="task-meta">
            <span className="category-tag">{task.category}</span>
            <span className="date">{formatDate(task.createdAt)}</span>
            {task.dueDate && (
              <span className={`due-date ${isOverdue ? 'overdue-text' : ''}`}>
                마감: {task.dueDate}
              </span>
            )}
            {task.attachments?.length > 0 && (
              <span className="attachment-count">📎 {task.attachments.length}</span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(task) }} title="수정">
            <FiEdit2 />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id) }} title="삭제">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="task-detail">
          {task.description && (
            <div className="description">
              <strong>상세설명</strong>
              <p>{task.description}</p>
            </div>
          )}

          <FileUpload
            taskId={task.id}
            attachments={task.attachments || []}
            onUpload={onUpload}
            onAddDriveLink={onAddDriveLink}
          />
        </div>
      )}
    </div>
  )
}

export default TaskItem
