'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
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
  Pin,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Megaphone,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnnouncementCategory = 'Company' | 'Team' | 'Policy' | 'Event';

interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  author: string;
  authorAvatar: string;
  pinned: boolean;
  preview: string;
  likes: number;
  comments: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Q3 Company All-Hands Meeting',
    category: 'Event',
    date: '2026-06-15',
    author: 'HR Team',
    authorAvatar: '',
    pinned: true,
    preview:
      'Join us for the quarterly all-hands meeting where we will discuss company performance, upcoming initiatives, and celebrate team achievements. All employees are expected to attend.',
    likes: 34,
    comments: 12,
  },
  {
    id: 'ann2',
    title: 'Updated Remote Work Policy',
    category: 'Policy',
    date: '2026-06-10',
    author: 'Sarah Chen',
    authorAvatar: '',
    pinned: false,
    preview:
      'We are updating our remote work policy effective July 1st. The new guidelines include flexible hybrid schedules and updated home-office equipment stipends for all eligible employees.',
    likes: 28,
    comments: 15,
  },
  {
    id: 'ann3',
    title: 'Welcome Our New Engineering Team Members',
    category: 'Company',
    date: '2026-06-08',
    author: 'People Team',
    authorAvatar: '',
    pinned: false,
    preview:
      'We are excited to welcome five new engineers joining our platform and infrastructure teams this month. Please join us in giving them a warm welcome at the meet-and-greet on Friday.',
    likes: 45,
    comments: 8,
  },
  {
    id: 'ann4',
    title: 'Office Renovation Schedule',
    category: 'Company',
    date: '2026-06-05',
    author: 'Operations',
    authorAvatar: '',
    pinned: false,
    preview:
      'The 3rd floor renovation will begin on June 15th and is expected to be completed by July 20th. Please plan accordingly and use the temporary workspaces on the 2nd floor during this period.',
    likes: 12,
    comments: 6,
  },
  {
    id: 'ann5',
    title: 'Annual Performance Review Kickoff',
    category: 'Policy',
    date: '2026-06-01',
    author: 'HR Team',
    authorAvatar: '',
    pinned: false,
    preview:
      'The annual performance review cycle is now open. Managers should complete all direct report reviews by June 30th. Self-assessments are due by June 15th. Check the HR portal for guidelines.',
    likes: 18,
    comments: 9,
  },
  {
    id: 'ann6',
    title: 'Summer Team Building Activities',
    category: 'Event',
    date: '2026-05-28',
    author: 'Culture Team',
    authorAvatar: '',
    pinned: false,
    preview:
      'Get ready for our summer team building events! This year we have outdoor activities including hiking, kayaking, and a BBQ picnic planned for various weekends throughout July and August.',
    likes: 52,
    comments: 20,
  },
  {
    id: 'ann7',
    title: 'New Health Insurance Benefits',
    category: 'Policy',
    date: '2026-05-25',
    author: 'Benefits Team',
    authorAvatar: '',
    pinned: false,
    preview:
      'Starting Q3, we are expanding health insurance coverage to include mental wellness programs, enhanced dental benefits, and a new telemedicine option available to all full-time employees.',
    likes: 67,
    comments: 14,
  },
  {
    id: 'ann8',
    title: 'Engineering Sprint Retrospective',
    category: 'Team',
    date: '2026-05-22',
    author: 'Engineering',
    authorAvatar: '',
    pinned: false,
    preview:
      'The sprint 24 retrospective highlighted great improvements in deployment frequency and reduced cycle time. Key action items include improving documentation and cross-team collaboration.',
    likes: 8,
    comments: 4,
  },
  {
    id: 'ann9',
    title: 'Quarterly Business Review Results',
    category: 'Company',
    date: '2026-05-20',
    author: 'Leadership',
    authorAvatar: '',
    pinned: false,
    preview:
      'Q2 results exceeded expectations with 15% revenue growth and strong customer retention metrics. The full report is available on the company intranet. Thank you all for your contributions.',
    likes: 89,
    comments: 22,
  },
  {
    id: 'ann10',
    title: 'New Parking Policy',
    category: 'Policy',
    date: '2026-05-15',
    author: 'Operations',
    authorAvatar: '',
    pinned: false,
    preview:
      'Due to the new building construction, parking arrangements have been updated. Please register for your new parking spot through the facilities portal by May 30th to ensure availability.',
    likes: 6,
    comments: 11,
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

const categoryColorMap: Record<AnnouncementCategory, string> = {
  Company:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Team: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Policy:
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Event:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
};

function getRelativeDate(dateStr: string): string {
  const now = new Date('2026-06-18');
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function AnnouncementSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Card
      className={cn(
        'transition-colors',
        announcement.pinned &&
          'border-primary/30 bg-primary/[0.02] ring-primary/20 dark:border-primary/20 dark:bg-primary/[0.03]'
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Top row: category + pin + date */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                'border-transparent font-medium',
                categoryColorMap[announcement.category]
              )}
            >
              {announcement.category}
            </Badge>
            {announcement.pinned && (
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <Pin className="size-3" aria-hidden="true" />
                Pinned
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {getRelativeDate(announcement.date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold leading-tight">
            {announcement.title}
          </h3>

          {/* Preview */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {announcement.preview}
          </p>

          {/* Footer: Author + Reactions + Read more */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage
                  src={announcement.authorAvatar}
                  alt={announcement.author}
                />
                <AvatarFallback>
                  {getInitials(announcement.author)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {announcement.author}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <button
                type="button"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
                onClick={() => toast.success('Liked!')}
              >
                <ThumbsUp className="size-3.5" aria-hidden="true" />
                {announcement.likes}
              </button>
              <button
                type="button"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
                onClick={() => toast.success('Opening comments...')}
              >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                {announcement.comments}
              </button>
            </div>

            <button
              type="button"
              className="ml-auto flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              onClick={() =>
                toast.success(`Reading "${announcement.title}"`)
              }
            >
              Read More
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnnouncementsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | AnnouncementCategory>('All');
  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);
  const [announcementSubmitting, setAnnouncementSubmitting] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [annTargetAudience, setAnnTargetAudience] = useState('');

  function resetAnnouncementForm() {
    setAnnTitle('');
    setAnnCategory('');
    setAnnContent('');
    setAnnPinned(false);
    setAnnTargetAudience('');
  }

  async function handleCreateAnnouncement() {
    setAnnouncementSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Announcement published');
    setAnnouncementSubmitting(false);
    setNewAnnouncementOpen(false);
    resetAnnouncementForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const sorted = [...mockAnnouncements].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    if (filter === 'All') return sorted;
    return sorted.filter((a) => a.category === filter);
  }, [filter]);

  const filterTabs: Array<'All' | AnnouncementCategory> = [
    'All',
    'Company',
    'Team',
    'Policy',
    'Event',
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Company-wide announcements, policies, and event updates."
      >
        <Button
          className="gap-1.5"
          onClick={() => setNewAnnouncementOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          New Announcement
        </Button>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-8',
              filter === tab ? '' : 'text-muted-foreground'
            )}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Announcement List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <AnnouncementSkeleton key={i} />
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements"
          description="No announcements match the selected filter."
        />
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}

      {/* New Announcement Dialog */}
      <Dialog open={newAnnouncementOpen} onOpenChange={setNewAnnouncementOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>
              Publish an announcement to your organization.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Title" required>
              <Input
                placeholder="Announcement title"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Category" required>
              <Select value={annCategory} onValueChange={(v) => v && setAnnCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Content" required>
              <Textarea
                placeholder="Write your announcement..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="min-h-[120px]"
              />
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={annPinned}
                onCheckedChange={setAnnPinned}
              />
              <Label>Pin Announcement</Label>
            </div>
            <FormFieldWrapper label="Target Audience" required>
              <Select value={annTargetAudience} onValueChange={(v) => v && setAnnTargetAudience(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewAnnouncementOpen(false)}
              disabled={announcementSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAnnouncement}
              disabled={announcementSubmitting || !annTitle.trim() || !annCategory || !annContent.trim() || !annTargetAudience}
            >
              {announcementSubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
