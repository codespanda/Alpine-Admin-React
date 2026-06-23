'use client';

import { useState } from 'react';
import { usePathname } from '@/lib/router';
import { Link } from '@/lib/router';
import { useRouter } from '@/lib/router';
import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  UserPlus,
  CalendarCheck,
  CalendarDays,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { buttonVariants } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Breadcrumb generation from pathname
// ---------------------------------------------------------------------------

function useBreadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, index + 1).join('/'),
      isLast: index === arr.length - 1,
    }));

  return segments;
}

function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm sm:flex">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-muted-foreground/40" aria-hidden="true">
              /
            </span>
          )}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <span className="text-muted-foreground transition-colors hover:text-foreground">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// User menu dropdown
// ---------------------------------------------------------------------------

function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : undefined;

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              'flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          />
        }
      >
        <Avatar size="sm">
          {user?.avatar && <AvatarImage src={user.avatar} alt={fullName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium md:inline-block">
          {fullName ?? 'User'}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        {/* User info header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-3 py-1">
              <Avatar>
                {user?.avatar && <AvatarImage src={user.avatar} alt={fullName} />}
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {fullName ?? 'User'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email ?? ''}
                </span>
                <Badge variant="secondary" className="mt-1 w-fit text-[10px] capitalize">
                  {user?.role ?? 'user'}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Account section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <User className="mr-2 size-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <CreditCard className="mr-2 size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/roles')}>
            <Shield className="mr-2 size-4" />
            Roles & Permissions
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Support section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Support</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/policies')}>
            <HelpCircle className="mr-2 size-4" />
            Help & Documentation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <LifeBuoy className="mr-2 size-4" />
            Contact Support
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Keyboard className="mr-2 size-4" />
            Keyboard Shortcuts
            <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Notification bell
// ---------------------------------------------------------------------------

const notifications = [
  {
    id: '1',
    icon: UserPlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    title: 'New employee added',
    description: 'Jessica Wang joined the Engineering team',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    icon: CalendarDays,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    title: 'Leave request pending',
    description: 'Mike Ross requested 3 days annual leave',
    time: '15 min ago',
    unread: true,
  },
  {
    id: '3',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Payroll processed',
    description: 'June 2026 payroll completed for 75 employees',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: '4',
    icon: CalendarCheck,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950',
    title: 'Attendance anomaly',
    description: '3 employees marked late today',
    time: '2 hours ago',
    unread: false,
  },
  {
    id: '5',
    icon: FileText,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950',
    title: 'Policy updated',
    description: 'Remote Work Policy v2.1 published',
    time: '5 hours ago',
    unread: false,
  },
  {
    id: '6',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-950',
    title: 'Document expiring',
    description: "Tom Wilson's CISSP certification expires in 7 days",
    time: 'Yesterday',
    unread: false,
  },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 gap-0 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] leading-tight">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Mark all read
          </button>
        </div>
        <Separator />

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={cn(
                  'flex gap-3 px-4 py-3 transition-colors hover:bg-accent/50 cursor-pointer',
                  notification.unread && 'bg-accent/30',
                )}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    notification.iconBg,
                  )}
                >
                  <Icon className={cn('size-4', notification.iconColor)} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        'text-sm leading-tight',
                        notification.unread
                          ? 'font-medium'
                          : 'text-muted-foreground',
                      )}
                    >
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {notification.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />
        {/* Footer */}
        <div className="p-2">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'w-full justify-center text-xs',
            )}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header() {
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const toggleMobile = () => setMobileOpen(!isMobileOpen);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6'
      )}
    >
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={toggleMobile}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <div className="ml-1">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
