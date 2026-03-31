import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AppBreadcrumbs from '../../../components/common/AppBreadcrumbs';
import AppButton from '../../../components/common/AppButton';
import AppCard from '../../../components/common/AppCard';
import AppSelect from '../../../components/common/AppSelect';
import AppTextField from '../../../components/common/AppTextField';
import PageHeader from '../../../components/common/PageHeader';

const tabs = [
  { value: 'general', label: 'General' },
  { value: 'store', label: 'Store Settings' },
  { value: 'payment', label: 'Payment' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
  { value: 'team', label: 'Team' },
];

const languageOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'Français (FR)' },
];

const timezoneOptions = [
  { value: 'UTC-05:00', label: 'UTC-05:00 (EST)' },
  { value: 'UTC+00:00', label: 'UTC+00:00 (GMT)' },
  { value: 'UTC+05:30', label: 'UTC+05:30 (IST)' },
];

const dateOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export default function AdminSettingsScreen() {
  const [activeTab, setActiveTab] = useState('general');
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@shopsphere.com',
    phone: '+1 (555) 123-4567',
  });
  const [preferences, setPreferences] = useState({
    language: 'en-US',
    timezone: 'UTC-05:00',
    dateFormat: 'MM/DD/YYYY',
  });

  const canSave = useMemo(() => {
    return !!profile.firstName && !!profile.lastName && !!profile.email;
  }, [profile]);

  const handleSave = () => {
    // local-only mock flow
    window.alert('Settings saved (mock)');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <AppBreadcrumbs items={[{ label: 'Dashboard', to: '/admin' }, { label: 'Settings' }]} />
      <PageHeader
        title="Settings"
        subtitle="Manage your platform preferences and configurations"
        action={
          <Stack direction="row" spacing={1}>
            <AppButton variant="outlined">Reset</AppButton>
            <AppButton disabled={!canSave} onClick={handleSave}>
              Save Changes
            </AppButton>
          </Stack>
        }
      />

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <AppButton
            key={tab.value}
            variant={activeTab === tab.value ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(tab.value)}
            size="small"
          >
            {tab.label}
          </AppButton>
        ))}
      </Stack>

      {activeTab === 'general' && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <AppCard title="Profile Information" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <AppTextField
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                />
                <AppTextField
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                />
              </Stack>
              <AppTextField
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
              <AppTextField
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </Stack>
          </AppCard>

          <AppCard title="Preferences" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <AppSelect
                label="Language"
                value={preferences.language}
                options={languageOptions}
                onChange={(e) => setPreferences((p) => ({ ...p, language: e.target.value }))}
              />
              <AppSelect
                label="Timezone"
                value={preferences.timezone}
                options={timezoneOptions}
                onChange={(e) => setPreferences((p) => ({ ...p, timezone: e.target.value }))}
              />
              <AppSelect
                label="Date Format"
                value={preferences.dateFormat}
                options={dateOptions}
                onChange={(e) => setPreferences((p) => ({ ...p, dateFormat: e.target.value }))}
              />
            </Stack>
          </AppCard>
        </Box>
      )}

      {activeTab !== 'general' && (
        <AppCard sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {`${tabs.find((tab) => tab.value === activeTab)?.label || 'Section'} content can be implemented here.`}
          </Typography>
        </AppCard>
      )}
    </Box>
  );
}
