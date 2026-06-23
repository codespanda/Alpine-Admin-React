'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/shared/search-input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  showColumnVisibility?: boolean;
  showRowCount?: boolean;
}

function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Search...',
  children,
  showColumnVisibility = true,
  showRowCount = false,
}: DataTableToolbarProps<TData>) {
  const searchValue = searchKey
    ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
    : '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <SearchInput
            value={searchValue}
            onChange={(value) =>
              table.getColumn(searchKey)?.setFilterValue(value)
            }
            placeholder={searchPlaceholder}
            className="w-full sm:max-w-[250px]"
          />
        )}
        {children}
      </div>
      <div className="flex items-center gap-2">
        {showRowCount && (
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} result(s)
          </p>
        )}
        {showColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  <Settings2 className="size-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export { DataTableToolbar, type DataTableToolbarProps };
