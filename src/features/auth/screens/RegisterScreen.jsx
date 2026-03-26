import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AppTextField from '../../../components/common/AppTextField';
import AppButton from '../../../components/common/AppButton';
import { authService } from '../services/authService';
import { UILoader } from '../../../core/utils/UILoader';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
];

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (values) => {
    setServerError('');
    UILoader.show('Creating your account...');
    try {
      await authService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      navigate('/auth/login');
    } catch (err) {
      setServerError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      UILoader.hide();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
        Create account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Join FlowerCart and start gifting today
      </Typography>

      {serverError && (
        <Box
          sx={{ mb: 2.5, px: 2, py: 1.5, borderRadius: 2, bgcolor: 'error.main', color: '#fff' }}
        >
          <Typography variant="body2" fontWeight={600}>{serverError}</Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <AppTextField
                    {...field}
                    label="First name"
                    placeholder="John"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    autoComplete="given-name"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <AppTextField
                    {...field}
                    label="Last name"
                    placeholder="Doe"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    autoComplete="family-name"
                  />
                )}
              />
            </Grid>
          </Grid>

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
                placeholder="john@example.com"
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
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              validate: (v) =>
                PASSWORD_RULES.every((r) => r.test(v)) ||
                'Password does not meet requirements',
            }}
            render={({ field }) => (
              <AppTextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />

          {passwordValue && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: -1.5 }}>
              {PASSWORD_RULES.map((rule) => (
                <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 14,
                      color: rule.test(passwordValue) ? 'success.main' : 'divider',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: rule.test(passwordValue) ? 'success.main' : 'text.secondary',
                    }}
                  >
                    {rule.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (v) => v === passwordValue || 'Passwords do not match',
            }}
            render={({ field }) => (
              <AppTextField
                {...field}
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm((p) => !p)} edge="end">
                      {showConfirm
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />

          <AppButton type="submit" fullWidth size="large" loading={isSubmitting}>
            Create account
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
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/auth/login"
          color="primary.main"
          fontWeight={700}
          underline="hover"
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
