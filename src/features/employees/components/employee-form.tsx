'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { CreateEmployeeData } from '@/types';
import { employeeSchema } from '@/lib/validations';
import { mockDepartments } from '@/constants/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';

interface EmployeeFormProps {
  defaultValues?: Partial<CreateEmployeeData>;
  onSubmit: (data: CreateEmployeeData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
  formId?: string;
  hideActions?: boolean;
  onValidityChange?: (isValid: boolean) => void;
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Terminated', value: 'terminated' },
] as const;

function EmployeeForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
  formId,
  hideActions = false,
  onValidityChange,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateEmployeeData>({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      joiningDate: '',
      salary: 0,
      status: 'active',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
      ...defaultValues,
    },
  });

  const watchDepartment = watch('department');
  const watchStatus = watch('status');

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Basic personal details of the employee
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="First Name"
              error={errors.firstName?.message}
              required
              htmlFor="firstName"
            >
              <Input
                id="firstName"
                placeholder="Enter first name"
                aria-invalid={!!errors.firstName}
                {...register('firstName')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Last Name"
              error={errors.lastName?.message}
              required
              htmlFor="lastName"
            >
              <Input
                id="lastName"
                placeholder="Enter last name"
                aria-invalid={!!errors.lastName}
                {...register('lastName')}
              />
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Email"
              error={errors.email?.message}
              required
              htmlFor="email"
            >
              <Input
                id="email"
                type="email"
                placeholder="employee@company.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Phone"
              error={errors.phone?.message}
              required
              htmlFor="phone"
            >
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>
            Job-related information and compensation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Department"
              error={errors.department?.message}
              required
            >
              <Select
                value={watchDepartment}
                onValueChange={(value) => {
                  if (value) setValue('department', value, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments
                    .filter((dept) => dept.status === 'active')
                    .map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Designation"
              error={errors.designation?.message}
              required
              htmlFor="designation"
            >
              <Input
                id="designation"
                placeholder="e.g. Software Engineer"
                aria-invalid={!!errors.designation}
                {...register('designation')}
              />
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Joining Date"
              error={errors.joiningDate?.message}
              required
              htmlFor="joiningDate"
            >
              <DatePicker
                id="joiningDate"
                value={watch('joiningDate')}
                onChange={(v) => setValue('joiningDate', v, { shouldValidate: true })}
                placeholder="Select joining date"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Salary"
              error={errors.salary?.message}
              required
              htmlFor="salary"
            >
              <Input
                id="salary"
                type="number"
                placeholder="0"
                min={0}
                aria-invalid={!!errors.salary}
                {...register('salary', { valueAsNumber: true })}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper
            label="Status"
            error={errors.status?.message}
            required
          >
            <Select
              value={watchStatus}
              onValueChange={(value) => {
                if (value) {
                  setValue(
                    'status',
                    value as CreateEmployeeData['status'],
                    { shouldValidate: true }
                  );
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </CardContent>
      </Card>

      {/* Section 3: Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>
            Residential address of the employee
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormFieldWrapper
            label="Street"
            error={errors.address?.street?.message}
            required
            htmlFor="address.street"
          >
            <Input
              id="address.street"
              placeholder="Enter street address"
              aria-invalid={!!errors.address?.street}
              {...register('address.street')}
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="City"
              error={errors.address?.city?.message}
              required
              htmlFor="address.city"
            >
              <Input
                id="address.city"
                placeholder="Enter city"
                aria-invalid={!!errors.address?.city}
                {...register('address.city')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="State"
              error={errors.address?.state?.message}
              required
              htmlFor="address.state"
            >
              <Input
                id="address.state"
                placeholder="Enter state"
                aria-invalid={!!errors.address?.state}
                {...register('address.state')}
              />
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Zip Code"
              error={errors.address?.zipCode?.message}
              required
              htmlFor="address.zipCode"
            >
              <Input
                id="address.zipCode"
                placeholder="Enter zip code"
                aria-invalid={!!errors.address?.zipCode}
                {...register('address.zipCode')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Country"
              error={errors.address?.country?.message}
              required
              htmlFor="address.country"
            >
              <Input
                id="address.country"
                placeholder="Enter country"
                aria-invalid={!!errors.address?.country}
                {...register('address.country')}
              />
            </FormFieldWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>
            Person to contact in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFieldWrapper
              label="Contact Name"
              error={errors.emergencyContact?.name?.message}
              required
              htmlFor="emergencyContact.name"
            >
              <Input
                id="emergencyContact.name"
                placeholder="Enter contact name"
                aria-invalid={!!errors.emergencyContact?.name}
                {...register('emergencyContact.name')}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Relationship"
              error={errors.emergencyContact?.relationship?.message}
              required
              htmlFor="emergencyContact.relationship"
            >
              <Input
                id="emergencyContact.relationship"
                placeholder="e.g. Spouse, Parent"
                aria-invalid={!!errors.emergencyContact?.relationship}
                {...register('emergencyContact.relationship')}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper
            label="Phone"
            error={errors.emergencyContact?.phone?.message}
            required
            htmlFor="emergencyContact.phone"
          >
            <Input
              id="emergencyContact.phone"
              placeholder="+1 (555) 000-0000"
              className="sm:w-1/2"
              aria-invalid={!!errors.emergencyContact?.phone}
              {...register('emergencyContact.phone')}
            />
          </FormFieldWrapper>
        </CardContent>
      </Card>

      {/* Actions */}
      {!hideActions && (
        <>
          <Separator />
          <div className="flex items-center justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading && (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {mode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export { EmployeeForm, type EmployeeFormProps };
