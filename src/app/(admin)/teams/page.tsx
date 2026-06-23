'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { SearchInput } from '@/components/shared/search-input';
import { EmptyState } from '@/components/shared/empty-state';
import { AvatarGroup, type AvatarItem } from '@/components/shared/avatar-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { toast } from 'sonner';
import {
  Plus,
  Users,
  UserCheck,
  Shuffle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { departmentColors, defaultDepartmentColor } from '@/constants/department-colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TeamMember {
  name: string;
  avatar?: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  department: string;
  lead: string;
  members: TeamMember[];
  status: 'active' | 'inactive';
  isCrossFunctional: boolean;
  description: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Team',
    department: 'Engineering',
    lead: 'Lisa Park',
    status: 'active',
    isCrossFunctional: false,
    description: 'Building and maintaining the web application frontend with React and Next.js.',
    members: [
      { name: 'Lisa Park', role: 'Team Lead' },
      { name: 'Alex Rivera', role: 'Senior Developer' },
      { name: 'Jordan Lee', role: 'Developer' },
      { name: 'Sam Taylor', role: 'Developer' },
      { name: 'Chris Nguyen', role: 'Junior Developer' },
      { name: 'Morgan White', role: 'UI Engineer' },
    ],
  },
  {
    id: 'team-2',
    name: 'Backend Team',
    department: 'Engineering',
    lead: 'Mike Ross',
    status: 'active',
    isCrossFunctional: false,
    description: 'Developing and scaling server-side APIs and microservices infrastructure.',
    members: [
      { name: 'Mike Ross', role: 'Team Lead' },
      { name: 'Priya Sharma', role: 'Senior Developer' },
      { name: 'Derek Kim', role: 'Developer' },
      { name: 'Nina Patel', role: 'Developer' },
      { name: 'Ryan Chen', role: 'DevOps Engineer' },
    ],
  },
  {
    id: 'team-3',
    name: 'Design System',
    department: 'Design',
    lead: 'Elena Martinez',
    status: 'active',
    isCrossFunctional: true,
    description: 'Creating and maintaining the design system, component library, and brand guidelines.',
    members: [
      { name: 'Elena Martinez', role: 'Design Lead' },
      { name: 'Maya Johnson', role: 'Senior Designer' },
      { name: 'Kai Tanaka', role: 'UI Designer' },
      { name: 'Liam O\'Brien', role: 'Motion Designer' },
    ],
  },
  {
    id: 'team-4',
    name: 'Growth Marketing',
    department: 'Marketing',
    lead: 'Amy Liu',
    status: 'active',
    isCrossFunctional: true,
    description: 'Driving user acquisition and engagement through data-driven marketing campaigns.',
    members: [
      { name: 'Amy Liu', role: 'Marketing Lead' },
      { name: 'Tom Chen', role: 'Growth Analyst' },
      { name: 'Sarah Kim', role: 'Content Strategist' },
      { name: 'Jake Wilson', role: 'SEO Specialist' },
      { name: 'Mia Davis', role: 'Social Media Manager' },
    ],
  },
  {
    id: 'team-5',
    name: 'Sales Ops',
    department: 'Sales',
    lead: 'James Cooper',
    status: 'active',
    isCrossFunctional: false,
    description: 'Managing the sales pipeline, CRM processes, and sales enablement tools.',
    members: [
      { name: 'James Cooper', role: 'Sales Lead' },
      { name: 'Diana Hall', role: 'Account Executive' },
      { name: 'Marcus Brown', role: 'Account Executive' },
      { name: 'Sophie Turner', role: 'SDR' },
      { name: 'Brandon Lee', role: 'SDR' },
      { name: 'Katie Moore', role: 'Sales Analyst' },
      { name: 'Ethan Clark', role: 'Sales Engineer' },
    ],
  },
  {
    id: 'team-6',
    name: 'People & Culture',
    department: 'HR',
    lead: 'Tom Wilson',
    status: 'active',
    isCrossFunctional: false,
    description: 'Fostering a positive workplace culture and managing talent acquisition and employee experience.',
    members: [
      { name: 'Tom Wilson', role: 'HR Lead' },
      { name: 'Anna Schmidt', role: 'HR Specialist' },
      { name: 'Robert Yang', role: 'Recruiter' },
      { name: 'Jennifer Adams', role: 'L&D Coordinator' },
    ],
  },
  {
    id: 'team-7',
    name: 'Data Analytics',
    department: 'Engineering',
    lead: 'Wei Zhang',
    status: 'active',
    isCrossFunctional: true,
    description: 'Analyzing product and business data to drive decisions and build ML pipelines.',
    members: [
      { name: 'Wei Zhang', role: 'Data Lead' },
      { name: 'Olivia Brown', role: 'Data Scientist' },
      { name: 'Carlos Gomez', role: 'Data Engineer' },
    ],
  },
  {
    id: 'team-8',
    name: 'Platform Security',
    department: 'Engineering',
    lead: 'Nathan Black',
    status: 'active',
    isCrossFunctional: false,
    description: 'Ensuring platform security, compliance, and vulnerability management across all services.',
    members: [
      { name: 'Nathan Black', role: 'Security Lead' },
      { name: 'Zara Ali', role: 'Security Engineer' },
      { name: 'David Park', role: 'Security Analyst' },
      { name: 'Emily Frost', role: 'Compliance Specialist' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TeamCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-8 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="size-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Team card component
// ---------------------------------------------------------------------------

function TeamCard({ team }: { team: Team }) {
  const avatarItems: AvatarItem[] = team.members.map((m) => ({
    name: m.name,
    src: m.avatar,
  }));

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">{team.name}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    'border-transparent text-[10px]',
                    departmentColors[team.department] ?? defaultDepartmentColor
                  )}
                >
                  {team.department}
                </Badge>
                {team.isCrossFunctional && (
                  <Badge variant="outline" className="text-[10px] gap-0.5">
                    <Shuffle className="size-2.5" aria-hidden="true" />
                    Cross-functional
                  </Badge>
                )}
              </div>
            </div>
            <StatusBadge status={team.status} />
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {team.description}
          </p>

          {/* Team lead */}
          <div className="flex items-center gap-1.5 text-xs">
            <UserCheck className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Lead:</span>
            <span className="font-medium">{team.lead}</span>
          </div>

          {/* Members & action */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2.5">
              <AvatarGroup avatars={avatarItems} max={3} size="sm" />
              <span className="text-xs text-muted-foreground">
                {team.members.length} members
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              View Team
              <ArrowRight className="size-3" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Create Team dialog
// ---------------------------------------------------------------------------

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'] as const;

const defaultCreateTeamForm = {
  name: '',
  department: '',
  description: '',
  teamLead: '',
  status: 'active' as 'active' | 'inactive',
};

function CreateTeamDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(defaultCreateTeamForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultCreateTeamForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.department) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success(`Team "${form.name}" created successfully`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Add a new team to your organization. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Team Name" required htmlFor="team-name">
              <Input
                id="team-name"
                placeholder="e.g. Platform Team"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Department" required htmlFor="team-department">
              <Select
                value={form.department}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, department: v }))
                }
              >
                <SelectTrigger id="team-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="team-description">
              <Textarea
                id="team-description"
                placeholder="Brief description of the team's purpose..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Team Lead" htmlFor="team-lead">
              <Input
                id="team-lead"
                placeholder="e.g. John Smith"
                value={form.teamLead}
                onChange={(e) =>
                  setForm((f) => ({ ...f, teamLead: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Status" required htmlFor="team-status">
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, status: v as 'active' | 'inactive' }))
                }
              >
                <SelectTrigger id="team-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={isSubmitting || !form.name.trim() || !form.department}
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Team
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

