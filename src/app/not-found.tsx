import { Link } from '@/lib/router';
import { buttonVariants } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion
          className="size-8 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <p className="mt-6 text-7xl font-bold tracking-tighter text-foreground sm:text-8xl">
        404
      </p>

      <h1 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
        Page not found
      </h1>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
        Please check the URL or navigate back to the dashboard.
      </p>

      <Link href="/" className={cn(buttonVariants(), 'mt-6')}>
        Back to Dashboard
      </Link>
    </div>
  );
}
