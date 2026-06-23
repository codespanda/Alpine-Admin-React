'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { DepartmentCard } from '@/features/departments/components/department-card';
import { DepartmentFormDialog } from '@/features/departments/components/department-form-dialog';
import { mockDepartments, mockEmployees } from '@/constants/mock-data';
import type { Department } from '@/types';
import type { DepartmentFormData } from '@/lib/validations';
import { Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

function DepartmentCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDepartments(mockDepartments);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddDepartment = useCallback(
    (data: DepartmentFormData) => {
      const employee = mockEmployees.find(
        (e) => e.id === data.headOfDepartmentId
      );
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name: data.name,
        description: data.description ?? '',
        headOfDepartment: employee
          ? `${employee.firstName} ${employee.lastName}`
          : '',
        headOfDepartmentId: data.headOfDepartmentId,
        employeeCount: 0,
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDepartments((prev) => [...prev, newDepartment]);
      toast.success('Department created', {
        description: `${data.name} has been added successfully.`,
      });
    },
    []
  );

  const handleEditDepartment = useCallback(
    (data: DepartmentFormData) => {
      if (!editingDepartment) return;
      const employee = mockEmployees.find(
        (e) => e.id === data.headOfDepartmentId
      );
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id
            ? {
                ...dept,
                name: data.name,
                description: data.description ?? '',
                headOfDepartment: employee
                  ? `${employee.firstName} ${employee.lastName}`
                  : dept.headOfDepartment,
                headOfDepartmentId: data.headOfDepartmentId,
                status: data.status,
                updatedAt: new Date().toISOString(),
              }
            : dept
        )
      );
      setEditingDepartment(null);
      toast.success('Department updated', {
        description: `${data.name} has been updated successfully.`,
      });
    },
    [editingDepartment]
  );

  const handleDeleteDepartment = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDepartments((prev) =>
      prev.filter((dept) => dept.id !== deleteTarget.id)
    );
    toast.success('Department deleted', {
      description: `${deleteTarget.name} has been removed.`,
    });
    setDeleteTarget(null);
    setIsDeleting(false);
  }, [deleteTarget]);

  const openEdit = useCallback((department: Department) => {
    setEditingDepartment(department);
    setFormOpen(true);
  }, []);

  const openAdd = useCallback(() => {
    setEditingDepartment(null);
    setFormOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Departments" description="Manage company departments and their teams.">
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          Add Department
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentCardSkeleton key={i} />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Create your first department to start organizing your teams."
          action={
            <Button onClick={openAdd} className="gap-1.5">
              <Plus className="size-4" aria-hidden="true" />
              Add Department
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingDepartment(null);
        }}
        department={editingDepartment}
        onSubmit={editingDepartment ? handleEditDepartment : handleAddDepartment}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and all associated data will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteDepartment}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
