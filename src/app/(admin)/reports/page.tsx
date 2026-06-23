'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  Clock,
  TrendingDown,
  PersonStanding,
  Download,
  FileText,
  DollarSign,
  CalendarCheck,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const headcountTrendData = [
  { month: 'Jul', count: 60 },
  { month: 'Aug', count: 61 },
  { month: 'Sep', count: 63 },
  { month: 'Oct', count: 64 },
  { month: 'Nov', count: 65 },
  { month: 'Dec', count: 66 },
  { month: 'Jan', count: 67 },
  { month: 'Feb', count: 68 },
  { month: 'Mar', count: 70 },
  { month: 'Apr', count: 72 },
  { month: 'May', count: 73 },
  { month: 'Jun', count: 75 },
];

const departmentDistributionData = [
  { name: 'Engineering', value: 30, color: '#6366f1' },
  { name: 'Design', value: 10, color: '#8b5cf6' },
  { name: 'Marketing', value: 8, color: '#ec4899' },
  { name: 'Sales', value: 12, color: '#f59e0b' },
  { name: 'HR', value: 8, color: '#10b981' },
  { name: 'Finance', value: 7, color: '#06b6d4' },
];

const hiringVsAttritionData = [
  { month: 'Jan', hires: 3, attrition: 1 },
  { month: 'Feb', hires: 2, attrition: 0 },
  { month: 'Mar', hires: 4, attrition: 1 },
  { month: 'Apr', hires: 2, attrition: 1 },
  { month: 'May', hires: 3, attrition: 0 },
  { month: 'Jun', hires: 8, attrition: 2 },
];

const costPerHireData = [
  { month: 'Jul', cost: 4200 },
  { month: 'Aug', cost: 3800 },
  { month: 'Sep', cost: 4500 },
  { month: 'Oct', cost: 4100 },
  { month: 'Nov', cost: 3900 },
  { month: 'Dec', cost: 4300 },
  { month: 'Jan', cost: 4000 },
  { month: 'Feb', cost: 3700 },
  { month: 'Mar', cost: 4600 },
  { month: 'Apr', cost: 4400 },
  { month: 'May', cost: 3500 },
  { month: 'Jun', cost: 3800 },
];

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  lastGenerated: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'headcount',
    title: 'Headcount Report',
    description: 'Employee count by department, status, and location',
    icon: Users,
    lastGenerated: 'Jun 15, 2026',
  },
  {
    id: 'payroll',
    title: 'Payroll Summary',
    description: 'Monthly payroll breakdown, deductions, and net pay',
    icon: DollarSign,
    lastGenerated: 'Jun 15, 2026',
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Attendance rates, late arrivals, and absences',
    icon: CalendarCheck,
    lastGenerated: 'Jun 15, 2026',
  },
  {
    id: 'leave',
    title: 'Leave Balance Report',
    description: 'Leave utilization by type and department',
    icon: CalendarDays,
    lastGenerated: 'Jun 15, 2026',
  },
  {
    id: 'turnover',
    title: 'Turnover Report',
    description: 'Attrition analysis, exit reasons, and trends',
    icon: BarChart3,
    lastGenerated: 'Jun 15, 2026',
  },
  {
    id: 'diversity',
    title: 'Diversity Report',
    description: 'Gender, age, and ethnicity distribution',
    icon: ShieldCheck,
    lastGenerated: 'Jun 15, 2026',
  },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Month');
  const [generateReportOpen, setGenerateReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDateRange, setReportDateRange] = useState('');
  const [reportFormat, setReportFormat] = useState('');
  const [reportIncludeCharts, setReportIncludeCharts] = useState(true);

  function resetReportForm() {
    setReportType('');
    setReportDateRange('');
    setReportFormat('');
    setReportIncludeCharts(true);
  }

  function openGenerateReport(title: string) {
    resetReportForm();
    setReportType(title);
    setGenerateReportOpen(true);
  }

  async function handleGenerateReport() {
    setReportSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Report generated successfully');
    setReportSubmitting(false);
    setGenerateReportOpen(false);
    resetReportForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Reports & Analytics">
        <Select value={dateRange} onValueChange={(v) => v && setDateRange(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="This Quarter">This Quarter</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-1.5">
          <Download className="size-4" />
          Export All
        </Button>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Employees"
          value={75}
          icon={Users}
          trend="up"
          change={12}
          changeLabel="from last month"
        />
        <StatCard
          title="New Hires"
          value={8}
          icon={UserPlus}
          trend="up"
          change={15}
          changeLabel="vs last period"
        />
        <StatCard
          title="Terminations"
          value={2}
          icon={UserMinus}
          trend="down"
          change={25}
          changeLabel="vs last period"
        />
        <StatCard
          title="Avg Tenure"
          value="2.5 yrs"
          icon={Clock}
          trend="up"
          change={8}
          changeLabel="vs last period"
        />
        <StatCard
          title="Attrition Rate"
          value="3.2%"
          icon={TrendingDown}
          trend="down"
          change={10}
          changeLabel="vs last period"
        />
        <StatCard
          title="Gender Ratio"
          value="58/42"
          icon={PersonStanding}
          trend="neutral"
          changeLabel="Male / Female"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Headcount Trend"
          description="Employee count over the past 12 months"
        >
          <LineChart
            data={headcountTrendData}
            xKey="month"
            lines={[{ key: 'count', name: 'Employees', color: '#6366f1' }]}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title="Department Distribution"
          description="Employees by department"
        >
          <PieChart
            data={departmentDistributionData}
            height={300}
            innerRadius={55}
            outerRadius={90}
            showLabel
            showLegend
          />
        </ChartCard>

        <ChartCard
          title="Monthly Hiring vs Attrition"
          description="Hires and attrition over the past 6 months"
        >
          <BarChart
            data={hiringVsAttritionData}
            xKey="month"
            bars={[
              { key: 'hires', name: 'Hires', color: '#10b981' },
              { key: 'attrition', name: 'Attrition', color: '#ef4444' },
            ]}
            height={300}
            showLegend
          />
        </ChartCard>

        <ChartCard
          title="Cost per Hire"
          description="Average cost per hire over 12 months"
        >
          <AreaChart
            data={costPerHireData}
            xKey="month"
            areas={[{ key: 'cost', name: 'Cost ($)', color: '#8b5cf6' }]}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Report Templates */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Report Templates</h2>
          <p className="text-sm text-muted-foreground">
            Generate and download pre-built reports
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Last generated: {report.lastGenerated}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => openGenerateReport(report.title)}
                  >
                    <FileText className="size-3.5" />
                    Generate
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={generateReportOpen} onOpenChange={setGenerateReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Configure and generate your report.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Report Type">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-primary/10 text-primary font-medium">
                  {reportType}
                </Badge>
              </div>
            </FormFieldWrapper>
            <FormFieldWrapper label="Date Range" required>
              <Select value={reportDateRange} onValueChange={(v) => v && setReportDateRange(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="Last Month">Last Month</SelectItem>
                  <SelectItem value="This Quarter">This Quarter</SelectItem>
                  <SelectItem value="Last Quarter">Last Quarter</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Format" required>
              <Select value={reportFormat} onValueChange={(v) => v && setReportFormat(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={reportIncludeCharts}
                onCheckedChange={setReportIncludeCharts}
              />
              <Label>Include Charts</Label>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGenerateReportOpen(false)}
              disabled={reportSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={reportSubmitting || !reportDateRange || !reportFormat}
            >
              {reportSubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
