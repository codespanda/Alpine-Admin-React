'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Edit,
  Sun,
  Sunset,
  Moon,
  CalendarClock,
  ArrowLeftRight,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ShiftType = 'morning' | 'afternoon' | 'night' | 'off';

interface ScheduleEntry {
  shiftType: ShiftType;
  label: string;
  time: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  schedule: Record<string, ScheduleEntry>;
}

interface ShiftTypeCard {
  id: string;
  name: string;
  time: string;
  duration: string;
  employeeCount: number;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}

interface SwapRequest {
  id: string;
  requester: { name: string; avatar: string };
  originalShift: string;
  requestedShift: string;
  swapWith: { name: string; avatar: string };
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const SHIFT_STYLES: Record<
  ShiftType,
  { bg: string; text: string; border: string }
> = {
  morning: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  afternoon: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  night: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  off: {
    bg: 'bg-gray-50 dark:bg-gray-900/40',
    text: 'text-gray-500 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-800',
  },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getWeekDateRange(offset: number): {
  start: Date;
  end: Date;
  label: string;
  dayDates: string[];
} {
  const now = new Date(2026, 5, 18); // June 18, 2026 (Thursday)
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + offset * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const dayDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dayDates.push(d.getDate().toString());
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    start: monday,
    end: sunday,
    label: `${fmt(monday)} - ${fmt(sunday)}, ${monday.getFullYear()}`,
    dayDates,
  };
}

function getCurrentDayIndex(): number {
  // June 18, 2026 is a Thursday = index 3 (Mon=0)
  return 3;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

function buildSchedule(
  pattern: ShiftType[]
): Record<string, ScheduleEntry> {
  const SHIFT_INFO: Record<ShiftType, { label: string; time: string }> = {
    morning: { label: 'Morning', time: '6AM - 2PM' },
    afternoon: { label: 'Afternoon', time: '2PM - 10PM' },
    night: { label: 'Night', time: '10PM - 6AM' },
    off: { label: 'Off', time: '' },
  };
  const result: Record<string, ScheduleEntry> = {};
  DAYS.forEach((day, i) => {
    const type = pattern[i];
    result[day] = {
      shiftType: type,
      label: SHIFT_INFO[type].label,
      time: SHIFT_INFO[type].time,
    };
  });
  return result;
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Alice Johnson',
    role: 'Team Lead',
    avatar: '/avatars/alice.jpg',
    schedule: buildSchedule([
      'morning', 'morning', 'morning', 'morning', 'morning', 'off', 'off',
    ]),
  },
  {
    id: 'emp-2',
    name: 'Bob Martinez',
    role: 'Developer',
    avatar: '/avatars/bob.jpg',
    schedule: buildSchedule([
      'morning', 'morning', 'afternoon', 'afternoon', 'morning', 'off', 'off',
    ]),
  },
  {
    id: 'emp-3',
    name: 'Carol Chen',
    role: 'Designer',
    avatar: '/avatars/carol.jpg',
    schedule: buildSchedule([
      'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'off', 'off',
    ]),
  },
  {
    id: 'emp-4',
    name: 'David Kim',
    role: 'Support',
    avatar: '/avatars/david.jpg',
    schedule: buildSchedule([
      'night', 'night', 'night', 'off', 'off', 'night', 'night',
    ]),
  },
  {
    id: 'emp-5',
    name: 'Eva Patel',
    role: 'QA Engineer',
    avatar: '/avatars/eva.jpg',
    schedule: buildSchedule([
      'morning', 'afternoon', 'morning', 'afternoon', 'morning', 'off', 'off',
    ]),
  },
  {
    id: 'emp-6',
    name: 'Frank Wilson',
    role: 'DevOps',
    avatar: '/avatars/frank.jpg',
    schedule: buildSchedule([
      'off', 'morning', 'morning', 'morning', 'morning', 'morning', 'off',
    ]),
  },
  {
    id: 'emp-7',
    name: 'Grace Lee',
    role: 'Analyst',
    avatar: '/avatars/grace.jpg',
    schedule: buildSchedule([
      'afternoon', 'afternoon', 'morning', 'morning', 'afternoon', 'off', 'off',
    ]),
  },
  {
    id: 'emp-8',
    name: 'Henry Davis',
    role: 'Manager',
    avatar: '/avatars/henry.jpg',
    schedule: buildSchedule([
      'morning', 'morning', 'morning', 'morning', 'morning', 'off', 'off',
    ]),
  },
];

const MOCK_SHIFT_TYPES: ShiftTypeCard[] = [
  {
    id: 'st-1',
    name: 'Morning Shift',
    time: '6:00 AM - 2:00 PM',
    duration: '8 hours',
    employeeCount: 12,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    icon: Sun,
  },
  {
    id: 'st-2',
    name: 'Afternoon Shift',
    time: '2:00 PM - 10:00 PM',
    duration: '8 hours',
    employeeCount: 8,
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    icon: Sunset,
  },
  {
    id: 'st-3',
    name: 'Night Shift',
    time: '10:00 PM - 6:00 AM',
    duration: '8 hours',
    employeeCount: 5,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    icon: Moon,
  },
  {
    id: 'st-4',
    name: 'Flexible',
    time: 'Core 10:00 AM - 4:00 PM',
    duration: '8 hours',
    employeeCount: 10,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: CalendarClock,
  },
];

const MOCK_SWAP_REQUESTS: SwapRequest[] = [
  {
    id: 'sw-1',
    requester: { name: 'Bob Martinez', avatar: '/avatars/bob.jpg' },
    originalShift: 'Morning (Jun 19)',
    requestedShift: 'Afternoon (Jun 19)',
    swapWith: { name: 'Carol Chen', avatar: '/avatars/carol.jpg' },
    date: 'Jun 19, 2026',
    status: 'pending',
  },
  {
    id: 'sw-2',
    requester: { name: 'Eva Patel', avatar: '/avatars/eva.jpg' },
    originalShift: 'Afternoon (Jun 20)',
    requestedShift: 'Morning (Jun 20)',
    swapWith: { name: 'Alice Johnson', avatar: '/avatars/alice.jpg' },
    date: 'Jun 20, 2026',
    status: 'pending',
  },
  {
    id: 'sw-3',
    requester: { name: 'David Kim', avatar: '/avatars/david.jpg' },
    originalShift: 'Night (Jun 16)',
    requestedShift: 'Morning (Jun 16)',
    swapWith: { name: 'Frank Wilson', avatar: '/avatars/frank.jpg' },
    date: 'Jun 16, 2026',
    status: 'approved',
  },
  {
    id: 'sw-4',
    requester: { name: 'Grace Lee', avatar: '/avatars/grace.jpg' },
    originalShift: 'Afternoon (Jun 15)',
    requestedShift: 'Morning (Jun 15)',
    swapWith: { name: 'Henry Davis', avatar: '/avatars/henry.jpg' },
    date: 'Jun 15, 2026',
    status: 'rejected',
  },
  {
    id: 'sw-5',
    requester: { name: 'Frank Wilson', avatar: '/avatars/frank.jpg' },
    originalShift: 'Morning (Jun 22)',
    requestedShift: 'Afternoon (Jun 22)',
    swapWith: { name: 'Bob Martinez', avatar: '/avatars/bob.jpg' },
    date: 'Jun 22, 2026',
    status: 'pending',
  },
];

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function ScheduleSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-40" />
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function ShiftCell({ entry }: { entry: ScheduleEntry }) {
  const style = SHIFT_STYLES[entry.shiftType];
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-md border px-1 py-1.5 text-center transition-colors',
        style.bg,
        style.text,
        style.border
      )}
    >
      <span className="text-xs font-semibold leading-tight">
        {entry.label}
      </span>
      {entry.time && (
        <span className="mt-0.5 text-[10px] leading-tight opacity-75">
          {entry.time}
        </span>
      )}
    </div>
  );
}

