import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function AppButton({
  children,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      sx={{
        ...(variant === 'contained' && {
          color: '#fff',
        }),
        ...(variant === 'outlined' && {
          backgroundColor: 'transparent',
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CircularProgress size={16} color="inherit" />
          <span>{children}</span>
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}