export default function TeamsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [teams] = useState<Team[]>(mockTeams);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const avgSize = Math.round(
      teams.reduce((sum, t) => sum + t.members.length, 0) / teams.length
    );
    const crossFunctional = teams.filter((t) => t.isCrossFunctional).length;
    return { totalTeams, avgSize, crossFunctional };
  }, [teams]);

  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.lead.toLowerCase().includes(q) ||
        t.members.some((m) => m.name.toLowerCase().includes(q))
    );
  }, [teams, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description="Manage and organize your teams across departments."
      >
        <Button className="gap-1.5" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create Team
        </Button>
      </PageHeader>

      {/* Stats */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Teams"
            value={stats.totalTeams}
            icon={Users}
            change={12}
            changeLabel="from last quarter"
            trend="up"
          />
          <StatCard
            title="Avg Team Size"
            value={stats.avgSize}
            icon={UserCheck}
            change={2}
            changeLabel="from last quarter"
            trend="up"
          />
          <StatCard
            title="Cross-functional"
            value={stats.crossFunctional}
            icon={Shuffle}
            change={1}
            changeLabel="from last quarter"
            trend="up"
          />
        </div>
      )}

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search teams, departments, or members..."
        className="max-w-sm"
      />

      {/* Team grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams found"
          description="No teams match your search criteria. Try a different search term."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <CreateTeamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
