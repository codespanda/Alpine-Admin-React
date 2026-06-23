import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

function LoadingState({ message, className, fullPage = false }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullPage
          ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm'
          : 'py-12',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading'}
    >
      <Loader2
        className="size-8 animate-spin text-muted-foreground"
        aria-hidden="true"
      />
      {message && (
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      )}
      <span className="sr-only">{message ?? 'Loading'}</span>
    </div>
  );
}

export { LoadingState, type LoadingStateProps };
