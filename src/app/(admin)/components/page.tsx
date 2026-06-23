'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Loader2,
  Heart,
  Star,
  Bell,
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Inbox,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Download,
  Copy,
  Share2,
  CheckCircle2,
  Info,
  XCircle,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Shared Components
import {
  StatCard,
  StatusBadge,
  EmptyState,
  LoadingState,
  ErrorState,
  PageHeader,
  ChartCard,
  AvatarGroup,
} from '@/components/shared';

// Chart Components
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
} from '@/components/charts';

// Data Table
import { DataTable } from '@/components/data-table';

// ---------------------------------------------------------------------------
// Section wrapper for consistent layout inside each tab
// ---------------------------------------------------------------------------
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sample data for Data Table
// ---------------------------------------------------------------------------
interface SampleRow {
  name: string;
  email: string;
  role: string;
  status: string;
  date: string;
}

const sampleTableData: SampleRow[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer', status: 'active', date: '2025-01-15' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', status: 'on-leave', date: '2025-02-20' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Manager', status: 'active', date: '2025-03-10' },
  { name: 'David Lee', email: 'david@example.com', role: 'Analyst', status: 'inactive', date: '2025-04-05' },
  { name: 'Eve Martinez', email: 'eve@example.com', role: 'Engineer', status: 'pending', date: '2025-05-12' },
];

const sampleTableColumns: ColumnDef<SampleRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  { accessorKey: 'date', header: 'Date' },
];

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------
const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 7400 },
  { month: 'May', revenue: 6800 },
  { month: 'Jun', revenue: 8200 },
];

const weeklyVisitorData = [
  { day: 'Mon', visitors: 420 },
  { day: 'Tue', visitors: 580 },
  { day: 'Wed', visitors: 520 },
  { day: 'Thu', visitors: 740 },
  { day: 'Fri', visitors: 680 },
  { day: 'Sat', visitors: 340 },
  { day: 'Sun', visitors: 290 },
];

const browserData = [
  { name: 'Chrome', value: 45 },
  { name: 'Safari', value: 25 },
  { name: 'Firefox', value: 15 },
  { name: 'Edge', value: 10 },
  { name: 'Other', value: 5 },
];

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1800 },
  { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3100 },
  { month: 'May', users: 4200 },
  { month: 'Jun', users: 5600 },
];

