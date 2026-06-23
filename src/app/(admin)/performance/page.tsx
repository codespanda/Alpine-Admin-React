'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Star,
  Plus,
  Target,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
} from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type ReviewStatus = 'completed' | 'pending' | 'in-progress';

interface EmployeeReview {
  id: string;
  name: string;
  avatar: string;
  department: string;
  rating: number;
  status: ReviewStatus;
  reviewer: string;
}

const employeeReviews: EmployeeReview[] = [
  { id: 'er-1', name: 'Alice Johnson', avatar: '', department: 'Engineering', rating: 5, status: 'completed', reviewer: 'David Chen' },
  { id: 'er-2', name: 'Bob Martinez', avatar: '', department: 'Marketing', rating: 4, status: 'completed', reviewer: 'Emily Davis' },
  { id: 'er-3', name: 'Carol Williams', avatar: '', department: 'Design', rating: 4, status: 'in-progress', reviewer: 'Frank Wilson' },
  { id: 'er-4', name: 'David Chen', avatar: '', department: 'Engineering', rating: 3, status: 'pending', reviewer: 'Grace Lee' },
  { id: 'er-5', name: 'Emily Davis', avatar: '', department: 'HR', rating: 5, status: 'completed', reviewer: 'Henry Brown' },
  { id: 'er-6', name: 'Frank Wilson', avatar: '', department: 'Finance', rating: 4, status: 'in-progress', reviewer: 'Irene Taylor' },
  { id: 'er-7', name: 'Grace Lee', avatar: '', department: 'Engineering', rating: 3, status: 'pending', reviewer: 'James Anderson' },
  { id: 'er-8', name: 'Henry Brown', avatar: '', department: 'Sales', rating: 4, status: 'completed', reviewer: 'Alice Johnson' },
];

interface Goal {
  id: string;
  title: string;
  progress: number;
  assignedTo: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const goals: Goal[] = [
  { id: 'g-1', title: 'Increase quarterly revenue by 15%', progress: 72, assignedTo: 'Sales Team', dueDate: 'Sep 30, 2026', priority: 'high' },
  { id: 'g-2', title: 'Launch mobile app v2.0', progress: 45, assignedTo: 'Engineering', dueDate: 'Aug 15, 2026', priority: 'high' },
  { id: 'g-3', title: 'Reduce customer churn rate to under 5%', progress: 60, assignedTo: 'Customer Success', dueDate: 'Dec 31, 2026', priority: 'medium' },
  { id: 'g-4', title: 'Complete SOC 2 Type II certification', progress: 30, assignedTo: 'Security Team', dueDate: 'Oct 31, 2026', priority: 'high' },
  { id: 'g-5', title: 'Implement employee wellness program', progress: 85, assignedTo: 'HR Team', dueDate: 'Jul 31, 2026', priority: 'medium' },
  { id: 'g-6', title: 'Publish 20 blog posts this quarter', progress: 50, assignedTo: 'Marketing', dueDate: 'Sep 30, 2026', priority: 'low' },
];

interface FeedbackEntry {
  id: string;
  from: string;
  to: string;
  date: string;
  rating: number;
  comment: string;
  type: 'peer' | 'manager' | 'self';
}

const feedbackEntries: FeedbackEntry[] = [
  { id: 'f-1', from: 'Emily Davis', to: 'Alice Johnson', date: 'Jun 12, 2026', rating: 5, comment: 'Alice consistently delivers outstanding work. Her technical leadership on the migration project was exceptional and helped the team hit every milestone ahead of schedule.', type: 'manager' },
  { id: 'f-2', from: 'Bob Martinez', to: 'Carol Williams', date: 'Jun 10, 2026', rating: 4, comment: 'Carol has a great eye for design and collaborates well with the marketing team. Her mockups for the new campaign were spot on.', type: 'peer' },
  { id: 'f-3', from: 'David Chen', to: 'David Chen', date: 'Jun 8, 2026', rating: 3, comment: 'I need to improve my time management skills. While I meet deadlines, I often feel rushed. Planning to adopt better prioritization frameworks next quarter.', type: 'self' },
  { id: 'f-4', from: 'Grace Lee', to: 'Frank Wilson', date: 'Jun 6, 2026', rating: 4, comment: 'Frank has been instrumental in streamlining our financial reporting process. His automation efforts saved the team roughly 10 hours per week.', type: 'manager' },
  { id: 'f-5', from: 'Alice Johnson', to: 'Bob Martinez', date: 'Jun 4, 2026', rating: 4, comment: 'Bob brings creative energy to every project. His campaign ideas for Q2 showed strong strategic thinking and market awareness.', type: 'peer' },
  { id: 'f-6', from: 'Henry Brown', to: 'Emily Davis', date: 'Jun 2, 2026', rating: 5, comment: 'Emily is an exceptional HR leader. She handled the onboarding of 6 new hires this month with remarkable organization and warmth.', type: 'peer' },
  { id: 'f-7', from: 'Irene Taylor', to: 'Grace Lee', date: 'May 30, 2026', rating: 4, comment: 'Grace has shown significant growth in her backend development skills. Her API design for the new microservice was clean and well-documented.', type: 'manager' },
  { id: 'f-8', from: 'Frank Wilson', to: 'Frank Wilson', date: 'May 28, 2026', rating: 4, comment: 'I have improved my cross-team communication this quarter. I will continue focusing on building stronger relationships with the engineering team for smoother collaboration.', type: 'self' },
];

// --- Helpers ---

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'size-4',
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const priorityVariantMap: Record<string, string> = {
  high: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  low: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
};

const feedbackTypeVariantMap: Record<string, string> = {
  peer: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  manager: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  self: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
};

type FilterStatus = 'all' | ReviewStatus;

// --- Skeleton ---

function PerformanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-36 rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// --- Page ---

export default function PerformancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<FilterStatus>('all');

