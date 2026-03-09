import { useState } from 'react';
import { ThemeContextProvider } from './core/context/ThemeModeContext';
import './App.css';

function App() {
  return (
    <ThemeContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
