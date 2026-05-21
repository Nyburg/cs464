import { Box, Button, Paper, TextField, Typography } from '@mui/material'

export default function LoginPage() {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up or Log In
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Authentication is not connected yet. This page is a temporary
        placeholder for future sign up and login functionality.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Log In
        </Typography>

        <Box component="form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            disabled
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            disabled
          />

          <Button variant="contained" disabled sx={{ mt: 2 }}>
            Log In
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sign Up
        </Typography>

        <Box component="form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            disabled
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            disabled
          />

          <Button variant="contained" disabled sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}