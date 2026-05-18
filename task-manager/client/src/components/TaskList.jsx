import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskItem from './TaskItem'

function TaskList({ tasks, editingTask, categories, onEdit, onUpdate, onDelete, onReorder, onUpload, onAddDriveLink }) {

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(tasks)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    onReorder(items.map(t => t.id))
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 할일이 없습니다</p>
        <p>새 할일을 추가해보세요!</p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'dragging' : ''}
                  >
                    <TaskItem
                      task={task}
                      index={index}
                      isEditing={editingTask?.id === task.id}
                      categories={categories}
                      onEdit={onEdit}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onUpload={onUpload}
                      onAddDriveLink={onAddDriveLink}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TaskList
