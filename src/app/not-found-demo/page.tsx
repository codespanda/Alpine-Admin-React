'use client';

import { Link } from '@/lib/router';
import {
  FileQuestion,
  ArrowLeft,
  Search,
  Home,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const popularPages = [
  { label: 'Dashboard', href: '/dashboard', description: 'Overview and analytics' },
  { label: 'Employees', href: '/employees', description: 'Employee management' },
  { label: 'Departments', href: '/departments', description: 'Department listing' },
  { label: 'Attendance', href: '/attendance', description: 'Attendance tracking' },
  { label: 'Leaves', href: '/leaves', description: 'Leave management' },
  { label: 'Settings', href: '/settings', description: 'Account preferences' },
];

export default function NotFoundDemoPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredPages = popularPages.filter(
    (page) =>
      page.label.toLowerCase().includes(search.toLowerCase()) ||
      page.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      {/* Illustration */}
      <div className="relative">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary">
          <span className="text-xs font-bold text-primary-foreground">?</span>
        </div>
      </div>

      <p className="mt-8 text-7xl font-bold tracking-tighter text-foreground sm:text-8xl">
        404
      </p>

      <h1 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
        Page not found
      </h1>

      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching for what you need or browse the popular pages below.
      </p>

      {/* Search */}
      <div className="mt-8 w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a page..."
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredPages.length > 0) {
                router.push(filteredPages[0].href);
              }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants(), 'gap-2')}
        >
          <Home className="size-4" />
          Go to Dashboard
        </Link>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Go Back
        </Button>
      </div>

      {/* Popular pages */}
      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {search ? 'Search Results' : 'Popular Pages'}
        </p>

        {filteredPages.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed py-8 text-center">
            <HelpCircle className="size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No pages found matching &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-foreground/20 hover:bg-accent"
              >
                <p className="text-sm font-medium group-hover:text-primary">
                  {page.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