// ---------------------------------------------------------------------------
// Avatar group data
// ---------------------------------------------------------------------------
const avatarGroupItems = [
  { name: 'Alice Johnson', fallback: 'AJ' },
  { name: 'Bob Smith', fallback: 'BS' },
  { name: 'Carol White', fallback: 'CW' },
  { name: 'David Lee', fallback: 'DL' },
  { name: 'Eve Martinez', fallback: 'EM' },
];

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function ComponentsShowcasePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader
          title="Components"
          description="Design system reference — browse all available UI components, patterns, and charts."
        />

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="data-display">Data Display</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          {/* ============================================================= */}
          {/* TAB 1 — General                                               */}
          {/* ============================================================= */}
          <TabsContent value="general" className="space-y-6">
            {/* Buttons */}
            <Section
              title="Buttons"
              description="Button variants, sizes, icons, and states."
            >
              {/* Row 1 — variants */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Row 2 — sizes */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* Row 3 — with icons */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">With Icons</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button>
                    <Plus data-icon="inline-start" />
                    Add Item
                  </Button>
                  <Button variant="outline">
                    <Download data-icon="inline-start" />
                    Export
                  </Button>
                  <Button variant="secondary">
                    Share
                    <Share2 data-icon="inline-end" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Star />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Bell />
                  </Button>
                  <Button variant="outline" size="icon-sm">
                    <Copy />
                  </Button>
                  <Button variant="outline" size="icon-xs">
                    <Settings />
                  </Button>
                </div>
              </div>

              {/* Row 4 — loading & disabled */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Loading &amp; Disabled</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button disabled>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Loading...
                  </Button>
                  <Button variant="outline" disabled>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Saving...
                  </Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="destructive" disabled>Disabled</Button>
                </div>
              </div>
            </Section>

            {/* Badges */}
            <Section
              title="Badges"
              description="Badge variants and StatusBadge component for semantic status indicators."
            >
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Badge Variants</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Status Badges</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="active" />
                  <StatusBadge status="inactive" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="approved" />
                  <StatusBadge status="rejected" />
                  <StatusBadge status="on-leave" />
                  <StatusBadge status="present" />
                  <StatusBadge status="absent" />
                  <StatusBadge status="late" />
                </div>
              </div>
            </Section>

            {/* Avatars */}
            <Section
              title="Avatars"
              description="Single avatars at different sizes and AvatarGroup for stacked display."
            >
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar size="sm">
                      <AvatarImage src="https://i.pravatar.cc/48?u=sm" alt="Small avatar" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-muted-foreground">sm</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar size="default">
                      <AvatarImage src="https://i.pravatar.cc/64?u=md" alt="Default avatar" />
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-muted-foreground">default</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar size="lg">
                      <AvatarImage src="https://i.pravatar.cc/80?u=lg" alt="Large avatar" />
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-muted-foreground">lg</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-muted-foreground">fallback</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Avatar Group (max 3 shown of 5)</p>
                <AvatarGroup
                  avatars={avatarGroupItems}
                  max={3}
                  size="md"
                />
              </div>
            </Section>

            {/* Separator */}
            <Section
              title="Separator"
              description="Visual dividers in horizontal and vertical orientations."
            >
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Horizontal</p>
                  <p className="text-sm text-muted-foreground">Content above</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground">Content below</p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Vertical</p>
                  <div className="flex h-8 items-center gap-4">
                    <span className="text-sm">Section A</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">Section B</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">Section C</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">With Label</p>
                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                  </div>
                </div>
              </div>
            </Section>
          </TabsContent>

          {/* ============================================================= */}
          {/* TAB 2 — Data Display                                          */}
          {/* ============================================================= */}
          <TabsContent value="data-display" className="space-y-6">
            {/* Cards */}
            <Section
              title="Cards"
              description="Card layouts from simple to interactive."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Simple card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                    <CardDescription>A basic card with a title and description.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Cards are surface-level containers for grouping related content and actions.
                    </p>
                  </CardContent>
                </Card>

                {/* Card with footer */}
                <Card>
                  <CardHeader>
                    <CardTitle>With Footer</CardTitle>
                    <CardDescription>Card with header, content, and footer.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Use the footer for secondary actions or metadata.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">Last updated 2 hours ago</p>
                  </CardFooter>
                </Card>

                {/* Interactive card */}
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Interactive</CardTitle>
                    <CardDescription>Hover to see the shadow effect.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add cursor-pointer and hover:shadow-md for clickable cards.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Stat Cards */}
            <Section
              title="Stat Cards"
              description="Metric cards with trend indicators for dashboards."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Revenue"
                  value="$48,200"
                  change={12.5}
                  changeLabel="vs last month"
                  icon={DollarSign}
                  trend="up"
                />
                <StatCard
                  title="Active Users"
                  value="2,420"
                  change={8.2}
                  changeLabel="vs last month"
                  icon={Users}
                  trend="up"
                />
                <StatCard
                  title="Bounce Rate"
                  value="24.3%"
                  change={3.1}
                  changeLabel="vs last month"
                  icon={TrendingUp}
                  trend="down"
                />
                <StatCard
                  title="Avg. Session"
                  value="4m 32s"
                  change={0}
                  changeLabel="no change"
                  icon={Activity}
                  trend="neutral"
                />
              </div>
            </Section>

            {/* Tables */}
            <Section
              title="Data Table"
              description="Sortable, filterable table built with TanStack Table."
            >
              <DataTable
                columns={sampleTableColumns}
                data={sampleTableData}
                searchKey="name"
                searchPlaceholder="Search by name..."
                showPagination={false}
                showColumnVisibility={false}
              />
            </Section>

            {/* Tabs Demo */}
            <Section
              title="Tabs"
              description="Tab component for switching between views."
            >
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Overview</h4>
                    <p className="text-sm text-muted-foreground">
                      This is the overview panel. Use tabs to organise content into logical groups that users can switch between without leaving the page.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Analytics content goes here. Charts, metrics, and insights can be displayed in this panel.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="reports" className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate and view reports in this section. Export options and filters can be placed here.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Section>
          </TabsContent>

          {/* ============================================================= */}
          {/* TAB 3 — Feedback                                              */}
          {/* ============================================================= */}
          <TabsContent value="feedback" className="space-y-6">
            {/* Skeleton Loaders */}
            <Section
              title="Skeleton Loaders"
              description="Placeholder shimmer effects for loading states."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Text skeleton */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Text Lines</p>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </div>

                {/* Card skeleton */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Card</p>
                  <div className="space-y-3 rounded-lg border p-4">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>

                {/* Avatar + text skeleton */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Avatar + Text</p>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </div>

                {/* Table skeleton */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Table Rows</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((row) => (
                      <div key={row} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Empty State */}
            <Section
              title="Empty State"
              description="Shown when a list or section has no content."
            >
              <EmptyState
                icon={Inbox}
                title="No results found"
                description="There are no items to display. Try adjusting your filters or add a new item to get started."
                action={
                  <Button>
                    <Plus data-icon="inline-start" />
                    Add Item
                  </Button>
                }
              />
            </Section>

            {/* Loading State */}
            <Section
              title="Loading State"
              description="Full-area loading indicator with optional message."
            >
              <LoadingState message="Fetching data, please wait..." />
            </Section>

            {/* Error State */}
            <Section
              title="Error State"
              description="Error display with an optional retry action."
            >
              <ErrorState
                title="Failed to load data"
                message="An unexpected error occurred while fetching the resource. Please check your connection and try again."
                onRetry={() => alert('Retry clicked')}
              />
            </Section>

            {/* Tooltips */}
            <Section
              title="Tooltips"
              description="Contextual hints appearing on hover, positioned on each side."
            >
              <div className="flex flex-wrap items-center justify-center gap-4 py-8">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" />}>
                    <ArrowUp data-icon="inline-start" />
                    Top
                  </TooltipTrigger>
                  <TooltipContent side="top">Tooltip on top</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" />}>
                    <ArrowRight data-icon="inline-start" />
                    Right
                  </TooltipTrigger>
                  <TooltipContent side="right">Tooltip on right</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" />}>
                    <ArrowDown data-icon="inline-start" />
                    Bottom
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" />}>
                    <ArrowLeft data-icon="inline-start" />
                    Left
                  </TooltipTrigger>
                  <TooltipContent side="left">Tooltip on left</TooltipContent>
                </Tooltip>
              </div>
            </Section>

            {/* Toasts */}
            <Section
              title="Toasts"
              description="Notification toasts using Sonner — success, error, warning, info, and more."
            >
              <p className="text-xs text-muted-foreground">
                Click the buttons below to trigger different toast variants.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success('Changes saved', {
                      description: 'Your profile has been updated successfully.',
                    })
                  }
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Success
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.error('Something went wrong', {
                      description: 'Please try again or contact support.',
                    })
                  }
                >
                  <XCircle className="size-4 text-red-500" />
                  Error
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.warning('Unsaved changes', {
                      description: 'You have unsaved changes that will be lost.',
                    })
                  }
                >
                  <TriangleAlert className="size-4 text-amber-500" />
                  Warning
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.info('New update available', {
                      description: 'Version 2.1 is ready to install.',
                    })
                  }
                >
                  <Info className="size-4 text-blue-500" />
                  Info
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.loading('Processing...', {
                      description: 'Please wait while we process your request.',
                    })
                  }
                >
                  <Loader2 className="size-4 animate-spin" />
                  Loading
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast('Event scheduled', {
                      description: 'Meeting with team at 3:00 PM',
                      action: {
                        label: 'Undo',
                        onClick: () => toast.info('Event cancelled'),
                      },
                    })
                  }
                >
                  With Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                      {
                        loading: 'Uploading file...',
                        success: 'File uploaded successfully!',
                        error: 'Upload failed. Please try again.',
                      },
                    )
                  }
                >
                  Promise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.dismiss()}
                >
                  Dismiss All
                </Button>
              </div>
            </Section>
          </TabsContent>

          {/* ============================================================= */}
          {/* TAB 4 — Overlays                                              */}
          {/* ============================================================= */}
          <TabsContent value="overlays" className="space-y-6">
            {/* Dialog */}
            <Section
              title="Dialog"
              description="Modal dialog for focused interactions."
            >
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Name</label>
                      <div className="rounded-md border px-3 py-2 text-sm">John Doe</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Email</label>
                      <div className="rounded-md border px-3 py-2 text-sm">john@example.com</div>
                    </div>
                  </DialogBody>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                      Cancel
                    </DialogClose>
                    <Button onClick={() => setDialogOpen(false)}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>

            {/* Sheet */}
            <Section
              title="Sheet"
              description="Slide-over panel from the edge of the screen."
            >
              <Button variant="outline" onClick={() => setSheetOpen(true)}>
                Open Sheet
              </Button>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Notification Settings</SheetTitle>
                    <SheetDescription>
                      Configure how and when you receive notifications.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 space-y-4 px-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Badge variant="secondary">On</Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">Browser push alerts</p>
                      </div>
                      <Badge variant="outline">Off</Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">Text message alerts</p>
                      </div>
                      <Badge variant="outline">Off</Badge>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose render={<Button variant="outline" />}>
                      Cancel
                    </SheetClose>
                    <Button onClick={() => setSheetOpen(false)}>Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </Section>

            {/* Alert Dialog */}
            <Section
              title="Alert Dialog"
              description="Confirmation dialog for destructive or irreversible actions."
            >
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                  <Trash2 data-icon="inline-start" />
                  Delete Account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-red-50 dark:bg-red-950/50">
                      <AlertTriangle className="text-red-600 dark:text-red-400" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => setAlertOpen(false)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Section>
          </TabsContent>

          {/* ============================================================= */}
          {/* TAB 5 — Charts                                                */}
          {/* ============================================================= */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard
                title="Monthly Revenue"
                description="Revenue trend over the last 6 months."
              >
                <LineChart
                  data={revenueData}
                  xKey="month"
                  lines={[{ key: 'revenue', name: 'Revenue' }]}
                  height={280}
                />
              </ChartCard>

              <ChartCard
                title="Weekly Visitors"
                description="Site visitors per day of the week."
              >
                <BarChart
                  data={weeklyVisitorData}
                  xKey="day"
                  bars={[{ key: 'visitors', name: 'Visitors' }]}
                  height={280}
                />
              </ChartCard>

              <ChartCard
                title="Browser Distribution"
                description="Market share by browser."
              >
                <PieChart
                  data={browserData}
                  height={280}
                  showLegend
                />
              </ChartCard>

              <ChartCard
                title="User Growth"
                description="Cumulative user registrations over 6 months."
              >
                <AreaChart
                  data={userGrowthData}
                  xKey="month"
                  areas={[{ key: 'users', name: 'Users' }]}
                  height={280}
                />
              </ChartCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
