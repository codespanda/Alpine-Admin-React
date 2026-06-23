'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { departmentSchema, type DepartmentFormData } from '@/lib/validations';
import { mockEmployees } from '@/constants/mock-data';
import { Loader2 } from 'lucide-react';
import type { Department } from '@/types';

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSubmit: (data: DepartmentFormData) => void;
}

function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      headOfDepartmentId: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        description: department.description,
        headOfDepartmentId: department.headOfDepartmentId,
        status: department.status,
      });
    } else {
      reset({
        name: '',
        description: '',
        headOfDepartmentId: '',
        status: 'active',
      });
    }
  }, [department, reset]);

  const handleFormSubmit = async (data: DepartmentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  const activeEmployees = mockEmployees.filter(
    (emp) => emp.status === 'active'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Department' : 'Add Department'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the department details below.'
              : 'Fill in the details to create a new department.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-1 min-h-0 flex-col"
        >
          <DialogBody className="space-y-4">
            <FormFieldWrapper
              label="Department Name"
              error={errors.name?.message}
              required
              htmlFor="dept-name"
            >
              <Input
                id="dept-name"
                placeholder="e.g. Engineering"
                {...register('name')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Description"
              error={errors.description?.message}
              htmlFor="dept-description"
            >
              <Textarea
                id="dept-description"
                placeholder="Brief description of the department..."
                rows={3}
                {...register('description')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Head of Department"
              error={errors.headOfDepartmentId?.message}
              required
              htmlFor="dept-head"
            >
              <Select
                value={watch('headOfDepartmentId')}
                onValueChange={(value) => setValue('headOfDepartmentId', value ?? '')}
              >
                <SelectTrigger id="dept-head">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Status"
              error={errors.status?.message}
              required
              htmlFor="dept-status"
            >
              <Select
                value={watch('status')}
                onValueChange={(value) =>
                  value && setValue('status', value as 'active' | 'inactive')
                }
              >
                <SelectTrigger id="dept-status">
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {isEditing ? 'Save Changes' : 'Add Department'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DepartmentFormDialog, type DepartmentFormDialogProps };
