import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';

export default function AppBreadcrumbs({ items = [], sx = {} }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2, ...sx }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return isLast ? (
          <Typography key={item.label} variant="body2" color="text.primary" fontWeight={600}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
