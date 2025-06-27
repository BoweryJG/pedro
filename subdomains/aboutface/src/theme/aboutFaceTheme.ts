import { createTheme } from '@mui/material/styles'

export const aboutFaceTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C8A882', // Warm champagne gold
      light: '#E6D3B7',
      dark: '#A18A5C',
      contrastText: '#2C2C2C',
    },
    secondary: {
      main: '#8B6F8B', // Sophisticated mauve
      light: '#B3A1B3',
      dark: '#6B536B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FEFEFE',
      paper: '#F9F7F4',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#5A5A5A',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#F57C00',
    },
    info: {
      main: '#8B6F8B',
    },
    success: {
      main: '#2E7D32',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '12px 32px',
          borderRadius: '28px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(200, 168, 130, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #C8A882 0%, #A18A5C 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A18A5C 0%, #8B7549 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(200, 168, 130, 0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#C8A882',
          color: '#2C2C2C',
          '&:hover': {
            backgroundColor: '#A18A5C',
          },
        },
      },
    },
  },
})