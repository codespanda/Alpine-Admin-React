import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

export function ArchitecturePage() {
  return (
    <div>
      <H1>Architecture</H1>
      <Lead>How the project is structured and why.</Lead>

      <H2>Directory Strategy</H2>
      <P>
        Alpine Admin follows a <strong>Next.js-inspired folder convention</strong> inside{' '}
        <Code>src/app/</Code> for pages, combined with a <strong>feature-first</strong> approach
        in <Code>src/features/</Code> for domain logic.
      </P>

      <H3>src/app/</H3>
      <P>
        All route-level page components live here, mirroring the URL structure with{' '}
        <Code>(admin)</Code> and <Code>(auth)</Code> layout groups.
      </P>
      <CodeBlock lang="bash" code={`src/app/
├── (admin)/
│   ├── dashboard/page.tsx
│   ├── employees/
│   │   ├── page.tsx          # /employees list
│   │   ├── new/page.tsx      # /employees/new
│   │   ├── [id]/page.tsx     # /employees/:id detail
│   │   └── [id]/edit/page.tsx
│   ├── attendance/page.tsx
│   ├── leaves/page.tsx
│   ├── payroll/page.tsx
│   └── …(30+ more)
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── …
└── not-found.tsx`} />

      <H3>src/features/</H3>
      <P>
        Domain-specific components, columns definitions, and schemas are co-located by feature.
        Only the features with significant logic have their own folder.
      </P>
      <CodeBlock lang="bash" code={`src/features/
├── auth/          # AuthCard, schemas, social buttons
├── dashboard/     # KPI cards, charts, activity feed
├── employees/     # EmployeeForm, columns, employee card
├── departments/   # DepartmentForm, columns
├── attendance/    # AttendanceTable, status chips
└── leaves/        # LeaveForm, leave calendar`} />

      <H2>Routing</H2>
      <P>
        React Router v7 is configured in <Code>src/App.tsx</Code>. There are three layout groups:
      </P>
      <UL>
        <LI><Code>/</Code> and <Code>/docs/*</Code> — standalone docs (no AdminLayout)</LI>
        <LI><Code>/login</Code>, <Code>/register</Code>, … — wrapped in <Code>AuthLayout</Code></LI>
        <LI>All other routes — wrapped in <Code>AdminLayout</Code> (sidebar + header)</LI>
      </UL>

      <H2>Data Flow</H2>
      <CodeBlock lang="bash" code={`Page component (src/app/(admin)/employees/page.tsx)
  └─ calls service fn   (src/services/employee.service.ts)
       └─ returns mock data  ←  swap for real API here
  └─ passes data to feature component
       └─ feature component handles display + local state`} />

      <Callout type="info">
        There is no server-state cache (React Query, SWR) by default. Add one if you need
        caching, background refetching, or optimistic updates.
      </Callout>

      <H2>State Management</H2>
      <P>
        Global state uses <strong>Zustand</strong>. Stores are small and domain-specific:
      </P>
      <UL>
        <LI><Code>src/stores/auth-store.ts</Code> — current user, session, login/logout actions</LI>
        <LI><Code>src/stores/sidebar-store.ts</Code> — sidebar open/collapsed state</LI>
      </UL>

      <H2>Path Aliases</H2>
      <P>
        The <Code>@/</Code> alias maps to <Code>src/</Code>. It is configured in both{' '}
        <Code>vite.config.ts</Code> and <Code>tsconfig.json</Code>.
      </P>
    </div>
  );
}
