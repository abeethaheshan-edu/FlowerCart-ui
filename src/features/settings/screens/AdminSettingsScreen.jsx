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

  const [store, setStore] = useState({
    name: 'ShopSphere',
    url: 'https://shopsphere.com',
    contact: '+1 (555) 987-6543',
    currency: 'USD',
  });

  const [payment, setPayment] = useState({
    gateway: 'Stripe',
    stripeKey: 'pk_test_123',
    paypalEmail: 'payments@shopsphere.com',
    taxRate: '8.5%',
  });

  const [shipping, setShipping] = useState({
    provider: 'FedEx',
    baseRate: '5.00',
    freeThreshold: '70',
    handlingDays: '2',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    refund: false,
    newsletter: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    passwordExpiry: '90',
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const [team, setTeam] = useState([
    { id: 1, name: 'Sarah Wilson', role: 'Administrator', email: 'sarah@shopsphere.com' },
    { id: 2, name: 'Alex Martin', role: 'Support', email: 'alex@shopsphere.com' },
    { id: 3, name: 'Priya Kaur', role: 'Inventory Manager', email: 'priya@shopsphere.com' },
  ]);

  const canSave = useMemo(() => profile.firstName && profile.lastName && profile.email, [profile]);

  const handleSave = () => {
    window.alert('Settings saved (mock)');
  };

  const renderTabContent = () => {
    if (activeTab === 'general') {
      return (
        <AppCard title="Profile & Preferences">
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <AppTextField label="First Name" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
              <AppTextField label="Last Name" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
            </Stack>
            <AppTextField label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <AppTextField label="Phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <AppSelect label="Language" value={preferences.language} options={languageOptions} onChange={(e) => setPreferences((p) => ({ ...p, language: e.target.value }))} />
              <AppSelect label="Timezone" value={preferences.timezone} options={timezoneOptions} onChange={(e) => setPreferences((p) => ({ ...p, timezone: e.target.value }))} />
              <AppSelect label="Date Format" value={preferences.dateFormat} options={dateOptions} onChange={(e) => setPreferences((p) => ({ ...p, dateFormat: e.target.value }))} />
            </Stack>
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'store') {
      return (
        <AppCard title="Store Settings">
          <Stack spacing={2}>
            <AppTextField label="Store Name" value={store.name} onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))} />
            <AppTextField label="Store URL" value={store.url} onChange={(e) => setStore((s) => ({ ...s, url: e.target.value }))} />
            <AppTextField label="Contact Number" value={store.contact} onChange={(e) => setStore((s) => ({ ...s, contact: e.target.value }))} />
            <AppTextField label="Default Currency" value={store.currency} onChange={(e) => setStore((s) => ({ ...s, currency: e.target.value }))} />
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'payment') {
      return (
        <AppCard title="Payment Settings">
          <Stack spacing={2}>
            <AppTextField label="Payment Gateway" value={payment.gateway} onChange={(e) => setPayment((p) => ({ ...p, gateway: e.target.value }))} />
            <AppTextField label="Stripe API Key" value={payment.stripeKey} onChange={(e) => setPayment((p) => ({ ...p, stripeKey: e.target.value }))} />
            <AppTextField label="PayPal Email" type="email" value={payment.paypalEmail} onChange={(e) => setPayment((p) => ({ ...p, paypalEmail: e.target.value }))} />
            <AppTextField label="Tax Rate (%)" value={payment.taxRate} onChange={(e) => setPayment((p) => ({ ...p, taxRate: e.target.value }))} />
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'shipping') {
      return (
        <AppCard title="Shipping Settings">
          <Stack spacing={2}>
            <AppTextField label="Default Provider" value={shipping.provider} onChange={(e) => setShipping((s) => ({ ...s, provider: e.target.value }))} />
            <AppTextField label="Base Rate" value={shipping.baseRate} onChange={(e) => setShipping((s) => ({ ...s, baseRate: e.target.value }))} />
            <AppTextField label="Free Shipping Threshold" value={shipping.freeThreshold} onChange={(e) => setShipping((s) => ({ ...s, freeThreshold: e.target.value }))} />
            <AppTextField label="Handling Days" value={shipping.handlingDays} onChange={(e) => setShipping((s) => ({ ...s, handlingDays: e.target.value }))} />
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'notifications') {
      return (
        <AppCard title="Notification Preferences">
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AppTextField label="New Order" value={notifications.newOrder ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setNotifications((n) => ({ ...n, newOrder: !n.newOrder }))}>
                Toggle
              </AppButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AppTextField label="Low Stock Alert" value={notifications.lowStock ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setNotifications((n) => ({ ...n, lowStock: !n.lowStock }))}>
                Toggle
              </AppButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AppTextField label="Refund Notification" value={notifications.refund ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setNotifications((n) => ({ ...n, refund: !n.refund }))}>
                Toggle
              </AppButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AppTextField label="Newsletter" value={notifications.newsletter ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setNotifications((n) => ({ ...n, newsletter: !n.newsletter }))}>
                Toggle
              </AppButton>
            </Stack>
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'security') {
      return (
        <AppCard title="Security Settings">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <AppTextField label="Two-Factor Authentication" value={security.twoFactor ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setSecurity((s) => ({ ...s, twoFactor: !s.twoFactor }))}>
                Toggle
              </AppButton>
            </Stack>
            <AppTextField label="Password Expiry (days)" value={security.passwordExpiry} onChange={(e) => setSecurity((s) => ({ ...s, passwordExpiry: e.target.value }))} />
            <AppTextField label="Session Timeout (min)" value={security.sessionTimeout} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))} />
            <Stack direction="row" spacing={2}>
              <AppTextField label="Login Alerts" value={security.loginAlerts ? 'Enabled' : 'Disabled'} readOnly />
              <AppButton size="small" onClick={() => setSecurity((s) => ({ ...s, loginAlerts: !s.loginAlerts }))}>
                Toggle
              </AppButton>
            </Stack>
          </Stack>
        </AppCard>
      );
    }

    if (activeTab === 'team') {
      return (
        <AppCard title="Team Members">
          <Stack spacing={2}>
            {team.map((member) => (
              <AppCard key={member.id} sx={{ p: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={600}>{member.name}</Typography>
                    <Typography variant="caption">{member.role}</Typography>
                    <Typography variant="caption">{member.email}</Typography>
                  </Box>
                  <AppButton
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => setTeam((prev) => prev.filter((m) => m.id !== member.id))}
                  >
                    Remove
                  </AppButton>
                </Stack>
              </AppCard>
            ))}
            <AppButton onClick={() => setTeam((prev) => [...prev, { id: Date.now(), name: 'New Member', role: 'Support', email: 'new@shopsphere.com' }])}>
              + Add Team Member
            </AppButton>
          </Stack>
        </AppCard>
      );
    }

    return null;
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

      {renderTabContent()}
    </Box>
  );
}
