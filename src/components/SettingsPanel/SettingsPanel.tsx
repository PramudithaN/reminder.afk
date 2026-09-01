import { Box, Button, Divider, FormControlLabel, Paper, Switch, TextField, ThemeProvider, Typography } from '@mui/material'
import { MODELS } from '../../constants/models'
import { InlineSelect } from '../InlineSelect/InlineSelect'
import theme from '../../theme'

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
        elevation={10}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          width: 340,
          pointerEvents: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }} color="text.primary">
          Configuration
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
          slotProps={{ formHelperText: { sx: { mx: 0 } } }}
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
          slotProps={{ formHelperText: { sx: { mx: 0 } } }}
        />

        <Divider />

        {/* ── Toggles ───────────────────────────────────────── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isMuted}
                onChange={(e) => setIsMuted(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label={<Typography variant="body2" color="text.secondary">Mute sounds</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={launchAtStartup}
                onChange={(e) => setLaunchAtStartup(e.target.checked)}
                color="primary"
                size="small"
              />
            }
            label={<Typography variant="body2" color="text.secondary">Launch at startup</Typography>}
          />
        </Box>

        {/* ── Actions ───────────────────────────────────────── */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            disableElevation
            sx={{ px: 3, py: 1, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </ThemeProvider>
  )
}
