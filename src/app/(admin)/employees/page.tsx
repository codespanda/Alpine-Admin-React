'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from '@/lib/router';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Employee, CreateEmployeeData } from '@/types';
import { mockEmployees } from '@/constants/mock-data';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getEmployeeColumns } from '@/features/employees';
import { EmployeeForm } from '@/features/employees';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setDialogMode('create');
    setEditTarget(null);
    setIsFormValid(false);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((employee: Employee) => {
    setDialogMode('edit');
    setEditTarget(employee);
    setIsFormValid(true);
    setDialogOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getEmployeeColumns({
        onView: (employee) => router.push(`/employees/${employee.id}`),
        onEdit: handleOpenEdit,
        onDelete: (employee) => setDeleteTarget(employee),
      }),
    [router, handleOpenEdit],
  );

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setTimeout(() => {
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== deleteTarget.id),
      );
      toast.success('Employee deleted', {
        description: `${deleteTarget.firstName} ${deleteTarget.lastName} has been removed.`,
      });
      setDeleteTarget(null);
      setIsDeleting(false);
    }, 500);
  }

  function handleFormSubmit(data: CreateEmployeeData) {
    setIsSubmitting(true);
    setTimeout(() => {
      if (dialogMode === 'create') {
        const newEmployee: Employee = {
          id: `emp-${Date.now()}`,
          employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          departmentId: `dept-${data.department.toLowerCase().replace(/\s/g, '-')}`,
          designation: data.designation,
          status: data.status,
          joiningDate: data.joiningDate,
          salary: data.salary,
          address: data.address,
          emergencyContact: data.emergencyContact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setEmployees((prev) => [newEmployee, ...prev]);
        toast.success('Employee created', {
          description: `${data.firstName} ${data.lastName} has been added.`,
        });
      } else {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editTarget?.id
              ? { ...emp, ...data, updatedAt: new Date().toISOString() }
              : emp,
          ),
        );
        toast.success('Employee updated', {
          description: `${data.firstName} ${data.lastName}'s record has been updated.`,
        });
      }
      setDialogOpen(false);
      setIsSubmitting(false);
      setEditTarget(null);
    }, 800);
  }

  const editDefaults: Partial<CreateEmployeeData> | undefined = editTarget
    ? {
        firstName: editTarget.firstName,
        lastName: editTarget.lastName,
        email: editTarget.email,
        phone: editTarget.phone,
        department: editTarget.department,
        designation: editTarget.designation,
        joiningDate: editTarget.joiningDate,
        salary: editTarget.salary,
        status: editTarget.status,
        address: { ...editTarget.address },
        emergencyContact: { ...editTarget.emergencyContact },
      }
    : undefined;

  const formId = dialogMode === 'create' ? 'create-employee-form' : 'edit-employee-form';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your organization's employee records"
      >
        <Button onClick={handleOpenCreate}>
          <Plus className="size-4" />
          Add Employee
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={employees}
        searchKey="firstName"
        searchPlaceholder="Search employees..."
        isLoading={isLoading}
        showRowSelection
        showPagination
        emptyMessage="No employees found."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Employee"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditTarget(null);
            setDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Employee' : 'Edit Employee'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Fill in the details below to create a new employee record.'
                : `Update ${editTarget?.firstName} ${editTarget?.lastName}'s record.`}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <EmployeeForm
              key={editTarget?.id ?? 'create'}
              formId={formId}
              mode={dialogMode}
              defaultValues={editDefaults}
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
              hideActions
              onValidityChange={setIsFormValid}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} disabled={isSubmitting || !isFormValid}>
              {isSubmitting && <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden="true" />}
              {dialogMode === 'create' ? 'Create Employee' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
