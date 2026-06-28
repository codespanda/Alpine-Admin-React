'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react';
import type { Department } from '@/types';

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  const initials = department.headOfDepartment
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:shadow-md',
        department.status === 'inactive' && 'opacity-75'
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">
                {department.name}
              </h3>
              <StatusBadge status={department.status} />
            </div>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {department.description}
            </p>
          </div>
          <div className="ml-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${department.name}`}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onEdit(department)}>
                    <Pencil className="size-4 text-muted-foreground" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(department)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage
                src={`${import.meta.env.BASE_URL}avatars/${department.headOfDepartment
                  .split(' ')[0]
                  .toLowerCase()}.jpg`}
                alt={department.headOfDepartment}
              />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {department.headOfDepartment}
              </p>
              <p className="text-xs text-muted-foreground">Head of Dept.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5">
            <Users className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium">
              {department.employeeCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { DepartmentCard, type DepartmentCardProps };
