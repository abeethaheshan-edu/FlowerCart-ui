import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function AppCard({ children, sx = {}, ...props }) {
  return (
    <Card sx={{ height: '100%', ...sx }} {...props}>
      {children}
    </Card>
  );
}

export function AppCardContent({ children, sx = {}, ...props }) {
  return <CardContent sx={sx} {...props}>{children}</CardContent>;
}

export function AppCardMedia({ image, alt, height = 200, ...props }) {
  return <CardMedia component="img" height={height} image={image} alt={alt} {...props} />;
}

export function AppCardActions({ children, sx = {}, ...props }) {
  return <CardActions sx={{ px: 2, pb: 2, ...sx }} {...props}>{children}</CardActions>;
}

export function StatCard({ icon, label, value, trend, trendPositive = true, sx = {} }) {
  return (
    <AppCard sx={sx}>
      <AppCardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="caption"
                sx={{ color: trendPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
              >
                {trend}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </AppCardContent>
    </AppCard>
  );
}

export function ProductCard({ image, name, price, originalPrice, badge, actions, sx = {} }) {
  return (
    <AppCard sx={{ position: 'relative', ...sx }}>
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 1,
            py: 0.3,
            borderRadius: 2,
            fontSize: '0.72rem',
            fontWeight: 700,
          }}
        >
          {badge}
        </Box>
      )}
      {image && <AppCardMedia image={image} alt={name} />}
      <AppCardContent sx={{ pb: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography variant="body1" fontWeight={700} color="primary.main">
            {price}
          </Typography>
          {originalPrice && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {originalPrice}
            </Typography>
          )}
        </Box>
      </AppCardContent>
      {actions && <AppCardActions>{actions}</AppCardActions>}
    </AppCard>
  );
}

export default AppCard;
