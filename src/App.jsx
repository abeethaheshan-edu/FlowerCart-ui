import { ThemeContextProvider } from './core/context/ThemeModeContext';
import { UILoaderProvider } from './core/context/UILoaderContext';
import Router from './Router';
import './App.css';

export default function App() {
  return (
    <ThemeContextProvider>
      <UILoaderProvider>
        <Router />
      </UILoaderProvider>
    </ThemeContextProvider>
  );
}
