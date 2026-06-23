import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const defaultVariantMap: Record<string, string> = {
  active:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
  pending:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  approved:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  'on-leave':
    'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  terminated: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  present:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  absent: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  late: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  'half-day':
    'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  cancelled:
    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
};

interface StatusBadgeProps {
  status: string;
  variantMap?: Record<string, string>;
  className?: string;
}

function StatusBadge({ status, variantMap, className }: StatusBadgeProps) {
  const mergedVariants = { ...defaultVariantMap, ...variantMap };
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  const variantClasses =
    mergedVariants[normalizedStatus] ??
    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400';

  const displayLabel =
    status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');

  return (
    <Badge
      className={cn(
        'border-transparent font-medium capitalize',
        variantClasses,
        className
      )}
    >
      {displayLabel}
    </Badge>
  );
}

export { StatusBadge, type StatusBadgeProps };
