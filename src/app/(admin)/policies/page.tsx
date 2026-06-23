'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  FileText,
  Eye,
  BarChart3,
  Bell,
  Search,
  ArrowUpRight,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Policy {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  acknowledged: number;
  required: boolean;
  version?: string;
}

interface Acknowledgment {
  id: string;
  employeeName: string;
  employeeInitials: string;
  policyName: string;
  status: 'acknowledged' | 'pending' | 'overdue';
  acknowledgedDate: string | null;
  sentDate: string;
}

interface PolicyUpdate {
  id: string;
  date: string;
  policyName: string;
  changeType: 'New' | 'Updated' | 'Archived';
  changedBy: string;
  summary: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockPolicies: Policy[] = [
  // Employment
  {
    id: 'p1',
    name: 'Employee Handbook',
    version: 'v3.2',
    category: 'Employment',
    lastUpdated: 'Jun 1, 2026',
    acknowledged: 95,
    required: true,
  },
  {
    id: 'p2',
    name: 'Code of Conduct',
    category: 'Employment',
    lastUpdated: 'Mar 15, 2026',
    acknowledged: 98,
    required: true,
  },
  {
    id: 'p3',
    name: 'Anti-Harassment Policy',
    category: 'Employment',
    lastUpdated: 'Jan 10, 2026',
    acknowledged: 100,
    required: true,
  },
  // Work Arrangements
  {
    id: 'p4',
    name: 'Remote Work Policy',
    category: 'Work Arrangements',
    lastUpdated: 'May 20, 2026',
    acknowledged: 88,
    required: true,
  },
  {
    id: 'p5',
    name: 'Flexible Hours Policy',
    category: 'Work Arrangements',
    lastUpdated: 'Apr 5, 2026',
    acknowledged: 92,
    required: false,
  },
  {
    id: 'p6',
    name: 'Travel & Expense Policy',
    category: 'Work Arrangements',
    lastUpdated: 'Feb 28, 2026',
    acknowledged: 85,
    required: true,
  },
  // IT & Security
  {
    id: 'p7',
    name: 'Data Security Policy',
    category: 'IT & Security',
    lastUpdated: 'Jun 10, 2026',
    acknowledged: 90,
    required: true,
  },
  {
    id: 'p8',
    name: 'Acceptable Use Policy',
    category: 'IT & Security',
    lastUpdated: 'Mar 1, 2026',
    acknowledged: 95,
    required: true,
  },
  {
    id: 'p9',
    name: 'BYOD Policy',
    category: 'IT & Security',
    lastUpdated: 'Jan 5, 2026',
    acknowledged: 80,
    required: false,
  },
  // Benefits
  {
    id: 'p10',
    name: 'Leave Policy',
    category: 'Benefits',
    lastUpdated: 'Apr 15, 2026',
    acknowledged: 97,
    required: true,
  },
  {
    id: 'p11',
    name: 'Health & Safety Policy',
    category: 'Benefits',
    lastUpdated: 'May 1, 2026',
    acknowledged: 93,
    required: true,
  },
];

const mockAcknowledgments: Acknowledgment[] = [
  {
    id: 'a1',
    employeeName: 'Mike Ross',
    employeeInitials: 'MR',
    policyName: 'Employee Handbook v3.2',
    status: 'acknowledged',
    acknowledgedDate: 'Jun 5, 2026',
    sentDate: 'Jun 1, 2026',
  },
  {
    id: 'a2',
    employeeName: 'Jessica Wang',
    employeeInitials: 'JW',
    policyName: 'Data Security Policy',
    status: 'pending',
    acknowledgedDate: null,
    sentDate: 'Jun 10, 2026',
  },
  {
    id: 'a3',
    employeeName: 'David Park',
    employeeInitials: 'DP',
    policyName: 'Remote Work Policy',
    status: 'overdue',
    acknowledgedDate: null,
    sentDate: 'May 20, 2026',
  },
  {
    id: 'a4',
    employeeName: 'Sarah Chen',
    employeeInitials: 'SC',
    policyName: 'Code of Conduct',
    status: 'acknowledged',
    acknowledgedDate: 'Mar 20, 2026',
    sentDate: 'Mar 15, 2026',
  },
  {
    id: 'a5',
    employeeName: 'Tom Wilson',
    employeeInitials: 'TW',
    policyName: 'Employee Handbook v3.2',
    status: 'pending',
    acknowledgedDate: null,
    sentDate: 'Jun 1, 2026',
  },
  {
    id: 'a6',
    employeeName: 'Emily Carter',
    employeeInitials: 'EC',
    policyName: 'Data Security Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Jun 12, 2026',
    sentDate: 'Jun 10, 2026',
  },
  {
    id: 'a7',
    employeeName: 'Rachel Kim',
    employeeInitials: 'RK',
    policyName: 'Anti-Harassment Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Jan 15, 2026',
    sentDate: 'Jan 10, 2026',
  },
  {
    id: 'a8',
    employeeName: 'Alex Turner',
    employeeInitials: 'AT',
    policyName: 'Travel & Expense Policy',
    status: 'overdue',
    acknowledgedDate: null,
    sentDate: 'Feb 28, 2026',
  },
  {
    id: 'a9',
    employeeName: 'Priya Sharma',
    employeeInitials: 'PS',
    policyName: 'Flexible Hours Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Apr 10, 2026',
    sentDate: 'Apr 5, 2026',
  },
  {
    id: 'a10',
    employeeName: 'James Chen',
    employeeInitials: 'JC',
    policyName: 'Remote Work Policy',
    status: 'pending',
    acknowledgedDate: null,
    sentDate: 'May 20, 2026',
  },
  {
    id: 'a11',
    employeeName: 'Lisa Nguyen',
    employeeInitials: 'LN',
    policyName: 'BYOD Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Jan 12, 2026',
    sentDate: 'Jan 5, 2026',
  },
  {
    id: 'a12',
    employeeName: 'Mark Stevens',
    employeeInitials: 'MS',
    policyName: 'Leave Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Apr 20, 2026',
    sentDate: 'Apr 15, 2026',
  },
  {
    id: 'a13',
    employeeName: 'Anna Lopez',
    employeeInitials: 'AL',
    policyName: 'Health & Safety Policy',
    status: 'pending',
    acknowledgedDate: null,
    sentDate: 'May 1, 2026',
  },
  {
    id: 'a14',
    employeeName: 'Kevin Brown',
    employeeInitials: 'KB',
    policyName: 'Acceptable Use Policy',
    status: 'acknowledged',
    acknowledgedDate: 'Mar 8, 2026',
    sentDate: 'Mar 1, 2026',
  },
  {
    id: 'a15',
    employeeName: 'Megan White',
    employeeInitials: 'MW',
    policyName: 'Employee Handbook v3.2',
    status: 'overdue',
    acknowledgedDate: null,
    sentDate: 'Jun 1, 2026',
  },
];

const mockUpdates: PolicyUpdate[] = [
  {
    id: 'u1',
    date: 'Jun 10, 2026',
    policyName: 'Data Security Policy',
    changeType: 'Updated',
    changedBy: 'Admin User',
    summary: 'Added section on AI tool usage guidelines and data handling for LLM-based tools',
  },
  {
    id: 'u2',
    date: 'Jun 1, 2026',
    policyName: 'Employee Handbook',
    changeType: 'Updated',
    changedBy: 'Admin User',
    summary: 'Updated to v3.2 with revised remote work section and new parental leave benefits',
  },
  {
    id: 'u3',
    date: 'May 20, 2026',
    policyName: 'Remote Work Policy',
    changeType: 'Updated',
    changedBy: 'Sarah Chen',
    summary: 'Added hybrid schedule requirements and home office equipment stipend details',
  },
  {
    id: 'u4',
    date: 'May 1, 2026',
    policyName: 'Health & Safety Policy',
    changeType: 'Updated',
    changedBy: 'Admin User',
    summary: 'Updated ergonomic assessment procedures and added mental health support resources',
  },
  {
    id: 'u5',
    date: 'Apr 15, 2026',
    policyName: 'Leave Policy',
    changeType: 'Updated',
    changedBy: 'Emily Carter',
    summary: 'Increased annual leave from 20 to 22 days and added volunteer day off',
  },
  {
    id: 'u6',
    date: 'Apr 5, 2026',
    policyName: 'Flexible Hours Policy',
    changeType: 'New',
    changedBy: 'Admin User',
    summary: 'New policy establishing core hours (10 AM - 3 PM) with flexible start/end times',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAckBarColor(pct: number): string {
  if (pct >= 95) return 'bg-emerald-500';
  if (pct >= 85) return 'bg-blue-500';
  if (pct >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
}

const ackStatusVariantMap: Record<string, string> = {
  acknowledged:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  pending:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  overdue: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

const changeTypeBadgeConfig: Record<
  string,
  { className: string }
> = {
  New: {
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  Updated: {
    className:
      'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  },
  Archived: {
    className:
      'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PolicyCategoryGroup({
  category,
  policies,
}: {
  category: string;
  policies: Policy[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {category}
      </h3>
      <div className="space-y-2">
        {policies.map((policy) => (
          <PolicyRow key={policy.id} policy={policy} />
        ))}
      </div>
    </div>
  );
}

function PolicyRow({ policy }: { policy: Policy }) {
  return (
    <div className="group flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/30">
      {/* Icon */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="size-4 text-primary" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {policy.name}
            {policy.version && (
              <span className="ml-1 text-muted-foreground">
                {policy.version}
              </span>
            )}
          </span>
          <Badge
            className={cn(
              'border-transparent text-[10px]',
              policy.required
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
            )}
          >
            {policy.required ? 'Required' : 'Optional'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {policy.lastUpdated}
        </p>
      </div>

      {/* Acknowledgment progress */}
      <div className="hidden w-40 shrink-0 items-center gap-2 md:flex">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all', getAckBarColor(policy.acknowledged))}
            style={{ width: `${policy.acknowledged}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs font-medium tabular-nums">
          {policy.acknowledged}%
        </span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Eye className="size-3.5" />
          View
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <BarChart3 className="size-3.5" />
          Track
        </Button>
      </div>
    </div>
  );
}

function AcknowledgmentsTab() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockAcknowledgments.filter((ack) => {
      if (statusFilter !== 'all' && ack.status !== statusFilter) return false;
      if (
        search &&
        !ack.employeeName.toLowerCase().includes(search.toLowerCase()) &&
        !ack.policyName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [statusFilter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search employees or policies..."
          className="w-full sm:w-64"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => v && setStatusFilter(v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Employee</th>
                <th className="px-4 py-3 text-left font-medium">Policy</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                  Sent Date
                </th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                  Acknowledged
                </th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ack) => (
                <tr key={ack.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px]">
                          {ack.employeeInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{ack.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ack.policyName}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={ack.status}
                      variantMap={ackStatusVariantMap}
                    />
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {ack.sentDate}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {ack.acknowledgedDate ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(ack.status === 'pending' || ack.status === 'overdue') && (
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Bell className="size-3.5" />
                        Send Reminder
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No acknowledgments match your filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UpdatesTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Recent changes to company policies
      </p>
      <div className="relative space-y-0">
        {mockUpdates.map((update, index) => {
          const badgeConf = changeTypeBadgeConfig[update.changeType];
          const isLast = index === mockUpdates.length - 1;
          return (
            <div key={update.id} className="relative flex gap-4 pb-6">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
              )}

              {/* Dot */}
              <div className="relative z-10 mt-1.5 flex size-[30px] shrink-0 items-center justify-center rounded-full border bg-card">
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">
                    {update.policyName}
                  </span>
                  <Badge
                    className={cn(
                      'border-transparent text-[10px] font-medium',
                      badgeConf.className
                    )}
                  >
                    {update.changeType}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {update.summary}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {update.date}
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>by {update.changedBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function PoliciesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="h-8 w-80" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-16 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PoliciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);
  const [policySubmitting, setPolicySubmitting] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [policyCategory, setPolicyCategory] = useState('');
  const [policyVersion, setPolicyVersion] = useState('');
  const [policyRequired, setPolicyRequired] = useState(false);
  const [policyContent, setPolicyContent] = useState('');

  function resetPolicyForm() {
    setPolicyName('');
    setPolicyCategory('');
    setPolicyVersion('');
    setPolicyRequired(false);
    setPolicyContent('');
  }

  async function handleAddPolicy() {
    setPolicySubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Policy created');
    setPolicySubmitting(false);
    setAddPolicyOpen(false);
    resetPolicyForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Group policies by category
  const groupedPolicies = useMemo(() => {
    const groups: Record<string, Policy[]> = {};
    for (const policy of mockPolicies) {
      if (!groups[policy.category]) {
        groups[policy.category] = [];
      }
      groups[policy.category].push(policy);
    }
    return groups;
  }, []);

  const categoryOrder = [
    'Employment',
    'Work Arrangements',
    'IT & Security',
    'Benefits',
  ];

  if (isLoading) {
    return <PoliciesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Company Policies">
        <Button
          className="gap-1.5"
          onClick={() => setAddPolicyOpen(true)}
        >
          <Plus className="size-4" />
          Add Policy
        </Button>
      </PageHeader>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => v && setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="all">All Policies</TabsTrigger>
          <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        {/* All Policies Tab */}
        <TabsContent value="all">
          <div className="space-y-6 pt-2">
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card size="sm">
                <CardContent className="flex items-center gap-3 pt-1">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{mockPolicies.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Total Policies
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex items-center gap-3 pt-1">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                    <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-muted-foreground">
                      Avg Acknowledgment
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex items-center gap-3 pt-1">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-950/50">
                    <Bell className="size-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        mockAcknowledgments.filter(
                          (a) => a.status === 'pending' || a.status === 'overdue'
                        ).length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pending Actions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policy categories */}
            {categoryOrder.map((category) => {
              const policies = groupedPolicies[category];
              if (!policies) return null;
              return (
                <PolicyCategoryGroup
                  key={category}
                  category={category}
                  policies={policies}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* Acknowledgments Tab */}
        <TabsContent value="acknowledgments">
          <div className="pt-2">
            <AcknowledgmentsTab />
          </div>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates">
          <div className="pt-2">
            <UpdatesTab />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Policy Dialog */}
      <Dialog open={addPolicyOpen} onOpenChange={setAddPolicyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Policy</DialogTitle>
            <DialogDescription>
              Create a new company policy document.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Policy Name" required>
              <Input
                placeholder="e.g. Remote Work Policy"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Category" required>
              <Select value={policyCategory} onValueChange={(v) => v && setPolicyCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employment">Employment</SelectItem>
                  <SelectItem value="Work Arrangements">Work Arrangements</SelectItem>
                  <SelectItem value="IT & Security">IT &amp; Security</SelectItem>
                  <SelectItem value="Benefits">Benefits</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Version">
              <Input
                placeholder="e.g. 1.0"
                value={policyVersion}
                onChange={(e) => setPolicyVersion(e.target.value)}
              />
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={policyRequired}
                onCheckedChange={setPolicyRequired}
              />
              <Label>Required</Label>
            </div>
            <FormFieldWrapper label="Content / Description">
              <Textarea
                placeholder="Policy content..."
                value={policyContent}
                onChange={(e) => setPolicyContent(e.target.value)}
                className="min-h-[140px]"
              />
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddPolicyOpen(false)}
              disabled={policySubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPolicy}
              disabled={policySubmitting || !policyName.trim() || !policyCategory}
            >
              {policySubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Add Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
