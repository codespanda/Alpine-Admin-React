'use client';

import { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
  DollarSign,
  Banknote,
  TrendingUp,
  Receipt,
  Plus,
  Download,
  Eye,
  ShieldCheck,
  Heart,
  Landmark,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { ChartCard } from '@/components/shared/chart-card';
import { BarChart } from '@/components/charts/bar-chart';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';

// --- Mock Data ---

const monthlyPayrollData = [
  { month: 'Jan', amount: 462000 },
  { month: 'Feb', amount: 468000 },
  { month: 'Mar', amount: 471000 },
  { month: 'Apr', amount: 478000 },
  { month: 'May', amount: 480000 },
  { month: 'Jun', amount: 485000 },
];

interface PayrollRun {
  id: string;
  month: string;
  totalAmount: string;
  employeesPaid: number;
  status: string;
  date: string;
}

const recentPayrollRuns: PayrollRun[] = [
  { id: 'pr-1', month: 'June 2026', totalAmount: '$485,000', employeesPaid: 20, status: 'processed', date: 'Jun 15, 2026' },
  { id: 'pr-2', month: 'May 2026', totalAmount: '$480,000', employeesPaid: 20, status: 'processed', date: 'May 15, 2026' },
  { id: 'pr-3', month: 'April 2026', totalAmount: '$478,000', employeesPaid: 19, status: 'processed', date: 'Apr 15, 2026' },
  { id: 'pr-4', month: 'March 2026', totalAmount: '$471,000', employeesPaid: 19, status: 'processed', date: 'Mar 15, 2026' },
  { id: 'pr-5', month: 'February 2026', totalAmount: '$468,000', employeesPaid: 18, status: 'pending', date: 'Feb 15, 2026' },
];

interface SalarySlip {
  id: string;
  employee: string;
  month: string;
  baseSalary: string;
  deductions: string;
  bonuses: string;
  netPay: string;
  status: string;
}

const salarySlips: SalarySlip[] = [
  { id: 'ss-1', employee: 'Alice Johnson', month: 'Jun 2026', baseSalary: '$6,200', deductions: '$1,240', bonuses: '$500', netPay: '$5,460', status: 'processed' },
  { id: 'ss-2', employee: 'Bob Martinez', month: 'Jun 2026', baseSalary: '$7,800', deductions: '$1,560', bonuses: '$0', netPay: '$6,240', status: 'processed' },
  { id: 'ss-3', employee: 'Carol Williams', month: 'Jun 2026', baseSalary: '$5,500', deductions: '$1,100', bonuses: '$250', netPay: '$4,650', status: 'pending' },
  { id: 'ss-4', employee: 'David Chen', month: 'Jun 2026', baseSalary: '$9,200', deductions: '$1,840', bonuses: '$750', netPay: '$8,110', status: 'processed' },
  { id: 'ss-5', employee: 'Emily Davis', month: 'Jun 2026', baseSalary: '$6,800', deductions: '$1,360', bonuses: '$0', netPay: '$5,440', status: 'processed' },
  { id: 'ss-6', employee: 'Frank Wilson', month: 'May 2026', baseSalary: '$7,100', deductions: '$1,420', bonuses: '$300', netPay: '$5,980', status: 'processed' },
  { id: 'ss-7', employee: 'Grace Lee', month: 'May 2026', baseSalary: '$8,400', deductions: '$1,680', bonuses: '$500', netPay: '$7,220', status: 'processed' },
  { id: 'ss-8', employee: 'Henry Brown', month: 'May 2026', baseSalary: '$5,900', deductions: '$1,180', bonuses: '$0', netPay: '$4,720', status: 'processed' },
  { id: 'ss-9', employee: 'Irene Taylor', month: 'May 2026', baseSalary: '$6,500', deductions: '$1,300', bonuses: '$200', netPay: '$5,400', status: 'pending' },
  { id: 'ss-10', employee: 'James Anderson', month: 'May 2026', baseSalary: '$7,600', deductions: '$1,520', bonuses: '$0', netPay: '$6,080', status: 'processed' },
];

interface DeductionCard {
  id: string;
  type: string;
  category: string;
  amount: string;
  description: string;
  icon: typeof DollarSign;
}

const deductions: DeductionCard[] = [
  { id: 'd-1', type: 'Federal Tax', category: 'Tax', amount: '22%', description: 'Federal income tax withheld based on W-4 filing status and allowances.', icon: Landmark },
  { id: 'd-2', type: 'State Tax', category: 'Tax', amount: '5.75%', description: 'State income tax withheld per employee residence state regulations.', icon: Landmark },
  { id: 'd-3', type: 'Health Insurance', category: 'Insurance', amount: '$450/mo', description: 'Employer-sponsored health insurance premium for employee and dependents.', icon: Heart },
  { id: 'd-4', type: 'Dental Insurance', category: 'Insurance', amount: '$85/mo', description: 'Dental coverage including preventive, basic, and major services.', icon: Heart },
  { id: 'd-5', type: 'Vision Insurance', category: 'Insurance', amount: '$35/mo', description: 'Vision plan covering annual exams, lenses, and frames allowance.', icon: Heart },
  { id: 'd-6', type: '401(k) Retirement', category: 'Retirement', amount: '6%', description: 'Pre-tax retirement contribution with 50% employer match up to 6%.', icon: ShieldCheck },
];

// --- Column definitions ---

const payrollRunColumns: ColumnDef<PayrollRun>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Month" />,
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
    cell: ({ row }) => <span className="font-semibold">{row.getValue('totalAmount')}</span>,
  },
  {
    accessorKey: 'employeesPaid',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employees Paid" />,
    cell: ({ row }) => <span>{row.getValue('employeesPaid')}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <StatusBadge
          status={status}
          variantMap={{
            processed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
          }}
        />
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('date')}</span>,
  },
];

