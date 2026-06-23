'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { LeaveRequestCard } from '@/features/leaves/components/leave-request-card';
import { LeaveBalanceCard } from '@/features/leaves/components/leave-balance-card';
import { LeaveRequestDialog } from '@/features/leaves/components/leave-request-dialog';
import { mockLeaveRequests, mockLeaveBalances } from '@/constants/mock-data';
import type { LeaveRequest, LeaveBalance, LeaveStatus } from '@/types';
import type { LeaveRequestFormData } from '@/lib/validations';
import { Plus, CalendarDays, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | LeaveStatus;

const filterOptions: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

function LeaveRequestSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests(mockLeaveRequests);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const handleApprove = useCallback((request: LeaveRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: 'approved' as const,
              approvedBy: 'Admin',
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    toast.success('Leave approved', {
      description: `${request.employeeName}'s ${request.type} leave has been approved.`,
    });
  }, []);

  const handleReject = useCallback((request: LeaveRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: 'rejected' as const,
              approvedBy: 'Admin',
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    toast.error('Leave rejected', {
      description: `${request.employeeName}'s ${request.type} leave has been rejected.`,
    });
  }, []);

  const handleCreateRequest = useCallback((data: LeaveRequestFormData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeId: 'emp-1',
      employeeName: 'Alice Johnson',
      employeeAvatar: '/avatars/alice.jpg',
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    toast.success('Leave request submitted', {
      description: `Your ${data.type} leave request for ${days} ${days === 1 ? 'day' : 'days'} has been submitted.`,
    });
  }, []);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'pending').length,
    [requests]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Manage employee leave requests and balances."
      >
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          New Leave Request
        </Button>
      </PageHeader>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests" className="gap-1.5">
            Requests
            {pendingCount > 0 && (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-8',
                  statusFilter === option.value
                    ? ''
                    : 'text-muted-foreground'
                )}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <LeaveRequestSkeleton key={i} />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon={statusFilter === 'pending' ? Clock : CalendarDays}
              title={
                statusFilter === 'all'
                  ? 'No leave requests'
                  : `No ${statusFilter} requests`
              }
              description={
                statusFilter === 'all'
                  ? 'There are no leave requests to display.'
                  : `There are no ${statusFilter} leave requests at the moment.`
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          {isLoading ? (
            <LoadingState message="Loading leave balances..." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {balances.map((balance) => (
                <LeaveBalanceCard key={balance.type} balance={balance} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <LeaveRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateRequest}
      />
    </div>
  );
}
