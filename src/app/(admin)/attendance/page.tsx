'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ChartCard } from '@/components/shared/chart-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState } from '@/components/shared/loading-state';
import { DataTable } from '@/components/data-table/data-table';
import { BarChart } from '@/components/charts/bar-chart';
import { AttendanceSummaryCards } from '@/features/attendance/components/attendance-summary-cards';
import { attendanceColumns } from '@/features/attendance/components/attendance-columns';
import {
  mockAttendanceRecords,
  mockAttendanceChartData,
} from '@/constants/mock-data';
import type { AttendanceRecord } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';
import { CalendarCheck, Plus, Loader2 } from 'lucide-react';

function formatTodayDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Mark Attendance dialog
// ---------------------------------------------------------------------------

const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'Half-day'] as const;

const defaultAttendanceForm = {
  employee: '',
  date: '',
  status: '',
  checkIn: '',
  checkOut: '',
  notes: '',
};

function MarkAttendanceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(defaultAttendanceForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultAttendanceForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employee.trim() || !form.date || !form.status) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success('Attendance marked successfully');
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Record attendance for an employee. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Employee" required htmlFor="att-employee">
              <Input
                id="att-employee"
                placeholder="e.g. Alice Johnson"
                value={form.employee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employee: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Date" required htmlFor="att-date">
              <DatePicker
                id="att-date"
                value={form.date}
                onChange={(v) =>
                  setForm((f) => ({ ...f, date: v }))
                }
                placeholder="Select date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Status" required htmlFor="att-status">
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, status: v }))
                }
              >
                <SelectTrigger id="att-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ATTENDANCE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Check In" htmlFor="att-check-in">
                <Input
                  id="att-check-in"
                  type="time"
                  value={form.checkIn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, checkIn: e.target.value }))
                  }
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Check Out" htmlFor="att-check-out">
                <Input
                  id="att-check-out"
                  type="time"
                  value={form.checkOut}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, checkOut: e.target.value }))
                  }
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Notes" htmlFor="att-notes">
              <Textarea
                id="att-notes"
                placeholder="Optional notes..."
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
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
                !form.employee.trim() ||
                !form.date ||
                !form.status
              }
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Mark Attendance
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

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markDialogOpen, setMarkDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(mockAttendanceRecords);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const todayRecords = useMemo(
    () => records.filter((r) => r.date === '2024-12-16'),
    [records]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track employee attendance and manage daily check-ins."
      >
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
          <CalendarCheck className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">{formatTodayDate()}</span>
        </div>
        <Button className="gap-1.5" onClick={() => setMarkDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Mark Attendance
        </Button>
      </PageHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Attendance Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <LoadingState message="Loading attendance data..." />
          ) : (
            <>
              <AttendanceSummaryCards records={todayRecords} />

              <ChartCard
                title="Weekly Attendance"
                description="Attendance breakdown for the current week"
              >
                <BarChart
                  data={mockAttendanceChartData}
                  xKey="day"
                  bars={[
                    { key: 'present', name: 'Present', color: '#10b981' },
                    { key: 'absent', name: 'Absent', color: '#ef4444' },
                    { key: 'late', name: 'Late', color: '#f59e0b' },
                  ]}
                  height={300}
                  showLegend
                />
              </ChartCard>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Today&apos;s Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayRecords.map((record) => {
                      const initials = record.employeeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between rounded-lg border px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={`${import.meta.env.BASE_URL}avatars/${record.employeeName
                                  .split(' ')[0]
                                  .toLowerCase()}.jpg`}
                                alt={record.employeeName}
                              />
                              <AvatarFallback className="text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {record.employeeName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {record.checkIn ?? '--:--'} &ndash;{' '}
                                {record.checkOut ?? '--:--'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {record.workHours && (
                              <span className="text-sm text-muted-foreground">
                                {record.workHours.toFixed(1)}h
                              </span>
                            )}
                            <StatusBadge status={record.status} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <DataTable
            columns={attendanceColumns}
            data={records}
            isLoading={isLoading}
            searchKey="employeeName"
            searchPlaceholder="Search by employee name..."
            emptyMessage="No attendance records found."
            pageSize={10}
          />
        </TabsContent>
      </Tabs>

      <MarkAttendanceDialog
        open={markDialogOpen}
        onOpenChange={setMarkDialogOpen}
      />
    </div>
  );
}
