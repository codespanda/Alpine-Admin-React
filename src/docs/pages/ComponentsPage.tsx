import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

const BASE = 'https://codespanda.github.io/Alpine-Admin-React';

export function ComponentsPage() {
  return (
    <div>
      <H1>Components</H1>
      <Lead>Shared, UI, and feature components — where they live and how to use them.</Lead>

      <H2>Component Layers</H2>
      <UL>
        <LI><strong>UI primitives</strong> — <Code>src/components/ui/</Code> — shadcn/ui wrappers (Button, Input, Badge, Card, Dialog…)</LI>
        <LI><strong>Shared components</strong> — <Code>src/components/shared/</Code> — StatCard, PageHeader, EmptyState, StatusBadge, ConfirmDialog</LI>
        <LI><strong>Data table</strong> — <Code>src/components/data-table/</Code> — TanStack Table wrapper with toolbar</LI>
        <LI><strong>Charts</strong> — <Code>src/components/charts/</Code> — Recharts wrappers (BarChart, LineChart, PieChart…)</LI>
        <LI><strong>Feature components</strong> — <Code>src/features/*/</Code> — domain components (forms, column defs)</LI>
      </UL>

      <H2>UI Primitives</H2>
      <H3>Button</H3>
      <CodeBlock lang="tsx" code={`import { Button } from '@/components/ui/button';

<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button disabled>Disabled</Button>`} />

      <H3>Badge</H3>
      <CodeBlock lang="tsx" code={`import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>`} />

      <H3>Card</H3>
      <CodeBlock lang="tsx" code={`import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Team summary</CardTitle>
  </CardHeader>
  <CardContent>42 employees across 6 departments.</CardContent>
</Card>`} />

      <H2>Shared Components</H2>

      <H3>StatCard</H3>
      <P>KPI card used on the dashboard. Accepts value, label, icon, and trend.</P>
      <CodeBlock lang="tsx" code={`import { StatCard } from '@/components/shared';
import { Users } from 'lucide-react';

<StatCard
  title="Total Employees"
  value="1,284"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
/>`} />

      <H3>PageHeader</H3>
      <CodeBlock lang="tsx" code={`import { PageHeader } from '@/components/shared';

<PageHeader
  title="Employees"
  description="Manage your workforce"
  actions={<Button>Add Employee</Button>}
/>`} />

      <H3>StatusBadge</H3>
      <CodeBlock lang="tsx" code={`import { StatusBadge } from '@/components/shared';

<StatusBadge status="active" />
<StatusBadge status="on-leave" />
<StatusBadge status="terminated" />`} />

      <H3>EmptyState</H3>
      <CodeBlock lang="tsx" code={`import { EmptyState } from '@/components/shared';

<EmptyState
  title="No employees yet"
  description="Add your first employee to get started."
  action={<Button>Add Employee</Button>}
/>`} />

      <H2>Data Table</H2>
      <P>
        The reusable <Code>DataTable</Code> wraps TanStack Table with sorting, pagination, and a
        search toolbar. Pass your column definitions and data.
      </P>
      <CodeBlock lang="tsx" code={`import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';

type Employee = { id: string; name: string; role: string };

const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

<DataTable columns={columns} data={employees} />`} />

      <H2>Charts</H2>
      <CodeBlock lang="tsx" code={`import { BarChart, LineChart, PieChart } from '@/components/charts';

<BarChart
  data={monthlyData}
  xKey="month"
  yKey="headcount"
  title="Headcount by Month"
/>

<LineChart
  data={attritionData}
  xKey="month"
  yKey="rate"
  title="Attrition Rate"
/>`} />

      <Callout type="tip">
        See all components, forms, and charts rendered interactively on the live app:{' '}
        {[
          ['/components', 'Components'],
          ['/forms', 'Forms'],
          ['/charts', 'Charts'],
        ].map(([path, label], i, arr) => (
          <span key={path}>
            <a
              href={`${BASE}${path}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-2"
            >
              {label}
            </a>
            {i < arr.length - 1 && ' · '}
          </span>
        ))}
      </Callout>
    </div>
  );
}
