'use client';

import { useCallback } from 'react';
import { Link } from '@/lib/router';
import { usePathname } from '@/lib/router';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogIn,
  UserPlus,
  KeyRound,
  MailCheck,
  ShieldAlert,
  FileQuestion,
  DollarSign,
  Star,
  UserCheck,
  UserMinus,
  FileText,

  Shield,
  UsersRound,
  BadgeCheck,
  Clock,
  Timer,
  CalendarHeart,
  GraduationCap,
  Megaphone,
  ClipboardList,
  Trophy,
  BarChart3,
  ScrollText,
  BookOpen,
  TextCursorInput,
  Component,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


// ---------------------------------------------------------------------------
// Navigation definition
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  newTab?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Departments', href: '/departments', icon: Building2 },
    ],
  },
  {
    title: 'HR & PEOPLE',
    items: [
      { label: 'Payroll', href: '/payroll', icon: DollarSign },
      { label: 'Performance', href: '/performance', icon: Star },
      { label: 'Onboarding', href: '/onboarding', icon: UserCheck },
      { label: 'Offboarding', href: '/offboarding', icon: UserMinus },
      { label: 'Documents', href: '/documents', icon: FileText },
    ],
  },
  {
    title: 'ORGANIZATION',
    items: [

      { label: 'Roles & Permissions', href: '/roles', icon: Shield },
      { label: 'Teams', href: '/teams', icon: UsersRound },
      { label: 'Designations', href: '/designations', icon: BadgeCheck },
    ],
  },
  {
    title: 'TIME & SCHEDULING',
    items: [
      { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
      { label: 'Leaves', href: '/leaves', icon: CalendarDays },
      { label: 'Shifts', href: '/shifts', icon: Clock },
      { label: 'Timesheet', href: '/timesheet', icon: Timer },
      { label: 'Holidays', href: '/holidays', icon: CalendarHeart },
    ],
  },
  {
    title: 'ENGAGEMENT',
    items: [
      { label: 'Training', href: '/training', icon: GraduationCap },
      { label: 'Announcements', href: '/announcements', icon: Megaphone },
      { label: 'Surveys', href: '/surveys', icon: ClipboardList },
      { label: 'Awards', href: '/awards', icon: Trophy },
    ],
  },
  {
    title: 'COMPLIANCE',
    items: [
      { label: 'Reports', href: '/reports', icon: BarChart3 },
      { label: 'Audit Log', href: '/audit-log', icon: ScrollText },
      { label: 'Policies', href: '/policies', icon: BookOpen },
    ],
  },
  {
    title: 'PAGES',
    items: [
      { label: 'Login', href: '/login', icon: LogIn },
      { label: 'Register', href: '/register', icon: UserPlus },
      { label: 'Forgot Password', href: '/forgot-password', icon: KeyRound },
      { label: 'Verify Email', href: '/verify-email', icon: MailCheck },
      { label: 'Error 500', href: '/error-500', icon: ShieldAlert, newTab: true },
      { label: 'Not Found', href: '/not-found-demo', icon: FileQuestion, newTab: true },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { label: 'Forms', href: '/forms', icon: TextCursorInput },
      { label: 'Components', href: '/components', icon: Component },
      { label: 'Charts', href: '/charts', icon: BarChart3 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

// ---------------------------------------------------------------------------
// NavLink (single navigation item)
// ---------------------------------------------------------------------------

function NavLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const content = (
    <Link
      href={item.href}
      target={item.newTab ? '_blank' : undefined}
      rel={item.newTab ? 'noopener noreferrer' : undefined}
      className={cn(
        'group/nav-link relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70',
        isCollapsed && 'justify-center px-0'
      )}
    >
      {isActive && (
        <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-sidebar-primary" />
      )}
      <item.icon
        className={cn(
          'size-4 shrink-0 transition-colors',
          isActive
            ? 'text-sidebar-primary'
            : 'text-sidebar-foreground/50 group-hover/nav-link:text-sidebar-accent-foreground'
        )}
      />
      {!isCollapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.newTab && (
            <ExternalLink className="ml-auto size-3 text-sidebar-foreground/30" />
          )}
          {item.badge && (
            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-[10px] font-semibold text-sidebar-primary-foreground">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<div />}>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// SidebarContent (shared between desktop & mobile)
// ---------------------------------------------------------------------------

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-sidebar-border px-4',
          isCollapsed && 'justify-center px-0'
        )}
      >
        {isCollapsed ? (
          <span className="text-base font-bold text-sidebar-primary">AP</span>
        ) : (
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            Admin<span className="text-sidebar-primary">Panel</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        <nav className={cn('space-y-6', isCollapsed ? 'px-2' : 'px-3')}>
          {navigation.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {section.title}
                </p>
              )}
              {isCollapsed && (
                <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname.startsWith(item.href)}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse toggle (desktop only, hidden on mobile) */}
      {!isCollapsed ? (
        <DesktopCollapseButton />
      ) : (
        <DesktopExpandButton />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapse / expand buttons
// ---------------------------------------------------------------------------

function DesktopCollapseButton() {
  const toggle = useSidebarStore((s) => s.toggle);
  return (
    <div className="hidden border-t border-sidebar-border p-3 md:block">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
        onClick={toggle}
      >
        <ChevronsLeft className="size-4" />
        <span className="text-xs">Collapse</span>
      </Button>
    </div>
  );
}

function DesktopExpandButton() {
  const toggle = useSidebarStore((s) => s.toggle);
  return (
    <div className="hidden border-t border-sidebar-border p-2 md:flex md:justify-center">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={toggle}
            />
          }
        >
          <ChevronsRight className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Expand
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DesktopSidebar
// ---------------------------------------------------------------------------

function DesktopSidebar() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <aside
      className={cn(
        'hidden h-full md:flex md:flex-col md:shrink-0',
        'overflow-hidden border-r border-sidebar-border bg-sidebar',
        'transition-[width] duration-200 ease-in-out',
        isCollapsed ? 'md:w-16' : 'md:w-64'
      )}
    >
      <TooltipProvider>
        <SidebarContent isCollapsed={isCollapsed} />
      </TooltipProvider>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// MobileSidebar
// ---------------------------------------------------------------------------

function MobileSidebar() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  const handleClose = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  return (
    <Sheet open={isMobileOpen} onOpenChange={handleClose}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-64 p-0 md:hidden [&>div]:h-full"
        onClick={(e) => {
          // Close sheet when a nav link is clicked
          if ((e.target as HTMLElement).closest('a')) {
            handleClose();
          }
        }}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Main application navigation
        </SheetDescription>
        <TooltipProvider>
          <SidebarContent isCollapsed={false} />
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Sidebar (combined export)
// ---------------------------------------------------------------------------

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
