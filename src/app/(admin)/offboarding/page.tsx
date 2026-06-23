'use client';

import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
  UserMinus,
  CheckCircle2,
  Clock,
  BookOpen,
  Package,
  ShieldOff,
  MessageSquare,
  Wallet,
  Plus,
  Calendar,
  Users,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { cn } from '@/lib/utils';

// --- Mock Data ---

interface ChecklistItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  section: string;
  icon: typeof BookOpen;
}

interface OffboardingEmployee {
  id: string;
  name: string;
  department: string;
  lastWorkingDay: string;
  progress: number;
  checklist: ChecklistItem[];
}

const activeOffboardings: OffboardingEmployee[] = [
  {
    id: 'off-1',
    name: 'Marcus Reed',
    department: 'Engineering',
    lastWorkingDay: 'Jun 30, 2026',
    progress: 60,
    checklist: [
      { id: 'c-1', title: 'Transfer project documentation', assignee: 'David Chen', dueDate: 'Jun 22, 2026', completed: true, section: 'Knowledge Transfer', icon: BookOpen },
      { id: 'c-2', title: 'Handover codebase ownership', assignee: 'Alice Johnson', dueDate: 'Jun 24, 2026', completed: true, section: 'Knowledge Transfer', icon: BookOpen },
      { id: 'c-3', title: 'Return laptop and peripherals', assignee: 'IT Admin', dueDate: 'Jun 28, 2026', completed: false, section: 'Asset Return', icon: Package },
      { id: 'c-4', title: 'Return access card and keys', assignee: 'Facilities', dueDate: 'Jun 30, 2026', completed: false, section: 'Asset Return', icon: Package },
      { id: 'c-5', title: 'Revoke GitHub and AWS access', assignee: 'IT Security', dueDate: 'Jun 28, 2026', completed: true, section: 'Access Revocation', icon: ShieldOff },
      { id: 'c-6', title: 'Disable email and Slack accounts', assignee: 'IT Admin', dueDate: 'Jun 30, 2026', completed: false, section: 'Access Revocation', icon: ShieldOff },
      { id: 'c-7', title: 'Schedule exit interview', assignee: 'Emily Davis', dueDate: 'Jun 26, 2026', completed: true, section: 'Exit Interview', icon: MessageSquare },
      { id: 'c-8', title: 'Process final paycheck', assignee: 'Finance', dueDate: 'Jun 30, 2026', completed: false, section: 'Final Settlement', icon: Wallet },
      { id: 'c-9', title: 'Process unused PTO payout', assignee: 'HR', dueDate: 'Jun 30, 2026', completed: true, section: 'Final Settlement', icon: Wallet },
    ],
  },
  {
    id: 'off-2',
    name: 'Sophia Hernandez',
    department: 'Marketing',
    lastWorkingDay: 'Jul 15, 2026',
    progress: 22,
    checklist: [
      { id: 'c-10', title: 'Hand over campaign materials', assignee: 'Bob Martinez', dueDate: 'Jul 8, 2026', completed: true, section: 'Knowledge Transfer', icon: BookOpen },
      { id: 'c-11', title: 'Document vendor contacts', assignee: 'Bob Martinez', dueDate: 'Jul 10, 2026', completed: false, section: 'Knowledge Transfer', icon: BookOpen },
      { id: 'c-12', title: 'Return laptop and peripherals', assignee: 'IT Admin', dueDate: 'Jul 14, 2026', completed: false, section: 'Asset Return', icon: Package },
      { id: 'c-13', title: 'Return access card', assignee: 'Facilities', dueDate: 'Jul 15, 2026', completed: false, section: 'Asset Return', icon: Package },
      { id: 'c-14', title: 'Revoke social media access', assignee: 'IT Security', dueDate: 'Jul 14, 2026', completed: false, section: 'Access Revocation', icon: ShieldOff },
      { id: 'c-15', title: 'Disable accounts', assignee: 'IT Admin', dueDate: 'Jul 15, 2026', completed: false, section: 'Access Revocation', icon: ShieldOff },
      { id: 'c-16', title: 'Schedule exit interview', assignee: 'Emily Davis', dueDate: 'Jul 10, 2026', completed: true, section: 'Exit Interview', icon: MessageSquare },
      { id: 'c-17', title: 'Process final paycheck', assignee: 'Finance', dueDate: 'Jul 15, 2026', completed: false, section: 'Final Settlement', icon: Wallet },
      { id: 'c-18', title: 'Benefits termination notice', assignee: 'HR', dueDate: 'Jul 15, 2026', completed: false, section: 'Final Settlement', icon: Wallet },
    ],
  },
];

