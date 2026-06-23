export interface StatCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  newHires: number;
  attendanceRate: number;
  payrollStatus: string;
}
