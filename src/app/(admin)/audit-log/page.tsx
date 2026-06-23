'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Download,
  ChevronDown,
  ChevronRight,
  Globe,
  Monitor,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionType = 'create' | 'update' | 'delete' | 'login' | 'export';
type ModuleType =
  | 'Employees'
  | 'Departments'
  | 'Payroll'
  | 'Settings'
  | 'Auth'
  | 'Documents'
  | 'Reports'
  | 'Leaves'
  | 'Attendance';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: { name: string; initials: string };
  action: ActionType;
  module: ModuleType;
  description: string;
  ip: string;
  browser: string;
  details?: {
    before?: Record<string, string>;
    after?: Record<string, string>;
  };
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2026-06-18T14:45:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Employees',
    description: 'Updated employee profile for Mike Ross',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { department: 'Engineering', title: 'Software Engineer' },
      after: { department: 'Engineering', title: 'Senior Software Engineer' },
    },
  },
  {
    id: '2',
    timestamp: '2026-06-18T14:30:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'create',
    module: 'Employees',
    description: 'Created new employee: Jessica Wang',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '3',
    timestamp: '2026-06-18T13:15:00',
    user: { name: 'Sarah Chen', initials: 'SC' },
    action: 'login',
    module: 'Auth',
    description: 'Logged in successfully',
    ip: '10.0.0.45',
    browser: 'Firefox 130 on Windows',
  },
  {
    id: '4',
    timestamp: '2026-06-18T12:00:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Payroll',
    description: 'Processed June payroll for 75 employees',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { status: 'Pending' },
      after: { status: 'Processed', totalAmount: '$425,000' },
    },
  },
  {
    id: '5',
    timestamp: '2026-06-18T11:30:00',
    user: { name: 'Tom Wilson', initials: 'TW' },
    action: 'delete',
    module: 'Documents',
    description: 'Deleted expired document: Q1 Tax Form',
    ip: '10.0.0.52',
    browser: 'Safari 19 on macOS',
  },
  {
    id: '6',
    timestamp: '2026-06-18T10:00:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'export',
    module: 'Reports',
    description: 'Exported Headcount Report',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '7',
    timestamp: '2026-06-18T09:30:00',
    user: { name: 'Emily Carter', initials: 'EC' },
    action: 'login',
    module: 'Auth',
    description: 'Logged in successfully',
    ip: '10.0.0.38',
    browser: 'Chrome 126 on Windows',
  },
  {
    id: '8',
    timestamp: '2026-06-18T09:15:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Settings',
    description: 'Updated company holiday calendar for Q3',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { holidays: '10 configured' },
      after: { holidays: '12 configured' },
    },
  },
  {
    id: '9',
    timestamp: '2026-06-17T17:45:00',
    user: { name: 'Rachel Kim', initials: 'RK' },
    action: 'create',
    module: 'Leaves',
    description: 'Submitted annual leave request for Jul 1-5',
    ip: '10.0.0.67',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '10',
    timestamp: '2026-06-17T16:30:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Employees',
    description: 'Updated salary for David Park',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { salary: '$85,000' },
      after: { salary: '$92,000' },
    },
  },
  {
    id: '11',
    timestamp: '2026-06-17T15:00:00',
    user: { name: 'Tom Wilson', initials: 'TW' },
    action: 'export',
    module: 'Reports',
    description: 'Exported Attendance Report for May',
    ip: '10.0.0.52',
    browser: 'Safari 19 on macOS',
  },
  {
    id: '12',
    timestamp: '2026-06-17T14:20:00',
    user: { name: 'Sarah Chen', initials: 'SC' },
    action: 'update',
    module: 'Departments',
    description: 'Updated Engineering department head to Alex Turner',
    ip: '10.0.0.45',
    browser: 'Firefox 130 on Windows',
    details: {
      before: { head: 'James Chen' },
      after: { head: 'Alex Turner' },
    },
  },
  {
    id: '13',
    timestamp: '2026-06-17T11:30:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'create',
    module: 'Departments',
    description: 'Created new department: Data Science',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '14',
    timestamp: '2026-06-17T10:45:00',
    user: { name: 'Emily Carter', initials: 'EC' },
    action: 'update',
    module: 'Attendance',
    description: 'Approved timesheet for week of Jun 9-13',
    ip: '10.0.0.38',
    browser: 'Chrome 126 on Windows',
  },
  {
    id: '15',
    timestamp: '2026-06-17T09:00:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'login',
    module: 'Auth',
    description: 'Logged in successfully',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '16',
    timestamp: '2026-06-16T17:00:00',
    user: { name: 'Rachel Kim', initials: 'RK' },
    action: 'update',
    module: 'Employees',
    description: 'Updated emergency contact for self',
    ip: '10.0.0.67',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { emergencyContact: 'John Kim - 555-0101' },
      after: { emergencyContact: 'Lisa Kim - 555-0202' },
    },
  },
  {
    id: '17',
    timestamp: '2026-06-16T15:30:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'delete',
    module: 'Employees',
    description: 'Archived employee record for Mark Stevens (terminated)',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '18',
    timestamp: '2026-06-16T14:00:00',
    user: { name: 'Tom Wilson', initials: 'TW' },
    action: 'create',
    module: 'Documents',
    description: 'Uploaded Q2 Tax Filing documents',
    ip: '10.0.0.52',
    browser: 'Safari 19 on macOS',
  },
  {
    id: '19',
    timestamp: '2026-06-16T12:15:00',
    user: { name: 'Sarah Chen', initials: 'SC' },
    action: 'export',
    module: 'Reports',
    description: 'Exported Payroll Summary for May',
    ip: '10.0.0.45',
    browser: 'Firefox 130 on Windows',
  },
  {
    id: '20',
    timestamp: '2026-06-16T10:30:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Settings',
    description: 'Updated password policy: minimum 12 characters',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { minLength: '8 characters' },
      after: { minLength: '12 characters' },
    },
  },
  {
    id: '21',
    timestamp: '2026-06-15T16:45:00',
    user: { name: 'Emily Carter', initials: 'EC' },
    action: 'create',
    module: 'Leaves',
    description: 'Submitted sick leave for Jun 16',
    ip: '10.0.0.38',
    browser: 'Chrome 126 on Windows',
  },
  {
    id: '22',
    timestamp: '2026-06-15T14:00:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'update',
    module: 'Payroll',
    description: 'Adjusted overtime rates for Q3',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
    details: {
      before: { overtimeRate: '1.5x' },
      after: { overtimeRate: '1.75x' },
    },
  },
  {
    id: '23',
    timestamp: '2026-06-15T11:20:00',
    user: { name: 'Rachel Kim', initials: 'RK' },
    action: 'login',
    module: 'Auth',
    description: 'Logged in successfully',
    ip: '10.0.0.67',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '24',
    timestamp: '2026-06-15T10:00:00',
    user: { name: 'Admin User', initials: 'AU' },
    action: 'create',
    module: 'Employees',
    description: 'Created new employee: Priya Sharma',
    ip: '192.168.1.100',
    browser: 'Chrome 126 on macOS',
  },
  {
    id: '25',
    timestamp: '2026-06-14T16:30:00',
    user: { name: 'Tom Wilson', initials: 'TW' },
    action: 'update',
    module: 'Documents',
    description: 'Updated company handbook to v3.2',
    ip: '10.0.0.52',
    browser: 'Safari 19 on macOS',
    details: {
      before: { version: 'v3.1' },
      after: { version: 'v3.2' },
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const actionBadgeConfig: Record<
  ActionType,
  { label: string; className: string }
> = {
  create: {
    label: 'Create',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  update: {
    label: 'Update',
    className:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  },
  delete: {
    label: 'Delete',
    className: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  },
  login: {
    label: 'Login',
    className:
      'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
  },
  export: {
    label: 'Export',
    className:
      'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  },
};

function getRelativeTime(timestamp: string): string {
  const now = new Date('2026-06-18T15:00:00');
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function AuditLogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-32" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entry Row
// ---------------------------------------------------------------------------

function AuditEntryRow({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: AuditEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const badge = actionBadgeConfig[entry.action];
  const hasDetails = !!entry.details;

  return (
    <div className="group rounded-lg border bg-card transition-colors hover:bg-muted/30">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {/* Expand icon */}
        <div className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
          {hasDetails ? (
            isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )
          ) : (
            <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          )}
        </div>

        {/* Avatar */}
        <Avatar size="sm">
          <AvatarFallback className="text-[10px]">
            {entry.user.initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 text-sm font-medium">
            {entry.user.name}
          </span>

          <Badge
            className={cn(
              'w-fit border-transparent text-[11px] font-medium',
              badge.className
            )}
          >
            {badge.label}
          </Badge>

          <span className="min-w-0 truncate text-sm text-muted-foreground">
            {entry.description}
          </span>
        </div>

        {/* Module */}
        <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
          {entry.module}
        </Badge>

        {/* Timestamp */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="shrink-0 text-xs text-muted-foreground" />
              }
            >
              {getRelativeTime(entry.timestamp)}
            </TooltipTrigger>
            <TooltipContent>{formatTimestamp(entry.timestamp)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t bg-muted/20 px-4 py-3 pl-12">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="size-3.5 shrink-0" />
              <span>IP: {entry.ip}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Monitor className="size-3.5 shrink-0" />
              <span>{entry.browser}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-3.5 shrink-0" />
              <span>{formatTimestamp(entry.timestamp)}</span>
            </div>
          </div>

          {entry.details && (
            <div className="mt-3 rounded-md border bg-background p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Changes
              </p>
              <div className="space-y-1.5">
                {Object.keys(entry.details.after ?? {}).map((key) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="font-medium capitalize text-muted-foreground">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    {entry.details?.before?.[key] && (
                      <>
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-700 line-through dark:bg-red-950/50 dark:text-red-400">
                          {entry.details.before[key]}
                        </span>
                        <span className="text-muted-foreground">&rarr;</span>
                      </>
                    )}
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      {entry.details?.after?.[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

const uniqueUsers = [
  ...new Set(mockAuditEntries.map((e) => e.user.name)),
].sort();
const uniqueModules = [
  ...new Set(mockAuditEntries.map((e) => e.module)),
].sort();

export default function AuditLogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [exportOpen, setExportOpen] = useState(false);
  const [exportSubmitting, setExportSubmitting] = useState(false);
  const [exportDateFrom, setExportDateFrom] = useState('');
  const [exportDateTo, setExportDateTo] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [exportUserActions, setExportUserActions] = useState(true);
  const [exportSystemEvents, setExportSystemEvents] = useState(true);
  const [exportLoginActivity, setExportLoginActivity] = useState(true);

  function resetExportForm() {
    setExportDateFrom('');
    setExportDateTo('');
    setExportFormat('');
    setExportUserActions(true);
    setExportSystemEvents(true);
    setExportLoginActivity(true);
  }

  async function handleExport() {
    setExportSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Audit log exported');
    setExportSubmitting(false);
    setExportOpen(false);
    resetExportForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = useMemo(() => {
    return mockAuditEntries.filter((entry) => {
      if (
        search &&
        !entry.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (actionFilter !== 'all' && entry.action !== actionFilter) {
        return false;
      }
      if (userFilter !== 'all' && entry.user.name !== userFilter) {
        return false;
      }
      if (moduleFilter !== 'all' && entry.module !== moduleFilter) {
        return false;
      }
      return true;
    });
  }, [search, actionFilter, userFilter, moduleFilter]);

  const totalPages = Math.ceil(filteredEntries.length / PAGE_SIZE);
  const paginatedEntries = filteredEntries.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, actionFilter, userFilter, moduleFilter]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (isLoading) {
    return <AuditLogSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Audit Log">
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => setExportOpen(true)}
        >
          <Download className="size-4" />
          Export Log
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by description..."
          className="w-full sm:w-64"
        />

        <Select
          value={actionFilter}
          onValueChange={(v) => v && setActionFilter(v)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="export">Export</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={userFilter}
          onValueChange={(v) => v && setUserFilter(v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {uniqueUsers.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={moduleFilter}
          onValueChange={(v) => v && setModuleFilter(v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {uniqueModules.map((mod) => (
              <SelectItem key={mod} value={mod}>
                {mod}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredEntries.length} log{' '}
          {filteredEntries.length === 1 ? 'entry' : 'entries'} found
        </p>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {paginatedEntries.length > 0 ? (
          paginatedEntries.map((entry) => (
            <AuditEntryRow
              key={entry.id}
              entry={entry}
              isExpanded={expandedIds.has(entry.id)}
              onToggle={() => toggleExpanded(entry.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
            <Clock className="size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No log entries match your filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Export Log Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Log</DialogTitle>
            <DialogDescription>
              Configure the audit log export settings.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Date Range From" required>
              <DatePicker
                value={exportDateFrom}
                onChange={(v) => setExportDateFrom(v)}
                placeholder="Select start date"
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Date Range To" required>
              <DatePicker
                value={exportDateTo}
                onChange={(v) => setExportDateTo(v)}
                placeholder="Select end date"
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Format" required>
              <Select value={exportFormat} onValueChange={(v) => v && setExportFormat(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <div className="space-y-3">
              <Label>Include</Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={exportUserActions}
                  onCheckedChange={setExportUserActions}
                />
                <Label className="font-normal">User Actions</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={exportSystemEvents}
                  onCheckedChange={setExportSystemEvents}
                />
                <Label className="font-normal">System Events</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={exportLoginActivity}
                  onCheckedChange={setExportLoginActivity}
                />
                <Label className="font-normal">Login Activity</Label>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportOpen(false)}
              disabled={exportSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportSubmitting || !exportDateFrom || !exportDateTo || !exportFormat}
            >
              {exportSubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