  // New Review Cycle dialog state
  const [reviewCycleOpen, setReviewCycleOpen] = useState(false);
  const [cycleName, setCycleName] = useState('');
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleEndDate, setCycleEndDate] = useState('');
  const [cycleDescription, setCycleDescription] = useState('');
  const [cycleScope, setCycleScope] = useState('');
  const [cycleLoading, setCycleLoading] = useState(false);

  // Add Goal dialog state
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalAssignedTo, setGoalAssignedTo] = useState('');
  const [goalDueDate, setGoalDueDate] = useState('');
  const [goalPriority, setGoalPriority] = useState('');
  const [goalLoading, setGoalLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateCycle = async () => {
    if (!cycleName || !cycleStartDate || !cycleEndDate) return;
    setCycleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Review cycle "${cycleName}" created successfully`);
    setCycleLoading(false);
    setReviewCycleOpen(false);
    setCycleName('');
    setCycleStartDate('');
    setCycleEndDate('');
    setCycleDescription('');
    setCycleScope('');
  };

  const handleAddGoal = async () => {
    if (!goalTitle || !goalAssignedTo || !goalDueDate || !goalPriority) return;
    setGoalLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Goal "${goalTitle}" added successfully`);
    setGoalLoading(false);
    setAddGoalOpen(false);
    setGoalTitle('');
    setGoalDescription('');
    setGoalAssignedTo('');
    setGoalDueDate('');
    setGoalPriority('');
  };

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return employeeReviews;
    return employeeReviews.filter((r) => r.status === reviewFilter);
  }, [reviewFilter]);

  if (isLoading) {
    return <PerformanceSkeleton />;
  }

  const completedCount = employeeReviews.filter((r) => r.status === 'completed').length;
  const totalCount = employeeReviews.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Reviews"
        description="Track employee performance, goals, and 360 feedback."
      >
        <Button className="gap-1.5" onClick={() => setReviewCycleOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          New Review Cycle
        </Button>
      </PageHeader>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews" className="gap-1.5">
            <Users className="size-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1.5">
            <Target className="size-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5">
            <MessageSquare className="size-4" />
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          {/* Active Review Cycle */}
          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Q2 2026 Performance Review</h3>
                    <StatusBadge status="active" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    April 1, 2026 - June 30, 2026
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{progressPercent}%</p>
                  <p className="text-xs text-muted-foreground">{completedCount}/{totalCount} reviews completed</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'pending', 'completed', 'in-progress'] as const).map((status) => (
              <Button
                key={status}
                variant={reviewFilter === status ? 'default' : 'outline'}
                size="sm"
                className={cn('h-8 capitalize', reviewFilter !== status && 'text-muted-foreground')}
                onClick={() => setReviewFilter(status)}
              >
                {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Employee Review Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center">
                    <Avatar size="lg" className="mb-3">
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
                    </Avatar>
                    <h4 className="text-sm font-semibold">{review.name}</h4>
                    <p className="text-xs text-muted-foreground">{review.department}</p>
                    <div className="mt-2">
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="mt-3">
                      <StatusBadge
                        status={review.status}
                        variantMap={{
                          'in-progress': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                          completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
                        }}
                      />
                    </div>
                    <Separator className="my-3" />
                    <p className="text-xs text-muted-foreground">
                      Reviewer: <span className="font-medium text-foreground">{review.reviewer}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5" onClick={() => setAddGoalOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Add Goal
            </Button>
          </div>
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold">{goal.title}</h4>
                      <StatusBadge
                        status={goal.priority}
                        variantMap={priorityVariantMap}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" aria-hidden="true" />
                        {goal.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" aria-hidden="true" />
                        {goal.dueDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            goal.progress >= 75 ? 'bg-emerald-500' : goal.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {feedbackEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{entry.from}</span>
                      <span className="text-xs text-muted-foreground">to</span>
                      <span className="text-sm font-semibold">{entry.to}</span>
                      <StatusBadge
                        status={entry.type}
                        variantMap={feedbackTypeVariantMap}
                      />
                    </div>
                    <StarRating rating={entry.rating} />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.comment}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{entry.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* New Review Cycle Dialog */}
      <Dialog open={reviewCycleOpen} onOpenChange={setReviewCycleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Review Cycle</DialogTitle>
            <DialogDescription>
              Create a new performance review cycle for your organization.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Cycle Name" required htmlFor="cycle-name">
              <Input
                id="cycle-name"
                placeholder="e.g. Q3 2026 Performance Review"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Start Date" required htmlFor="cycle-start">
                <DatePicker
                  id="cycle-start"
                  value={cycleStartDate}
                  onChange={(v) => setCycleStartDate(v)}
                  placeholder="Select start date"
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="End Date" required htmlFor="cycle-end">
                <DatePicker
                  id="cycle-end"
                  value={cycleEndDate}
                  onChange={(v) => setCycleEndDate(v)}
                  placeholder="Select end date"
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Description" htmlFor="cycle-description">
              <Textarea
                id="cycle-description"
                placeholder="Describe the objectives of this review cycle..."
                rows={3}
                value={cycleDescription}
                onChange={(e) => setCycleDescription(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Reviewers Scope" required htmlFor="cycle-scope">
              <Select
                value={cycleScope}
                onValueChange={(v) => v && setCycleScope(v)}
              >
                <SelectTrigger id="cycle-scope" className="w-full">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="managers">Managers Only</SelectItem>
                  <SelectItem value="teams">Select Teams</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewCycleOpen(false)}
              disabled={cycleLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCycle}
              disabled={cycleLoading || !cycleName.trim() || !cycleStartDate || !cycleEndDate}
            >
              {cycleLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Cycle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogDescription>
              Define a new performance goal and assign it to a team or individual.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Goal Title" required htmlFor="goal-title">
              <Input
                id="goal-title"
                placeholder="e.g. Increase quarterly revenue by 15%"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="goal-description">
              <Textarea
                id="goal-description"
                placeholder="Describe the goal and success criteria..."
                rows={3}
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Assigned To" required htmlFor="goal-assigned">
              <Input
                id="goal-assigned"
                placeholder="e.g. Sales Team"
                value={goalAssignedTo}
                onChange={(e) => setGoalAssignedTo(e.target.value)}
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Due Date" required htmlFor="goal-due">
                <DatePicker
                  id="goal-due"
                  value={goalDueDate}
                  onChange={(v) => setGoalDueDate(v)}
                  placeholder="Select due date"
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Priority" required htmlFor="goal-priority">
                <Select
                  value={goalPriority}
                  onValueChange={(v) => v && setGoalPriority(v)}
                >
                  <SelectTrigger id="goal-priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddGoalOpen(false)}
              disabled={goalLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGoal}
              disabled={goalLoading || !goalTitle.trim() || !goalAssignedTo.trim() || !goalDueDate || !goalPriority}
            >
              {goalLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
