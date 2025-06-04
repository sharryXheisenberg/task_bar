import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isDarkMode: boolean;
  searchTerm: string;
  filterPriority: 'all' | 'low' | 'medium' | 'high';
}

// Load from localStorage or use initial state
const loadUIFromStorage = (): UIState => {
  const savedUI = localStorage.getItem('taskBoardUI');
  if (savedUI) {
    return JSON.parse(savedUI);
  }
  
  // Check system preference for dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return {
    isDarkMode: prefersDarkMode,
    searchTerm: '',
    filterPriority: 'all',
  };
};

const initialState: UIState = loadUIFromStorage();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      saveUIToLocalStorage(state);
    },
    
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    
    setFilterPriority: (state, action: PayloadAction<'all' | 'low' | 'medium' | 'high'>) => {
      state.filterPriority = action.payload;
    },
  },
});

// Helper function to save UI state to localStorage
const saveUIToLocalStorage = (ui: UIState) => {
  localStorage.setItem('taskBoardUI', JSON.stringify(ui));
};

export const {
  toggleDarkMode,
  setSearchTerm,
  setFilterPriority,
} = uiSlice.actions;

export default uiSlice.reducer;