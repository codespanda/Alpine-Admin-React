'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  Plus,
  ClipboardList,
  Send,
  BarChart3,
  FileText,
  CalendarClock,
  Users,
  MessageSquarePlus,
  CheckCircle2,
  Copy,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActiveSurvey {
  id: string;
  title: string;
  responseRate: number;
  responsesReceived: number;
  totalTarget: number;
  deadline: string;
  questionCount: number;
}

interface CompletedSurvey {
  id: string;
  title: string;
  responseRate: number;
  totalResponses: number;
  completionDate: string;
  avgScore: number;
  satisfactionBreakdown: { label: string; value: number; color: string }[];
}

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  icon: React.ElementType;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockActiveSurveys: ActiveSurvey[] = [
  {
    id: 'as1',
    title: 'Q2 Employee Satisfaction Survey',
    responseRate: 65,
    responsesReceived: 130,
    totalTarget: 200,
    deadline: '2026-06-30',
    questionCount: 12,
  },
  {
    id: 'as2',
    title: 'Remote Work Feedback',
    responseRate: 45,
    responsesReceived: 90,
    totalTarget: 200,
    deadline: '2026-07-15',
    questionCount: 8,
  },
  {
    id: 'as3',
    title: 'Manager Effectiveness Survey',
    responseRate: 30,
    responsesReceived: 24,
    totalTarget: 80,
    deadline: '2026-07-01',
    questionCount: 15,
  },
];

const mockCompletedSurveys: CompletedSurvey[] = [
  {
    id: 'cs1',
    title: 'Q1 Employee Satisfaction Survey',
    responseRate: 82,
    totalResponses: 164,
    completionDate: '2026-03-31',
    avgScore: 4.2,
    satisfactionBreakdown: [
      { label: 'Very Satisfied', value: 35, color: 'bg-emerald-500' },
      { label: 'Satisfied', value: 40, color: 'bg-emerald-300' },
      { label: 'Neutral', value: 15, color: 'bg-amber-400' },
      { label: 'Dissatisfied', value: 8, color: 'bg-orange-400' },
      { label: 'Very Dissatisfied', value: 2, color: 'bg-red-500' },
    ],
  },
  {
    id: 'cs2',
    title: 'Annual Engagement Survey 2025',
    responseRate: 91,
    totalResponses: 182,
    completionDate: '2025-12-15',
    avgScore: 4.0,
    satisfactionBreakdown: [
      { label: 'Very Satisfied', value: 30, color: 'bg-emerald-500' },
      { label: 'Satisfied', value: 38, color: 'bg-emerald-300' },
      { label: 'Neutral', value: 18, color: 'bg-amber-400' },
      { label: 'Dissatisfied', value: 10, color: 'bg-orange-400' },
      { label: 'Very Dissatisfied', value: 4, color: 'bg-red-500' },
    ],
  },
  {
    id: 'cs3',
    title: 'Onboarding Experience Feedback',
    responseRate: 76,
    totalResponses: 38,
    completionDate: '2026-02-28',
    avgScore: 4.5,
    satisfactionBreakdown: [
      { label: 'Very Satisfied', value: 50, color: 'bg-emerald-500' },
      { label: 'Satisfied', value: 30, color: 'bg-emerald-300' },
      { label: 'Neutral', value: 12, color: 'bg-amber-400' },
      { label: 'Dissatisfied', value: 6, color: 'bg-orange-400' },
      { label: 'Very Dissatisfied', value: 2, color: 'bg-red-500' },
    ],
  },
  {
    id: 'cs4',
    title: 'Work-Life Balance Check',
    responseRate: 68,
    totalResponses: 136,
    completionDate: '2026-01-15',
    avgScore: 3.8,
    satisfactionBreakdown: [
      { label: 'Very Satisfied', value: 22, color: 'bg-emerald-500' },
      { label: 'Satisfied', value: 35, color: 'bg-emerald-300' },
      { label: 'Neutral', value: 25, color: 'bg-amber-400' },
      { label: 'Dissatisfied', value: 12, color: 'bg-orange-400' },
      { label: 'Very Dissatisfied', value: 6, color: 'bg-red-500' },
    ],
  },
  {
    id: 'cs5',
    title: 'IT Satisfaction Survey',
    responseRate: 55,
    totalResponses: 110,
    completionDate: '2025-11-30',
    avgScore: 3.6,
    satisfactionBreakdown: [
      { label: 'Very Satisfied', value: 18, color: 'bg-emerald-500' },
      { label: 'Satisfied', value: 32, color: 'bg-emerald-300' },
      { label: 'Neutral', value: 28, color: 'bg-amber-400' },
      { label: 'Dissatisfied', value: 15, color: 'bg-orange-400' },
      { label: 'Very Dissatisfied', value: 7, color: 'bg-red-500' },
    ],
  },
];