function ScheduleTab() {
  const [weekOffset, setWeekOffset] = useState(0);
  const week = useMemo(() => getWeekDateRange(weekOffset), [weekOffset]);
  const todayIndex = weekOffset === 0 ? getCurrentDayIndex() : -1;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((o) => o - 1)}
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[200px] text-center text-sm font-medium">
              {week.label}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((o) => o + 1)}
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </Button>
            {weekOffset !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset(0)}
              >
                Today
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0 pb-4">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Employee
              </th>
              {DAYS.map((day, i) => (
                <th
                  key={day}
                  className={cn(
                    'px-2 py-2 text-center text-xs font-medium text-muted-foreground',
                    i === todayIndex &&
                      'bg-primary/5 dark:bg-primary/10'
                  )}
                >
                  <div>{day}</div>
                  <div className={cn(
                    'mt-0.5 text-[10px]',
                    i === todayIndex && 'font-bold text-primary'
                  )}>
                    {week.dayDates[i]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_EMPLOYEES.map((emp) => (
              <tr
                key={emp.id}
                className="border-t border-border/50 hover:bg-muted/30"
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
                {DAYS.map((day, i) => (
                  <td
                    key={day}
                    className={cn(
                      'px-1.5 py-1.5',
                      i === todayIndex &&
                        'bg-primary/5 dark:bg-primary/10'
                    )}
                  >
                    <ShiftCell entry={emp.schedule[day]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ShiftTypesTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {MOCK_SHIFT_TYPES.map((shift) => {
        const Icon = shift.icon;
        return (
          <Card key={shift.id} className="relative overflow-hidden">
            <div
              className={cn('absolute inset-y-0 left-0 w-1', shift.color)}
            />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-lg',
                      shift.bgColor
                    )}
                  >
                    <Icon className="size-5 text-current opacity-70" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{shift.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {shift.time}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Edit className="size-3.5" />
                  Edit
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {shift.duration}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-3.5" />
                  {shift.employeeCount} employees
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SwapRequestsTab() {
  const [requests, setRequests] = useState(MOCK_SWAP_REQUESTS);

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
    toast.success('Swap request approved');
  }

  function handleReject(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    );
    toast.error('Swap request rejected');
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <Card key={req.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                {/* Requester */}
                <div className="flex items-center gap-2.5 min-w-[140px]">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={req.requester.avatar}
                      alt={req.requester.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(req.requester.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{req.requester.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {req.originalShift}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="size-4 shrink-0 text-muted-foreground" />
                </div>

                {/* Swap With */}
                <div className="flex items-center gap-2.5 min-w-[140px]">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={req.swapWith.avatar}
                      alt={req.swapWith.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(req.swapWith.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{req.swapWith.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {req.requestedShift}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-muted-foreground">
                  {req.date}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={req.status} />
                {req.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      onClick={() => handleApprove(req.id)}
                    >
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700 dark:text-red-400"
                      onClick={() => handleReject(req.id)}
                    >
                      <X className="size-3.5" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Create Shift dialog
// ---------------------------------------------------------------------------

const SHIFT_COLORS = ['Blue', 'Amber', 'Purple', 'Green'] as const;

const defaultShiftForm = {
  name: '',
  startTime: '',
  endTime: '',
  breakDuration: '',
  color: '',
  description: '',
};

function CreateShiftDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(defaultShiftForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultShiftForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.startTime || !form.endTime) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success(`Shift "${form.name}" created successfully`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Shift</DialogTitle>
          <DialogDescription>
            Define a new shift type with time range and break duration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Shift Name" required htmlFor="shift-name">
              <Input
                id="shift-name"
                placeholder="e.g. Early Morning Shift"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Start Time" required htmlFor="shift-start">
                <Input
                  id="shift-start"
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startTime: e.target.value }))
                  }
                  required
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="End Time" required htmlFor="shift-end">
                <Input
                  id="shift-end"
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endTime: e.target.value }))
                  }
                  required
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper
              label="Break Duration (minutes)"
              htmlFor="shift-break"
            >
              <Input
                id="shift-break"
                type="number"
                placeholder="e.g. 30"
                min={0}
                value={form.breakDuration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, breakDuration: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Color" htmlFor="shift-color">
              <Select
                value={form.color}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, color: v }))
                }
              >
                <SelectTrigger id="shift-color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_COLORS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="shift-description">
              <Textarea
                id="shift-description"
                placeholder="Optional notes about this shift..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
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
                !form.name.trim() ||
                !form.startTime ||
                !form.endTime
              }
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Shift
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

export default function ShiftsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Scheduling"
        description="Manage employee shifts, schedules, and swap requests."
      >
        <Button className="gap-1.5" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create Shift
        </Button>
      </PageHeader>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="shift-types">Shift Types</TabsTrigger>
          <TabsTrigger value="swap-requests">Swap Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {isLoading ? <ScheduleSkeleton /> : <ScheduleTab />}
        </TabsContent>

        <TabsContent value="shift-types" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="flex gap-6">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ShiftTypesTab />
          )}
        </TabsContent>

        <TabsContent value="swap-requests" className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-4" />
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="ml-auto h-5 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <SwapRequestsTab />
          )}
        </TabsContent>
      </Tabs>

      <CreateShiftDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
