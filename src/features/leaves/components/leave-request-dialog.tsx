'use client';

import { useMemo } from 'react';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  leaveRequestSchema,
  type LeaveRequestFormData,
} from '@/lib/validations';
import { Loader2, CalendarDays } from 'lucide-react';

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeaveRequestFormData) => void;
}

function LeaveRequestDialog({
  open,
  onOpenChange,
  onSubmit,
}: LeaveRequestDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LeaveRequestFormData>({
    mode: 'onChange',
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: undefined,
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [startDate, endDate]);

  const handleFormSubmit = async (data: LeaveRequestFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
          <DialogDescription>
            Submit a new leave request for approval.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-1 min-h-0 flex-col"
        >
          <DialogBody className="space-y-4">
            <FormFieldWrapper
              label="Leave Type"
              error={errors.type?.message}
              required
              htmlFor="leave-type"
            >
              <Select
                value={watch('type') ?? ''}
                onValueChange={(value) =>
                  value && setValue('type', value as LeaveRequestFormData['type'])
                }
              >
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                  <SelectItem value="paternity">Paternity Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper
                label="Start Date"
                error={errors.startDate?.message}
                required
                htmlFor="leave-start"
              >
                <DatePicker
                  id="leave-start"
                  value={watch('startDate')}
                  onChange={(v) => setValue('startDate', v, { shouldValidate: true })}
                  placeholder="Select start date"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="End Date"
                error={errors.endDate?.message}
                required
                htmlFor="leave-end"
              >
                <DatePicker
                  id="leave-end"
                  value={watch('endDate')}
                  onChange={(v) => setValue('endDate', v, { shouldValidate: true })}
                  placeholder="Select end date"
                />
              </FormFieldWrapper>
            </div>

            {calculatedDays > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
                <CalendarDays
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">
                  {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}{' '}
                  requested
                </span>
              </div>
            )}

            <FormFieldWrapper
              label="Reason"
              error={errors.reason?.message}
              required
              htmlFor="leave-reason"
            >
              <Textarea
                id="leave-reason"
                placeholder="Please provide a reason for your leave request..."
                rows={3}
                {...register('reason')}
              />
            </FormFieldWrapper>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
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
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { LeaveRequestDialog, type LeaveRequestDialogProps };
