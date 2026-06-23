'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import { CalendarDays, Check, X } from 'lucide-react';
import type { LeaveRequest } from '@/types';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onApprove?: (request: LeaveRequest) => void;
  onReject?: (request: LeaveRequest) => void;
}

const leaveTypeColors: Record<string, string> = {
  annual:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  sick: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  personal:
    'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  maternity:
    'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  paternity:
    'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
  unpaid:
    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function LeaveRequestCard({
  request,
  onApprove,
  onReject,
}: LeaveRequestCardProps) {
  const initials = request.employeeName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isPending = request.status === 'pending';
  const typeColor =
    leaveTypeColors[request.type] ?? leaveTypeColors.unpaid;

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={request.employeeAvatar}
                alt={request.employeeName}
              />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold">
                  {request.employeeName}
                </h4>
                <Badge
                  className={cn(
                    'border-transparent text-xs font-medium capitalize',
                    typeColor
                  )}
                >
                  {request.type}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {formatDate(request.startDate)} &mdash;{' '}
                  {formatDate(request.endDate)}
                </span>
                <span className="font-medium text-foreground">
                  ({request.days} {request.days === 1 ? 'day' : 'days'})
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {request.reason}
              </p>
              {request.approvedBy && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {request.status === 'approved'
                    ? 'Approved'
                    : request.status === 'rejected'
                      ? 'Rejected'
                      : 'Reviewed'}{' '}
                  by {request.approvedBy}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusBadge status={request.status} />
            {isPending && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                  onClick={() => onApprove?.(request)}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                  onClick={() => onReject?.(request)}
                >
                  <X className="size-3.5" aria-hidden="true" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { LeaveRequestCard, type LeaveRequestCardProps };
