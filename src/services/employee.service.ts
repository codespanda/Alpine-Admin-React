import type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

import { mockEmployees } from '@/constants/mock-data';

// ============================================================================
// Helpers
// ============================================================================

function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 500) + 300;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// ============================================================================
// Employee Stats Type (local to service)
// ============================================================================

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  inactiveEmployees: number;
  newHiresThisMonth: number;
  departmentDistribution: Array<{ department: string; count: number }>;
}

// ============================================================================
// Query Params
// ============================================================================

export interface GetEmployeesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Mutable Mock Store (in-memory)
// ============================================================================

let employees: Employee[] = [...mockEmployees];

// ============================================================================
// Employee Service
// ============================================================================

export const employeeService = {
  /**
   * Get a paginated, filterable, and sortable list of employees.
   */
  async getEmployees(
    params: GetEmployeesParams = {},
  ): Promise<PaginatedResponse<Employee>> {
    await delay(500);

    const {
      page = 1,
      pageSize = 10,
      search,
      department,
      status,
      sortBy = 'firstName',
      sortOrder = 'asc',
    } = params;

    let filtered = [...employees];

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(query) ||
          emp.lastName.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query),
      );
    }

    // Department filter
    if (department) {
      filtered = filtered.filter(
        (emp) => emp.department.toLowerCase() === department.toLowerCase(),
      );
    }

    // Status filter
    if (status) {
      filtered = filtered.filter(
        (emp) => emp.status === status,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = String(a[sortBy as keyof Employee] ?? '');
      const bVal = String(b[sortBy as keyof Employee] ?? '');
      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      success: true,
      message: 'Employees retrieved successfully',
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get a single employee by ID.
   */
  async getEmployee(id: string): Promise<ApiResponse<Employee>> {
    await delay(400);

    const employee = employees.find((emp) => emp.id === id);

    if (!employee) {
      throw new Error(`Employee with ID "${id}" not found`);
    }

    return {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
  },

  /**
   * Create a new employee.
   */
  async createEmployee(
    data: CreateEmployeeData,
  ): Promise<ApiResponse<Employee>> {
    await delay(600);

    const newId = `emp-${String(employees.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newEmployee: Employee = {
      id: newId,
      employeeId: newId.toUpperCase(),
      ...data,
      departmentId:
        employees.find((e) => e.department === data.department)?.departmentId ??
        `dept-${Date.now()}`,
      avatar: undefined,
      createdAt: now,
      updatedAt: now,
    };

    employees = [...employees, newEmployee];

    return {
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
    };
  },

  /**
   * Update an existing employee.
   */
  async updateEmployee(
    id: string,
    data: UpdateEmployeeData,
  ): Promise<ApiResponse<Employee>> {
    await delay(500);

    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      throw new Error(`Employee with ID "${id}" not found`);
    }

    const updatedEmployee: Employee = {
      ...employees[index],
      ...data,
      address: data.address
        ? { ...employees[index].address, ...data.address }
        : employees[index].address,
      emergencyContact: data.emergencyContact
        ? { ...employees[index].emergencyContact, ...data.emergencyContact }
        : employees[index].emergencyContact,
      updatedAt: new Date().toISOString(),
    };

    employees = employees.map((emp) =>
      emp.id === id ? updatedEmployee : emp,
    );

    return {
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    };
  },

  /**
   * Delete an employee by ID.
   */
  async deleteEmployee(id: string): Promise<ApiResponse<null>> {
    await delay(400);

    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      throw new Error(`Employee with ID "${id}" not found`);
    }

    employees = employees.filter((emp) => emp.id !== id);

    return {
      success: true,
      message: 'Employee deleted successfully',
      data: null,
    };
  },

  /**
   * Get aggregated employee statistics.
   */
  async getEmployeeStats(): Promise<ApiResponse<EmployeeStats>> {
    await delay(300);

    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'on-leave').length;
    const inactive = employees.filter(
      (e) => e.status === 'inactive' || e.status === 'terminated',
    ).length;

    // Count employees who joined this month
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newHires = employees.filter((e) =>
      e.joiningDate.startsWith(thisMonth),
    ).length;

    // Department distribution
    const deptMap = new Map<string, number>();
    for (const emp of employees) {
      deptMap.set(emp.department, (deptMap.get(emp.department) ?? 0) + 1);
    }
    const departmentDistribution = Array.from(deptMap.entries()).map(
      ([department, count]) => ({ department, count }),
    );

    return {
      success: true,
      message: 'Employee stats retrieved successfully',
      data: {
        totalEmployees: employees.length,
        activeEmployees: active,
        onLeaveEmployees: onLeave,
        inactiveEmployees: inactive,
        newHiresThisMonth: newHires,
        departmentDistribution,
      },
    };
  },
};