const mockTemplates: SurveyTemplate[] = [
  {
    id: 'tmpl1',
    name: 'Employee Satisfaction',
    description: 'Comprehensive survey measuring overall employee satisfaction across key dimensions including compensation, growth, and culture.',
    questionCount: 15,
    icon: ClipboardList,
  },
  {
    id: 'tmpl2',
    name: 'Onboarding Feedback',
    description: 'Gather feedback from new hires about their onboarding experience, training quality, and first impressions of the team.',
    questionCount: 10,
    icon: Users,
  },
  {
    id: 'tmpl3',
    name: 'Exit Survey',
    description: 'Understand why employees are leaving with questions about management, culture, compensation, and improvement areas.',
    questionCount: 12,
    icon: FileText,
  },
  {
    id: 'tmpl4',
    name: 'Manager 360',
    description: 'Multi-rater feedback survey for managers covering leadership, communication, team development, and strategic thinking.',
    questionCount: 20,
    icon: BarChart3,
  },
  {
    id: 'tmpl5',
    name: 'Pulse Check',
    description: 'Quick weekly or bi-weekly check-in to gauge employee morale, engagement, and surface any immediate concerns.',
    questionCount: 5,
    icon: MessageSquarePlus,
  },
  {
    id: 'tmpl6',
    name: 'Work-Life Balance',
    description: 'Assess employee well-being, workload distribution, remote work effectiveness, and overall work-life harmony.',
    questionCount: 8,
    icon: CalendarClock,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysUntil(dateStr: string): number {
  const now = new Date('2026-06-18');
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function SurveyCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ActiveSurveyCard({ survey }: { survey: ActiveSurvey }) {
  const daysLeft = getDaysUntil(survey.deadline);
  const isUrgent = daysLeft <= 7;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="leading-snug">{survey.title}</CardTitle>
          <Badge
            className={cn(
              'shrink-0 border-transparent font-medium',
              isUrgent
                ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
            )}
          >
            {daysLeft} days left
          </Badge>
        </div>
        <CardDescription>
          {survey.questionCount} questions &middot; Ends{' '}
          {formatDate(survey.deadline)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Response Rate</span>
              <span className="font-semibold">{survey.responseRate}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  survey.responseRate >= 70
                    ? 'bg-emerald-500'
                    : survey.responseRate >= 50
                      ? 'bg-amber-500'
                      : 'bg-primary'
                )}
                style={{ width: `${survey.responseRate}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {survey.responsesReceived}
            </span>{' '}
            / {survey.totalTarget} responses
          </p>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() =>
            toast.success(`Viewing results for "${survey.title}"`)
          }
        >
          <BarChart3 className="size-3.5" aria-hidden="true" />
          View Results
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            toast.success(`Reminder sent for "${survey.title}"`)
          }
        >
          <Send className="size-3.5" aria-hidden="true" />
          Send Reminder
        </Button>
      </CardFooter>
    </Card>
  );
}

function CompletedSurveyCard({ survey }: { survey: CompletedSurvey }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="leading-snug">{survey.title}</CardTitle>
          <Badge className="shrink-0 border-transparent bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/50 dark:text-emerald-400">
            Completed
          </Badge>
        </div>
        <CardDescription>
          Completed {formatDate(survey.completionDate)} &middot;{' '}
          {survey.totalResponses} responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Score */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {survey.avgScore.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 5.0 avg score</span>
          </div>

          {/* Response rate */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Response Rate</span>
            <span className="font-medium">{survey.responseRate}%</span>
          </div>

          {/* Mini stacked bar */}
          <div className="space-y-2">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full">
              {survey.satisfactionBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={cn('h-full', item.color)}
                  style={{ width: `${item.value}%` }}
                  title={`${item.label}: ${item.value}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {survey.satisfactionBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className={cn(
                      'inline-block size-2 rounded-full',
                      item.color
                    )}
                  />
                  {item.label} ({item.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            toast.success(`Viewing report for "${survey.title}"`)
          }
        >
          <BarChart3 className="size-3.5" aria-hidden="true" />
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
}

function TemplateCard({ template }: { template: SurveyTemplate }) {
  const Icon = template.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </div>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {template.questionCount} questions
        </p>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            toast.success(`Creating survey from "${template.name}" template`)
          }
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SurveysPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [createSurveyOpen, setCreateSurveyOpen] = useState(false);
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyAudience, setSurveyAudience] = useState('');
  const [surveyDeadline, setSurveyDeadline] = useState('');
  const [surveyAnonymous, setSurveyAnonymous] = useState(true);
  const [surveyEstimatedTime, setSurveyEstimatedTime] = useState('');

  function resetSurveyForm() {
    setSurveyTitle('');
    setSurveyDescription('');
    setSurveyAudience('');
    setSurveyDeadline('');
    setSurveyAnonymous(true);
    setSurveyEstimatedTime('');
  }

  async function handleCreateSurvey() {
    setSurveySubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Survey created');
    setSurveySubmitting(false);
    setCreateSurveyOpen(false);
    resetSurveyForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surveys"
        description="Create, manage, and analyze employee surveys."
      >
        <Button
          className="gap-1.5"
          onClick={() => setCreateSurveyOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Create Survey
        </Button>
      </PageHeader>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Surveys</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* ---- Active Surveys ---- */}
        <TabsContent value="active">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SurveyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockActiveSurveys.map((survey) => (
                <ActiveSurveyCard key={survey.id} survey={survey} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Completed ---- */}
        <TabsContent value="completed">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SurveyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockCompletedSurveys.map((survey) => (
                <CompletedSurveyCard key={survey.id} survey={survey} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Templates ---- */}
        <TabsContent value="templates">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SurveyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Survey Dialog */}
      <Dialog open={createSurveyOpen} onOpenChange={setCreateSurveyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Survey</DialogTitle>
            <DialogDescription>
              Set up a new survey for your team or organization.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Survey Title" required>
              <Input
                placeholder="e.g. Q3 Employee Satisfaction"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Description">
              <Textarea
                placeholder="Describe the purpose of this survey..."
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Target Audience" required>
              <Select value={surveyAudience} onValueChange={(v) => v && setSurveyAudience(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees</SelectItem>
                  <SelectItem value="Managers">Managers</SelectItem>
                  <SelectItem value="Specific Teams">Specific Teams</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Deadline" required>
              <DatePicker
                value={surveyDeadline}
                onChange={(v) => setSurveyDeadline(v)}
                placeholder="Select deadline"
              />
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={surveyAnonymous}
                onCheckedChange={setSurveyAnonymous}
              />
              <Label>Anonymous</Label>
            </div>
            <FormFieldWrapper label="Estimated Time">
              <Input
                placeholder="e.g. 10 minutes"
                value={surveyEstimatedTime}
                onChange={(e) => setSurveyEstimatedTime(e.target.value)}
              />
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateSurveyOpen(false)}
              disabled={surveySubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSurvey}
              disabled={surveySubmitting || !surveyTitle.trim() || !surveyAudience || !surveyDeadline}
            >
              {surveySubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Create Survey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
