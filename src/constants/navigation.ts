import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  Settings,
  HelpCircle,
  UserPlus,
  FileText,
} from 'lucide-react';

export interface NavItemConfig {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
  roles?: string[];
  children?: NavItemConfig[];
}

export interface NavSection {
  label: string;
  items: NavItemConfig[];
}

export const navConfig: NavSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Employees',
        href: '/employees',
        icon: Users,
        children: [
          {
            title: 'All Employees',
            href: '/employees',
            icon: Users,
          },
          {
            title: 'Add Employee',
            href: '/employees/new',
            icon: UserPlus,
          },
        ],
      },
      {
        title: 'Departments',
        href: '/departments',
        icon: Building2,
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Attendance',
        href: '/attendance',
        icon: CalendarCheck,
      },
      {
        title: 'Leave Management',
        href: '/leaves',
        icon: CalendarDays,
        badge: '3',
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        title: 'Reports',
        href: '/reports',
        icon: FileText,
        disabled: true,
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
      {
        title: 'Help & Support',
        href: '/help',
        icon: HelpCircle,
      },
    ],
  },
];
