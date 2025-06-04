import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Task, DragResult } from '../types';

// Load from localStorage or use initial state
const loadBoardFromStorage = (): Board => {
  const savedBoard = localStorage.getItem('taskBoard');
  if (savedBoard) {
    return JSON.parse(savedBoard);
  }
  
  // Default initial state
  return {
    tasks: {
      'task-1': { 
        id: 'task-1', 
        title: 'Create project structure', 
        description: 'Set up the basic files and folders for the project',
        priority: 'high',
        createdAt: new Date().toISOString(),
        tags: ['setup']
      },
      'task-2': { 
        id: 'task-2', 
        title: 'Design UI components', 
        description: 'Create basic UI components for the application',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        tags: ['design', 'UI']
      },
      'task-3': { 
        id: 'task-3', 
        title: 'Implement drag and drop', 
        description: 'Add drag and drop functionality to the task board',
        priority: 'low',
        createdAt: new Date().toISOString(),
        tags: ['feature']
      },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        taskIds: ['task-1', 'task-2'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        taskIds: ['task-3'],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };
};

const initialState: Board = loadBoardFromStorage();

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ columnId: string; task: Omit<Task, 'id' | 'createdAt'> }>) => {
      const { columnId, task } = action.payload;
      const newTaskId = `task-${uuidv4()}`;
      
      state.tasks[newTaskId] = {
        id: newTaskId,
        ...task,
        createdAt: new Date().toISOString(),
      };
      
      state.columns[columnId].taskIds.push(newTaskId);
      saveToLocalStorage(state);
    },
    
    updateTask: (state, action: PayloadAction<{ taskId: string; updatedTask: Partial<Task> }>) => {
      const { taskId, updatedTask } = action.payload;
      
      if (state.tasks[taskId]) {
        state.tasks[taskId] = {
          ...state.tasks[taskId],
          ...updatedTask,
        };
      }
      saveToLocalStorage(state);
    },
    
    deleteTask: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;
      
      // Remove task from any column that has it
      Object.values(state.columns).forEach(column => {
        column.taskIds = column.taskIds.filter(id => id !== taskId);
      });
      
      // Delete the task
      delete state.tasks[taskId];
      saveToLocalStorage(state);
    },
    
    addColumn: (state) => {
      const newColumnId = `column-${uuidv4()}`;
      
      state.columns[newColumnId] = {
        id: newColumnId,
        title: 'New Column',
        taskIds: [],
      };
      
      state.columnOrder.push(newColumnId);
      saveToLocalStorage(state);
    },
    
    updateColumn: (state, action: PayloadAction<{ columnId: string; title: string }>) => {
      const { columnId, title } = action.payload;
      
      if (state.columns[columnId]) {
        state.columns[columnId].title = title;
      }
      saveToLocalStorage(state);
    },
    
    deleteColumn: (state, action: PayloadAction<{ columnId: string }>) => {
      const { columnId } = action.payload;
      
      // Delete all tasks in this column
      state.columns[columnId].taskIds.forEach(taskId => {
        delete state.tasks[taskId];
      });
      
      // Delete the column
      delete state.columns[columnId];
      
      // Remove from column order
      state.columnOrder = state.columnOrder.filter(id => id !== columnId);
      saveToLocalStorage(state);
    },
    
    moveTask: (state, action: PayloadAction<DragResult>) => {
      const { source, destination, draggableId } = action.payload;
      
      // If no destination, the task was dropped outside a droppable area
      if (!destination) return;
      
      // If dropped in the same position, do nothing
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }
      
      // Get source and destination columns
      const sourceColumn = state.columns[source.droppableId];
      const destinationColumn = state.columns[destination.droppableId];
      
      // If moving within the same column
      if (sourceColumn.id === destinationColumn.id) {
        const newTaskIds = Array.from(sourceColumn.taskIds);
        
        // Remove from old position and insert at new position
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        
        // Update the column with new task order
        state.columns[sourceColumn.id].taskIds = newTaskIds;
      } else {
        // Moving between columns
        // Remove from source column
        const sourceTaskIds = Array.from(sourceColumn.taskIds);
        sourceTaskIds.splice(source.index, 1);
        
        // Add to destination column
        const destTaskIds = Array.from(destinationColumn.taskIds);
        destTaskIds.splice(destination.index, 0, draggableId);
        
        // Update both columns
        state.columns[sourceColumn.id].taskIds = sourceTaskIds;
        state.columns[destinationColumn.id].taskIds = destTaskIds;
      }
      
      saveToLocalStorage(state);
    },
    
    moveColumn: (state, action: PayloadAction<DragResult>) => {
      const { source, destination, draggableId } = action.payload;
      
      if (!destination) return;
      
      if (source.index === destination.index) return;
      
      // Create new column order array
      const newColumnOrder = Array.from(state.columnOrder);
      
      // Remove from old position and insert at new position
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      
      // Update state with new column order
      state.columnOrder = newColumnOrder;
      saveToLocalStorage(state);
    },
  },
});

// Helper function to save board to localStorage
const saveToLocalStorage = (board: Board) => {
  localStorage.setItem('taskBoard', JSON.stringify(board));
};

export const {
  addTask,
  updateTask,
  deleteTask,
  addColumn,
  updateColumn,
  deleteColumn,
  moveTask,
  moveColumn,
} = boardSlice.actions;

export default boardSlice.reducer;