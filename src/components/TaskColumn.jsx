import React, { useMemo } from 'react';
import { useSelector } from 'react-redux'; 
import TaskCard from "./TaskCard";
import DropArea from "./DropArea";
import "./TaskColumn.scss";

const TaskColumn = ({ 
  title, 
  tasks, 
  status, 
  onDelete, 
  onEdit, 
  setActiveCard, 
  onDrop,
  selectedTasks = [], 
  onSelectAll,
  onToggleSelect 
}) => {
  const { user } = useSelector(state => state.auth);

  const columnTasks = tasks
    .filter(task => task.status === status && task.owner === user?.email);

  const allSelected = columnTasks.length > 0 && 
    columnTasks.every(task => selectedTasks.includes(task.id));

    const filteredTasks = useMemo(() => {
      return tasks.filter(task => task.status === status);
    }, [tasks, status]);

  return (
    <section className='task_column' data-status={status}>
      <div className="task_column_header" data-status={status}>
        <h2>{title}</h2>
        {columnTasks.length > 0 && (
          <button 
            onClick={() => onSelectAll(status)}
            className="select-all-btn"
          >
            {allSelected ? 'Unselect All' : 'Select All'}
          </button>
        )}
      </div>

      <DropArea onDrop={() => onDrop(status, 0)} />

      {columnTasks.map((task, i) => (
        <React.Fragment key={task.id}>
          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            dueDate={task.dueDate}
            tags={task.tags}
            setActiveCard={setActiveCard}
            onDelete={() => onDelete(task.id)}
            onEdit={() => onEdit(task.id)} 
            isSelected={selectedTasks.includes(task.id)} 
            onToggleSelect={onToggleSelect} 
          />
          <DropArea onDrop={() => onDrop(status, i + 1)} />
        </React.Fragment>
      ))}
    </section>
  );
};

export default TaskColumn;
