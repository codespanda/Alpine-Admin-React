'use client';

import { Link } from '@/lib/router';
import {
  ShieldAlert,
  RefreshCcw,
  ArrowLeft,
  ServerCrash,
  Bug,
  TriangleAlert,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Error500Page() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      {/* Error illustration */}
      <div className="relative">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="size-10 text-destructive" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-destructive">
          <span className="text-xs font-bold text-destructive-foreground">!</span>
        </div>
      </div>

      <p className="mt-8 text-7xl font-bold tracking-tighter text-foreground sm:text-8xl">
        500
      </p>

      <h1 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
        Internal Server Error
      </h1>

      <p className="mt-2 max-w-lg text-center text-sm text-muted-foreground">
        Something went wrong on our end. The server encountered an unexpected
        condition that prevented it from fulfilling the request. Please try again
        or contact support.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => window.location.reload()}>
          <RefreshCcw className="mr-2 size-4" />
          Try Again
        </Button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Common causes */}
      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Common Causes
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ServerCrash,
              title: 'Server Overload',
              description: 'The server may be experiencing high traffic.',
            },
            {
              icon: Bug,
              title: 'Application Bug',
              description: 'An unhandled error occurred in the application.',
            },
            {
              icon: TriangleAlert,
              title: 'Service Outage',
              description: 'A dependent service may be temporarily down.',
            },
          ].map((cause) => (
            <div
              key={cause.title}
              className="flex flex-col items-center rounded-lg border p-4 text-center"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                <cause.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium">{cause.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {cause.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
