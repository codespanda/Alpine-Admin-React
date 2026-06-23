'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  Plus,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  Award,
  Download,
  Play,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Course {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  duration: string;
  enrolled: number;
  progress: number;
  status: string;
  instructor: string;
}

interface Certification {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  certificationName: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring-soon' | 'expired';
}

interface MyLearningCourse {
  id: string;
  name: string;
  progress: number;
  lastAccessed: string;
  completedDate?: string;
  hasCertificate?: boolean;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockCourses: Course[] = [
  {
    id: 'c1',
    name: 'React Advanced Patterns',
    category: 'Technical',
    categoryColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    duration: '12 hours',
    enrolled: 15,
    progress: 45,
    status: 'In Progress',
    instructor: 'Dr. Sarah Mitchell',
  },
  {
    id: 'c2',
    name: 'Leadership Fundamentals',
    category: 'Management',
    categoryColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    duration: '8 hours',
    enrolled: 8,
    progress: 0,
    status: 'Active',
    instructor: 'James Wilson',
  },
  {
    id: 'c3',
    name: 'Data Security Basics',
    category: 'Compliance',
    categoryColor: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    duration: '4 hours',
    enrolled: 45,
    progress: 100,
    status: 'Mandatory',
    instructor: 'Lisa Chen',
  },
  {
    id: 'c4',
    name: 'Project Management 101',
    category: 'Management',
    categoryColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    duration: '16 hours',
    enrolled: 10,
    progress: 0,
    status: 'Active',
    instructor: 'Robert Garcia',
  },
  {
    id: 'c5',
    name: 'AWS Cloud Practitioner',
    category: 'Technical',
    categoryColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    duration: '20 hours',
    enrolled: 6,
    progress: 0,
    status: 'Active',
    instructor: 'Michael Torres',
  },
  {
    id: 'c6',
    name: 'Effective Communication',
    category: 'Soft Skills',
    categoryColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    duration: '6 hours',
    enrolled: 20,
    progress: 0,
    status: 'Active',
    instructor: 'Emily Davis',
  },
  {
    id: 'c7',
    name: 'GDPR Compliance',
    category: 'Compliance',
    categoryColor: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    duration: '3 hours',
    enrolled: 45,
    progress: 72,
    status: 'Mandatory',
    instructor: 'Anna Schmidt',
  },
  {
    id: 'c8',
    name: 'Agile Methodology',
    category: 'Process',
    categoryColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    duration: '10 hours',
    enrolled: 12,
    progress: 0,
    status: 'Active',
    instructor: 'David Kim',
  },
];

const mockCertifications: Certification[] = [
  {
    id: 'cert1',
    employeeName: 'Alice Johnson',
    employeeAvatar: '',
    certificationName: 'AWS Solutions Architect',
    issuingBody: 'Amazon Web Services',
    issueDate: '2024-03-15',
    expiryDate: '2027-03-15',
    status: 'active',
  },
  {
    id: 'cert2',
    employeeName: 'Bob Williams',
    employeeAvatar: '',
    certificationName: 'PMP',
    issuingBody: 'PMI',
    issueDate: '2023-06-20',
    expiryDate: '2026-06-20',
    status: 'active',
  },
  {
    id: 'cert3',
    employeeName: 'Carol Martinez',
    employeeAvatar: '',
    certificationName: 'Certified Scrum Master',
    issuingBody: 'Scrum Alliance',
    issueDate: '2024-01-10',
    expiryDate: '2026-01-10',
    status: 'expired',
  },
  {
    id: 'cert4',
    employeeName: 'Daniel Lee',
    employeeAvatar: '',
    certificationName: 'Google Analytics',
    issuingBody: 'Google',
    issueDate: '2025-02-28',
    expiryDate: '2026-08-28',
    status: 'expiring-soon',
  },
  {
    id: 'cert5',
    employeeName: 'Eva Brown',
    employeeAvatar: '',
    certificationName: 'CISSP',
    issuingBody: 'ISC2',
    issueDate: '2023-11-05',
    expiryDate: '2026-11-05',
    status: 'active',
  },
  {
    id: 'cert6',
    employeeName: 'Frank Thompson',
    employeeAvatar: '',
    certificationName: 'Azure Administrator',
    issuingBody: 'Microsoft',
    issueDate: '2024-07-12',
    expiryDate: '2026-07-12',
    status: 'expiring-soon',
  },
  {
    id: 'cert7',
    employeeName: 'Grace Kim',
    employeeAvatar: '',
    certificationName: 'ITIL Foundation',
    issuingBody: 'Axelos',
    issueDate: '2022-09-01',
    expiryDate: '2025-09-01',
    status: 'expired',
  },
  {
    id: 'cert8',
    employeeName: 'Henry Clark',
    employeeAvatar: '',
    certificationName: 'Kubernetes Administrator',
    issuingBody: 'CNCF',
    issueDate: '2025-04-18',
    expiryDate: '2028-04-18',
    status: 'active',
  },
  {
    id: 'cert9',
    employeeName: 'Iris Patel',
    employeeAvatar: '',
    certificationName: 'Salesforce Admin',
    issuingBody: 'Salesforce',
    issueDate: '2024-12-01',
    expiryDate: '2026-12-01',
    status: 'active',
  },
  {
    id: 'cert10',
    employeeName: 'Jack Rivera',
    employeeAvatar: '',
    certificationName: 'CompTIA Security+',
    issuingBody: 'CompTIA',
    issueDate: '2023-08-22',
    expiryDate: '2026-08-22',
    status: 'expiring-soon',
  },
];

const myInProgressCourses: MyLearningCourse[] = [
  { id: 'ml1', name: 'React Advanced Patterns', progress: 45, lastAccessed: '2026-06-16' },
  { id: 'ml2', name: 'GDPR Compliance', progress: 72, lastAccessed: '2026-06-15' },
  { id: 'ml3', name: 'AWS Cloud Practitioner', progress: 20, lastAccessed: '2026-06-12' },
];

const myCompletedCourses: MyLearningCourse[] = [
  { id: 'mc1', name: 'Data Security Basics', progress: 100, lastAccessed: '2026-05-20', completedDate: '2026-05-20', hasCertificate: true },
  { id: 'mc2', name: 'JavaScript Fundamentals', progress: 100, lastAccessed: '2026-04-15', completedDate: '2026-04-15', hasCertificate: true },
  { id: 'mc3', name: 'Introduction to TypeScript', progress: 100, lastAccessed: '2026-03-10', completedDate: '2026-03-10', hasCertificate: true },
  { id: 'mc4', name: 'CSS Grid & Flexbox', progress: 100, lastAccessed: '2026-02-28', completedDate: '2026-02-28', hasCertificate: false },
  { id: 'mc5', name: 'Git & Version Control', progress: 100, lastAccessed: '2026-01-18', completedDate: '2026-01-18', hasCertificate: true },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CourseCard({ course }: { course: Course }) {
  const isEnrolled = course.progress > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge
            className={cn(
              'border-transparent font-medium',
              course.categoryColor
            )}
          >
            {course.category}
          </Badge>
          <StatusBadge
            status={course.status}
            variantMap={{
              'in-progress':
                'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
              mandatory:
                'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
            }}
          />
        </div>
        <CardTitle className="line-clamp-1">{course.name}</CardTitle>
        <CardDescription>Instructor: {course.instructor}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden="true" />
              {course.enrolled} enrolled
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  course.progress === 100
                    ? 'bg-emerald-500'
                    : course.progress > 0
                      ? 'bg-primary'
                      : 'bg-transparent'
                )}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          variant={isEnrolled ? 'default' : 'outline'}
          className="gap-1.5"
          onClick={() =>
            toast.success(
              isEnrolled
                ? `Resuming "${course.name}"`
                : `Enrolled in "${course.name}"`
            )
          }
        >
          {isEnrolled ? (
            <>
              <Play className="size-3.5" aria-hidden="true" />
              Continue
            </>
          ) : (
            <>
              <Plus className="size-3.5" aria-hidden="true" />
              Enroll
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CertificationsTable({
  certifications,
}: {
  certifications: Certification[];
}) {
  const certVariantMap: Record<string, string> = {
    active:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    'expiring-soon':
      'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
    expired: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Certification</TableHead>
            <TableHead>Issuing Body</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={cert.employeeAvatar} alt={cert.employeeName} />
                    <AvatarFallback>{getInitials(cert.employeeName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{cert.employeeName}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {cert.certificationName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {cert.issuingBody}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(cert.issueDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(cert.expiryDate)}
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={cert.status}
                  variantMap={certVariantMap}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TrainingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [addCourseSubmitting, setAddCourseSubmitting] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseMandatory, setCourseMandatory] = useState(false);

  function resetCourseForm() {
    setCourseName('');
    setCourseCategory('');
    setCourseDuration('');
    setCourseInstructor('');
    setCourseDescription('');
    setCourseMandatory(false);
  }

  async function handleAddCourse() {
    setAddCourseSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Course created successfully');
    setAddCourseSubmitting(false);
    setAddCourseOpen(false);
    resetCourseForm();
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training & Development"
        description="Manage courses, certifications, and employee learning paths."
      >
        <Button
          className="gap-1.5"
          onClick={() => setAddCourseOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Course
        </Button>
      </PageHeader>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
        </TabsList>

        {/* ---- Courses Tab ---- */}
        <TabsContent value="courses">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Certifications Tab ---- */}
        <TabsContent value="certifications">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <CertificationsTable certifications={mockCertifications} />
          )}
        </TabsContent>

        {/* ---- My Learning Tab ---- */}
        <TabsContent value="my-learning" className="space-y-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Courses in Progress"
                  value={3}
                  icon={BookOpen}
                  trend="up"
                  change={50}
                  changeLabel="vs last quarter"
                />
                <StatCard
                  title="Completed"
                  value={12}
                  icon={CheckCircle2}
                  trend="up"
                  change={20}
                  changeLabel="vs last quarter"
                />
                <StatCard
                  title="Certificates Earned"
                  value={5}
                  icon={Award}
                  trend="up"
                  change={25}
                  changeLabel="vs last quarter"
                />
              </div>

              {/* In Progress */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Current Courses</h3>
                <div className="space-y-3">
                  {myInProgressCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="size-4 text-primary" aria-hidden="true" />
                              </div>
                              <div>
                                <p className="font-medium">{course.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Last accessed: {formatDate(course.lastAccessed)}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">
                                  {course.progress}%
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="gap-1.5 self-start"
                            onClick={() =>
                              toast.success(`Resuming "${course.name}"`)
                            }
                          >
                            <Play className="size-3.5" aria-hidden="true" />
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Completed */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Completed Courses</h3>
                <div className="space-y-3">
                  {myCompletedCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                              <CheckCircle2
                                className="size-4 text-emerald-600 dark:text-emerald-400"
                                aria-hidden="true"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{course.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Completed:{' '}
                                {course.completedDate
                                  ? formatDate(course.completedDate)
                                  : '---'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                              Completed
                            </Badge>
                            {course.hasCertificate && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() =>
                                  toast.success(
                                    `Downloading certificate for "${course.name}"`
                                  )
                                }
                              >
                                <Download
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Course Dialog */}
      <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Create a new training course for employees.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Course Name" required>
              <Input
                placeholder="e.g. React Advanced Patterns"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Category" required>
              <Select value={courseCategory} onValueChange={(v) => v && setCourseCategory(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                  <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper label="Duration in Hours" required>
              <Input
                type="number"
                placeholder="e.g. 12"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Instructor">
              <Input
                placeholder="e.g. Dr. Sarah Mitchell"
                value={courseInstructor}
                onChange={(e) => setCourseInstructor(e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper label="Description">
              <Textarea
                placeholder="Course description..."
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </FormFieldWrapper>
            <div className="flex items-center gap-3">
              <Switch
                checked={courseMandatory}
                onCheckedChange={setCourseMandatory}
              />
              <Label>Mandatory</Label>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddCourseOpen(false)}
              disabled={addCourseSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCourse}
              disabled={addCourseSubmitting || !courseName.trim() || !courseCategory || !courseDuration}
            >
              {addCourseSubmitting && (
                <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />
              )}
              Add Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
