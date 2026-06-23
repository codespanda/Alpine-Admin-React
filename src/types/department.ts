export type DepartmentStatus = 'active' | 'inactive';

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  headOfDepartmentId: string;
  employeeCount: number;
  status: DepartmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentData {
  name: string;
  description: string;
  headOfDepartmentId: string;
  status: DepartmentStatus;
}

export type UpdateDepartmentData = Partial<CreateDepartmentData>;
