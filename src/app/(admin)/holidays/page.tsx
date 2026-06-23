'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Building2,
  MapPin,
  Star,
  Loader2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HolidayType = 'company' | 'regional' | 'optional';

interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: HolidayType;
  observedBy: string;
  status: 'upcoming' | 'past';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const HOLIDAY_TYPE_CONFIG: Record<
  HolidayType,
  { label: string; color: string; dotColor: string; icon: React.ElementType }
> = {
  company: {
    label: 'Company',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    dotColor: 'bg-blue-500',
    icon: Building2,
  },
  regional: {
    label: 'Regional',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
    icon: MapPin,
  },
  optional: {
    label: 'Optional',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    dotColor: 'bg-amber-500',
    icon: Star,
  },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_HOLIDAYS: Holiday[] = [
  {
    id: 'h-1',
    name: "New Year's Day",
    date: '2026-01-01',
    type: 'company',
    observedBy: 'All Employees',
    status: 'past',
  },
  {
    id: 'h-2',
    name: 'Martin Luther King Jr. Day',
    date: '2026-01-19',
    type: 'company',
    observedBy: 'All Employees',
    status: 'past',
  },
  {
    id: 'h-3',
    name: "Presidents' Day",
    date: '2026-02-16',
    type: 'company',
    observedBy: 'All Employees',
    status: 'past',
  },
  {
    id: 'h-4',
    name: 'Holi',
    date: '2026-03-14',
    type: 'regional',
    observedBy: 'India Office',
    status: 'past',
  },
  {
    id: 'h-5',
    name: 'Good Friday',
    date: '2026-04-03',
    type: 'optional',
    observedBy: 'Opt-in',
    status: 'past',
  },
  {
    id: 'h-6',
    name: 'Memorial Day',
    date: '2026-05-25',
    type: 'company',
    observedBy: 'All Employees',
    status: 'past',
  },
  {
    id: 'h-7',
    name: 'Juneteenth',
    date: '2026-06-19',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
  {
    id: 'h-8',
    name: 'Independence Day',
    date: '2026-07-04',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
  {
    id: 'h-9',
    name: 'Raksha Bandhan',
    date: '2026-08-12',
    type: 'regional',
    observedBy: 'India Office',
    status: 'upcoming',
  },
  {
    id: 'h-10',
    name: 'Labor Day',
    date: '2026-09-07',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
  {
    id: 'h-11',
    name: 'Diwali',
    date: '2026-10-09',
    type: 'regional',
    observedBy: 'India Office',
    status: 'upcoming',
  },
  {
    id: 'h-12',
    name: 'Columbus Day',
    date: '2026-10-12',
    type: 'optional',
    observedBy: 'Opt-in',
    status: 'upcoming',
  },
  {
    id: 'h-13',
    name: 'Veterans Day',
    date: '2026-11-11',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
  {
    id: 'h-14',
    name: 'Thanksgiving',
    date: '2026-11-26',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
  {
    id: 'h-15',
    name: 'Christmas',
    date: '2026-12-25',
    type: 'company',
    observedBy: 'All Employees',
    status: 'upcoming',
  },
];

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function CalendarSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const holidayMap = useMemo(() => {
    const map = new Map<number, Holiday[]>();
    MOCK_HOLIDAYS.forEach((h) => {
      const d = new Date(h.date + 'T00:00:00');
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        const existing = map.get(day) || [];
        existing.push(h);
        map.set(day, existing);
      }
    });
    return map;
  }, [currentMonth, currentYear]);

  const today = new Date(2026, 5, 18);
  const isCurrentMonth =
    today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = today.getDate();

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  // Build calendar grid cells
  const cells: Array<{ day: number | null; holidays: Holiday[] }> = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, holidays: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, holidays: holidayMap.get(d) || [] });
  }
  // Fill remaining cells to complete the grid
  const remainingCells = 7 - (cells.length % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      cells.push({ day: null, holidays: [] });
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {!(isCurrentMonth) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                  }}
                >
                  Today
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              const isToday =
                isCurrentMonth && cell.day === todayDate;
              const hasHolidays = cell.holidays.length > 0;
              const isWeekend =
                cell.day !== null &&
                (i % 7 === 0 || i % 7 === 6);

              return (
                <div
                  key={i}
                  className={cn(
                    'relative min-h-[80px] rounded-lg border p-1.5 transition-colors',
                    cell.day === null
                      ? 'border-transparent bg-transparent'
                      : 'border-border/50 bg-background',
                    isToday && 'border-primary/50 bg-primary/5 ring-1 ring-primary/20',
                    isWeekend && cell.day !== null && !isToday && 'bg-muted/30',
                    hasHolidays && !isToday && 'bg-muted/50'
                  )}
                >
                  {cell.day !== null && (
                    <>
                      <span
                        className={cn(
                          'inline-flex size-6 items-center justify-center rounded-full text-xs font-medium',
                          isToday &&
                            'bg-primary text-primary-foreground',
                          isWeekend && !isToday && 'text-muted-foreground'
                        )}
                      >
                        {cell.day}
                      </span>
                      {cell.holidays.map((h) => (
                        <div
                          key={h.id}
                          className="mt-0.5 flex items-center gap-1"
                        >
                          <span
                            className={cn(
                              'size-1.5 shrink-0 rounded-full',
                              HOLIDAY_TYPE_CONFIG[h.type].dotColor
                            )}
                          />
                          <span className="truncate text-[10px] font-medium leading-tight">
                            {h.name}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Legend:
        </span>
        {Object.entries(HOLIDAY_TYPE_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={cn('size-2.5 rounded-full', config.dotColor)}
            />
            <span className="text-xs font-medium">
              {config.label} Holiday
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListView() {
  const upcomingHolidays = MOCK_HOLIDAYS.filter(
    (h) => h.status === 'upcoming'
  );
  const pastHolidays = MOCK_HOLIDAYS.filter(
    (h) => h.status === 'past'
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Day of Week</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Observed By</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Upcoming */}
            {upcomingHolidays.length > 0 && (
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableCell
                  colSpan={6}
                  className="py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Upcoming Holidays ({upcomingHolidays.length})
                </TableCell>
              </TableRow>
            )}
            {upcomingHolidays.map((holiday) => {
              const typeConfig = HOLIDAY_TYPE_CONFIG[holiday.type];
              // Check if the holiday is within the next 7 days
              const holidayDate = new Date(holiday.date + 'T00:00:00');
              const todayDate = new Date(2026, 5, 18);
              const diffDays = Math.ceil(
                (holidayDate.getTime() - todayDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const isSoon = diffDays >= 0 && diffDays <= 7;

              return (
                <TableRow
                  key={holiday.id}
                  className={cn(isSoon && 'bg-primary/5')}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          typeConfig.dotColor
                        )}
                      />
                      <span className="font-medium">{holiday.name}</span>
                      {isSoon && (
                        <Badge variant="secondary" className="text-[10px]">
                          Soon
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(holiday.date)}</TableCell>
                  <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'border-transparent font-medium',
                        typeConfig.color
                      )}
                    >
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {holiday.observedBy}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status="upcoming"
                      variantMap={{
                        upcoming:
                          'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Past */}
            {pastHolidays.length > 0 && (
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableCell
                  colSpan={6}
                  className="py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Past Holidays ({pastHolidays.length})
                </TableCell>
              </TableRow>
            )}
            {pastHolidays.map((holiday) => {
              const typeConfig = HOLIDAY_TYPE_CONFIG[holiday.type];
              return (
                <TableRow key={holiday.id} className="opacity-70">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 rounded-full opacity-50',
                          typeConfig.dotColor
                        )}
                      />
                      <span className="font-medium">{holiday.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(holiday.date)}</TableCell>
                  <TableCell>{getDayOfWeek(holiday.date)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'border-transparent font-medium',
                        typeConfig.color
                      )}
                    >
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {holiday.observedBy}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status="inactive" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Add Holiday dialog
// ---------------------------------------------------------------------------

const HOLIDAY_TYPES = ['Company', 'Regional', 'Optional'] as const;

const defaultHolidayForm = {
  name: '',
  date: '',
  type: '',
  observedBy: '',
  description: '',
};

function AddHolidayDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(defaultHolidayForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultHolidayForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.date || !form.type) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success(`Holiday "${form.name}" added successfully`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
          <DialogDescription>
            Add a new holiday to the company calendar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Holiday Name" required htmlFor="holiday-name">
              <Input
                id="holiday-name"
                placeholder="e.g. Independence Day"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Date" required htmlFor="holiday-date">
              <DatePicker
                id="holiday-date"
                value={form.date}
                onChange={(v) =>
                  setForm((f) => ({ ...f, date: v }))
                }
                placeholder="Select date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Type" required htmlFor="holiday-type">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, type: v }))
                }
              >
                <SelectTrigger id="holiday-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {HOLIDAY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Observed By" htmlFor="holiday-observed">
              <Input
                id="holiday-observed"
                placeholder="e.g. All Employees"
                value={form.observedBy}
                onChange={(e) =>
                  setForm((f) => ({ ...f, observedBy: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="holiday-description">
              <Textarea
                id="holiday-description"
                placeholder="Optional description or notes..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </FormFieldWrapper>
          </DialogBody>


          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !form.name.trim() ||
                !form.date ||
                !form.type
              }
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add Holiday
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HolidaysPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const holidaySummary = useMemo(() => {
    const company = MOCK_HOLIDAYS.filter((h) => h.type === 'company').length;
    const regional = MOCK_HOLIDAYS.filter((h) => h.type === 'regional').length;
    const optional = MOCK_HOLIDAYS.filter((h) => h.type === 'optional').length;
    const upcoming = MOCK_HOLIDAYS.filter((h) => h.status === 'upcoming').length;
    return { company, regional, optional, total: MOCK_HOLIDAYS.length, upcoming };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Holiday Calendar"
        description="Manage company holidays, regional observances, and optional days off."
      >
        <Select value={selectedYear} onValueChange={(v) => v && setSelectedYear(v)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-1.5" onClick={() => setAddDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Add Holiday
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <CalendarDays className="size-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Holidays</p>
                    <p className="text-xl font-bold">{holidaySummary.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <Building2 className="size-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-xl font-bold">{holidaySummary.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <MapPin className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Regional</p>
                    <p className="text-xl font-bold">{holidaySummary.regional}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <Star className="size-4.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Optional</p>
                    <p className="text-xl font-bold">{holidaySummary.optional}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {isLoading ? <CalendarSkeleton /> : <CalendarView />}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? <TableSkeleton /> : <ListView />}
        </TabsContent>
      </Tabs>

      <AddHolidayDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  );
}
