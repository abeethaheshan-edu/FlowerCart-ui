import { createTheme } from '@mui/material/styles';
import { commonTokens, lightPalette, darkPalette } from './appColors';

export function appTheme(mode = 'light') {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    shape: {
      borderRadius: commonTokens.shape.borderRadius,
    },
    typography: {
      fontFamily: commonTokens.typography.fontFamily,
      h1: {
        fontFamily: commonTokens.typography.headingFontFamily,
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.1,
      },
      h2: {
        fontFamily: commonTokens.typography.headingFontFamily,
        fontWeight: 700,
        fontSize: '2.4rem',
        lineHeight: 1.15,
      },
      h3: {
        fontFamily: commonTokens.typography.headingFontFamily,
        fontWeight: 700,
      },
      h4: {
        fontFamily: commonTokens.typography.headingFontFamily,
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.95rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
          },
          body: {
            margin: 0,
            padding: 0,
            width: '100%',
            minHeight: '100%',
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            fontFamily: commonTokens.typography.fontFamily,
          },
          '#root': {
            minHeight: '100vh',
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
          img: {
            display: 'block',
            maxWidth: '100%',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow:
              mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.25)' : commonTokens.customShadows.card,
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 48,
            borderRadius: 16,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            color: '#FFFFFF',
          },
          outlinedPrimary: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
            },
          },
          sizeSmall: {
            minHeight: 40,
            borderRadius: 14,
            paddingLeft: 16,
            paddingRight: 16,
            fontSize: '0.95rem',
          },
          sizeLarge: {
            minHeight: 54,
            borderRadius: 18,
            paddingLeft: 24,
            paddingRight: 24,
            fontSize: '1rem',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${palette.divider}`,
            boxShadow:
              mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.22)' : commonTokens.customShadows.soft,
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 12,
            paddingInline: 18,
          },
          containedPrimary: {
            '&:hover': {
              opacity: 0.95,
            },
          },
          outlined: {
            borderColor: palette.divider,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.divider,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
              borderWidth: 1,
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${palette.divider}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiContainer: {
        defaultProps: {
          maxWidth: 'xl',
        },
      },
    },
  });
}
