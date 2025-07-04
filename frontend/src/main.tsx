import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdaptiveNavigationProvider } from './contexts/AdaptiveNavigationContext'
import theme from './theme'
import App from './App.tsx'
import './styles/animations.css'
import './styles/luxury-design-system.css'
import './styles/panerai-luxury.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AdaptiveNavigationProvider>
            <App />
          </AdaptiveNavigationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