const salarySlipColumns: ColumnDef<SalarySlip>[] = [
  {
    accessorKey: 'employee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue('employee')}</span>,
  },
  {
    accessorKey: 'month',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Month" />,
  },
  {
    accessorKey: 'baseSalary',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Base Salary" />,
  },
  {
    accessorKey: 'deductions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deductions" />,
    cell: ({ row }) => <span className="text-red-600 dark:text-red-400">-{row.getValue('deductions')}</span>,
  },
  {
    accessorKey: 'bonuses',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bonuses" />,
    cell: ({ row }) => {
      const bonuses = row.getValue('bonuses') as string;
      return bonuses === '$0' ? (
        <span className="text-muted-foreground">{bonuses}</span>
      ) : (
        <span className="text-emerald-600 dark:text-emerald-400">+{bonuses}</span>
      );
    },
  },
  {
    accessorKey: 'netPay',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Net Pay" />,
    cell: ({ row }) => <span className="font-semibold">{row.getValue('netPay')}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <StatusBadge
          status={status}
          variantMap={{
            processed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
          }}
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const slip = row.original;
      return (
        <div className="flex items-center gap-1">
          <SalarySlipActionButton slip={slip} />
          <Button variant="ghost" size="icon-xs">
            <Download className="size-3.5" />
          </Button>
        </div>
      );
    },
  },
];

// --- Salary Slip Action Button (needs to lift state to page level) ---
// We use a module-level callback pattern to avoid prop drilling through column defs
let openSalarySlipViewer: ((slip: SalarySlip) => void) | null = null;

function SalarySlipActionButton({ slip }: { slip: SalarySlip }) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => openSalarySlipViewer?.(slip)}
    >
      <Eye className="size-3.5" />
    </Button>
  );
}

// --- Skeleton ---

function PayrollSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="h-8 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[350px] rounded-lg" />
      <Skeleton className="h-[300px] rounded-lg" />
    </div>
  );
}

// --- Page ---

