'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from '@/lib/router';
import { ArrowLeft, UserX } from 'lucide-react';
import { toast } from 'sonner';
import type { Employee, CreateEmployeeData } from '@/types';
import { mockEmployees } from '@/constants/mock-data';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmployeeForm } from '@/features/employees';

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockEmployees.find((emp) => emp.id === params.id) ?? null;
      setEmployee(found);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [params.id]);

  function handleSubmit(data: CreateEmployeeData) {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Employee updated', {
        description: `${data.firstName} ${data.lastName}'s record has been updated.`,
      });
      router.push(`/employees/${params.id}`);
    }, 800);
  }

  if (isLoading) {
    return <LoadingState message="Loading employee data..." />;
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
              The employee you are trying to edit does not exist or has been
              removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const defaultValues: Partial<CreateEmployeeData> = {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    joiningDate: employee.joiningDate,
    salary: employee.salary,
    status: employee.status,
    address: { ...employee.address },
    emergencyContact: { ...employee.emergencyContact },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Employee"
        description={`Editing ${employee.firstName} ${employee.lastName}'s record`}
      >
        <Button
          variant="outline"
          onClick={() => router.push(`/employees/${params.id}`)}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-3xl">
        <EmployeeForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/employees/${params.id}`)}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
