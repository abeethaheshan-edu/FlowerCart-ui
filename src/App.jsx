import { useState } from 'react';
import { ThemeContextProvider } from './core/context/ThemeModeContext';
import './App.css';
import AppButton from './components/common/AppButton';

function App() {
  return (
    <ThemeContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
