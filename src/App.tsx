import { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// ─── DOCS (optional, self-contained — safe to delete) ──────────────
// Template documentation. To remove: delete `src/docs` and this block
// plus the <Route path="/docs"> line below.
const DocsPage = lazy(() => import('@/docs/DocsPage'));
// ───────────────────────────────────────────────────────────────────

import { AdminLayout } from '@/components/layouts/admin-layout';
import { AuthLayout } from '@/components/layouts/auth-layout';

// Admin pages
import AnnouncementsPage from '@/app/(admin)/announcements/page';
import AttendancePage from '@/app/(admin)/attendance/page';
import AuditLogPage from '@/app/(admin)/audit-log/page';
import AwardsPage from '@/app/(admin)/awards/page';
import ChartsPage from '@/app/(admin)/charts/page';
import ComponentsPage from '@/app/(admin)/components/page';
import DashboardPage from '@/app/(admin)/dashboard/page';
import DepartmentsPage from '@/app/(admin)/departments/page';
import DesignationsPage from '@/app/(admin)/designations/page';
import DocumentsPage from '@/app/(admin)/documents/page';
import EmployeesPage from '@/app/(admin)/employees/page';
import NewEmployeePage from '@/app/(admin)/employees/new/page';
import EmployeeDetailPage from '@/app/(admin)/employees/[id]/page';
import EditEmployeePage from '@/app/(admin)/employees/[id]/edit/page';
import FormsPage from '@/app/(admin)/forms/page';
import HolidaysPage from '@/app/(admin)/holidays/page';
import LeavesPage from '@/app/(admin)/leaves/page';
import NotificationsPage from '@/app/(admin)/notifications/page';
import OffboardingPage from '@/app/(admin)/offboarding/page';
import OnboardingPage from '@/app/(admin)/onboarding/page';
import PayrollPage from '@/app/(admin)/payroll/page';
import PerformancePage from '@/app/(admin)/performance/page';
import PoliciesPage from '@/app/(admin)/policies/page';
import ReportsPage from '@/app/(admin)/reports/page';
import RolesPage from '@/app/(admin)/roles/page';
import SettingsPage from '@/app/(admin)/settings/page';
import ShiftsPage from '@/app/(admin)/shifts/page';
import SurveysPage from '@/app/(admin)/surveys/page';
import TeamsPage from '@/app/(admin)/teams/page';
import TimesheetPage from '@/app/(admin)/timesheet/page';
import TrainingPage from '@/app/(admin)/training/page';

// Auth pages
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';
import LoginPage from '@/app/(auth)/login/page';
import RegisterPage from '@/app/(auth)/register/page';
import ResetPasswordPage from '@/app/(auth)/reset-password/page';
import VerifyEmailPage from '@/app/(auth)/verify-email/page';

// Standalone pages
import Error500Page from '@/app/error-500/page';
import NotFoundDemoPage from '@/app/not-found-demo/page';
import NotFound from '@/app/not-found';

export default function App() {
  return (
    <Routes>
      {/* DOCS: landing page serves the template documentation.
          To restore the app default, replace this with:
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="/" element={<Suspense fallback={null}><DocsPage /></Suspense>} />

      {/* Admin */}
      <Route element={<AdminLayout><Outlet /></AdminLayout>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<NewEmployeePage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/offboarding" element={<OffboardingPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/designations" element={<DesignationsPage />} />
        <Route path="/shifts" element={<ShiftsPage />} />
        <Route path="/timesheet" element={<TimesheetPage />} />
        <Route path="/holidays" element={<HolidaysPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/surveys" element={<SurveysPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout><Outlet /></AuthLayout>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* DOCS (optional — delete src/docs folder + this line to remove) */}
      <Route path="/docs" element={<Suspense fallback={null}><DocsPage /></Suspense>} />

      {/* Standalone */}
      <Route path="/error-500" element={<Error500Page />} />
      <Route path="/not-found-demo" element={<NotFoundDemoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
