'use client';

import { useState } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Upload,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';
import { PageHeader, FormFieldWrapper } from '@/components/shared';

export default function FormsPage() {
  // Section 1: Text Inputs
  const [defaultInput, setDefaultInput] = useState('');
  const [placeholderInput, setPlaceholderInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [numberInput, setNumberInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // Section 2: Textarea
  const [defaultTextarea, setDefaultTextarea] = useState('');
  const [descTextarea, setDescTextarea] = useState('');
  const [errorTextarea, setErrorTextarea] = useState('');
  const [charCountTextarea, setCharCountTextarea] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing.'
  );

  // Section 3: Selects
  const [defaultSelect, setDefaultSelect] = useState('react');
  const [placeholderSelect, setPlaceholderSelect] = useState('');
  const [errorSelect, setErrorSelect] = useState('');

  // Section 4: Date Picker
  const [defaultDate, setDefaultDate] = useState('');
  const [preselectedDate, setPreselectedDate] = useState('2026-06-18');

  // Section 5: Checkboxes & Radios
  const [singleCheck, setSingleCheck] = useState(false);
  const [checkedByDefault, setCheckedByDefault] = useState(true);
  const [descCheck, setDescCheck] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [planRadio, setPlanRadio] = useState('pro');
  const [detailedRadio, setDetailedRadio] = useState('standard');

  // Section 6: Switches
  const [switchBasic, setSwitchBasic] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchDesc, setSwitchDesc] = useState(false);
  const [settingSwitches, setSettingSwitches] = useState({
    emailDigest: true,
    pushNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    autoUpdates: true,
  });

  // Section 7: Form A - Contact Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubscribe, setContactSubscribe] = useState(false);

  // Section 7: Form B - Profile Settings
  const [profileFirst, setProfileFirst] = useState('');
  const [profileLast, setProfileLast] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileNotifications, setProfileNotifications] = useState(true);

  const toggleSetting = (key: keyof typeof settingSwitches) => {
    setSettingSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forms"
        description="Form components and input elements reference."
      />

      {/* Section 1: Text Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Text Inputs</CardTitle>
          <CardDescription>
            Various text input configurations and states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldWrapper label="Default Input">
              <Input
                value={defaultInput}
                onChange={(e) => setDefaultInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Input with Placeholder">
              <Input
                placeholder="Enter your name..."
                value={placeholderInput}
                onChange={(e) => setPlaceholderInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Input with Description"
              description="This is a helper text"
            >
              <Input
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Input with Error"
              error="This field is required"
              required
            >
              <Input
                aria-invalid="true"
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Disabled Input">
              <Input disabled value="Cannot edit this" />
            </FormFieldWrapper>

            <FormFieldWrapper label="Input with Icon">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper label="Password Input">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper label="Number Input">
              <Input
                type="number"
                placeholder="0"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Email Input">
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="URL Input">
              <Input
                type="url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Textarea */}
      <Card>
        <CardHeader>
          <CardTitle>Textarea</CardTitle>
          <CardDescription>
            Multi-line text input variations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldWrapper label="Default Textarea">
              <Textarea
                value={defaultTextarea}
                onChange={(e) => setDefaultTextarea(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Textarea with Description"
              description="Provide a detailed description of your request."
            >
              <Textarea
                value={descTextarea}
                onChange={(e) => setDescTextarea(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Textarea with Error"
              error="Message must be at least 10 characters"
              required
            >
              <Textarea
                aria-invalid="true"
                value={errorTextarea}
                onChange={(e) => setErrorTextarea(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Disabled Textarea">
              <Textarea disabled value="This textarea is disabled and cannot be edited." />
            </FormFieldWrapper>

            <FormFieldWrapper label="Textarea with Character Count">
              <div>
                <Textarea
                  maxLength={500}
                  value={charCountTextarea}
                  onChange={(e) => setCharCountTextarea(e.target.value)}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {charCountTextarea.length}/500
                </p>
              </div>
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Select Dropdowns */}
      <Card>
        <CardHeader>
          <CardTitle>Select Dropdowns</CardTitle>
          <CardDescription>
            Dropdown select components with various states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldWrapper label="Default Select">
              <Select
                value={defaultSelect}
                onValueChange={(v) => v && setDefaultSelect(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Select with Placeholder">
              <Select
                value={placeholderSelect}
                onValueChange={(v) => v && setPlaceholderSelect(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a department..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Disabled Select">
              <Select value="engineering" disabled>
                <SelectTrigger className="w-full" disabled>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Select with Error"
              error="Please select an option"
              required
            >
              <Select
                value={errorSelect}
                onValueChange={(v) => v && setErrorSelect(v)}
              >
                <SelectTrigger className="w-full" aria-invalid="true">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Date Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Date Picker</CardTitle>
          <CardDescription>
            Date selection components.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormFieldWrapper label="Default Date Picker">
              <DatePicker
                value={defaultDate}
                onChange={setDefaultDate}
                placeholder="Pick a date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Pre-selected Date">
              <DatePicker
                value={preselectedDate}
                onChange={setPreselectedDate}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Disabled Date Picker">
              <DatePicker
                value="2026-01-15"
                disabled
                placeholder="Cannot change"
              />
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Checkboxes & Radio Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Checkboxes &amp; Radio Buttons</CardTitle>
          <CardDescription>
            Selection controls for single and multiple choices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Checkboxes */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">
                Checkboxes
              </h3>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="single-check"
                  checked={singleCheck}
                  onCheckedChange={(checked) =>
                    setSingleCheck(checked as boolean)
                  }
                />
                <Label htmlFor="single-check">Accept terms and conditions</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="checked-default"
                  checked={checkedByDefault}
                  onCheckedChange={(checked) =>
                    setCheckedByDefault(checked as boolean)
                  }
                />
                <Label htmlFor="checked-default">Checked by default</Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="desc-check"
                  checked={descCheck}
                  onCheckedChange={(checked) =>
                    setDescCheck(checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="desc-check">Newsletter subscription</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive weekly updates about new features and improvements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="disabled-check" disabled />
                <Label
                  htmlFor="disabled-check"
                  className="opacity-50"
                >
                  Disabled checkbox
                </Label>
              </div>

              <div className="space-y-3">
                <Label>Notification preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="email-notif"
                      checked={emailNotif}
                      onCheckedChange={(checked) =>
                        setEmailNotif(checked as boolean)
                      }
                    />
                    <Label htmlFor="email-notif" className="font-normal">
                      Email notifications
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sms-notif"
                      checked={smsNotif}
                      onCheckedChange={(checked) =>
                        setSmsNotif(checked as boolean)
                      }
                    />
                    <Label htmlFor="sms-notif" className="font-normal">
                      SMS notifications
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="push-notif"
                      checked={pushNotif}
                      onCheckedChange={(checked) =>
                        setPushNotif(checked as boolean)
                      }
                    />
                    <Label htmlFor="push-notif" className="font-normal">
                      Push notifications
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Radio Buttons */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">
                Radio Buttons
              </h3>

              <div className="space-y-3">
                <Label>Select a plan</Label>
                <RadioGroup
                  value={planRadio}
                  onValueChange={setPlanRadio}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="free" id="plan-free" />
                    <Label htmlFor="plan-free" className="font-normal">
                      Free
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pro" id="plan-pro" />
                    <Label htmlFor="plan-pro" className="font-normal">
                      Pro
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="enterprise" id="plan-enterprise" />
                    <Label htmlFor="plan-enterprise" className="font-normal">
                      Enterprise
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Shipping method</Label>
                <RadioGroup
                  value={detailedRadio}
                  onValueChange={setDetailedRadio}
                >
                  <div className="flex items-start gap-2">
                    <RadioGroupItem
                      value="standard"
                      id="ship-standard"
                      className="mt-0.5"
                    />
                    <div>
                      <Label htmlFor="ship-standard" className="font-normal">
                        Standard shipping
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        5-7 business days, free
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RadioGroupItem
                      value="express"
                      id="ship-express"
                      className="mt-0.5"
                    />
                    <div>
                      <Label htmlFor="ship-express" className="font-normal">
                        Express shipping
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        2-3 business days, $9.99
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RadioGroupItem
                      value="overnight"
                      id="ship-overnight"
                      className="mt-0.5"
                    />
                    <div>
                      <Label htmlFor="ship-overnight" className="font-normal">
                        Overnight shipping
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Next business day, $24.99
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Disabled radio group</Label>
                <RadioGroup value="option-a" disabled>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option-a" id="disabled-a" />
                    <Label htmlFor="disabled-a" className="font-normal opacity-50">
                      Option A (selected)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option-b" id="disabled-b" />
                    <Label htmlFor="disabled-b" className="font-normal opacity-50">
                      Option B
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Switches / Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Switches / Toggles</CardTitle>
          <CardDescription>
            Toggle switches for on/off states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="switch-basic">Basic switch</Label>
                <Switch
                  id="switch-basic"
                  checked={switchBasic}
                  onCheckedChange={(checked: boolean) => setSwitchBasic(checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="switch-on">Enabled by default</Label>
                <Switch
                  id="switch-on"
                  checked={switchOn}
                  onCheckedChange={(checked: boolean) => setSwitchOn(checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="switch-disabled" className="opacity-50">
                  Disabled switch
                </Label>
                <Switch id="switch-disabled" disabled checked={false} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="switch-desc">Dark mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Switch between light and dark themes.
                  </p>
                </div>
                <Switch
                  id="switch-desc"
                  checked={switchDesc}
                  onCheckedChange={(checked: boolean) => setSwitchDesc(checked)}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Settings
              </h3>
              <div className="space-y-0">
                {[
                  {
                    key: 'emailDigest' as const,
                    label: 'Email digest',
                    description:
                      'Receive a daily summary of activity via email.',
                  },
                  {
                    key: 'pushNotifications' as const,
                    label: 'Push notifications',
                    description:
                      'Get notified about important updates in real-time.',
                  },
                  {
                    key: 'marketingEmails' as const,
                    label: 'Marketing emails',
                    description:
                      'Receive occasional emails about new features and offers.',
                  },
                  {
                    key: 'securityAlerts' as const,
                    label: 'Security alerts',
                    description:
                      'Get notified about suspicious activity on your account.',
                  },
                  {
                    key: 'autoUpdates' as const,
                    label: 'Automatic updates',
                    description:
                      'Automatically install the latest version when available.',
                  },
                ].map((item, index) => (
                  <div key={item.key}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between gap-4 py-4">
                      <div className="space-y-0.5">
                        <Label htmlFor={`setting-${item.key}`}>
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={`setting-${item.key}`}
                        checked={settingSwitches[item.key]}
                        onCheckedChange={() => toggleSetting(item.key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Form Layouts */}
      <Card>
        <CardHeader>
          <CardTitle>Form Layouts</CardTitle>
          <CardDescription>
            Complete form examples with various field combinations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form A: Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>
                  Send us a message and we will get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormFieldWrapper label="Name" required>
                      <Input
                        placeholder="Your name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper label="Email" required>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Subject" required>
                    <Select
                      value={contactSubject}
                      onValueChange={(v) => v && setContactSubject(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Message" required>
                    <Textarea
                      placeholder="Write your message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </FormFieldWrapper>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="contact-subscribe"
                      checked={contactSubscribe}
                      onCheckedChange={(checked) =>
                        setContactSubscribe(checked as boolean)
                      }
                    />
                    <Label htmlFor="contact-subscribe" className="font-normal">
                      Subscribe to our newsletter
                    </Label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button>Submit</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setContactName('');
                        setContactEmail('');
                        setContactSubject('');
                        setContactMessage('');
                        setContactSubscribe(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form B: Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                      <User className="size-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                      <Upload className="size-4" data-icon="inline-start" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormFieldWrapper label="First Name" required>
                      <Input
                        placeholder="John"
                        value={profileFirst}
                        onChange={(e) => setProfileFirst(e.target.value)}
                      />
                    </FormFieldWrapper>
                    <FormFieldWrapper label="Last Name" required>
                      <Input
                        placeholder="Doe"
                        value={profileLast}
                        onChange={(e) => setProfileLast(e.target.value)}
                      />
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper
                    label="Email"
                    description="Contact admin to change"
                  >
                    <Input
                      type="email"
                      disabled
                      value="john.doe@company.com"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Bio">
                    <Textarea
                      placeholder="Tell us about yourself..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Date of Birth">
                    <DatePicker
                      value={profileDob}
                      onChange={setProfileDob}
                      placeholder="Select your date of birth"
                    />
                  </FormFieldWrapper>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-notifications">
                        Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about account activity.
                      </p>
                    </div>
                    <Switch
                      id="profile-notifications"
                      checked={profileNotifications}
                      onCheckedChange={(checked: boolean) =>
                        setProfileNotifications(checked)
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProfileFirst('');
                        setProfileLast('');
                        setProfileBio('');
                        setProfileDob('');
                        setProfileNotifications(true);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
