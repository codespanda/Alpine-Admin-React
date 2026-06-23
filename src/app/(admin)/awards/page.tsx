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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Trophy,
  Star,
  Heart,
  Sparkles,
  ThumbsUp,
  Lightbulb,
  Users,
  Rocket,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AwardTypeName =
  | 'Employee of the Month'
  | 'Innovation Award'
  | 'Team Player'
  | 'Going Above & Beyond'
  | 'Customer Champion'
  | 'Mentor of the Quarter';

interface Recognition {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  recipientDepartment: string;
  awardType: AwardTypeName;
  givenBy: string;
  date: string;
  message: string;
  likes: number;
  featured: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  department: string;
  awardsReceived: number;
  points: number;
  trend: 'up' | 'down' | 'neutral';
}

interface AwardTypeCard {
  id: string;
  name: AwardTypeName;
  frequency: string;
  description: string;
  totalGiven: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const awardBadgeColors: Record<AwardTypeName, string> = {
  'Employee of the Month':
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  'Innovation Award':
    'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  'Team Player':
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  'Going Above & Beyond':
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  'Customer Champion':
    'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  'Mentor of the Quarter':
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
};

const awardDecorationIcons: Record<AwardTypeName, React.ElementType> = {
  'Employee of the Month': Trophy,
  'Innovation Award': Sparkles,
  'Team Player': Star,
  'Going Above & Beyond': Rocket,
  'Customer Champion': Heart,
  'Mentor of the Quarter': GraduationCap,
};

const mockRecognitions: Recognition[] = [
  {
    id: 'r1',
    recipientName: 'Sarah Mitchell',
    recipientAvatar: '',
    recipientDepartment: 'Engineering',
    awardType: 'Employee of the Month',
    givenBy: 'David Kim',
    date: '2026-06-15',
    message:
      'Sarah delivered an outstanding performance this quarter, leading the platform migration project ahead of schedule while mentoring two junior developers. Her dedication and technical expertise are truly exemplary.',
    likes: 42,
    featured: true,
  },
  {
    id: 'r2',
    recipientName: 'James Wilson',
    recipientAvatar: '',
    recipientDepartment: 'Product',
    awardType: 'Innovation Award',
    givenBy: 'Lisa Chen',
    date: '2026-06-12',
    message:
      'James introduced an AI-powered workflow that reduced our customer onboarding time by 40%. This innovation directly impacted our bottom line and improved user satisfaction scores.',
    likes: 38,
    featured: false,
  },
  {
    id: 'r3',
    recipientName: 'Emily Davis',
    recipientAvatar: '',
    recipientDepartment: 'Marketing',
    awardType: 'Team Player',
    givenBy: 'Robert Garcia',
    date: '2026-06-10',
    message:
      'Emily went above and beyond to support the sales team during the product launch, creating compelling materials on short notice and ensuring every team member had what they needed.',
    likes: 29,
    featured: false,
  },
  {
    id: 'r4',
    recipientName: 'Michael Torres',
    recipientAvatar: '',
    recipientDepartment: 'Engineering',
    awardType: 'Going Above & Beyond',
    givenBy: 'Anna Schmidt',
    date: '2026-06-08',
    message:
      'Michael spent his weekend resolving a critical production issue that could have impacted thousands of users. His quick thinking and dedication saved the day.',
    likes: 55,
    featured: false,
  },
  {
    id: 'r5',
    recipientName: 'Carol Martinez',
    recipientAvatar: '',
    recipientDepartment: 'Customer Success',
    awardType: 'Customer Champion',
    givenBy: 'HR Team',
    date: '2026-06-05',
    message:
      'Carol achieved the highest customer satisfaction score in the company this quarter, with a 98% positive rating. Her empathy and problem-solving skills make her a true champion for our customers.',
    likes: 33,
    featured: false,
  },
  {
    id: 'r6',
    recipientName: 'Daniel Lee',
    recipientAvatar: '',
    recipientDepartment: 'Design',
    awardType: 'Innovation Award',
    givenBy: 'James Wilson',
    date: '2026-06-01',
    message:
      'Daniel redesigned our mobile experience using cutting-edge interaction patterns, resulting in a 25% increase in user engagement and rave reviews from beta testers.',
    likes: 21,
    featured: false,
  },
  {
    id: 'r7',
    recipientName: 'Grace Kim',
    recipientAvatar: '',
    recipientDepartment: 'Engineering',
    awardType: 'Mentor of the Quarter',
    givenBy: 'People Team',
    date: '2026-05-28',
    message:
      'Grace has been an incredible mentor to our junior engineers, running weekly knowledge-sharing sessions and providing thoughtful code reviews that help everyone grow.',
    likes: 47,
    featured: false,
  },
  {
    id: 'r8',
    recipientName: 'Henry Clark',
    recipientAvatar: '',
    recipientDepartment: 'Operations',
    awardType: 'Team Player',
    givenBy: 'Emily Davis',
    date: '2026-05-25',
    message:
      'Henry organized a cross-functional task force to streamline our deployment pipeline, resulting in 50% faster releases and zero downtime during the transition.',
    likes: 18,
    featured: false,
  },
  {
    id: 'r9',
    recipientName: 'Iris Patel',
    recipientAvatar: '',
    recipientDepartment: 'Data Science',
    awardType: 'Going Above & Beyond',
    givenBy: 'Michael Torres',
    date: '2026-05-22',
    message:
      'Iris built a predictive analytics dashboard that gave our leadership team unprecedented visibility into business trends, directly influencing our Q3 strategy.',
    likes: 26,
    featured: false,
  },
  {
    id: 'r10',
    recipientName: 'Bob Williams',
    recipientAvatar: '',
    recipientDepartment: 'Sales',
    awardType: 'Customer Champion',
    givenBy: 'Carol Martinez',
    date: '2026-05-18',
    message:
      'Bob secured our largest enterprise deal this year by building genuine relationships with stakeholders and demonstrating deep understanding of their business challenges.',
    likes: 31,
    featured: false,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Mitchell', avatar: '', department: 'Engineering', awardsReceived: 8, points: 1250, trend: 'up' },
  { rank: 2, name: 'Michael Torres', avatar: '', department: 'Engineering', awardsReceived: 7, points: 1100, trend: 'up' },
  { rank: 3, name: 'Carol Martinez', avatar: '', department: 'Customer Success', awardsReceived: 6, points: 980, trend: 'neutral' },
  { rank: 4, name: 'Grace Kim', avatar: '', department: 'Engineering', awardsReceived: 5, points: 850, trend: 'up' },
  { rank: 5, name: 'James Wilson', avatar: '', department: 'Product', awardsReceived: 5, points: 820, trend: 'down' },
  { rank: 6, name: 'Emily Davis', avatar: '', department: 'Marketing', awardsReceived: 4, points: 720, trend: 'up' },
  { rank: 7, name: 'Daniel Lee', avatar: '', department: 'Design', awardsReceived: 4, points: 690, trend: 'neutral' },
  { rank: 8, name: 'Bob Williams', avatar: '', department: 'Sales', awardsReceived: 3, points: 560, trend: 'down' },
  { rank: 9, name: 'Henry Clark', avatar: '', department: 'Operations', awardsReceived: 3, points: 530, trend: 'up' },
  { rank: 10, name: 'Iris Patel', avatar: '', department: 'Data Science', awardsReceived: 3, points: 510, trend: 'up' },
];

const mockAwardTypes: AwardTypeCard[] = [
  {
    id: 'at1',
    name: 'Employee of the Month',
    frequency: 'Monthly',
    description: 'Recognizes outstanding individual performance and dedication that goes beyond regular responsibilities.',
    totalGiven: 24,
    icon: Trophy,
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'hover:ring-amber-200 dark:hover:ring-amber-800',
  },
  {
    id: 'at2',
    name: 'Innovation Award',
    frequency: 'Quarterly',
    description: 'Celebrates creative solutions and innovative ideas that drive meaningful business impact or efficiency gains.',
    totalGiven: 12,
    icon: Lightbulb,
    iconBg: 'bg-purple-100 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'hover:ring-purple-200 dark:hover:ring-purple-800',
  },
  {
    id: 'at3',
    name: 'Team Player',
    frequency: 'Anytime',
    description: 'Honors employees who demonstrate exceptional collaboration, support, and teamwork across the organization.',
    totalGiven: 45,
    icon: Users,
    iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'hover:ring-blue-200 dark:hover:ring-blue-800',
  },
  {
    id: 'at4',
    name: 'Going Above & Beyond',
    frequency: 'Anytime',
    description: 'Recognizes employees who consistently exceed expectations and take on challenges beyond their role.',
    totalGiven: 38,
    icon: Rocket,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:ring-emerald-200 dark:hover:ring-emerald-800',
  },
  {
    id: 'at5',
    name: 'Customer Champion',
    frequency: 'Monthly',
    description: 'Awarded to employees who deliver exceptional customer experiences and advocate for customer needs.',
    totalGiven: 18,
    icon: Heart,
    iconBg: 'bg-pink-100 dark:bg-pink-950/50',
    iconColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'hover:ring-pink-200 dark:hover:ring-pink-800',
  },
  {
    id: 'at6',
    name: 'Mentor of the Quarter',
    frequency: 'Quarterly',
    description: 'Celebrates those who invest in growing others through mentorship, knowledge sharing, and career development guidance.',
    totalGiven: 8,
    icon: GraduationCap,
    iconBg: 'bg-amber-100 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'hover:ring-amber-200 dark:hover:ring-amber-800',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getRankStyle(rank: number) {
  if (rank === 1)
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-700';
  if (rank === 2)
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600';
  if (rank === 3)
    return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 ring-1 ring-orange-300 dark:ring-orange-700';
  return 'bg-muted text-muted-foreground';
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function RecognitionCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RecognitionCard({
  recognition,
}: {
  recognition: Recognition;
}) {
  const DecoIcon = awardDecorationIcons[recognition.awardType];

  return (
    <Card
      className={cn(
        'transition-all',
        recognition.featured &&
          'ring-2 ring-amber-300/60 dark:ring-amber-600/40 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent dark:from-amber-950/20'
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Recipient info */}
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage
                src={recognition.recipientAvatar}
                alt={recognition.recipientName}
              />
              <AvatarFallback>
                {getInitials(recognition.recipientName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{recognition.recipientName}</p>
              <p className="text-xs text-muted-foreground">
                {recognition.recipientDepartment}
              </p>
            </div>
            <DecoIcon
              className={cn(
                'size-5 shrink-0',
                recognition.featured
                  ? 'text-amber-500'
                  : 'text-muted-foreground/40'
              )}
              aria-hidden="true"
            />
          </div>

          {/* Award badge */}
          <Badge
            className={cn(
              'border-transparent font-medium',
              awardBadgeColors[recognition.awardType]
            )}
          >
            {recognition.awardType}
          </Badge>

          {/* Message */}
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {recognition.message}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span>
              Given by{' '}
              <span className="font-medium text-foreground">
                {recognition.givenBy}
              </span>
            </span>
            <span>&middot;</span>
            <span>{formatDate(recognition.date)}</span>
            <button
              type="button"
              className="ml-auto flex items-center gap-1 transition-colors hover:text-foreground"
              onClick={() => toast.success('Liked!')}
            >
              <ThumbsUp className="size-3.5" aria-hidden="true" />
              {recognition.likes}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const TrendIcon =
    entry.trend === 'up'
      ? TrendingUp
      : entry.trend === 'down'
        ? TrendingDown
        : Minus;
  const trendColor =
    entry.trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : entry.trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 transition-colors',
        entry.rank <= 3 && 'bg-muted/30'
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          getRankStyle(entry.rank)
        )}
      >
        {entry.rank}
      </div>

      {/* Avatar + info */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar>
          <AvatarImage src={entry.avatar} alt={entry.name} />
          <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{entry.name}</p>
          <p className="text-xs text-muted-foreground">
            {entry.department}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden items-center gap-6 sm:flex">
        <div className="text-center">
          <p className="text-sm font-semibold">{entry.awardsReceived}</p>
          <p className="text-xs text-muted-foreground">Awards</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">
            {entry.points.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
      </div>

      {/* Trend */}
      <TrendIcon
        className={cn('size-4 shrink-0', trendColor)}
        aria-hidden="true"
      />
    </div>
  );
}

function AwardTypeItem({ awardType }: { awardType: AwardTypeCard }) {
  const Icon = awardType.icon;

  return (
    <Card
      className={cn(
        'flex flex-col transition-all',
        awardType.borderColor
      )}
    >
      <CardHeader>
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-xl',
            awardType.iconBg
          )}
        >
          <Icon
            className={cn('size-6', awardType.iconColor)}
            aria-hidden="true"
          />
        </div>
        <CardTitle>{awardType.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {awardType.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{awardType.frequency}</span>
          <span>&middot;</span>
          <span>{awardType.totalGiven} given</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() =>
            toast.success(`Opening nomination for "${awardType.name}"`)
          }
        >
          <Award className="size-3.5" aria-hidden="true" />
          Nominate
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AwardsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [giveAwardOpen, setGiveAwardOpen] = useState(false);
  const [awardSubmitting, setAwardSubmitting] = useState(false);
  const [awardRecipient, setAwardRecipient] = useState('');
  const [awardType, setAwardType] = useState('');
  const [awardMessage, setAwardMessage] = useState('');
  const [awardAnnounce, setAwardAnnounce] = useState(true);

  function resetAwardForm() {
    setAwardRecipient('');
    setAwardType('');
    setAwardMessage('');
    setAwardAnnounce(true);
  }

  async function handleGiveAward() {
    setAwardSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Award given to ${awardRecipient}!`);
    setAwardSubmitting(false);
    setGiveAwardOpen(false);
    resetAwardForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sortedRecognitions = [...mockRecognitions].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Awards & Recognition"
        description="Celebrate achievements and recognize outstanding contributions."
      >
        <Button
          className="gap-1.5"
          onClick={() => setGiveAwardOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Give Award
        </Button>
      </PageHeader>

      <Tabs defaultValue="wall-of-fame" className="space-y-6">
        <TabsList>
          <TabsTrigger value="wall-of-fame">Wall of Fame</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="award-types">Award Types</TabsTrigger>
        </TabsList>

        {/* ---- Wall of Fame ---- */}
        <TabsContent value="wall-of-fame">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <RecognitionCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedRecognitions.map((recognition) => (
                <RecognitionCard
                  key={recognition.id}
                  recognition={recognition}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Leaderboard ---- */}
        <TabsContent value="leaderboard">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {mockLeaderboard.map((entry) => (
                <LeaderboardRow key={entry.rank} entry={entry} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Award Types ---- */}
        <TabsContent value="award-types">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <RecognitionCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockAwardTypes.map((awardType) => (
                <AwardTypeItem key={awardType.id} awardType={awardType} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Give Award Dialog */}
      <Dialog open={giveAwardOpen} onOpenChange={setGiveAwardOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Give Award</DialogTitle>
            <DialogDescription>
              Recognize an employee for their outstanding contributions.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Recipient" required>
              <Input
                placeholder="Employee name"
                value={awardRecipient}
                onChange={(e) => setAwardRecipient(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Award Type" required>
              <Select value={awardType} onValueChange={(v) => v && setAwardType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select award type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee of the Month">Employee of the Month</SelectItem>
                  <SelectItem value="Innovation Award">Innovation Award</SelectItem>
                  <SelectItem value="Team Player">Team Player</SelectItem>
                  <SelectItem value="Going Above & Beyond">Going Above &amp; Beyond</SelectItem>
                  <SelectItem value="Customer Champion">Customer Champion</SelectItem>
                  <SelectItem value="Mentor of the Quarter">Mentor of the Quarter</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Message / Reason" required>
              <Textarea
                placeholder="Describe why this person deserves this award..."
                value={awardMessage}
                onChange={(e) => setAwardMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={awardAnnounce}
                onCheckedChange={setAwardAnnounce}
              />
              <Label>Announce on Wall of Fame</Label>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGiveAwardOpen(false)}
              disabled={awardSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGiveAward}
              disabled={awardSubmitting || !awardRecipient.trim() || !awardType || !awardMessage.trim()}
            >
              {awardSubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Give Award
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
