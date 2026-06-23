'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { departmentColors, defaultDepartmentColor } from '@/constants/department-colors';

interface EmployeeColumnActions {
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getEmployeeColumns(
  actions: EmployeeColumnActions
): ColumnDef<Employee>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'employeeId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-medium text-muted-foreground">
          {row.getValue('employeeId')}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee" />
      ),
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
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
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {employee.firstName} {employee.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {employee.email}
              </span>
            </div>
          </div>
        );
      },
      size: 260,
    },
    {
      accessorKey: 'department',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const department = row.getValue('department') as string;
        const colorClass =
          departmentColors[department] ?? defaultDepartmentColor;
        return (
          <Badge
            className={`border-transparent font-medium ${colorClass}`}
          >
            {department}
          </Badge>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'designation',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Designation" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">
          {row.getValue('designation')}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
      size: 120,
    },
    {
      accessorKey: 'joiningDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joining Date" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.getValue('joiningDate'))}
        </span>
      ),
      size: 140,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open actions menu"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => actions.onView(employee)}
                >
                  <Eye className="size-4 text-muted-foreground" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => actions.onEdit(employee)}
                >
                  <Pencil className="size-4 text-muted-foreground" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => actions.onDelete(employee)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 60,
    },
  ];
}

export { getEmployeeColumns, type EmployeeColumnActions };
