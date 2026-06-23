'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle
          className="size-8 text-destructive"
          aria-hidden="true"
        />
      </div>

      <h1 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
        Something went wrong
      </h1>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error.message ||
          'An unexpected error occurred. Please try again or contact support if the problem persists.'}
      </p>

      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}

      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
