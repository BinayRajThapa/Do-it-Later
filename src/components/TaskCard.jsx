import React from "react";
import { FiEdit2 } from "react-icons/fi";
import "./TaskCard.scss";

// Priority color mapping
const priorityColors = {
  high: '#ff4d4f',
  medium: '#faad14',
  low: '#52c41a'
};

const TaskCard = ({
  id,
  title,
  description,
  priority,
  dueDate,
  tags,
  setActiveCard,
  onDelete,
  onEdit,
  isSelected,
  onToggleSelect
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", id);
    setActiveCard(id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
    setActiveCard(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return null;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article
      className={`task_card ${isSelected ? "selected" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task_main">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
          onClick={(e) => e.stopPropagation()}
          className="task-checkbox"
        />
        <div className="task_content">
          <p className="task_text">{title}</p>
          {description && <p className="task_description">{description}</p>}
          {dueDate && (
            <p className="task_due_date">Due: {formatDate(dueDate)}</p>
          )}
        </div>
      </div>

      <div className="task_card_bottom_line">
        {priority && (
          <span
            className="priority-badge"
            data-priority={priority}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}

        <div className="task_actions">
          <button
            className="icon_btn edit_icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            title="Edit Task"
          >
            <FiEdit2 />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
