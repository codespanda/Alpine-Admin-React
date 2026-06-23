'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { StatusBadge } from '@/components/shared/status-badge';
import type { AttendanceRecord } from '@/types';

export const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: 'employeeName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('employeeName')}</span>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('date') as string;
      const date = new Date(dateStr);
      return (
        <span className="text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    accessorKey: 'checkIn',
    header: 'Check In',
    cell: ({ row }) => {
      const checkIn = row.getValue('checkIn') as string | null;
      return (
        <span className={checkIn ? '' : 'text-muted-foreground'}>
          {checkIn ?? '--:--'}
        </span>
      );
    },
  },
  {
    accessorKey: 'checkOut',
    header: 'Check Out',
    cell: ({ row }) => {
      const checkOut = row.getValue('checkOut') as string | null;
      return (
        <span className={checkOut ? '' : 'text-muted-foreground'}>
          {checkOut ?? '--:--'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'workHours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Work Hours" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue('workHours') as number | null;
      return (
        <span className={hours ? 'font-medium' : 'text-muted-foreground'}>
          {hours ? `${hours.toFixed(1)}h` : '--'}
        </span>
      );
    },
  },
];
