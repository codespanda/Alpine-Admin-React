'use client';

import * as React from 'react';
import { Link } from '@/lib/router';
import { usePathname } from '@/lib/router';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface AppBreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { label, href };
  });
}

function AppBreadcrumbs({ items, className }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = items ?? generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center rounded-sm p-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Home"
          >
            <Home className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight
                className="size-3.5 text-muted-foreground/50"
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-sm px-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { AppBreadcrumbs, type AppBreadcrumbsProps, type BreadcrumbItem };
