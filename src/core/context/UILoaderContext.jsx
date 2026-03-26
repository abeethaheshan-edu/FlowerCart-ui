import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UILoader } from '../utils/UILoader';

const UILoaderContext = createContext(null);

export function UILoaderProvider({ children }) {
  const [state, setState] = useState({ visible: false, message: '' });

  const show = useCallback((message = '') => {
    setState({ visible: true, message });
  }, []);

  const hide = useCallback(() => {
    setState({ visible: false, message: '' });
  }, []);

  useEffect(() => {
    UILoader.register(show, hide);
  }, [show, hide]);

  return (
    <UILoaderContext.Provider value={{ show, hide }}>
      {children}
      <Backdrop
        open={state.visible}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100, flexDirection: 'column', gap: 2 }}
      >
        <CircularProgress color="primary" size={48} thickness={4} />
        {state.message && (
          <Box
            sx={{
              bgcolor: 'background.paper',
              px: 3,
              py: 1.5,
              borderRadius: 3,
              boxShadow: 4,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {state.message}
            </Typography>
          </Box>
        )}
      </Backdrop>
    </UILoaderContext.Provider>
  );
}

export function useUILoader() {
  const ctx = useContext(UILoaderContext);
  if (!ctx) throw new Error('useUILoader must be used inside UILoaderProvider');
  return ctx;
}
