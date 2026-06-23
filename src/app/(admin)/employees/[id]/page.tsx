'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from '@/lib/router';
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  CalendarDays,
  DollarSign,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  CalendarCheck,
  CalendarMinus,
  CalendarClock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  LogIn,
  LogOut,
  Award,
  MessageSquare,
} from 'lucide-react';
import type { Employee } from '@/types';
import { mockEmployees, mockAttendanceRecords, mockLeaveRequests, mockLeaveBalances } from '@/constants/mock-data';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// -- Mock activity data ---------------------------------------------------

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
}

function getMockActivities(employee: Employee): ActivityItem[] {
  return [
    {
      id: 'act-1',
      icon: LogIn,
      iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
      title: 'Checked in',
      description: 'Arrived at office at 8:55 AM',
      timestamp: '2024-12-16T08:55:00Z',
    },
    {
      id: 'act-2',
      icon: FileText,
      iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50',
      title: 'Submitted timesheet',
      description: 'Weekly timesheet for Dec 9 - Dec 13 submitted',
      timestamp: '2024-12-13T17:00:00Z',
    },
    {
      id: 'act-3',
      icon: Award,
      iconColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50',
      title: 'Performance review completed',
      description: 'Q4 performance review rated as "Exceeds Expectations"',
      timestamp: '2024-12-10T14:30:00Z',
    },
    {
      id: 'act-4',
      icon: CalendarMinus,
      iconColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50',
      title: 'Leave request submitted',
      description: 'Requested 3 days of annual leave for Dec 23-25',
      timestamp: '2024-12-08T09:00:00Z',
    },
    {
      id: 'act-5',
      icon: MessageSquare,
      iconColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50',
      title: 'Added to project',
      description: `Added to "Platform Migration" project as ${employee.designation}`,
      timestamp: '2024-12-05T11:15:00Z',
    },
    {
      id: 'act-6',
      icon: LogOut,
      iconColor: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50',
      title: 'Checked out',
      description: 'Left office at 5:30 PM',
      timestamp: '2024-12-04T17:30:00Z',
    },
  ];
}

// -- Info row helper ------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

// -- Stat card helper -----------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-0">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            accent
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-lg font-bold tracking-tight">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================================
// Main component
// =========================================================================

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockEmployees.find((emp) => emp.id === params.id) ?? null;
      setEmployee(found);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return <LoadingState message="Loading employee details..." />;
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <PageHeader title="Employee Not Found">
          <Button
            variant="outline"
            onClick={() => router.push('/employees')}
          >
            <ArrowLeft className="size-4" />
            Back to Employees
          </Button>
        </PageHeader>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UserX className="size-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-base font-semibold">
              Employee not found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The employee you are looking for does not exist or has been
              removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attendanceRecords = mockAttendanceRecords.filter(
    (r) => r.employeeId === employee.id
  );
  const leaveRequests = mockLeaveRequests.filter(
    (r) => r.employeeId === employee.id
  );
  const activities = getMockActivities(employee);

  // Compute attendance summary from records
  const presentDays = attendanceRecords.filter(
    (r) => r.status === 'present'
  ).length;
  const absentDays = attendanceRecords.filter(
    (r) => r.status === 'absent'
  ).length;
  const lateDays = attendanceRecords.filter(
    (r) => r.status === 'late'
  ).length;
  const totalRecords = attendanceRecords.length || 1;
  const attendanceRate = Math.round((presentDays / totalRecords) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/employees')}
            aria-label="Back to employees"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Avatar size="lg">
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
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {employee.firstName} {employee.lastName}
              </h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {employee.designation} &middot; {employee.department}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/employees/${employee.id}/edit`)}
        >
          <Pencil className="size-4" />
          Edit Employee
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* ------ Overview Tab ------ */}
        <TabsContent value="overview">
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={
                    <a
                      href={`mailto:${employee.email}`}
                      className="text-primary hover:underline"
                    >
                      {employee.email}
                    </a>
                  }
                />
                <InfoRow icon={Phone} label="Phone" value={employee.phone} />
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={Briefcase}
                  label="Employee ID"
                  value={employee.employeeId}
                />
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={employee.department}
                />
                <InfoRow
                  icon={UserCheck}
                  label="Designation"
                  value={employee.designation}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Joining Date"
                  value={formatDate(employee.joiningDate)}
                />
                <InfoRow
                  icon={DollarSign}
                  label="Salary"
                  value={formatCurrency(employee.salary)}
                />
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow
                  icon={MapPin}
                  label="Residential Address"
                  value={
                    <span>
                      {employee.address.street}
                      <br />
                      {employee.address.city}, {employee.address.state}{' '}
                      {employee.address.zipCode}
                      <br />
                      {employee.address.country}
                    </span>
                  }
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={ShieldAlert}
                  label="Contact Name"
                  value={employee.emergencyContact.name}
                />
                <InfoRow
                  icon={UserCheck}
                  label="Relationship"
                  value={employee.emergencyContact.relationship}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={employee.emergencyContact.phone}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------ Attendance Tab ------ */}
        <TabsContent value="attendance">
          <div className="mt-4 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={CheckCircle2}
                label="Present Days"
                value={presentDays}
                accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              />
              <StatCard
                icon={XCircle}
                label="Absent Days"
                value={absentDays}
                accent="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
              />
              <StatCard
                icon={Clock}
                label="Late Days"
                value={lateDays}
                accent="bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400"
              />
              <StatCard
                icon={TrendingUp}
                label="Attendance Rate"
                value={`${attendanceRate}%`}
                accent="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>
                  Last {attendanceRecords.length} attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No attendance records found.
                  </p>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">
                            Hours
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.slice(0, 10).map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="text-sm">
                              {formatDate(record.date)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.checkIn ?? '--'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {record.checkOut ?? '--'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={record.status} />
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {record.workHours != null
                                ? `${record.workHours}h`
                                : '--'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------ Leaves Tab ------ */}
        <TabsContent value="leaves">
          <div className="mt-4 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockLeaveBalances
                .filter((b) => b.total > 0)
                .map((balance) => (
                  <Card key={balance.type}>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs capitalize text-muted-foreground">
                            {balance.type.replace(/-/g, ' ')} Leave
                          </p>
                          <p className="mt-0.5 text-2xl font-bold tracking-tight">
                            {balance.remaining}
                            <span className="text-sm font-normal text-muted-foreground">
                              {' '}
                              / {balance.total}
                            </span>
                          </p>
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <CalendarCheck
                            className="size-5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${
                              balance.total > 0
                                ? (balance.used / balance.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {balance.used} used
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {leaveRequests.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No leave requests found.
                  </p>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="capitalize"
                              >
                                {request.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(request.startDate)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(request.endDate)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {request.days}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={request.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ------ Activity Tab ------ */}
        <TabsContent value="activity">
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Timeline of recent employee activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {/* Connector line */}
                      {index < activities.length - 1 && (
                        <div className="absolute left-[18px] top-10 h-[calc(100%-24px)] w-px bg-border" />
                      )}
                      {/* Icon */}
                      <div
                        className={cn(
                          'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full',
                          activity.iconColor
                        )}
                      >
                        <activity.icon className="size-4" aria-hidden="true" />
                      </div>
                      {/* Content */}
                      <div className="flex flex-1 flex-col pt-0.5">
                        <span className="text-sm font-medium">
                          {activity.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {activity.description}
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground/70">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
