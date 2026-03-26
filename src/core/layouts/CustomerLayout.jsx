import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import CustomerTopNav from '../../components/customer/CustomerTopNav';
import CustomerFooter from '../../components/customer/CustomerFooter';

export default function CustomerLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerTopNav />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <CustomerFooter />
    </Box>
  );
}
