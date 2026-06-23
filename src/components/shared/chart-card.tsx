import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
}

function ChartCard({
  title,
  description,
  children,
  className,
  isLoading = false,
  isEmpty = false,
}: ChartCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartCardSkeleton />
        ) : isEmpty ? (
          <ChartCardEmpty />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading chart" role="status">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <span className="sr-only">Loading chart data</span>
    </div>
  );
}

function ChartCardEmpty() {
  return (
    <div
      className="flex h-[200px] flex-col items-center justify-center gap-2 text-center"
      role="status"
    >
      <BarChart3
        className="size-8 text-muted-foreground/50"
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground">No data available</p>
    </div>
  );
}

export { ChartCard, type ChartCardProps };