export default function PayrollPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [runPayrollOpen, setRunPayrollOpen] = useState(false);
  const [runPayrollMonth, setRunPayrollMonth] = useState('');
  const [runPayrollYear, setRunPayrollYear] = useState('');
  const [runPayrollNotes, setRunPayrollNotes] = useState('');
  const [runPayrollLoading, setRunPayrollLoading] = useState(false);

  const [salarySlipOpen, setSalarySlipOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);

  // Wire up the module-level callback for the column action button
  useEffect(() => {
    openSalarySlipViewer = (slip: SalarySlip) => {
      setSelectedSlip(slip);
      setSalarySlipOpen(true);
    };
    return () => {
      openSalarySlipViewer = null;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRunPayroll = async () => {
    if (!runPayrollMonth || !runPayrollYear) return;
    setRunPayrollLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Payroll processed for ${runPayrollMonth} ${runPayrollYear}`);
    setRunPayrollLoading(false);
    setRunPayrollOpen(false);
    setRunPayrollMonth('');
    setRunPayrollYear('');
    setRunPayrollNotes('');
  };

  if (isLoading) {
    return <PayrollSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Manage employee compensation, deductions, and payroll runs."
      >
        <Button className="gap-1.5" onClick={() => setRunPayrollOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Run Payroll
        </Button>
      </PageHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Pay History</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Payroll"
              value="$485,000"
              icon={DollarSign}
              trend="up"
              change={3.2}
              changeLabel="from last month"
            />
            <StatCard
              title="Avg Salary"
              value="$24,250"
              icon={Banknote}
              trend="up"
              change={1.5}
              changeLabel="from last month"
            />
            <StatCard
              title="Bonuses Paid"
              value="$12,500"
              icon={TrendingUp}
              trend="up"
              change={8}
              changeLabel="from last month"
            />
            <StatCard
              title="Pending Reimbursements"
              value="$3,200"
              icon={Receipt}
              trend="down"
              change={-12}
              changeLabel="from last month"
            />
          </div>

          <ChartCard
            title="Monthly Payroll"
            description="Total payroll disbursement over the last 6 months"
          >
            <BarChart
              data={monthlyPayrollData}
              xKey="month"
              bars={[{ key: 'amount', color: '#6366f1', name: 'Payroll' }]}
              height={300}
              showGrid
              showTooltip
            />
          </ChartCard>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payroll Runs</CardTitle>
              <CardDescription>Latest payroll processing history</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={payrollRunColumns}
                data={recentPayrollRuns}
                showPagination={false}
                showColumnVisibility={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pay History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Slips</CardTitle>
              <CardDescription>Individual employee salary breakdowns</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={salarySlipColumns}
                data={salarySlips}
                searchKey="employee"
                searchPlaceholder="Search by employee..."
                showPagination
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deductions Tab */}
        <TabsContent value="deductions" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deductions.map((deduction) => {
              const Icon = deduction.icon;
              return (
                <Card key={deduction.id} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">{deduction.type}</h3>
                          <span className="text-sm font-bold text-primary">{deduction.amount}</span>
                        </div>
                        <StatusBadge
                          status={deduction.category}
                          variantMap={{
                            tax: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
                            insurance: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                            retirement: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
                          }}
                        />
                        <p className="pt-1 text-xs text-muted-foreground leading-relaxed">
                          {deduction.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Run Payroll Dialog */}
      <Dialog open={runPayrollOpen} onOpenChange={setRunPayrollOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>
              Process payroll for a specific month and year.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Month" required htmlFor="payroll-month">
              <Select
                value={runPayrollMonth}
                onValueChange={(v) => v && setRunPayrollMonth(v)}
              >
                <SelectTrigger id="payroll-month" className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                    (m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Year" required htmlFor="payroll-year">
              <Input
                id="payroll-year"
                type="text"
                placeholder="e.g. 2026"
                value={runPayrollYear}
                onChange={(e) => setRunPayrollYear(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Notes" htmlFor="payroll-notes">
              <Textarea
                id="payroll-notes"
                placeholder="Optional notes for this payroll run..."
                rows={3}
                value={runPayrollNotes}
                onChange={(e) => setRunPayrollNotes(e.target.value)}
              />
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRunPayrollOpen(false)}
              disabled={runPayrollLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunPayroll}
              disabled={runPayrollLoading || !runPayrollMonth || !runPayrollYear.trim()}
            >
              {runPayrollLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Process Payroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Salary Slip Dialog */}
      <Dialog open={salarySlipOpen} onOpenChange={setSalarySlipOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Salary Slip</DialogTitle>
            <DialogDescription>
              {selectedSlip?.employee} &mdash; {selectedSlip?.month}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {selectedSlip && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Employee</span>
                  <span className="text-sm font-semibold">{selectedSlip.employee}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Month</span>
                  <span className="text-sm">{selectedSlip.month}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base Salary</span>
                  <span className="text-sm font-semibold">{selectedSlip.baseSalary}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deductions</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    -{selectedSlip.deductions}
                  </span>
                </div>
                <div className="pl-4 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Federal Tax (22%)</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax (5.75%)</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Insurance</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>401(k) Retirement</span>
                    <span>Included</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bonuses</span>
                  <span className={`text-sm font-semibold ${selectedSlip.bonuses === '$0' ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {selectedSlip.bonuses === '$0' ? selectedSlip.bonuses : `+${selectedSlip.bonuses}`}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                  <span className="text-sm font-semibold">Net Pay</span>
                  <span className="text-base font-bold text-primary">{selectedSlip.netPay}</span>
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSalarySlipOpen(false)}>
              Close
            </Button>
            <Button className="gap-1.5">
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
