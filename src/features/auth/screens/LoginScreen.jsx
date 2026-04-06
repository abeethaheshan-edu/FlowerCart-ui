import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AppTextField from '../../../components/common/AppTextField';
import AppButton from '../../../components/common/AppButton';
import { authService } from '../services/authService';
import { UILoader } from '../../../core/utils/UILoader';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values) => {
    setServerError('');
    UILoader.show('Signing in...');
    try {
      const auth = await authService.login(values);
      navigate(auth.user.isAdmin ? '/admin' : '/');
    } catch (err) {
      setServerError(err.message ?? 'Login failed. Please try again.');
    } finally {
      UILoader.hide();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Sign in to continue your floral journey
      </Typography>

      {serverError && (
        <Box
          sx={{
            mb: 2.5,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: 'error.main',
            color: '#fff',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {serverError}
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: { value: EMAIL_REGEX, message: 'Enter a valid email' },
            }}
            render={({ field }) => (
              <AppTextField
                {...field}
                label="Email address"
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            }}
            render={({ field }) => (
              <AppTextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                    >
                      {showPassword
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -1 }}>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} size="small" color="primary" />}
                  label={<Typography variant="body2">Remember me</Typography>}
                  sx={{ m: 0 }}
                />
              )}
            />
            <Link
              component={RouterLink}
              to="/auth/forgot-password"
              variant="body2"
              color="primary.main"
              fontWeight={600}
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>

          <AppButton
            type="submit"
            fullWidth
            size="large"
            loading={isSubmitting}
          >
            Sign in
          </AppButton>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <AppButton
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon fontSize="small" />}
          sx={{ color: 'text.primary', borderColor: 'divider' }}
        >
          Google
        </AppButton>
        <AppButton
          variant="outlined"
          fullWidth
          startIcon={<AppleIcon fontSize="small" />}
          sx={{ color: 'text.primary', borderColor: 'divider' }}
        >
          Apple
        </AppButton>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        Don&apos;t have an account?{' '}
        <Link
          component={RouterLink}
          to="/auth/register"
          color="primary.main"
          fontWeight={700}
          underline="hover"
        >
          Create account
        </Link>
      </Typography>
    </Box>
  );
}
