import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  ApiResponse,
} from '@/types';

import {
  mockAttendanceRecords,
  mockAttendanceSummary,
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

export interface GetAttendanceParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  date?: string;
  status?: AttendanceStatus;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Mark Attendance Data
// ============================================================================

export interface MarkAttendanceData {
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

// ============================================================================
// Mutable Mock Store (in-memory)
// ============================================================================

let records: AttendanceRecord[] = [...mockAttendanceRecords];

// ============================================================================
// Attendance Service
// ============================================================================

export const attendanceService = {
  /**
   * Get attendance records with optional filtering.
   */
  async getAttendanceRecords(
    params: GetAttendanceParams = {},
  ): Promise<ApiResponse<AttendanceRecord[]>> {
    await delay(500);

    const { employeeId, date, status, startDate, endDate } = params;

    let filtered = [...records];

    if (employeeId) {
      filtered = filtered.filter((r) => r.employeeId === employeeId);
    }

    if (date) {
      filtered = filtered.filter((r) => r.date === date);
    }

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (startDate) {
      filtered = filtered.filter((r) => r.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((r) => r.date <= endDate);
    }

    return {
      success: true,
      message: 'Attendance records retrieved successfully',
      data: filtered,
    };
  },

  /**
   * Get attendance summary for a specific employee.
   */
  async getAttendanceSummary(
    employeeId: string,
  ): Promise<ApiResponse<AttendanceSummary>> {
    await delay(400);

    // In production, this would compute the summary from actual records.
    // For now, return mock summary adjusted for the requested employee.
    void employeeId;

    return {
      success: true,
      message: 'Attendance summary retrieved successfully',
      data: { ...mockAttendanceSummary },
    };
  },

  /**
   * Mark attendance for an employee.
   */
  async markAttendance(
    data: MarkAttendanceData,
  ): Promise<ApiResponse<AttendanceRecord>> {
    await delay(500);

    // Check for duplicate attendance on the same date
    const existing = records.find(
      (r) => r.employeeId === data.employeeId && r.date === data.date,
    );

    if (existing) {
      // Update existing record
      const updated: AttendanceRecord = {
        ...existing,
        checkIn: data.checkIn,
        checkOut: data.checkOut ?? existing.checkOut,
        status: data.status,
        workHours: data.checkOut
          ? calculateWorkHours(data.checkIn, data.checkOut)
          : existing.workHours,
        notes: data.notes ?? existing.notes,
      };

      records = records.map((r) => (r.id === existing.id ? updated : r));

      return {
        success: true,
        message: 'Attendance updated successfully',
        data: updated,
      };
    }

    // Create new record
    const newRecord: AttendanceRecord = {
      id: `att-${String(records.length + 1).padStart(3, '0')}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut ?? null,
      status: data.status,
      workHours: data.checkOut
        ? calculateWorkHours(data.checkIn, data.checkOut)
        : null,
      notes: data.notes,
    };

    records = [...records, newRecord];

    return {
      success: true,
      message: 'Attendance marked successfully',
      data: newRecord,
    };
  },

  /**
   * Get all attendance records for a specific date.
   */
  async getDailyAttendance(
    date: string,
  ): Promise<ApiResponse<AttendanceRecord[]>> {
    await delay(400);

    const dailyRecords = records.filter((r) => r.date === date);

    return {
      success: true,
      message: 'Daily attendance retrieved successfully',
      data: dailyRecords,
    };
  },
};

// ============================================================================
// Internal Utility
// ============================================================================

/**
 * Calculate work hours between two time strings (HH:mm format).
 */
function calculateWorkHours(checkIn: string, checkOut: string): number {
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;
  return Math.round(((outMinutes - inMinutes) / 60) * 100) / 100;
}
