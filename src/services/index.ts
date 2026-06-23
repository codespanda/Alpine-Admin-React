export { apiClient, ApiError } from './api-client';
export { authService } from './auth.service';
export { employeeService } from './employee.service';
export { departmentService } from './department.service';
export { attendanceService } from './attendance.service';
export { leaveService } from './leave.service';

// Re-export service-specific types
export type { EmployeeStats, GetEmployeesParams } from './employee.service';
export type { GetAttendanceParams, MarkAttendanceData } from './attendance.service';
export type { GetLeaveRequestsParams } from './leave.service';
