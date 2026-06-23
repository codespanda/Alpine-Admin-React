'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  FileText,
  Monitor,
  GraduationCap,
  CircleCheckBig,
  Mail,
  Key,
  Users,
  Laptop,
  Plus,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

interface OnboardingEmployee {
  id: string;
  name: string;
  position: string;
  startDate: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
}

interface PipelineStage {
  id: string;
  title: string;
  icon: typeof FileText;
  color: string;
  employees: OnboardingEmployee[];
}

const pipeline: PipelineStage[] = [
  {
    id: 'stage-1',
    title: 'Document Collection',
    icon: FileText,
    color: 'text-orange-600 dark:text-orange-400',
    employees: [
      { id: 'oe-1', name: 'Sarah Parker', position: 'Product Designer', startDate: 'Jun 22, 2026', progress: 33, tasksCompleted: 2, tasksTotal: 6 },
      { id: 'oe-2', name: 'Tom Nguyen', position: 'Backend Engineer', startDate: 'Jun 24, 2026', progress: 17, tasksCompleted: 1, tasksTotal: 6 },
    ],
  },
  {
    id: 'stage-2',
    title: 'IT Setup',
    icon: Monitor,
    color: 'text-blue-600 dark:text-blue-400',
    employees: [
      { id: 'oe-3', name: 'Maya Patel', position: 'Data Analyst', startDate: 'Jun 20, 2026', progress: 50, tasksCompleted: 3, tasksTotal: 6 },
    ],
  },
  {
    id: 'stage-3',
    title: 'Training',
    icon: GraduationCap,
    color: 'text-purple-600 dark:text-purple-400',
    employees: [
      { id: 'oe-4', name: 'Jake Rivera', position: 'Sales Rep', startDate: 'Jun 16, 2026', progress: 67, tasksCompleted: 4, tasksTotal: 6 },
    ],
  },
  {
    id: 'stage-4',
    title: 'Complete',
    icon: CircleCheckBig,
    color: 'text-emerald-600 dark:text-emerald-400',
    employees: [
      { id: 'oe-5', name: 'Nina Kowalski', position: 'Marketing Manager', startDate: 'Jun 8, 2026', progress: 100, tasksCompleted: 6, tasksTotal: 6 },
      { id: 'oe-6', name: 'Liam Foster', position: 'DevOps Engineer', startDate: 'Jun 5, 2026', progress: 100, tasksCompleted: 6, tasksTotal: 6 },
      { id: 'oe-7', name: 'Rachel Kim', position: 'Frontend Engineer', startDate: 'Jun 2, 2026', progress: 100, tasksCompleted: 6, tasksTotal: 6 },
    ],
  },
];

interface ActivityEntry {
  id: string;
  icon: typeof FileText;
  iconColor: string;
  description: string;
  timestamp: string;
}

const recentActivity: ActivityEntry[] = [
  { id: 'a-1', icon: FileText, iconColor: 'text-orange-500', description: 'Sarah Parker submitted identity verification documents', timestamp: '2 hours ago' },
  { id: 'a-2', icon: Laptop, iconColor: 'text-blue-500', description: 'Maya Patel received laptop and access credentials', timestamp: '4 hours ago' },
  { id: 'a-3', icon: GraduationCap, iconColor: 'text-purple-500', description: 'Jake Rivera completed compliance training module', timestamp: '6 hours ago' },
  { id: 'a-4', icon: CheckCircle2, iconColor: 'text-emerald-500', description: 'Nina Kowalski finished onboarding - all tasks complete', timestamp: 'Yesterday' },
  { id: 'a-5', icon: Mail, iconColor: 'text-indigo-500', description: 'Welcome emails sent to Tom Nguyen and Sarah Parker', timestamp: 'Yesterday' },
];

// --- Helpers ---

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

function getProgressColor(progress: number) {
  if (progress >= 100) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  return 'bg-orange-500';
}

// --- Skeleton ---

function OnboardingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-72 shrink-0 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

