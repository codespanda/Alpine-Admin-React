'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  UserPlus,
  CalendarCheck,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { ChartCard } from '@/components/shared/chart-card';
import { LineChart } from '@/components/charts/line-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { AreaChart } from '@/components/charts/area-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  DashboardSkeleton,
  RecentEmployees,
  RecentLeaves,
} from '@/features/dashboard';

import {
  mockDashboardStats,
  mockEmployeeGrowthData,
  mockDepartmentDistribution,
  mockAttendanceChartData,
  mockHiringTrendData,
  mockEmployees,
  mockLeaveRequests,
} from '@/constants/mock-data';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = mockDashboardStats;
  const recentEmployees = mockEmployees.slice(-5).reverse();
  const recentLeaveRequests = mockLeaveRequests.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin. Here's what's happening."
      />

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          trend="up"
          change={12}
          changeLabel="from last month"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={UserCheck}
          trend="up"
          change={8}
          changeLabel="from last month"
        />
        <StatCard
          title="Departments"
          value={stats.departments}
          icon={Building2}
          trend="neutral"
        />
        <StatCard
          title="New Hires"
          value={stats.newHires}
          icon={UserPlus}
          trend="up"
          change={15}
          changeLabel="from last month"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={CalendarCheck}
          trend="down"
          change={-2}
          changeLabel="from last month"
        />
        <StatCard
          title="Payroll Status"
          value={stats.payrollStatus}
          icon={DollarSign}
          trend="neutral"
        />
      </div>

      {/* Row 2: Employee Growth + Department Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Employee Growth"
          description="Headcount trend over the last 12 months"
        >
          <LineChart
            data={mockEmployeeGrowthData}
            xKey="month"
            lines={[
              { key: 'employees', color: '#6366f1', name: 'Employees' },
            ]}
            height={300}
            showGrid
            showTooltip
          />
        </ChartCard>

        <ChartCard
          title="Department Distribution"
          description="Employee distribution by department"
        >
          <PieChart
            data={mockDepartmentDistribution}
            height={300}
            innerRadius={60}
            outerRadius={90}
            showLabel
            showTooltip
            showLegend
          />
        </ChartCard>
      </div>

      {/* Row 3: Attendance Overview + Hiring Trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Attendance Overview"
          description="Weekly attendance breakdown"
        >
          <BarChart
            data={mockAttendanceChartData}
            xKey="day"
            bars={[
              { key: 'present', color: '#10b981', name: 'Present' },
              { key: 'absent', color: '#ef4444', name: 'Absent' },
              { key: 'late', color: '#f59e0b', name: 'Late' },
            ]}
            height={300}
            showGrid
            showTooltip
            showLegend
          />
        </ChartCard>

        <ChartCard
          title="Hiring Trend"
          description="Hires vs departures over the last 12 months"
        >
          <AreaChart
            data={mockHiringTrendData}
            xKey="month"
            areas={[
              { key: 'hires', color: '#6366f1', name: 'Hires' },
              { key: 'departures', color: '#ec4899', name: 'Departures' },
            ]}
            height={300}
            showGrid
            showTooltip
            showLegend
          />
        </ChartCard>
      </div>

      {/* Row 4: Recent Employees + Recent Leave Requests */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Employees</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 size-4" data-icon="inline-end" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentEmployees employees={recentEmployees} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leave Requests</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 size-4" data-icon="inline-end" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentLeaves requests={recentLeaveRequests} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
