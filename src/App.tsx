import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Board from './components/Board';
import { useAppSelector } from './hooks/useAppSelector';

const AppContent: React.FC = () => {
  const isDarkMode = useAppSelector(state => state.ui.isDarkMode);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Header />
      <Board />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;