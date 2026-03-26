import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import AppTextField from '../../../components/common/AppTextField';
import AppButton from '../../../components/common/AppButton';
import { authService } from '../services/authService';
import { UILoader } from '../../../core/utils/UILoader';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    setServerError('');
    UILoader.show('Sending reset link...');
    try {
      await authService.forgotPassword(values.email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      UILoader.hide();
    }
  };

  if (submitted) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <CheckCircleIcon sx={{ color: '#fff', fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
          Check your email
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, mx: 'auto' }}>
          We sent a password reset link to{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {getValues('email')}
          </Typography>
        </Typography>
        <Link
          component={RouterLink}
          to="/auth/login"
          variant="body2"
          color="primary.main"
          fontWeight={700}
          underline="hover"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to sign in
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
        Forgot password?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
        Enter your email and we&apos;ll send you a reset link
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

          <AppButton type="submit" fullWidth size="large" loading={isSubmitting}>
            Send reset link
          </AppButton>
        </Box>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/auth/login"
          variant="body2"
          color="text.secondary"
          underline="hover"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to sign in
        </Link>
      </Box>
    </Box>
  );
}
