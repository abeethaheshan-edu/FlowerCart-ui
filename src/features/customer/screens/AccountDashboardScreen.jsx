import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AccountDashboardScreen() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        AccountDashboardScreen
      </Typography>
    </Box>
  );
}
