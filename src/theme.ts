import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff0000' },
    background: {
      default: '#101010',
      paper: '#101010',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Fira Code", "Consolas", "Inter", monospace',
  },
  shape: { borderRadius: 8 },
})

export default theme
