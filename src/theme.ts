import { createTheme } from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  palette: {
    primary: { main: '#6366f1' },
    background: { paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
})

export default theme
