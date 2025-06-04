import { useState } from 'react';
import { Moon, Sun, Search, Sliders } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { toggleDarkMode, setSearchTerm, setFilterPriority } from '../store/uiSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode, searchTerm, filterPriority } = useAppSelector(state => state.ui);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Board</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Filter tasks"
            >
              <Sliders className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by priority:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => dispatch(setFilterPriority('all'))}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterPriority === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => dispatch(setFilterPriority('high'))}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterPriority === 'high' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                High
              </button>
              <button
                onClick={() => dispatch(setFilterPriority('medium'))}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterPriority === 'medium' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => dispatch(setFilterPriority('low'))}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterPriority === 'low' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                Low
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;