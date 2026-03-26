import { createTheme } from '@mui/material/styles';
import { commonTokens, lightPalette, darkPalette } from './appColors';

export function appTheme(mode = 'light') {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: commonTokens.typography.fontFamily,
      h1: { fontFamily: commonTokens.typography.headingFontFamily, fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.1 },
      h2: { fontFamily: commonTokens.typography.headingFontFamily, fontWeight: 700, fontSize: '2.4rem', lineHeight: 1.15 },
      h3: { fontFamily: commonTokens.typography.headingFontFamily, fontWeight: 700 },
      h4: { fontFamily: commonTokens.typography.headingFontFamily, fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.95rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.2 },
    },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': { boxSizing: 'border-box' },
          html: { margin: 0, padding: 0, width: '100%', height: '100%' },
          body: {
            margin: 0, padding: 0, width: '100%', minHeight: '100%',
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            fontFamily: commonTokens.typography.fontFamily,
          },
          '#root': { minHeight: '100vh' },
          a: { color: 'inherit', textDecoration: 'none' },
          img: { display: 'block', maxWidth: '100%' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow: mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.25)' : commonTokens.customShadows.card,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${palette.divider}`,
            boxShadow: mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.22)' : commonTokens.customShadows.soft,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10, fontWeight: 600, textTransform: 'none',
            boxShadow: 'none', whiteSpace: 'nowrap',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            color: '#FFFFFF',
            '&:hover': { opacity: 0.92 },
          },
          outlined: { borderColor: palette.divider },
          outlinedPrimary: {
            borderColor: palette.primary.main,
            borderWidth: '1px',
            '&:hover': { borderWidth: '1px' },
          },
          sizeSmall: { minHeight: 32, borderRadius: 9, paddingLeft: 12, paddingRight: 12, fontSize: '0.78rem' },
          sizeMedium: { minHeight: 38, borderRadius: 10, paddingLeft: 16, paddingRight: 16, fontSize: '0.88rem' },
          sizeLarge: { minHeight: 44, borderRadius: 12, paddingLeft: 20, paddingRight: 20, fontSize: '0.96rem' },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: palette.divider },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.primary.main },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.primary.main, borderWidth: 1 },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 600 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${palette.divider}`,
            backgroundImage: 'none',
            backgroundColor: palette.background.paper,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: palette.background.paper,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '&.Mui-selected': {
              backgroundColor: palette.primary.main,
              color: '#FFFFFF',
              '&:hover': { backgroundColor: palette.primary.dark },
              '& .MuiListItemIcon-root': { color: '#FFFFFF' },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            fontSize: '0.78rem',
            color: palette.text.secondary,
            backgroundColor: palette.background.default,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: { fontWeight: 700, fontSize: '0.7rem' },
        },
      },
      MuiContainer: {
        defaultProps: { maxWidth: 'xl' },
      },
    },
  });
}