// --- Page ---

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);

  // New Onboarding dialog state
  const [newOnboardingOpen, setNewOnboardingOpen] = useState(false);
  const [obEmployeeName, setObEmployeeName] = useState('');
  const [obPosition, setObPosition] = useState('');
  const [obDepartment, setObDepartment] = useState('');
  const [obStartDate, setObStartDate] = useState('');
  const [obBuddy, setObBuddy] = useState('');
  const [obLoading, setObLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleNewOnboarding = async () => {
    if (!obEmployeeName || !obPosition || !obDepartment || !obStartDate) return;
    setObLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Onboarding initiated for ${obEmployeeName}`);
    setObLoading(false);
    setNewOnboardingOpen(false);
    setObEmployeeName('');
    setObPosition('');
    setObDepartment('');
    setObStartDate('');
    setObBuddy('');
  };

  if (isLoading) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding"
        description="Track and manage new employee onboarding workflows."
      >
        <Button className="gap-1.5" onClick={() => setNewOnboardingOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          New Onboarding
        </Button>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Onboardings"
          value={4}
          icon={UserPlus}
          trend="up"
          change={33}
          changeLabel="from last month"
        />
        <StatCard
          title="Completed This Month"
          value={6}
          icon={CheckCircle2}
          trend="up"
          change={20}
          changeLabel="from last month"
        />
        <StatCard
          title="Avg Completion Time"
          value="5 days"
          icon={Clock}
          trend="down"
          change={-15}
          changeLabel="faster than last month"
        />
      </div>

      {/* Kanban Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {pipeline.map((stage) => {
            const StageIcon = stage.icon;
            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 rounded-lg border bg-muted/30 p-3"
              >
                <div className="mb-3 flex items-center gap-2">
                  <StageIcon className={cn('size-4', stage.color)} aria-hidden="true" />
                  <h3 className="text-sm font-semibold">{stage.title}</h3>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stage.employees.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stage.employees.map((emp) => (
                    <Card key={emp.id} className="transition-shadow hover:shadow-md">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(emp.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <h4 className="text-sm font-medium leading-tight">{emp.name}</h4>
                            <p className="text-xs text-muted-foreground">{emp.position}</p>
                            <p className="text-xs text-muted-foreground">
                              Start: {emp.startDate}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {emp.tasksCompleted}/{emp.tasksTotal} tasks
                            </span>
                            <span className="font-medium tabular-nums">{emp.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                getProgressColor(emp.progress)
                              )}
                              style={{ width: `${emp.progress}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = activity.icon;
              const isLast = index === recentActivity.length - 1;
              return (
                <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                  )}
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                    <ActivityIcon className={cn('size-4', activity.iconColor)} aria-hidden="true" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm">{activity.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* New Onboarding Dialog */}
      <Dialog open={newOnboardingOpen} onOpenChange={setNewOnboardingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Onboarding</DialogTitle>
            <DialogDescription>
              Start the onboarding process for a new employee.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Employee Name" required htmlFor="ob-name">
              <Input
                id="ob-name"
                placeholder="e.g. Jane Smith"
                value={obEmployeeName}
                onChange={(e) => setObEmployeeName(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Position" required htmlFor="ob-position">
              <Input
                id="ob-position"
                placeholder="e.g. Frontend Engineer"
                value={obPosition}
                onChange={(e) => setObPosition(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Department" required htmlFor="ob-department">
              <Select
                value={obDepartment}
                onValueChange={(v) => v && setObDepartment(v)}
              >
                <SelectTrigger id="ob-department" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Start Date" required htmlFor="ob-start">
              <DatePicker
                id="ob-start"
                value={obStartDate}
                onChange={(v) => setObStartDate(v)}
                placeholder="Select start date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Assigned Buddy" htmlFor="ob-buddy">
              <Input
                id="ob-buddy"
                placeholder="e.g. Alice Johnson"
                value={obBuddy}
                onChange={(e) => setObBuddy(e.target.value)}
              />
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewOnboardingOpen(false)}
              disabled={obLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewOnboarding}
              disabled={obLoading || !obEmployeeName.trim() || !obPosition.trim() || !obDepartment || !obStartDate}
            >
              {obLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Start Onboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
