'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Employee } from '@/types';

interface RecentEmployeesProps {
  employees: Employee[];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function RecentEmployees({ employees }: RecentEmployeesProps) {
  return (
    <div className="space-y-0">
      {employees.map((employee, index) => (
        <div
          key={employee.id}
          className={`flex items-center justify-between py-3.5 ${
            index < employees.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar size="default">
              {employee.avatar && (
                <AvatarImage
                  src={employee.avatar}
                  alt={`${employee.firstName} ${employee.lastName}`}
                />
              )}
              <AvatarFallback>
                {getInitials(employee.firstName, employee.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {employee.department}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={employee.status} />
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export { RecentEmployees, type RecentEmployeesProps };
