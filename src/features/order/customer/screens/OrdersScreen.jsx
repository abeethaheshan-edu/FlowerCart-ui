import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function OrdersScreen() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        OrdersScreen
      </Typography>
    </Box>
  );
}