interface CompletedOffboarding {
  id: string;
  name: string;
  department: string;
  lastWorkingDay: string;
  completedDate: string;
  reason: string;
}

const completedOffboardings: CompletedOffboarding[] = [
  { id: 'co-1', name: 'Ryan Mitchell', department: 'Sales', lastWorkingDay: 'May 31, 2026', completedDate: 'Jun 2, 2026', reason: 'Resignation' },
  { id: 'co-2', name: 'Laura Bennett', department: 'Finance', lastWorkingDay: 'Apr 30, 2026', completedDate: 'May 1, 2026', reason: 'Career Change' },
  { id: 'co-3', name: 'Daniel Foster', department: 'Engineering', lastWorkingDay: 'Mar 31, 2026', completedDate: 'Apr 2, 2026', reason: 'Relocation' },
];

// --- Helpers ---

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

function groupChecklist(checklist: ChecklistItem[]) {
  const groups: Record<string, ChecklistItem[]> = {};
  for (const item of checklist) {
    if (!groups[item.section]) groups[item.section] = [];
    groups[item.section].push(item);
  }
  return groups;
}

const sectionColors: Record<string, string> = {
  'Knowledge Transfer': 'text-indigo-600 dark:text-indigo-400',
  'Asset Return': 'text-orange-600 dark:text-orange-400',
  'Access Revocation': 'text-red-600 dark:text-red-400',
  'Exit Interview': 'text-purple-600 dark:text-purple-400',
  'Final Settlement': 'text-emerald-600 dark:text-emerald-400',
};

// --- Column Definitions ---

const completedColumns: ColumnDef<CompletedOffboarding>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
  },
  {
    accessorKey: 'lastWorkingDay',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Working Day" />,
  },
  {
    accessorKey: 'completedDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Completed Date" />,
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue('reason') as string}
        variantMap={{
          resignation: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
          'career-change': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
          relocation: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
        }}
      />
    ),
  },
];

// --- Skeleton ---

function OffboardingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-96 rounded-lg" />
      ))}
    </div>
  );
}

// --- Page ---

