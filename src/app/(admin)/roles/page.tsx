'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { toast } from 'sonner';
import {
  Plus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  icon: 'shield' | 'shield-check' | 'shield-alert';
  permissions: Record<string, string[]>;
  isSystem: boolean;
}

type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const modules = [
  'Dashboard',
  'Employees',
  'Departments',
  'Attendance',
  'Leaves',
  'Payroll',
  'Reports',
  'Settings',
] as const;

const permissionActions: PermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'export',
];

const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    description: 'Full system access with all permissions across every module.',
    userCount: 3,
    color: 'border-l-red-500',
    icon: 'shield-alert',
    isSystem: true,
    permissions: Object.fromEntries(
      modules.map((m) => [m, [...permissionActions]])
    ),
  },
  {
    id: 'role-2',
    name: 'Admin',
    description:
      'Administrative access to manage employees, departments, and reports.',
    userCount: 5,
    color: 'border-l-orange-500',
    icon: 'shield-check',
    isSystem: true,
    permissions: {
      Dashboard: ['view'],
      Employees: ['view', 'create', 'edit', 'delete', 'export'],
      Departments: ['view', 'create', 'edit', 'delete'],
      Attendance: ['view', 'create', 'edit', 'export'],
      Leaves: ['view', 'create', 'edit', 'delete'],
      Payroll: ['view', 'export'],
      Reports: ['view', 'create', 'export'],
      Settings: ['view', 'edit'],
    },
  },
  {
    id: 'role-3',
    name: 'HR Manager',
    description: 'Full access to HR-related modules including leaves and attendance.',
    userCount: 4,
    color: 'border-l-violet-500',
    icon: 'shield-check',
    isSystem: false,
    permissions: {
      Dashboard: ['view'],
      Employees: ['view', 'create', 'edit', 'export'],
      Departments: ['view'],
      Attendance: ['view', 'create', 'edit', 'export'],
      Leaves: ['view', 'create', 'edit', 'delete', 'export'],
      Payroll: ['view'],
      Reports: ['view', 'export'],
      Settings: ['view'],
    },
  },
  {
    id: 'role-4',
    name: 'Team Lead',
    description:
      'Team management access with oversight of attendance and leave approvals.',
    userCount: 8,
    color: 'border-l-blue-500',
    icon: 'shield',
    isSystem: false,
    permissions: {
      Dashboard: ['view'],
      Employees: ['view'],
      Departments: ['view'],
      Attendance: ['view', 'edit'],
      Leaves: ['view', 'edit'],
      Payroll: [],
      Reports: ['view'],
      Settings: ['view'],
    },
  },
  {
    id: 'role-5',
    name: 'Employee',
    description: 'Basic employee access for self-service features and personal data.',
    userCount: 45,
    color: 'border-l-emerald-500',
    icon: 'shield',
    isSystem: false,
    permissions: {
      Dashboard: ['view'],
      Employees: ['view'],
      Departments: ['view'],
      Attendance: ['view'],
      Leaves: ['view', 'create'],
      Payroll: ['view'],
      Reports: [],
      Settings: ['view'],
    },
  },
  {
    id: 'role-6',
    name: 'Viewer',
    description: 'Read-only access to view dashboards and basic reports.',
    userCount: 10,
    color: 'border-l-gray-400',
    icon: 'shield',
    isSystem: false,
    permissions: {
      Dashboard: ['view'],
      Employees: ['view'],
      Departments: ['view'],
      Attendance: ['view'],
      Leaves: ['view'],
      Payroll: [],
      Reports: ['view'],
      Settings: [],
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function RoleIcon({ icon }: { icon: Role['icon'] }) {
  switch (icon) {
    case 'shield-alert':
      return <ShieldAlert className="size-5 text-red-500" />;
    case 'shield-check':
      return <ShieldCheck className="size-5 text-blue-500" />;
    default:
      return <Shield className="size-5 text-muted-foreground" />;
  }
}

// ---------------------------------------------------------------------------
// Skeleton loaders
// ---------------------------------------------------------------------------

function RoleCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-muted">
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-7 w-14" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MatrixSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-48" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 py-2">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} className="size-5 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role card component
// ---------------------------------------------------------------------------

function RoleCard({
  role,
  onViewDetails,
}: {
  role: Role;
  onViewDetails: (role: Role) => void;
}) {
  return (
    <Card
      className={cn(
        'border-l-4 transition-shadow hover:shadow-md',
        role.color
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <RoleIcon icon={role.icon} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{role.name}</h3>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-[10px]">
                      System
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Users className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {role.description}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(role)}
              className="gap-1"
            >
              <Eye className="size-3" aria-hidden="true" />
              View
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Pencil className="size-3" aria-hidden="true" />
              Edit
            </Button>
            {!role.isSystem && (
              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                <Trash2 className="size-3" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Permissions matrix
// ---------------------------------------------------------------------------

function PermissionsMatrix({
  roles,
  selectedRoleId,
  onRoleChange,
}: {
  roles: Role[];
  selectedRoleId: string;
  onRoleChange: (id: string) => void;
}) {
  const role = roles.find((r) => r.id === selectedRoleId) ?? roles[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">Permission Matrix</h3>
          <p className="text-xs text-muted-foreground">
            View permissions for each role across all modules.
          </p>
        </div>
        <Select
          value={selectedRoleId}
          onValueChange={(v) => v && onRoleChange(v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-foreground">
                    Module
                  </th>
                  {permissionActions.map((action) => (
                    <th
                      key={action}
                      className="px-4 py-3 text-center font-medium capitalize text-foreground"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, idx) => {
                  const perms = role.permissions[mod] ?? [];
                  return (
                    <tr
                      key={mod}
                      className={cn(
                        'border-b last:border-b-0 transition-colors',
                        idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{mod}</td>
                      {permissionActions.map((action) => {
                        const hasPermission = perms.includes(action);
                        return (
                          <td key={action} className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={hasPermission}
                                aria-label={`${mod} ${action} permission`}
                                className={cn(
                                  'transition-opacity',
                                  !hasPermission && 'opacity-40'
                                )}
                                disabled
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <div className="size-3 rounded border border-primary bg-primary" />
          Granted
        </span>
        <span className="flex items-center gap-1.5">
          <div className="size-3 rounded border border-input opacity-40" />
          Not granted
        </span>
        <span className="ml-auto">
          Total permissions:{' '}
          <strong className="text-foreground">
            {Object.values(role.permissions).flat().length}
          </strong>{' '}
          / {modules.length * permissionActions.length}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role detail dialog
// ---------------------------------------------------------------------------

function RoleDetailDialog({
  role,
  open,
  onOpenChange,
}: {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <RoleIcon icon={role.icon} />
            </div>
            <div>
              <DialogTitle>{role.name}</DialogTitle>
              <DialogDescription>{role.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-muted-foreground" />
            <span>
              <strong>{role.userCount}</strong> users assigned
            </span>
            {role.isSystem && (
              <Badge variant="secondary" className="ml-auto text-[10px]">
                System Role
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Permissions by Module</h4>
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border p-3">
              {modules.map((mod) => {
                const perms = role.permissions[mod] ?? [];
                if (perms.length === 0) return null;
                return (
                  <div key={mod} className="flex items-start gap-2">
                    <span className="shrink-0 text-sm font-medium w-24">
                      {mod}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {perms.map((p) => (
                        <Badge
                          key={p}
                          variant="secondary"
                          className="text-[10px] capitalize"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogBody>

        <DialogFooter showCloseButton>
          <Button variant="outline" className="gap-1.5">
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Create Role dialog
// ---------------------------------------------------------------------------

const defaultCreateRoleForm = {
  name: '',
  description: '',
  copyFrom: '',
};

function CreateRoleDialog({
  open,
  onOpenChange,
  roles,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
}) {
  const [form, setForm] = useState(defaultCreateRoleForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setForm(defaultCreateRoleForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    toast.success(`Role "${form.name}" created successfully`);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new role with permissions. You can optionally copy
            permissions from an existing role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Role Name" required htmlFor="role-name">
              <Input
                id="role-name"
                placeholder="e.g. Content Manager"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="role-description">
              <Textarea
                id="role-description"
                placeholder="Brief description of this role's responsibilities..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Copy Permissions From"
              description="Optionally start with permissions from an existing role. You can edit them later."
              htmlFor="role-copy-from"
            >
              <Select
                value={form.copyFrom}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, copyFrom: v }))
                }
              >
                <SelectTrigger id="role-copy-from">
                  <SelectValue placeholder="None (start from scratch)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (start from scratch)</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
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
            <Button type="submit" disabled={isSubmitting || !form.name.trim()}>
              {isSubmitting && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Role
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

export default function RolesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roles] = useState<Role[]>(mockRoles);
  const [detailRole, setDetailRole] = useState<Role | null>(null);
  const [matrixRoleId, setMatrixRoleId] = useState('role-2');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage access control roles and their permission levels."
      >
        <Button className="gap-1.5" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Create Role
        </Button>
      </PageHeader>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="matrix">Permissions Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <RoleCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onViewDetails={setDetailRole}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matrix">
          {isLoading ? (
            <MatrixSkeleton />
          ) : (
            <PermissionsMatrix
              roles={roles}
              selectedRoleId={matrixRoleId}
              onRoleChange={setMatrixRoleId}
            />
          )}
        </TabsContent>
      </Tabs>

      <RoleDetailDialog
        role={detailRole}
        open={!!detailRole}
        onOpenChange={(open) => {
          if (!open) setDetailRole(null);
        }}
      />

      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        roles={roles}
      />
    </div>
  );
}
