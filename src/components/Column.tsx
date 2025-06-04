import { useState, useRef } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreVertical, Edit2, Trash } from 'lucide-react';
import TaskCard from './TaskCard';
import { Column as ColumnType, Task } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { deleteColumn, updateColumn } from '../store/boardSlice';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  index: number;
  onAddTask: (columnId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  index, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}) => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsMenuOpen(false);
    }
  };
  
  useState(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  
  const handleUpdateTitle = () => {
    if (title.trim() !== '') {
      dispatch(updateColumn({ columnId: column.id, title }));
      setIsEditing(false);
    }
  };
  
  const handleDeleteColumn = () => {
    if (window.confirm('Are you sure you want to delete this column and all its tasks?')) {
      dispatch(deleteColumn({ columnId: column.id }));
    }
    setIsMenuOpen(false);
  };
  
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-80 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm flex flex-col max-h-[calc(100vh-11rem)] mx-2"
        >
          <div 
            {...provided.dragHandleProps}
            className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
          >
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                autoFocus
                className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wide">
                {column.title} <span className="text-gray-500 dark:text-gray-400 font-normal">({tasks.length})</span>
              </h2>
            )}
            
            <div className="flex">
              <button
                onClick={() => onAddTask(column.id)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                aria-label="Add task"
              >
                <Plus size={16} />
              </button>
              
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                  aria-label="Column options"
                >
                  <MoreVertical size={16} />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-750 shadow-lg rounded-md z-10 py-1 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Edit2 size={14} className="mr-2" />
                      Edit Title
                    </button>
                    <button
                      onClick={handleDeleteColumn}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Trash size={14} className="mr-2" />
                      Delete Column
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-2 overflow-y-auto ${
                  snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } transition-colors duration-200`}
              >
                {tasks.map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    index={index} 
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
                {provided.placeholder}
                
                {tasks.length === 0 && !snapshot.isDraggingOver && (
                  <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm italic">
                    No tasks yet. Add a task or drag one here.
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;