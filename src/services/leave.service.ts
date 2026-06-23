import type {
  LeaveRequest,
  LeaveBalance,
  LeaveStatus,
  CreateLeaveRequest,
  ApiResponse,
} from '@/types';

import {
  mockLeaveRequests,
  mockLeaveBalances,
} from '@/constants/mock-data';

// ============================================================================
// Helpers
// ============================================================================

function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 500) + 300;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// ============================================================================
// Query Params
// ============================================================================

export interface GetLeaveRequestsParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  status?: LeaveStatus;
  type?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Mutable Mock Store (in-memory)
// ============================================================================

let leaveRequests: LeaveRequest[] = [...mockLeaveRequests];

// ============================================================================
// Leave Service
// ============================================================================

export const leaveService = {
  /**
   * Get leave requests with optional filtering.
   */
  async getLeaveRequests(
    params: GetLeaveRequestsParams = {},
  ): Promise<ApiResponse<LeaveRequest[]>> {
    await delay(500);

    const { employeeId, status, type, startDate, endDate } = params;

    let filtered = [...leaveRequests];

    if (employeeId) {
      filtered = filtered.filter((r) => r.employeeId === employeeId);
    }

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (type) {
      filtered = filtered.filter((r) => r.type === type);
    }

    if (startDate) {
      filtered = filtered.filter((r) => r.startDate >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((r) => r.endDate <= endDate);
    }

    // Sort by newest first
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      success: true,
      message: 'Leave requests retrieved successfully',
      data: filtered,
    };
  },

  /**
   * Get leave balances for a specific employee.
   */
  async getLeaveBalances(
    employeeId: string,
  ): Promise<ApiResponse<LeaveBalance[]>> {
    await delay(400);

    // In production this would be computed per-employee.
    void employeeId;

    return {
      success: true,
      message: 'Leave balances retrieved successfully',
      data: [...mockLeaveBalances],
    };
  },

  /**
   * Create a new leave request.
   */
  async createLeaveRequest(
    data: CreateLeaveRequest & { employeeId: string; employeeName: string },
  ): Promise<ApiResponse<LeaveRequest>> {
    await delay(600);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const now = new Date().toISOString();

    const newRequest: LeaveRequest = {
      id: `leave-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      approvedBy: undefined,
      createdAt: now,
      updatedAt: now,
    };

    leaveRequests = [...leaveRequests, newRequest];

    return {
      success: true,
      message: 'Leave request submitted successfully',
      data: newRequest,
    };
  },

  /**
   * Update the status of a leave request (approve, reject, cancel).
   */
  async updateLeaveStatus(
    id: string,
    status: LeaveStatus,
    approvedBy?: string,
  ): Promise<ApiResponse<LeaveRequest>> {
    await delay(500);

    const index = leaveRequests.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Leave request with ID "${id}" not found`);
    }

    const current = leaveRequests[index];

    // Validate status transitions
    if (current.status !== 'pending' && status !== 'cancelled') {
      throw new Error(
        `Cannot change status from "${current.status}" to "${status}"`,
      );
    }

    if (status === 'cancelled' && current.status === 'rejected') {
      throw new Error('Cannot cancel a rejected leave request');
    }

    const updatedRequest: LeaveRequest = {
      ...current,
      status,
      approvedBy: approvedBy ?? current.approvedBy,
      updatedAt: new Date().toISOString(),
    };

    leaveRequests = leaveRequests.map((r) =>
      r.id === id ? updatedRequest : r,
    );

    return {
      success: true,
      message: `Leave request ${status} successfully`,
      data: updatedRequest,
    };
  },
};
