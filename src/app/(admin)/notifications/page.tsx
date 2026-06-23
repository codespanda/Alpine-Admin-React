'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Trophy,
  Megaphone,
  DollarSign,
  Shield,
  Bell,
  Check,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  date: string;
  unread: boolean;
  category: 'employee' | 'leave' | 'payroll' | 'attendance' | 'policy' | 'system';
}

const allNotifications: Notification[] = [
  {
    id: '1',
    icon: UserPlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    title: 'New employee added',
    description: 'Jessica Wang joined the Engineering team as a Senior Frontend Developer. Onboarding has been initiated.',
    time: '2 min ago',
    date: 'Today',
    unread: true,
    category: 'employee',
  },
  {
    id: '2',
    icon: CalendarDays,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    title: 'Leave request pending approval',
    description: 'Mike Ross has requested 3 days of annual leave from Jun 25 to Jun 27, 2026. Requires your approval.',
    time: '15 min ago',
    date: 'Today',
    unread: true,
    category: 'leave',
  },
  {
    id: '3',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Payroll processed successfully',
    description: 'June 2026 payroll has been completed for 75 employees. Total disbursement: $485,000.',
    time: '1 hour ago',
    date: 'Today',
    unread: true,
    category: 'payroll',
  },
  {
    id: '4',
    icon: CalendarCheck,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950',
    title: 'Attendance anomaly detected',
    description: '3 employees were marked late today. Check attendance dashboard for details.',
    time: '2 hours ago',
    date: 'Today',
    unread: false,
    category: 'attendance',
  },
  {
    id: '5',
    icon: FileText,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950',
    title: 'Policy updated',
    description: 'Remote Work Policy has been updated to version 2.1. All employees need to acknowledge the new terms.',
    time: '5 hours ago',
    date: 'Today',
    unread: false,
    category: 'policy',
  },
  {
    id: '6',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-950',
    title: 'Document expiring soon',
    description: "Tom Wilson's CISSP certification expires in 7 days. Please remind them to renew.",
    time: 'Yesterday',
    date: 'Yesterday',
    unread: false,
    category: 'system',
  },
  {
    id: '7',
    icon: Trophy,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-50 dark:bg-yellow-950',
    title: 'Employee of the Month selected',
    description: 'Sarah Chen has been nominated as Employee of the Month for June 2026.',
    time: 'Yesterday',
    date: 'Yesterday',
    unread: false,
    category: 'employee',
  },
  {
    id: '8',
    icon: Megaphone,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950',
    title: 'New announcement posted',
    description: 'Q3 Company All-Hands Meeting has been scheduled for July 15, 2026 at 2:00 PM.',
    time: 'Yesterday',
    date: 'Yesterday',
    unread: false,
    category: 'system',
  },
  {
    id: '9',
    icon: CalendarDays,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    title: 'Leave request approved',
    description: "Lisa Park's sick leave for Jun 16-17 has been approved by the HR manager.",
    time: '2 days ago',
    date: 'Jun 16, 2026',
    unread: false,
    category: 'leave',
  },
  {
    id: '10',
    icon: DollarSign,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Reimbursement approved',
    description: 'Your travel expense reimbursement of $1,250 has been approved and will be processed in the next payroll.',
    time: '2 days ago',
    date: 'Jun 16, 2026',
    unread: false,
    category: 'payroll',
  },
  {
    id: '11',
    icon: Shield,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-950',
    title: 'Security audit completed',
    description: 'Quarterly security audit has been completed. 2 medium-risk issues found. Review the report for details.',
    time: '3 days ago',
    date: 'Jun 15, 2026',
    unread: false,
    category: 'system',
  },
  {
    id: '12',
    icon: UserPlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    title: 'Onboarding completed',
    description: 'David Kim has completed all onboarding tasks and is now fully set up in the system.',
    time: '3 days ago',
    date: 'Jun 15, 2026',
    unread: false,
    category: 'employee',
  },
  {
    id: '13',
    icon: CalendarCheck,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950',
    title: 'Weekly attendance report',
    description: 'Week of Jun 9-13: 96.5% attendance rate. 2 unexcused absences detected.',
    time: '4 days ago',
    date: 'Jun 14, 2026',
    unread: false,
    category: 'attendance',
  },
  {
    id: '14',
    icon: FileText,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950',
    title: 'New policy acknowledgment required',
    description: 'Data Security Policy v3.0 requires your acknowledgment by Jun 30, 2026.',
    time: '5 days ago',
    date: 'Jun 13, 2026',
    unread: false,
    category: 'policy',
  },
  {
    id: '15',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-950',
    title: 'System maintenance scheduled',
    description: 'Planned maintenance window on Jun 22, 2026 from 2:00 AM to 6:00 AM. Some services may be unavailable.',
    time: '1 week ago',
    date: 'Jun 11, 2026',
    unread: false,
    category: 'system',
  },
];

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = notification.icon;

  return (
    <div
      className={cn(
        'group flex gap-4 rounded-lg p-4 transition-colors',
        notification.unread ? 'bg-accent/40' : 'hover:bg-accent/30',
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          notification.iconBg,
        )}
      >
        <Icon className={cn('size-5', notification.iconColor)} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-tight',
              notification.unread ? 'font-semibold' : 'font-medium',
            )}
          >
            {notification.title}
            {notification.unread && (
              <span className="ml-2 inline-block size-1.5 rounded-full bg-primary align-middle" />
            )}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {notification.time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.description}
        </p>
        <div className="flex items-center gap-2 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
          {notification.unread && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onMarkRead(notification.id)}
            >
              <Check className="mr-1 size-3" />
              Mark read
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="mr-1 size-3" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(allNotifications);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = items.filter((n) => n.unread).length;

  const handleMarkRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
    toast.success('Notification marked as read');
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    setItems([]);
    toast.success('All notifications cleared');
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return items;
    if (category === 'unread') return items.filter((n) => n.unread);
    return items.filter((n) => n.category === category);
  };

  const groupByDate = (list: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    for (const item of list) {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    }
    return groups;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Notifications" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border p-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="mr-1.5 size-3.5" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll} disabled={items.length === 0}>
            <Trash2 className="mr-1.5 size-3.5" />
            Clear all
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-1.5 text-[10px] leading-tight">
              {items.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-[10px] leading-tight">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {['all', 'unread', 'employee', 'leave', 'payroll', 'attendance', 'policy', 'system'].map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              {filterByCategory(tab).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <Bell className="size-6 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium">No notifications</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tab === 'unread'
                        ? "You're all caught up!"
                        : 'No notifications in this category.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {tab === 'all'
                        ? 'All Notifications'
                        : tab === 'unread'
                          ? 'Unread Notifications'
                          : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Notifications`}
                    </CardTitle>
                    <CardDescription>
                      {filterByCategory(tab).length} notification
                      {filterByCategory(tab).length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 p-2">
                    {Object.entries(groupByDate(filterByCategory(tab))).map(
                      ([date, group], idx) => (
                        <div key={date}>
                          {idx > 0 && <Separator className="my-2" />}
                          <p className="px-4 py-2 text-xs font-medium text-muted-foreground">
                            {date}
                          </p>
                          {group.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              onMarkRead={handleMarkRead}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      ),
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  );
}
