import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';

const BASE = 'https://codespanda.github.io/Alpine-Admin-React';

function L({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <a
      href={`${BASE}${path}`}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[13px] text-primary underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  );
}

export function FeaturesPage() {
  return (
    <div>
      <H1>Features & Pages</H1>
      <Lead>A tour of every section in Alpine Admin — 40+ pages covering the full HR lifecycle.</Lead>

      <H2>Dashboard</H2>
      <P>Route: <L path="/dashboard">/dashboard</L></P>
      <UL>
        <LI>KPI stat cards (headcount, new hires, attrition, open positions)</LI>
        <LI>Headcount trend chart, department breakdown</LI>
        <LI>Recent activity feed and upcoming events</LI>
      </UL>

      <H2>Employees</H2>
      <H3>List — <L path="/employees">/employees</L></H3>
      <P>Searchable, filterable employee table with status chips and bulk actions.</P>
      <H3>Create — <L path="/employees/new">/employees/new</L></H3>
      <P>Multi-section employee form (personal info, role, contact) with Zod validation.</P>
      <H3>Detail — <Code>/employees/:id</Code></H3>
      <P>Full employee profile with tabs for overview, documents, attendance, and leave history.</P>
      <H3>Edit — <Code>/employees/:id/edit</Code></H3>
      <P>Pre-populated edit form pulled from the service layer.</P>

      <H2>Organization</H2>
      <UL>
        <LI><L path="/departments">/departments</L> — department list with headcount</LI>
        <LI><L path="/teams">/teams</L> — team structure and membership</LI>
        <LI><L path="/designations">/designations</L> — job title management</LI>
        <LI><L path="/roles">/roles</L> — RBAC role management</LI>
      </UL>

      <H2>Time & Attendance</H2>
      <UL>
        <LI><L path="/attendance">/attendance</L> — daily check-in/out log with filters</LI>
        <LI><L path="/timesheet">/timesheet</L> — weekly timesheet view</LI>
        <LI><L path="/shifts">/shifts</L> — shift scheduling and assignments</LI>
        <LI><L path="/holidays">/holidays</L> — company holiday calendar</LI>
        <LI><L path="/leaves">/leaves</L> — leave requests, approvals, and balances</LI>
      </UL>

      <H2>Payroll</H2>
      <P>Route: <L path="/payroll">/payroll</L></P>
      <UL>
        <LI>Payslip generation and salary breakdown</LI>
        <LI>Pay run management with deduction tracking</LI>
      </UL>

      <H2>Performance</H2>
      <P>Route: <L path="/performance">/performance</L></P>
      <UL>
        <LI>Performance review cycles and rating summaries</LI>
        <LI>Goal tracking per employee</LI>
      </UL>

      <H2>Employee Lifecycle</H2>
      <UL>
        <LI><L path="/onboarding">/onboarding</L> — onboarding tasks and progress tracker</LI>
        <LI><L path="/offboarding">/offboarding</L> — exit checklist and clearance management</LI>
        <LI><L path="/training">/training</L> — training programs and completion status</LI>
      </UL>

      <H2>Engagement</H2>
      <UL>
        <LI><L path="/announcements">/announcements</L> — company-wide announcements</LI>
        <LI><L path="/surveys">/surveys</L> — employee pulse surveys</LI>
        <LI><L path="/awards">/awards</L> — recognition and awards management</LI>
      </UL>

      <H2>Operations</H2>
      <UL>
        <LI><L path="/documents">/documents</L> — company document library</LI>
        <LI><L path="/policies">/policies</L> — HR policy management</LI>
        <LI><L path="/reports">/reports</L> — HR analytics and exportable reports</LI>
        <LI><L path="/audit-log">/audit-log</L> — admin action audit trail</LI>
      </UL>

      <H2>Settings & Admin</H2>
      <UL>
        <LI><L path="/settings">/settings</L> — company info, timezone, preferences</LI>
        <LI><L path="/notifications">/notifications</L> — notification center</LI>
      </UL>

      <H2>Resources (Dev Utilities)</H2>
      <UL>
        <LI><L path="/components">/components</L> — full component showcase</LI>
        <LI><L path="/forms">/forms</L> — form element examples</LI>
        <LI><L path="/charts">/charts</L> — chart type gallery</LI>
      </UL>

      <H2>Error Pages</H2>
      <UL>
        <LI><L path="/not-found-demo">/not-found-demo</L> — 404 page preview</LI>
        <LI><L path="/error-500">/error-500</L> — 500 server error page preview</LI>
      </UL>

      <Callout type="info">
        All pages run on mock data from <Code>src/services/</Code>. Replace the service
        implementations to connect to a real backend.
      </Callout>
    </div>
  );
}
