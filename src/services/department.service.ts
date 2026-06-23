import type {
  Department,
  CreateDepartmentData,
  UpdateDepartmentData,
  ApiResponse,
} from '@/types';

import { mockDepartments } from '@/constants/mock-data';

// ============================================================================
// Helpers
// ============================================================================

function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 500) + 300;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// ============================================================================
// Mutable Mock Store (in-memory)
// ============================================================================

let departments: Department[] = [...mockDepartments];

// ============================================================================
// Department Service
// ============================================================================

export const departmentService = {
  /**
   * Get all departments.
   */
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    await delay(400);

    return {
      success: true,
      message: 'Departments retrieved successfully',
      data: [...departments],
    };
  },

  /**
   * Get a single department by ID.
   */
  async getDepartment(id: string): Promise<ApiResponse<Department>> {
    await delay(300);

    const department = departments.find((dept) => dept.id === id);

    if (!department) {
      throw new Error(`Department with ID "${id}" not found`);
    }

    return {
      success: true,
      message: 'Department retrieved successfully',
      data: department,
    };
  },

  /**
   * Create a new department.
   */
  async createDepartment(
    data: CreateDepartmentData,
  ): Promise<ApiResponse<Department>> {
    await delay(600);

    const now = new Date().toISOString();

    const newDepartment: Department = {
      id: `dept-${String(departments.length + 1).padStart(3, '0')}`,
      name: data.name,
      description: data.description,
      headOfDepartment: '', // Would be resolved from employee lookup in production
      headOfDepartmentId: data.headOfDepartmentId,
      employeeCount: 0,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    departments = [...departments, newDepartment];

    return {
      success: true,
      message: 'Department created successfully',
      data: newDepartment,
    };
  },

  /**
   * Update an existing department.
   */
  async updateDepartment(
    id: string,
    data: UpdateDepartmentData,
  ): Promise<ApiResponse<Department>> {
    await delay(500);

    const index = departments.findIndex((dept) => dept.id === id);

    if (index === -1) {
      throw new Error(`Department with ID "${id}" not found`);
    }

    const updatedDepartment: Department = {
      ...departments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    departments = departments.map((dept) =>
      dept.id === id ? updatedDepartment : dept,
    );

    return {
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment,
    };
  },

  /**
   * Delete a department by ID.
   */
  async deleteDepartment(id: string): Promise<ApiResponse<null>> {
    await delay(400);

    const index = departments.findIndex((dept) => dept.id === id);

    if (index === -1) {
      throw new Error(`Department with ID "${id}" not found`);
    }

    departments = departments.filter((dept) => dept.id !== id);

    return {
      success: true,
      message: 'Department deleted successfully',
      data: null,
    };
  },
};
