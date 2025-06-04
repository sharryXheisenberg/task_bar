import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    case 'medium':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
    case 'low':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString();
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-750 rounded-lg shadow-sm p-4 mb-3 border-l-4 
            ${snapshot.isDragging ? 'shadow-lg' : ''} 
            ${task.priority === 'high' ? 'border-red-500' : 
              task.priority === 'medium' ? 'border-orange-500' : 'border-green-500'} 
            transition-all duration-200 ease-in-out`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 dark:text-white text-base mb-1">{task.title}</h3>
            <div className="flex space-x-1">
              <button 
                onClick={() => onEdit(task.id)} 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Edit task"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(task.id)} 
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {task.description}
            </ReactMarkdown>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          </div>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;