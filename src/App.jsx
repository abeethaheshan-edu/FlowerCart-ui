import { useState } from 'react';
import { ThemeContextProvider } from './core/context/ThemeModeContext';
import './App.css';
import AppButton from './components/common/AppButton';

function App() {
    const [number,setNumber] =  useState(0);  
  return (
    <ThemeContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