export default function OffboardingPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Initiate Offboarding dialog state
  const [offboardingOpen, setOffboardingOpen] = useState(false);
  const [offEmployee, setOffEmployee] = useState('');
  const [offLastDay, setOffLastDay] = useState('');
  const [offReason, setOffReason] = useState('');
  const [offExitDate, setOffExitDate] = useState('');
  const [offNotes, setOffNotes] = useState('');
  const [offLoading, setOffLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInitiateOffboarding = async () => {
    if (!offEmployee || !offLastDay || !offReason) return;
    setOffLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Offboarding initiated for ${offEmployee}`);
    setOffLoading(false);
    setOffboardingOpen(false);
    setOffEmployee('');
    setOffLastDay('');
    setOffReason('');
    setOffExitDate('');
    setOffNotes('');
  };

  if (isLoading) {
    return <OffboardingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offboarding"
        description="Manage employee exits with structured offboarding workflows."
      >
        <Button className="gap-1.5" onClick={() => setOffboardingOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Initiate Offboarding
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Offboardings"
          value={2}
          icon={UserMinus}
          trend="neutral"
        />
        <StatCard
          title="Completed This Month"
          value={1}
          icon={CheckCircle2}
          trend="down"
          change={-50}
          changeLabel="from last month"
        />
        <StatCard
          title="Avg Process Time"
          value="7 days"
          icon={Clock}
          trend="neutral"
        />
      </div>

      {/* Active Offboarding Cards */}
      {activeOffboardings.map((emp) => {
        const completedItems = emp.checklist.filter((c) => c.completed).length;
        const totalItems = emp.checklist.length;
        const groups = groupChecklist(emp.checklist);

        return (
          <Card key={emp.id}>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{emp.name}</CardTitle>
                    <CardDescription>
                      {emp.department} &middot; Last working day: {emp.lastWorkingDay}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">{emp.progress}%</p>
                    <p className="text-xs text-muted-foreground">{completedItems}/{totalItems} tasks</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    emp.progress >= 75 ? 'bg-emerald-500' : emp.progress >= 40 ? 'bg-amber-500' : 'bg-orange-500'
                  )}
                  style={{ width: `${emp.progress}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groups).map(([section, items]) => {
                  const SectionIcon = items[0].icon;
                  const sectionColor = sectionColors[section] ?? 'text-muted-foreground';
                  return (
                    <div key={section}>
                      <div className="mb-3 flex items-center gap-2">
                        <SectionIcon className={cn('size-4', sectionColor)} aria-hidden="true" />
                        <h4 className="text-sm font-semibold">{section}</h4>
                        <span className="text-xs text-muted-foreground">
                          ({items.filter((i) => i.completed).length}/{items.length})
                        </span>
                      </div>
                      <div className="space-y-2 pl-6">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                              item.completed ? 'bg-muted/50 opacity-75' : 'bg-background'
                            )}
                          >
                            <Checkbox
                              checked={item.completed}
                              disabled
                              aria-label={item.title}
                            />
                            <div className="flex-1">
                              <p className={cn('text-sm', item.completed && 'line-through text-muted-foreground')}>
                                {item.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="size-3" aria-hidden="true" />
                                  {item.assignee}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="size-3" aria-hidden="true" />
                                  {item.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Completed Offboardings */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Offboardings</CardTitle>
          <CardDescription>Previously processed employee exits</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={completedColumns}
            data={completedOffboardings}
            showPagination={false}
            showColumnVisibility={false}
          />
        </CardContent>
      </Card>

      {/* Initiate Offboarding Dialog */}
      <Dialog open={offboardingOpen} onOpenChange={setOffboardingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Initiate Offboarding</DialogTitle>
            <DialogDescription>
              Start the offboarding process for a departing employee.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Employee" required htmlFor="off-employee">
              <Input
                id="off-employee"
                placeholder="e.g. Marcus Reed"
                value={offEmployee}
                onChange={(e) => setOffEmployee(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Last Working Day" required htmlFor="off-last-day">
              <DatePicker
                id="off-last-day"
                value={offLastDay}
                onChange={(v) => setOffLastDay(v)}
                placeholder="Select last working day"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Reason" required htmlFor="off-reason">
              <Select
                value={offReason}
                onValueChange={(v) => v && setOffReason(v)}
              >
                <SelectTrigger id="off-reason" className="w-full">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resignation">Resignation</SelectItem>
                  <SelectItem value="Termination">Termination</SelectItem>
                  <SelectItem value="End of Contract">End of Contract</SelectItem>
                  <SelectItem value="Retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Exit Interview Date" htmlFor="off-exit-date">
              <DatePicker
                id="off-exit-date"
                value={offExitDate}
                onChange={(v) => setOffExitDate(v)}
                placeholder="Select exit interview date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Notes" htmlFor="off-notes">
              <Textarea
                id="off-notes"
                placeholder="Additional notes about this offboarding..."
                rows={3}
                value={offNotes}
                onChange={(e) => setOffNotes(e.target.value)}
              />
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOffboardingOpen(false)}
              disabled={offLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInitiateOffboarding}
              disabled={offLoading || !offEmployee.trim() || !offLastDay || !offReason}
            >
              {offLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Initiate Offboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
