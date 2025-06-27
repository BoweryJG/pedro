import { createTheme } from '@mui/material/styles'

export const medspaTheme = createTheme({
  palette: {
    primary: {
      main: '#B8860B', // Luxurious gold for premium aesthetic treatments
      light: '#DAA520',
      dark: '#9A7C0A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8B4A8B', // Elegant purple for beauty and wellness
      light: '#CD5C5C',
      dark: '#663366',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFF8F0', // Warm cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA726',
    },
    success: {
      main: '#2E7D32',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      color: '#B8860B',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      color: '#B8860B',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      color: '#2C2C2C',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#2C2C2C',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2C2C2C',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
        contained: {
          background: 'linear-gradient(45deg, #B8860B 30%, #DAA520 90%)',
          boxShadow: '0 4px 12px rgba(184, 134, 11, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #9A7C0A 30%, #B8860B 90%)',
            boxShadow: '0 6px 20px rgba(184, 134, 11, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
})