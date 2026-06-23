'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { ChartCard } from '@/components/shared/chart-card';
import { BarChart } from '@/components/charts/bar-chart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';
import {
  Plus,
  Clock,
  TrendingUp,
  Timer,
  DollarSign,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TimesheetEmployee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  hours: Record<string, number>; // Mon-Sun
}

interface TimeEntry {
  id: string;
  employee: string;
  avatar: string;
  project: string;
  task: string;
  hours: number;
  date: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_EMPLOYEES: TimesheetEmployee[] = [
  {
    id: 'ts-1',
    name: 'Alice Johnson',
    avatar: '/avatars/alice.jpg',
    role: 'Team Lead',
    hours: { Mon: 8.5, Tue: 9.0, Wed: 8.0, Thu: 8.5, Fri: 8.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-2',
    name: 'Bob Martinez',
    avatar: '/avatars/bob.jpg',
    role: 'Developer',
    hours: { Mon: 7.5, Tue: 8.0, Wed: 8.5, Thu: 7.5, Fri: 8.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-3',
    name: 'Carol Chen',
    avatar: '/avatars/carol.jpg',
    role: 'Designer',
    hours: { Mon: 8.0, Tue: 8.0, Wed: 7.5, Thu: 8.0, Fri: 7.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-4',
    name: 'David Kim',
    avatar: '/avatars/david.jpg',
    role: 'Support',
    hours: { Mon: 8.0, Tue: 8.0, Wed: 8.0, Thu: 8.0, Fri: 8.0, Sat: 4.0, Sun: 0 },
  },
  {
    id: 'ts-5',
    name: 'Eva Patel',
    avatar: '/avatars/eva.jpg',
    role: 'QA Engineer',
    hours: { Mon: 8.0, Tue: 7.5, Wed: 8.5, Thu: 8.0, Fri: 8.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-6',
    name: 'Frank Wilson',
    avatar: '/avatars/frank.jpg',
    role: 'DevOps',
    hours: { Mon: 9.0, Tue: 8.5, Wed: 9.0, Thu: 8.5, Fri: 8.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-7',
    name: 'Grace Lee',
    avatar: '/avatars/grace.jpg',
    role: 'Analyst',
    hours: { Mon: 8.0, Tue: 8.0, Wed: 8.0, Thu: 7.5, Fri: 7.0, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-8',
    name: 'Henry Davis',
    avatar: '/avatars/henry.jpg',
    role: 'Manager',
    hours: { Mon: 8.5, Tue: 8.0, Wed: 8.0, Thu: 8.5, Fri: 7.5, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-9',
    name: 'Irene Torres',
    avatar: '/avatars/irene.jpg',
    role: 'Product Manager',
    hours: { Mon: 8.0, Tue: 8.5, Wed: 8.0, Thu: 8.0, Fri: 7.5, Sat: 0, Sun: 0 },
  },
  {
    id: 'ts-10',
    name: 'James Brown',
    avatar: '/avatars/james.jpg',
    role: 'Developer',
    hours: { Mon: 7.5, Tue: 8.0, Wed: 8.0, Thu: 9.0, Fri: 8.5, Sat: 3.0, Sun: 0 },
  },
];

const MOCK_PROJECT_HOURS = [
  { project: 'Platform v3', hours: 96 },
  { project: 'Mobile App', hours: 72 },
  { project: 'Analytics', hours: 58 },
  { project: 'CRM Integration', hours: 48 },
  { project: 'DevOps Infra', hours: 38 },
];

const MOCK_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te-1',
    employee: 'Alice Johnson',
    avatar: '/avatars/alice.jpg',
    project: 'Platform v3',
    task: 'API endpoint refactoring',
    hours: 3.5,
    date: 'Jun 18, 2026',
    notes: 'Completed auth middleware updates',
  },
  {
    id: 'te-2',
    employee: 'Bob Martinez',
    avatar: '/avatars/bob.jpg',
    project: 'Mobile App',
    task: 'Push notification service',
    hours: 4.0,
    date: 'Jun 18, 2026',
    notes: 'Implemented FCM integration',
  },
  {
    id: 'te-3',
    employee: 'Frank Wilson',
    avatar: '/avatars/frank.jpg',
    project: 'DevOps Infra',
    task: 'CI/CD pipeline optimization',
    hours: 2.5,
    date: 'Jun 18, 2026',
    notes: 'Reduced build times by 40%',
  },
  {
    id: 'te-4',
    employee: 'Carol Chen',
    avatar: '/avatars/carol.jpg',
    project: 'Platform v3',
    task: 'Dashboard redesign',
    hours: 5.0,
    date: 'Jun 17, 2026',
    notes: 'New analytics widgets and chart components',
  },
  {
    id: 'te-5',
    employee: 'James Brown',
    avatar: '/avatars/james.jpg',
    project: 'CRM Integration',
    task: 'Salesforce connector',
    hours: 6.0,
    date: 'Jun 17, 2026',
    notes: 'Syncing contacts and opportunities',
  },
  {
    id: 'te-6',
    employee: 'Eva Patel',
    avatar: '/avatars/eva.jpg',
    project: 'Analytics',
    task: 'Regression test suite',
    hours: 4.5,
    date: 'Jun 17, 2026',
    notes: 'Added 45 new test cases for reporting module',
  },
];

const WEEK_OPTIONS = [
  { value: 'current', label: 'Jun 15 - Jun 21, 2026' },
  { value: 'prev1', label: 'Jun 8 - Jun 14, 2026' },
  { value: 'prev2', label: 'Jun 1 - Jun 7, 2026' },
];

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function TimesheetGridSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-36" />
              {Array.from({ length: 8 }).map((_, j) => (
                <Skeleton key={j} className="h-8 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function TimesheetGrid() {
  const columnTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    DAYS.forEach((day) => {
      totals[day] = MOCK_EMPLOYEES.reduce(
        (sum, emp) => sum + emp.hours[day],
        0
      );
    });
    totals['total'] = MOCK_EMPLOYEES.reduce(
      (sum, emp) =>
        sum + DAYS.reduce((ds, day) => ds + emp.hours[day], 0),
      0
    );
    return totals;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly Timesheet</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 pb-2">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 z-10 bg-background px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                Employee
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </th>
              ))}
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-foreground">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EMPLOYEES.map((emp) => {
              const total = DAYS.reduce(
                (sum, day) => sum + emp.hours[day],
                0
              );
              return (
                <tr
                  key={emp.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="sticky left-0 z-10 bg-background px-4 py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarImage src={emp.avatar} alt={emp.name} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {emp.name}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {emp.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const h = emp.hours[day];
                    const isOvertime = h > 8;
                    const isZero = h === 0;
                    return (
                      <td
                        key={day}
                        className="px-3 py-2 text-center"
                      >
                        <span
                          className={cn(
                            'inline-flex min-w-[42px] items-center justify-center rounded-md px-2 py-0.5 text-sm font-medium',
                            isOvertime &&
                              'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                            isZero && 'text-muted-foreground/40',
                            !isOvertime &&
                              !isZero &&
                              'text-foreground'
                          )}
                        >
                          {isZero ? '-' : `${h.toFixed(1)}h`}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex min-w-[48px] items-center justify-center rounded-md bg-muted px-2 py-0.5 text-sm font-semibold">
                      {total.toFixed(1)}h
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td className="sticky left-0 z-10 bg-muted/30 px-4 py-2.5 text-sm font-semibold">
                Total
              </td>
              {DAYS.map((day) => (
                <td key={day} className="px-3 py-2.5 text-center">
                  <span className="text-sm font-semibold">
                    {columnTotals[day].toFixed(1)}h
                  </span>
                </td>
              ))}
              <td className="px-3 py-2.5 text-center">
                <span className="inline-flex min-w-[48px] items-center justify-center rounded-md bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
                  {columnTotals['total'].toFixed(1)}h
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
}

function RecentTimeEntries() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Time Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_TIME_ENTRIES.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
            >
              <Avatar className="size-8 mt-0.5">
                <AvatarImage src={entry.avatar} alt={entry.employee} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(entry.employee)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{entry.employee}</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {entry.hours}h
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-foreground/80">
                  {entry.task}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="size-3" />
                    {entry.project}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {entry.date}
                  </span>
                </div>
                {entry.notes && (
                  <p className="mt-1.5 text-xs text-muted-foreground italic">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Log Time dialog
// ---------------------------------------------------------------------------

const PROJECT_OPTIONS = [
  'Project Alpha',
  'Project Beta',
  'Project Gamma',
  'Project Delta',
  'Internal',
] as const;

const defaultLogTimeForm = {
  employee: '',
  project: '',
  task: '',
  date: '',
  hours: '',
  notes: '',
};

function LogTimeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(defaultLogTimeForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultLogTimeForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employee.trim() || !form.project || !form.date || !form.hours)
      return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success('Time entry logged successfully');
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
          <DialogDescription>
            Record work hours for an employee on a specific project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Employee" required htmlFor="time-employee">
              <Input
                id="time-employee"
                placeholder="e.g. Alice Johnson"
                value={form.employee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employee: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Project" required htmlFor="time-project">
              <Select
                value={form.project}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, project: v }))
                }
              >
                <SelectTrigger id="time-project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Task" htmlFor="time-task">
              <Input
                id="time-task"
                placeholder="e.g. API development"
                value={form.task}
                onChange={(e) =>
                  setForm((f) => ({ ...f, task: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Date" required htmlFor="time-date">
                <DatePicker
                  id="time-date"
                  value={form.date}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, date: v }))
                  }
                  placeholder="Select date"
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Hours" required htmlFor="time-hours">
                <Input
                  id="time-hours"
                  type="number"
                  placeholder="e.g. 4.5"
                  min={0}
                  max={24}
                  step={0.5}
                  value={form.hours}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hours: e.target.value }))
                  }
                  required
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Notes" htmlFor="time-notes">
              <Textarea
                id="time-notes"
                placeholder="Optional notes about the work done..."
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </FormFieldWrapper>
          </DialogBody>


          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !form.employee.trim() ||
                !form.project ||
                !form.date ||
                !form.hours ||
                Number(form.hours) <= 0
              }
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Log Time
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TimesheetPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [logTimeDialogOpen, setLogTimeDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timesheet"
        description="Track employee work hours and project time allocation."
      >
        <Select value={selectedWeek} onValueChange={(v) => v && setSelectedWeek(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="gap-1.5" onClick={() => setLogTimeDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Log Time
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="size-10 rounded-lg" />
                </div>
                <Skeleton className="mt-3 h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Hours This Week"
              value="312h"
              icon={Clock}
              change={4.2}
              changeLabel="vs last week"
              trend="up"
            />
            <StatCard
              title="Avg Hours/Employee"
              value="39h"
              icon={TrendingUp}
              change={1.5}
              changeLabel="vs last week"
              trend="up"
            />
            <StatCard
              title="Overtime Hours"
              value="24h"
              icon={Timer}
              change={8}
              changeLabel="vs last week"
              trend="down"
            />
            <StatCard
              title="Billable Hours"
              value="280h"
              icon={DollarSign}
              change={5.3}
              changeLabel="vs last week"
              trend="up"
            />
          </>
        )}
      </div>

      {/* Timesheet Grid */}
      {isLoading ? <TimesheetGridSkeleton /> : <TimesheetGrid />}

      {/* Bottom Section: Chart + Recent Entries */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Hours by Project"
          description="Total hours logged per project this week"
          isLoading={isLoading}
        >
          <BarChart
            data={MOCK_PROJECT_HOURS}
            xKey="project"
            bars={[
              { key: 'hours', name: 'Hours', color: '#6366f1' },
            ]}
            height={280}
          />
        </ChartCard>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <RecentTimeEntries />
        )}
      </div>

      <LogTimeDialog
        open={logTimeDialogOpen}
        onOpenChange={setLogTimeDialogOpen}
      />
    </div>
  );
}
