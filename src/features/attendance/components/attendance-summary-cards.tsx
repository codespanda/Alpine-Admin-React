'use client';

import { StatCard } from '@/components/shared/stat-card';
import { UserCheck, UserX, Clock, BarChart3 } from 'lucide-react';
import type { AttendanceRecord } from '@/types';

interface AttendanceSummaryCardsProps {
  records: AttendanceRecord[];
}

function AttendanceSummaryCards({ records }: AttendanceSummaryCardsProps) {
  const presentCount = records.filter(
    (r) => r.status === 'present' || r.status === 'half-day'
  ).length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const totalActive = records.length;
  const attendanceRate =
    totalActive > 0
      ? (((presentCount + lateCount) / totalActive) * 100).toFixed(1)
      : '0';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Present"
        value={presentCount}
        change={5.2}
        changeLabel="from yesterday"
        icon={UserCheck}
        trend="up"
      />
      <StatCard
        title="Total Absent"
        value={absentCount}
        change={2.1}
        changeLabel="from yesterday"
        icon={UserX}
        trend="down"
      />
      <StatCard
        title="Late Arrivals"
        value={lateCount}
        change={1.5}
        changeLabel="from yesterday"
        icon={Clock}
        trend="up"
      />
      <StatCard
        title="Attendance Rate"
        value={`${attendanceRate}%`}
        change={1.8}
        changeLabel="from last week"
        icon={BarChart3}
        trend="up"
      />
    </div>
  );
}

export { AttendanceSummaryCards, type AttendanceSummaryCardsProps };
