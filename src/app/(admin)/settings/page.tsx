'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  User,
  Bell,
  Shield,
  Palette,
  KeyRound,
  Monitor,
  Moon,
  Sun,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Camera,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Validation Schemas
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().max(300, 'Bio must be less than 300 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// ---------------------------------------------------------------------------
// Profile Tab
// ---------------------------------------------------------------------------

function ProfileSettings() {
  const user = useAuthStore((s) => s.user);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: '',
      bio: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    void data;
    setIsSaving(false);
    toast.success('Profile updated successfully');
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Admin User';
  const displayEmail = user?.email ?? 'admin@company.com';
  const displayRole = user?.role ?? 'admin';
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'AU';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Photo</CardTitle>
          <CardDescription>
            This will be displayed on your profile and in the sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-lg font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent"
                onClick={() => toast.info('Upload functionality coming soon')}
              >
                <Camera className="size-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
              <Badge variant="secondary" className="mt-1 text-xs capitalize">
                {displayRole}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>
            Update your name, email, and personal details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="First Name"
              required
              error={errors.firstName?.message}
            >
              <Input {...register('firstName')} placeholder="John" />
            </FormFieldWrapper>
            <FormFieldWrapper
              label="Last Name"
              required
              error={errors.lastName?.message}
            >
              <Input {...register('lastName')} placeholder="Doe" />
            </FormFieldWrapper>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Email"
              required
              error={errors.email?.message}
            >
              <Input
                {...register('email')}
                type="email"
                placeholder="john@company.com"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              label="Phone"
              error={errors.phone?.message}
            >
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </FormFieldWrapper>
          </div>
          <FormFieldWrapper
            label="Bio"
            description="Brief description for your profile. Max 300 characters."
            error={errors.bio?.message}
          >
            <Textarea
              {...register('bio')}
              placeholder="Tell us about yourself..."
              className="min-h-[80px] resize-none"
            />
          </FormFieldWrapper>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Password / Security Tab
// ---------------------------------------------------------------------------

function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    void data;
    setIsSaving(false);
    reset();
    toast.success('Password updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              label="Current Password"
              required
              error={errors.currentPassword?.message}
            >
              <div className="relative">
                <Input
                  {...register('currentPassword')}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex={-1}
                >
                  {showCurrent ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FormFieldWrapper>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="New Password"
                required
                error={errors.newPassword?.message}
              >
                <div className="relative">
                  <Input
                    {...register('newPassword')}
                    type={showNew ? 'text' : 'password'}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNew(!showNew)}
                    tabIndex={-1}
                  >
                    {showNew ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormFieldWrapper>
              <FormFieldWrapper
                label="Confirm New Password"
                required
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormFieldWrapper>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <KeyRound className="mr-2 size-4" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {twoFAEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-muted-foreground">
                {twoFAEnabled
                  ? 'Your account is protected with 2FA.'
                  : 'Enable 2FA to add an extra layer of security.'}
              </p>
            </div>
            <Switch
              checked={twoFAEnabled}
              onCheckedChange={(checked: boolean) => {
                setTwoFAEnabled(checked);
                toast.success(
                  checked
                    ? 'Two-factor authentication enabled'
                    : 'Two-factor authentication disabled',
                );
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              device: 'MacBook Pro - Chrome',
              location: 'San Francisco, US',
              current: true,
              lastActive: 'Now',
            },
            {
              device: 'iPhone 15 - Safari',
              location: 'San Francisco, US',
              current: false,
              lastActive: '2 hours ago',
            },
            {
              device: 'Windows PC - Firefox',
              location: 'New York, US',
              current: false,
              lastActive: '3 days ago',
            },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <Monitor className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.device}</p>
                    {session.current && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] leading-tight"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.location} &middot; {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    toast.success(`Session on ${session.device} revoked`)
                  }
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notifications Tab
// ---------------------------------------------------------------------------

function NotificationSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNewEmployee: true,
    emailLeaveRequest: true,
    emailAttendance: false,
    emailWeeklyReport: true,
    pushNewEmployee: true,
    pushLeaveRequest: true,
    pushAttendance: true,
    pushWeeklyReport: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    toast.success('Notification preferences saved');
  };

  const notificationRows = [
    {
      title: 'New Employee Added',
      description: 'When a new employee is added to the system.',
      emailKey: 'emailNewEmployee' as const,
      pushKey: 'pushNewEmployee' as const,
    },
    {
      title: 'Leave Requests',
      description: 'When an employee submits a leave request.',
      emailKey: 'emailLeaveRequest' as const,
      pushKey: 'pushLeaveRequest' as const,
    },
    {
      title: 'Attendance Alerts',
      description: 'Daily attendance summary and anomaly alerts.',
      emailKey: 'emailAttendance' as const,
      pushKey: 'pushAttendance' as const,
    },
    {
      title: 'Weekly Reports',
      description: 'Weekly summary of all activities.',
      emailKey: 'emailWeeklyReport' as const,
      pushKey: 'pushWeeklyReport' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you want to be notified about activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="mb-2 grid grid-cols-[1fr_80px_80px] items-center gap-4 px-1">
            <div />
            <p className="text-center text-xs font-medium text-muted-foreground">
              Email
            </p>
            <p className="text-center text-xs font-medium text-muted-foreground">
              Push
            </p>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {notificationRows.map((row) => (
              <div
                key={row.title}
                className="grid grid-cols-[1fr_80px_80px] items-center gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.description}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    size="sm"
                    checked={notifications[row.emailKey]}
                    onCheckedChange={() => toggleNotification(row.emailKey)}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    size="sm"
                    checked={notifications[row.pushKey]}
                    onCheckedChange={() => toggleNotification(row.pushKey)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Appearance Tab
// ---------------------------------------------------------------------------

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const currentTheme = mounted ? theme : 'system';

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      preview: 'bg-white border-2',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      preview: 'bg-zinc-900 border-2',
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      preview:
        'bg-gradient-to-br from-white from-50% to-zinc-900 to-50% border-2',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>
            Select your preferred color theme for the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = currentTheme === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'group flex flex-col items-center gap-3 rounded-lg border p-4 transition-all hover:border-foreground/20',
                    isActive
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-12 items-center justify-center rounded-lg',
                      t.preview,
                      isActive ? 'border-primary' : 'border-border',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-5',
                        t.value === 'dark'
                          ? 'text-white'
                          : t.value === 'light'
                            ? 'text-zinc-900'
                            : 'text-zinc-500',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Language & Region</CardTitle>
          <CardDescription>
            Set your preferred language, timezone, and date format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm">Language</Label>
              <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Timezone</Label>
              <Select value={timezone} onValueChange={(v) => v && setTimezone(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Greenwich Mean Time (GMT)
                  </SelectItem>
                  <SelectItem value="Europe/Berlin">
                    Central European Time (CET)
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo">
                    Japan Standard Time (JST)
                  </SelectItem>
                  <SelectItem value="Asia/Kolkata">
                    India Standard Time (IST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Date Format</Label>
              <Select value={dateFormat} onValueChange={(v) => v && setDateFormat(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------

const settingsTabs = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <Icon className="mr-1.5 size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
