import { Box, Button, Divider, Paper, Switch, TextField, ThemeProvider, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MODELS } from '../../constants/models'
import { InlineSelect } from '../InlineSelect/InlineSelect'
import theme from '../../theme'

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: '#b5b5b5',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}))

interface SettingsPanelProps {
  eyeInterval: number
  setEyeInterval: (v: number) => void
  stretchInterval: number
  setStretchInterval: (v: number) => void
  selectedModel: string
  setSelectedModel: (v: string) => void
  isMuted: boolean
  setIsMuted: (v: boolean) => void
  launchAtStartup: boolean
  setLaunchAtStartup: (v: boolean) => void
  onClose: () => void
}

export function SettingsPanel({
  eyeInterval,
  setEyeInterval,
  stretchInterval,
  setStretchInterval,
  selectedModel,
  setSelectedModel,
  isMuted,
  setIsMuted,
  launchAtStartup,
  setLaunchAtStartup,
  onClose,
}: SettingsPanelProps) {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(16, 16, 16, 0.96)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          pointerEvents: 'auto',
          color: '#f3f4f6',
          fontFamily: '"Fira Code", "Consolas", monospace',
          padding: '32px 28px 24px 28px',
          width: 360,
          position: 'relative',
        }}
      >
        {/* macOS-style top title bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '24px',
            background: 'rgba(255,255,255,0.05)',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
          }}
        >
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', marginRight: '6px' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ marginLeft: '12px', fontSize: '0.7rem', color: '#9ca3af', fontFamily: '"Fira Code", "Consolas", monospace' }}>
            system_config.sh
          </span>
        </div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#ff0000',
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: '1.15rem',
            }}
          >
            {'>'} Configuration
          </Typography>

          {/* ── Render Entity ──────────────────────────────────── */}
          <InlineSelect
            value={selectedModel}
            onChange={setSelectedModel}
            options={MODELS}
            label="Render Entity"
          />

          {/* ── Intervals ─────────────────────────────────────── */}
          <TextField
            type="number"
            label="Eye Rest (mins)"
            value={eyeInterval}
            onChange={(e) => setEyeInterval(Number(e.target.value))}
            fullWidth
            variant="outlined"
            size="small"
            helperText="20-20-20 rule recommended"
            slotProps={{
              formHelperText: { sx: { mx: 0, color: '#9ca3af', fontFamily: '"Fira Code", "Consolas", monospace' } },
              htmlInput: { style: { fontFamily: '"Fira Code", "Consolas", monospace' } }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                borderRadius: '6px',
              }
            }}
          />

          <TextField
            type="number"
            label="Stretch Break (mins)"
            value={stretchInterval}
            onChange={(e) => setStretchInterval(Number(e.target.value))}
            fullWidth
            variant="outlined"
            size="small"
            helperText="60 mins recommended"
            slotProps={{
              formHelperText: { sx: { mx: 0, color: '#9ca3af', fontFamily: '"Fira Code", "Consolas", monospace' } },
              htmlInput: { style: { fontFamily: '"Fira Code", "Consolas", monospace' } }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                borderRadius: '6px',
              }
            }}
          />

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* ── Toggles ───────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#d1d5db', fontFamily: '"Fira Code", "Consolas", monospace', fontSize: '0.85rem' }}>
                Mute sounds
              </Typography>
              <IOSSwitch
                checked={isMuted}
                onChange={(e) => setIsMuted(e.target.checked)}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#d1d5db', fontFamily: '"Fira Code", "Consolas", monospace', fontSize: '0.85rem' }}>
                Launch at startup
              </Typography>
              <IOSSwitch
                checked={launchAtStartup}
                onChange={(e) => setLaunchAtStartup(e.target.checked)}
              />
            </Box>
          </Box>

          {/* ── Actions ───────────────────────────────────────── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={onClose}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '6px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#dc2626',
                fontFamily: '"Fira Code", "Consolas", monospace',
                fontSize: '0.85rem',
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#b91c1c',
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  )
}
