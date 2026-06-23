'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LeaveBalance } from '@/types';

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

const leaveTypeConfig: Record<
  string,
  { label: string; color: string; bgColor: string; trackColor: string }
> = {
  annual: {
    label: 'Annual Leave',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    trackColor: 'bg-blue-100 dark:bg-blue-950/50',
  },
  sick: {
    label: 'Sick Leave',
    color: 'bg-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    trackColor: 'bg-red-100 dark:bg-red-950/50',
  },
  personal: {
    label: 'Personal Leave',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    trackColor: 'bg-purple-100 dark:bg-purple-950/50',
  },
  maternity: {
    label: 'Maternity Leave',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    trackColor: 'bg-pink-100 dark:bg-pink-950/50',
  },
  paternity: {
    label: 'Paternity Leave',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    trackColor: 'bg-indigo-100 dark:bg-indigo-950/50',
  },
  unpaid: {
    label: 'Unpaid Leave',
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/30',
    trackColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
};

function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const config = leaveTypeConfig[balance.type] ?? leaveTypeConfig.unpaid;
  const percentage =
    balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

  return (
    <Card className={cn('overflow-hidden')}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">{config.label}</h4>
          <span className="text-xs text-muted-foreground">
            {balance.used}/{balance.total} used
          </span>
        </div>

        <div className="mt-3">
          <div
            className={cn('h-2 w-full overflow-hidden rounded-full', config.trackColor)}
          >
            <div
              className={cn('h-full rounded-full transition-all', config.color)}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div
            className={cn(
              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
              config.bgColor
            )}
          >
            {balance.remaining} remaining
          </div>
          {balance.total > 0 && (
            <span className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}% used
            </span>
          )}
          {balance.total === 0 && (
            <span className="text-xs text-muted-foreground">No allocation</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { LeaveBalanceCard, type LeaveBalanceCardProps };
