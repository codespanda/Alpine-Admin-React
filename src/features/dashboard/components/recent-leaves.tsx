'use client';

import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { Clock } from 'lucide-react';
import type { LeaveRequest } from '@/types';

interface RecentLeavesProps {
  requests: LeaveRequest[];
}

const leaveTypeStyles: Record<string, string> = {
  annual:
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  sick: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  personal:
    'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  maternity:
    'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  paternity:
    'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  unpaid:
    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function RecentLeaves({ requests }: RecentLeavesProps) {
  return (
    <div className="space-y-0">
      {requests.map((request, index) => (
        <div
          key={request.id}
          className={`flex items-center justify-between py-3.5 ${
            index < requests.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium text-foreground">
              {request.employeeName}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                className={`border-transparent text-xs font-medium capitalize ${
                  leaveTypeStyles[request.type] ?? leaveTypeStyles.unpaid
                }`}
              >
                {request.type}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" aria-hidden="true" />
                {formatDate(request.startDate)}
                {request.startDate !== request.endDate &&
                  ` - ${formatDate(request.endDate)}`}
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={request.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

export { RecentLeaves, type RecentLeavesProps };
