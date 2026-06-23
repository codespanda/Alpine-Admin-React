'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateEmployeeData } from '@/types';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { EmployeeForm } from '@/features/employees';

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(data: CreateEmployeeData) {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Employee created', {
        description: `${data.firstName} ${data.lastName} has been added successfully.`,
      });
      router.push('/employees');
    }, 800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Employee"
        description="Fill in the details to create a new employee record"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/employees')}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-3xl">
        <EmployeeForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => router.push('/employees')}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
