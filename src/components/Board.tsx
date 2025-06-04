import { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import Column from './Column';
import TaskModal from './TaskModal';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addTask, updateTask, deleteTask, addColumn, moveTask, moveColumn } from '../store/boardSlice';
import { Task } from '../types';

const Board = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector(state => state.board);
  const { searchTerm, filterPriority } = useAppSelector(state => state.ui);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    if (type === 'column') {
      dispatch(moveColumn(result));
      return;
    }
    
    dispatch(moveTask(result));
  };
  
  const openAddTaskModal = (columnId: string) => {
    setEditingTask(undefined);
    setActiveColumnId(columnId);
    setIsModalOpen(true);
  };
  
  const openEditTaskModal = (taskId: string) => {
    const task = board.tasks[taskId];
    if (task) {
      setEditingTask(task);
      
      // Find which column this task belongs to
      for (const colId in board.columns) {
        if (board.columns[colId].taskIds.includes(taskId)) {
          setActiveColumnId(colId);
          break;
        }
      }
      
      setIsModalOpen(true);
    }
  };
  
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      dispatch(updateTask({ 
        taskId: editingTask.id, 
        updatedTask: taskData 
      }));
    } else if (activeColumnId) {
      dispatch(addTask({ 
        columnId: activeColumnId, 
        task: taskData 
      }));
    }
    
    setIsModalOpen(false);
    setEditingTask(undefined);
    setActiveColumnId(null);
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask({ taskId }));
    }
  };
  
  const handleAddColumn = () => {
    dispatch(addColumn());
  };
  
  // Filter tasks based on search term and priority filter
  const getFilteredTasks = (taskIds: string[]) => {
    return taskIds
      .map(taskId => board.tasks[taskId])
      .filter(task => {
        const matchesSearch = searchTerm === '' || 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        
        return matchesSearch && matchesPriority;
      });
  };
  
  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex min-h-[calc(100vh-10rem)]"
            >
              {board.columnOrder.map((columnId, index) => {
                const column = board.columns[columnId];
                const tasks = getFilteredTasks(column.taskIds);
                
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    onAddTask={openAddTaskModal}
                    onEditTask={openEditTaskModal}
                    onDeleteTask={handleDeleteTask}
                  />
                );
              })}
              {provided.placeholder}
              
              <div className="flex-shrink-0 w-80 mx-2">
                <button
                  onClick={handleAddColumn}
                  className="w-full h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-200"
                >
                  <Plus size={20} className="mr-2" />
                  Add Column
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
          setActiveColumnId(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Board;