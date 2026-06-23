'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';
import {
  Plus,
  Briefcase,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronUp,
  ArrowUpRight,
  Star,
  Award,
  Trophy,
  Crown,
  Gem,
  Rocket,
  Loader2,
} from 'lucide-react';
import { departmentColors, defaultDepartmentColor } from '@/constants/department-colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Designation {
  id: string;
  title: string;
  department: string;
  gradeLevel: number;
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  status: 'active' | 'inactive';
}

interface GradeLevel {
  level: number;
  label: string;
  sublabel: string;
  titles: string[];
  salaryRange: [number, number];
  experience: string;
  requirements: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockDesignations: Designation[] = [
  {
    id: 'des-1',
    title: 'Junior Developer',
    department: 'Engineering',
    gradeLevel: 1,
    employeeCount: 8,
    minSalary: 50000,
    maxSalary: 70000,
    status: 'active',
  },
  {
    id: 'des-2',
    title: 'Senior Developer',
    department: 'Engineering',
    gradeLevel: 3,
    employeeCount: 12,
    minSalary: 90000,
    maxSalary: 130000,
    status: 'active',
  },
  {
    id: 'des-3',
    title: 'Lead Developer',
    department: 'Engineering',
    gradeLevel: 4,
    employeeCount: 4,
    minSalary: 130000,
    maxSalary: 170000,
    status: 'active',
  },
  {
    id: 'des-4',
    title: 'Staff Engineer',
    department: 'Engineering',
    gradeLevel: 4,
    employeeCount: 2,
    minSalary: 150000,
    maxSalary: 200000,
    status: 'active',
  },
  {
    id: 'des-5',
    title: 'Engineering Manager',
    department: 'Engineering',
    gradeLevel: 5,
    employeeCount: 3,
    minSalary: 160000,
    maxSalary: 220000,
    status: 'active',
  },
  {
    id: 'des-6',
    title: 'UI Designer',
    department: 'Design',
    gradeLevel: 2,
    employeeCount: 5,
    minSalary: 60000,
    maxSalary: 85000,
    status: 'active',
  },
  {
    id: 'des-7',
    title: 'Senior Designer',
    department: 'Design',
    gradeLevel: 3,
    employeeCount: 3,
    minSalary: 85000,
    maxSalary: 120000,
    status: 'active',
  },
  {
    id: 'des-8',
    title: 'Design Lead',
    department: 'Design',
    gradeLevel: 4,
    employeeCount: 1,
    minSalary: 120000,
    maxSalary: 160000,
    status: 'active',
  },
  {
    id: 'des-9',
    title: 'Marketing Associate',
    department: 'Marketing',
    gradeLevel: 1,
    employeeCount: 6,
    minSalary: 45000,
    maxSalary: 65000,
    status: 'active',
  },
  {
    id: 'des-10',
    title: 'Marketing Manager',
    department: 'Marketing',
    gradeLevel: 5,
    employeeCount: 2,
    minSalary: 100000,
    maxSalary: 145000,
    status: 'active',
  },
  {
    id: 'des-11',
    title: 'Sales Executive',
    department: 'Sales',
    gradeLevel: 2,
    employeeCount: 10,
    minSalary: 55000,
    maxSalary: 80000,
    status: 'active',
  },
  {
    id: 'des-12',
    title: 'Sales Manager',
    department: 'Sales',
    gradeLevel: 5,
    employeeCount: 2,
    minSalary: 95000,
    maxSalary: 140000,
    status: 'active',
  },
  {
    id: 'des-13',
    title: 'HR Associate',
    department: 'HR',
    gradeLevel: 1,
    employeeCount: 3,
    minSalary: 45000,
    maxSalary: 62000,
    status: 'active',
  },
  {
    id: 'des-14',
    title: 'HR Manager',
    department: 'HR',
    gradeLevel: 5,
    employeeCount: 2,
    minSalary: 90000,
    maxSalary: 135000,
    status: 'active',
  },
  {
    id: 'des-15',
    title: 'Finance Analyst',
    department: 'Finance',
    gradeLevel: 2,
    employeeCount: 4,
    minSalary: 60000,
    maxSalary: 90000,
    status: 'active',
  },
];

const gradeLevels: GradeLevel[] = [
  {
    level: 1,
    label: 'Associate / Junior',
    sublabel: 'Entry Level',
    titles: ['Junior Developer', 'Marketing Associate', 'HR Associate'],
    salaryRange: [45000, 70000],
    experience: '0 - 2 years',
    requirements:
      'Bachelor\'s degree or equivalent. Eager to learn with foundational skills. Works under direct supervision.',
    icon: <Rocket className="size-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    level: 2,
    label: 'Mid-Level',
    sublabel: 'Individual Contributor',
    titles: ['UI Designer', 'Sales Executive', 'Finance Analyst'],
    salaryRange: [55000, 90000],
    experience: '2 - 4 years',
    requirements:
      'Proven track record in their domain. Works independently on standard tasks. Contributes to team goals effectively.',
    icon: <Star className="size-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  {
    level: 3,
    label: 'Senior',
    sublabel: 'Subject Matter Expert',
    titles: ['Senior Developer', 'Senior Designer'],
    salaryRange: [85000, 130000],
    experience: '4 - 7 years',
    requirements:
      'Deep expertise in their field. Mentors junior team members. Drives technical or design decisions within their area.',
    icon: <Award className="size-5" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/50',
  },
  {
    level: 4,
    label: 'Lead / Staff',
    sublabel: 'Technical Leadership',
    titles: ['Lead Developer', 'Staff Engineer', 'Design Lead'],
    salaryRange: [120000, 200000],
    experience: '7 - 10 years',
    requirements:
      'Sets technical direction and architecture. Leads cross-team initiatives. Recognized as a domain authority.',
    icon: <Trophy className="size-5" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    level: 5,
    label: 'Manager / Director',
    sublabel: 'People & Strategy Leadership',
    titles: [
      'Engineering Manager',
      'Marketing Manager',
      'Sales Manager',
      'HR Manager',
    ],
    salaryRange: [90000, 220000],
    experience: '8 - 12 years',
    requirements:
      'Manages teams and budgets. Defines department strategy. Partners with leadership on organizational goals.',
    icon: <Crown className="size-5" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
  },
  {
    level: 6,
    label: 'VP / Executive',
    sublabel: 'Executive Leadership',
    titles: ['VP of Engineering', 'VP of Marketing', 'VP of Operations'],
    salaryRange: [180000, 350000],
    experience: '12+ years',
    requirements:
      'Owns major business functions. Drives company-wide strategy and culture. Reports to C-suite or Board.',
    icon: <Gem className="size-5" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getGradeLabel(level: number): string {
  const grade = gradeLevels.find((g) => g.level === level);
  return grade ? `L${level}` : `L${level}`;
}

const gradeBadgeColors: Record<number, string> = {
  1: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  2: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  3: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  4: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  5: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  6: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

// ---------------------------------------------------------------------------
// Skeleton loaders
// ---------------------------------------------------------------------------

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-10 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-14 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-16" />
      </TableCell>
    </TableRow>
  );
}

function GradeSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="size-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Designations table
// ---------------------------------------------------------------------------

function DesignationsTable({
  designations,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: {
  designations: Designation[];
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (designation: Designation) => void;
  onDelete: (designation: Designation) => void;
}) {
  const [sortField, setSortField] = useState<keyof Designation>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = designations;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      let cmp = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        cmp = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [designations, search, sortField, sortDir]);

  function toggleSort(field: keyof Designation) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function SortableHeader({
    field,
    children,
    className,
  }: {
    field: keyof Designation;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <TableHead className={className}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
        >
          {children}
          {sortField === field && (
            <span className="text-xs">
              {sortDir === 'asc' ? '\u2191' : '\u2193'}
            </span>
          )}
        </button>
      </TableHead>
    );
  }

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by title or department..."
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No designations found"
          description="No designations match your search criteria."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="title">Title</SortableHeader>
                  <SortableHeader field="department">Department</SortableHeader>
                  <SortableHeader field="gradeLevel">Grade</SortableHeader>
                  <SortableHeader field="employeeCount">
                    Employees
                  </SortableHeader>
                  <SortableHeader field="minSalary">Min Salary</SortableHeader>
                  <SortableHeader field="maxSalary">Max Salary</SortableHeader>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((des) => (
                  <TableRow key={des.id}>
                    <TableCell className="font-medium">{des.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'border-transparent text-[10px]',
                          departmentColors[des.department] ?? defaultDepartmentColor
                        )}
                      >
                        {des.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'border-transparent text-[10px]',
                          gradeBadgeColors[des.gradeLevel] ?? ''
                        )}
                      >
                        {getGradeLabel(des.gradeLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {des.employeeCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatSalary(des.minSalary)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatSalary(des.maxSalary)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={des.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${des.title}`}
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => onEdit(des)}>
                              <Pencil className="size-4 text-muted-foreground" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDelete(des)}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Career ladder / grade levels tab
// ---------------------------------------------------------------------------

function CareerLadder() {
  return (
    <div className="space-y-0">
      {gradeLevels.map((grade, idx) => {
        const isLast = idx === gradeLevels.length - 1;
        return (
          <div key={grade.level} className="relative">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-6 top-full z-0 h-4 w-px bg-border" />
            )}

            <Card
              className={cn(
                'relative z-10 transition-shadow hover:shadow-md',
                idx > 0 && 'mt-4'
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Level indicator */}
                  <div
                    className={cn(
                      'flex size-12 shrink-0 flex-col items-center justify-center rounded-xl',
                      grade.bgColor
                    )}
                  >
                    <span className={cn('font-bold text-lg', grade.color)}>
                      {grade.level}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{grade.label}</h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {grade.sublabel}
                      </Badge>
                    </div>

                    {/* Titles at this level */}
                    <div className="flex flex-wrap gap-1.5">
                      {grade.titles.map((title) => (
                        <Badge
                          key={title}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {title}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta row */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-3">
                      <div>
                        <span className="text-muted-foreground">
                          Salary Range:{' '}
                        </span>
                        <span className="font-medium">
                          {formatSalary(grade.salaryRange[0])} -{' '}
                          {formatSalary(grade.salaryRange[1])}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Experience:{' '}
                        </span>
                        <span className="font-medium">{grade.experience}</span>
                      </div>
                      <div className="sm:text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5',
                            grade.color
                          )}
                        >
                          {grade.icon}
                          <span className="font-medium">Level {grade.level}</span>
                        </span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {grade.requirements}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arrow between cards */}
            {!isLast && (
              <div className="flex justify-center py-1">
                <ChevronUp
                  className="size-4 text-muted-foreground rotate-180"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Summary footer */}
      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-dashed p-4">
        <ArrowUpRight className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Career progression from{' '}
          <strong className="text-foreground">Level 1</strong> to{' '}
          <strong className="text-foreground">Level 6</strong> -- salary range
          from {formatSalary(45000)} to {formatSalary(350000)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Add Designation dialog
// ---------------------------------------------------------------------------

const DEPT_OPTIONS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'] as const;
const GRADE_OPTIONS = ['1', '2', '3', '4', '5', '6'] as const;

type DesignationFormData = Omit<Designation, 'id' | 'employeeCount'>;

const defaultDesignationForm = {
  title: '',
  department: '',
  gradeLevel: '',
  minSalary: '',
  maxSalary: '',
  status: 'active' as 'active' | 'inactive',
};

function DesignationFormDialog({
  open,
  onOpenChange,
  designation,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designation?: Designation | null;
  onSubmit: (data: DesignationFormData) => void;
}) {
  const isEditing = !!designation;
  const [form, setForm] = useState(defaultDesignationForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        designation
          ? {
              title: designation.title,
              department: designation.department,
              gradeLevel: String(designation.gradeLevel),
              minSalary: String(designation.minSalary),
              maxSalary: String(designation.maxSalary),
              status: designation.status,
            }
          : defaultDesignationForm
      );
    }
  }, [designation, open]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.department || !form.gradeLevel) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    onSubmit({
      title: form.title.trim(),
      department: form.department,
      gradeLevel: Number(form.gradeLevel),
      minSalary: Number(form.minSalary) || 0,
      maxSalary: Number(form.maxSalary) || 0,
      status: form.status,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Designation' : 'Add Designation'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the job title, grade level, and salary band.'
              : 'Create a new job title with grade level and salary band.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Title" required htmlFor="des-title">
              <Input
                id="des-title"
                placeholder="e.g. Senior Developer"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Department" required htmlFor="des-department">
              <Select
                value={form.department}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, department: v }))
                }
              >
                <SelectTrigger id="des-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPT_OPTIONS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Grade Level" required htmlFor="des-grade">
              <Select
                value={form.gradeLevel}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, gradeLevel: v }))
                }
              >
                <SelectTrigger id="des-grade">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>
                      L{g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper label="Min Salary" htmlFor="des-min-salary">
                <Input
                  id="des-min-salary"
                  type="number"
                  placeholder="e.g. 50000"
                  min={0}
                  value={form.minSalary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minSalary: e.target.value }))
                  }
                />
              </FormFieldWrapper>

              <FormFieldWrapper label="Max Salary" htmlFor="des-max-salary">
                <Input
                  id="des-max-salary"
                  type="number"
                  placeholder="e.g. 80000"
                  min={0}
                  value={form.maxSalary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxSalary: e.target.value }))
                  }
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Status" required htmlFor="des-status">
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, status: v as 'active' | 'inactive' }))
                }
              >
                <SelectTrigger id="des-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                !form.title.trim() ||
                !form.department ||
                !form.gradeLevel
              }
            >
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {isEditing ? 'Save Changes' : 'Add Designation'}
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

export default function DesignationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [designations, setDesignations] =
    useState<Designation[]>(mockDesignations);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Designation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(designation: Designation) {
    setEditing(designation);
    setFormOpen(true);
  }

  function handleSubmit(data: DesignationFormData) {
    if (editing) {
      setDesignations((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...data } : d))
      );
      toast.success(`Designation "${data.title}" updated successfully`);
    } else {
      const newDesignation: Designation = {
        id: `des-${Date.now()}`,
        employeeCount: 0,
        ...data,
      };
      setDesignations((prev) => [...prev, newDesignation]);
      toast.success(`Designation "${data.title}" added successfully`);
    }
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDesignations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success(`Designation "${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
    setIsDeleting(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designations"
        description="Manage job titles, grade levels, and salary bands."
      >
        <Button className="gap-1.5" onClick={openAdd}>
          <Plus className="size-4" aria-hidden="true" />
          Add Designation
        </Button>
      </PageHeader>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Designations</TabsTrigger>
          <TabsTrigger value="grades">Grade Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-80 rounded-lg" />
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Min Salary</TableHead>
                        <TableHead>Max Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <DesignationsTable
              designations={designations}
              search={search}
              onSearchChange={setSearch}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          )}
        </TabsContent>

        <TabsContent value="grades">
          {isLoading ? <GradeSkeleton /> : <CareerLadder />}
        </TabsContent>
      </Tabs>

      <DesignationFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        designation={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Designation"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
