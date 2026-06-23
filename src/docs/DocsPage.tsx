/*
 * Alpine Admin — Template documentation
 * ==================================================================
 * This whole folder (`src/docs`) is INDEPENDENT and SELF-CONTAINED.
 * It imports nothing from the rest of the app (only React, the icon
 * package and its own files), and nothing in the app imports from it
 * (except one clearly-marked route block in App.tsx).
 *
 * To remove the docs from your project:
 *   1. delete the `src/docs` folder
 *   2. remove the DOCS block + <Route path="/docs"> line in src/App.tsx
 *
 * Served at the site root (/) and at /docs.
 */
import { useEffect, useState } from 'react';
import {
  Mountain,
  BookOpen,
  Sun,
  Moon,
  Rocket,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Zap,
  Palette,
  Compass,
  ChartColumn,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import './docs.css';

const NAV = [
  {
    group: 'Getting started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'scripts', label: 'Scripts' },
      { id: 'deploy', label: 'Deploy to GitHub Pages' },
    ],
  },
  {
    group: 'Build with it',
    items: [
      { id: 'structure', label: 'Project structure' },
      { id: 'components', label: 'Using components' },
      { id: 'forms', label: 'Forms & validation' },
      { id: 'data-table', label: 'Data tables' },
      { id: 'theming', label: 'Theming & dark mode' },
    ],
  },
  {
    group: 'Housekeeping',
    items: [{ id: 'remove-docs', label: 'Removing these docs' }],
  },
];

function useDocsTheme(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('alpine-docs-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    localStorage.setItem('alpine-docs-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export default function DocsPage() {
  const [dark, toggleTheme] = useDocsTheme();
  const allIds = NAV.flatMap((g) => g.items.map((i) => i.id));
  const active = useActiveSection(allIds);

  // Respect the Vite base path so it works in dev ("/dashboard") and on
  // GitHub Pages ("/Alpine-Admin-React/dashboard").
  const dashboardHref = `${import.meta.env.BASE_URL}dashboard`.replace(/\/{2,}/g, '/');

  return (
    <div className={`alpine-docs${dark ? ' dark' : ''}`}>
      <div className="alpine-docs__shell">
        {/* ---- Sidebar ------------------------------------------ */}
        <aside className="alpine-docs__sidebar">
          <div className="alpine-docs__brand">
            <span className="alpine-docs__brand-mark">
              <Mountain size={17} />
            </span>
            Alpine Admin
          </div>
          <div className="alpine-docs__brand-sub">Documentation</div>
          <nav className="alpine-docs__nav">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="alpine-docs__nav-group-title">{g.group}</div>
                {g.items.map((i) => (
                  <a
                    key={i.id}
                    href={`#${i.id}`}
                    className={active === i.id ? 'is-active' : ''}
                  >
                    {i.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* ---- Main --------------------------------------------- */}
        <main className="alpine-docs__main">
          <div className="alpine-docs__topbar">
            <span className="alpine-docs__pill">v0.1 · React + Vite template</span>
            <div className="alpine-docs__actions">
              <button className="alpine-docs__btn" onClick={toggleTheme} type="button">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                {dark ? 'Light' : 'Dark'}
              </button>
              <a
                className="alpine-docs__btn alpine-docs__btn--primary"
                href={dashboardHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Dashboard
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Hero */}
          <header className="alpine-docs__hero">
            <span className="alpine-docs__pill">
              <BookOpen size={14} />
              Template docs
            </span>
            <h1>
              Build your admin in <span className="grad">minutes</span>, not weeks.
            </h1>
            <p>
              Everything you need to install <strong>Alpine Admin</strong> and ship with its
              component library — a modern employee-management dashboard built on React 19, Vite,
              Tailwind v4 and shadcn/ui.
            </p>
            <div className="alpine-docs__hero-cta">
              <a
                className="alpine-docs__btn alpine-docs__btn--primary"
                href={dashboardHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rocket size={16} />
                Open the live dashboard
                <ArrowUpRight size={16} />
              </a>
              <a className="alpine-docs__btn" href="#quick-start">
                Read the quick start
                <ArrowRight size={16} />
              </a>
            </div>
          </header>

          {/* Overview */}
          <section id="overview" className="alpine-docs__section">
            <h2>Overview</h2>
            <p className="alpine-docs__lead">
              A production-ready admin starter with 40+ pages, a reusable component kit, charts,
              data tables, forms and authentication screens — fully responsive with dark mode.
            </p>
            <div className="alpine-docs__grid">
              <div className="alpine-docs__card">
                <span className="alpine-docs__card-icon"><Zap size={20} /></span>
                <h4>React 19 + Vite 6</h4>
                <p>Instant HMR in dev and a tiny, fast production build.</p>
              </div>
              <div className="alpine-docs__card">
                <span className="alpine-docs__card-icon"><Palette size={20} /></span>
                <h4>Tailwind v4 + shadcn/ui</h4>
                <p>Accessible, themeable components you actually own.</p>
              </div>
              <div className="alpine-docs__card">
                <span className="alpine-docs__card-icon"><Compass size={20} /></span>
                <h4>react-router-dom</h4>
                <p>Clean route table in <code>src/App.tsx</code> — easy to extend.</p>
              </div>
              <div className="alpine-docs__card">
                <span className="alpine-docs__card-icon"><ChartColumn size={20} /></span>
                <h4>Tables &amp; charts</h4>
                <p>TanStack Table + Recharts wired up and ready to use.</p>
              </div>
            </div>
          </section>

          {/* Quick start */}
          <section id="quick-start" className="alpine-docs__section">
            <h2>Quick start</h2>
            <p className="alpine-docs__lead">
              You&apos;ll need <strong>Node 18+</strong> (Node 20 or 22 recommended) and npm.
            </p>
            <ol className="alpine-docs__steps">
              <li>
                <span className="alpine-docs__step-title">Get the code</span>
                Clone the repository (or download it as a ZIP).
                <CodeBlock
                  lang="bash"
                  code={`git clone https://github.com/codespanda/Alpine-Admin-React.git
cd Alpine-Admin-React`}
                />
              </li>
              <li>
                <span className="alpine-docs__step-title">Install dependencies</span>
                <CodeBlock lang="bash" code={`npm install`} />
              </li>
              <li>
                <span className="alpine-docs__step-title">Start the dev server</span>
                Vite serves the app at <code>http://localhost:5173</code> with hot reload.
                <CodeBlock lang="bash" code={`npm run dev`} />
              </li>
            </ol>
            <div className="alpine-docs__callout">
              <span className="alpine-docs__callout-icon"><Lightbulb size={18} /></span>
              <p>
                The <code>@</code> alias points to <code>src/</code>, so imports look like{' '}
                <code>import {'{ Button }'} from &apos;@/components/ui/button&apos;</code>.
              </p>
            </div>
          </section>

          {/* Scripts */}
          <section id="scripts" className="alpine-docs__section">
            <h2>Scripts</h2>
            <table className="alpine-docs__table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>npm run dev</code></td>
                  <td>Start the Vite dev server with HMR.</td>
                </tr>
                <tr>
                  <td><code>npm run build</code></td>
                  <td>Type-check (<code>tsc -b</code>) and build to <code>dist/</code>.</td>
                </tr>
                <tr>
                  <td><code>npm run preview</code></td>
                  <td>Serve the production build locally.</td>
                </tr>
                <tr>
                  <td><code>npm run lint</code></td>
                  <td>Run ESLint across the project.</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Deploy */}
          <section id="deploy" className="alpine-docs__section">
            <h2>Deploy to GitHub Pages</h2>
            <p className="alpine-docs__lead">
              The template ships with a GitHub Actions workflow that builds and deploys on every
              push to <code>main</code>.
            </p>
            <ol className="alpine-docs__steps">
              <li>
                <span className="alpine-docs__step-title">Set the base path</span>
                In <code>vite.config.ts</code>, set <code>base</code> to your repository name so
                assets resolve under the sub-path.
                <CodeBlock
                  lang="ts"
                  code={`// vite.config.ts
base: command === 'build' ? '/Your-Repo-Name/' : '/',`}
                />
              </li>
              <li>
                <span className="alpine-docs__step-title">Enable Pages</span>
                In your repo: <strong>Settings → Pages → Source → GitHub Actions</strong>.
              </li>
              <li>
                <span className="alpine-docs__step-title">Push</span>
                The workflow in <code>.github/workflows/deploy.yml</code> handles the rest.
                <CodeBlock lang="bash" code={`git push origin main`} />
              </li>
            </ol>
            <div className="alpine-docs__callout">
              <span className="alpine-docs__callout-icon"><Compass size={18} /></span>
              <p>
                Because routing uses <code>BrowserRouter</code>, the workflow copies{' '}
                <code>index.html</code> to <code>404.html</code> so deep links and refreshes work
                on Pages.
              </p>
            </div>
          </section>

          {/* Structure */}
          <section id="structure" className="alpine-docs__section">
            <h2>Project structure</h2>
            <p className="alpine-docs__lead">A quick map of where things live.</p>
            <div
              className="alpine-docs__tree"
              dangerouslySetInnerHTML={{
                __html: `src/
├─ App.tsx              <span class="c"># route table</span>
├─ main.tsx             <span class="c"># app entry (BrowserRouter)</span>
├─ app/                 <span class="c"># page components (admin + auth)</span>
├─ components/
│  ├─ ui/               <span class="c"># shadcn primitives (Button, Card…)</span>
│  ├─ shared/           <span class="c"># StatCard, PageHeader, EmptyState…</span>
│  ├─ data-table/       <span class="c"># reusable DataTable</span>
│  ├─ charts/           <span class="c"># Recharts wrappers</span>
│  └─ layouts/          <span class="c"># AdminLayout, Sidebar, Header</span>
├─ features/            <span class="c"># feature modules (employees, leaves…)</span>
├─ hooks/               <span class="c"># useDebounce, useMediaQuery…</span>
├─ lib/                 <span class="c"># utils, router shim, validations</span>
├─ services/            <span class="c"># API client + service layer</span>
├─ stores/              <span class="c"># Zustand stores</span>
├─ types/               <span class="c"># shared TypeScript types</span>
└─ docs/                <span class="c"># this documentation (deletable)</span>`,
              }}
            />
          </section>

          {/* Components */}
          <section id="components" className="alpine-docs__section">
            <h2>Using components</h2>
            <p className="alpine-docs__lead">
              Components live under <code>src/components</code>. Import what you need and compose.
              Here are the building blocks you&apos;ll reach for most.
            </p>

            <h3>Buttons</h3>
            <CodeBlock
              lang="tsx"
              code={`import { Button } from '@/components/ui/button';

<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="sm">Ghost</Button>`}
            />

            <h3>Cards</h3>
            <CodeBlock
              lang="tsx"
              code={`import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Team summary</CardTitle>
  </CardHeader>
  <CardContent>42 employees across 6 departments.</CardContent>
</Card>`}
            />

            <h3>Stat cards</h3>
            <p>
              A shared dashboard widget from <code>@/components/shared</code>.
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { StatCard } from '@/components/shared';
import { Users } from 'lucide-react';

<StatCard
  title="Total employees"
  value="1,284"
  icon={Users}
  trend={{ value: 12, isPositive: true }}
/>`}
            />

            <h3>Status badges &amp; dialogs</h3>
            <CodeBlock
              lang="tsx"
              code={`import { StatusBadge } from '@/components/shared';
import { ConfirmDialog } from '@/components/shared';

<StatusBadge status="active" />

<ConfirmDialog
  title="Delete employee?"
  description="This action cannot be undone."
  onConfirm={() => remove(id)}
/>`}
            />
          </section>

          {/* Forms */}
          <section id="forms" className="alpine-docs__section">
            <h2>Forms &amp; validation</h2>
            <p className="alpine-docs__lead">
              Forms use <strong>react-hook-form</strong> + <strong>Zod</strong>. Define a schema,
              infer the type, and wire it up.
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

function EmployeeForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Input placeholder="Name" {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
      <Input placeholder="Email" {...register('email')} />
      <Button type="submit">Save</Button>
    </form>
  );
}`}
            />
          </section>

          {/* Data table */}
          <section id="data-table" className="alpine-docs__section">
            <h2>Data tables</h2>
            <p className="alpine-docs__lead">
              The reusable <code>DataTable</code> wraps TanStack Table with sorting, pagination and
              a toolbar. Pass your <code>columns</code> and <code>data</code>.
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';

type Employee = { id: string; name: string; role: string };

const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

<DataTable columns={columns} data={employees} />`}
            />
            <div className="alpine-docs__callout">
              <span className="alpine-docs__callout-icon"><ChartColumn size={18} /></span>
              <p>
                Need charts instead? Import wrappers from <code>@/components/charts</code> — e.g.{' '}
                <code>BarChart</code>, <code>LineChart</code>, <code>PieChart</code>.
              </p>
            </div>
          </section>

          {/* Theming */}
          <section id="theming" className="alpine-docs__section">
            <h2>Theming &amp; dark mode</h2>
            <p className="alpine-docs__lead">
              Theming uses <strong>next-themes</strong> with Tailwind&apos;s <code>dark</code>{' '}
              class. Colors are CSS variables defined in <code>src/app/globals.css</code>.
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}`}
            />
            <p>
              To recolor the app, edit the HSL CSS variables (e.g. <code>--primary</code>,{' '}
              <code>--background</code>) under <code>:root</code> and <code>.dark</code> in{' '}
              <code>globals.css</code>.
            </p>
          </section>

          {/* Remove docs */}
          <section id="remove-docs" className="alpine-docs__section">
            <h2>Removing these docs</h2>
            <p className="alpine-docs__lead">
              This documentation is intentionally isolated — it imports nothing from your app, and
              nothing in your app imports from it. Removing it is a 2-step job:
            </p>
            <ol className="alpine-docs__steps">
              <li>
                <span className="alpine-docs__step-title">Delete the folder</span>
                Remove the entire <code>src/docs</code> directory.
                <CodeBlock lang="bash" code={`rm -rf src/docs`} />
              </li>
              <li>
                <span className="alpine-docs__step-title">Unwire the route</span>
                In <code>src/App.tsx</code>, delete the <code>DocsPage</code> import block and the{' '}
                <code>&lt;Route path=&quot;/docs&quot; …/&gt;</code> line. Both are marked with a{' '}
                <code>DOCS</code> comment.
              </li>
            </ol>
            <div className="alpine-docs__callout alpine-docs__callout--warn">
              <span className="alpine-docs__callout-icon"><TriangleAlert size={18} /></span>
              <p>
                That&apos;s it — no other file references the docs, so the rest of the template
                keeps working untouched.
              </p>
            </div>
          </section>

          <footer className="alpine-docs__footer">
            <span>Alpine Admin · React + Vite template</span>
            <span>
              <a href="#overview" className="alpine-docs__toplink">
                Back to top
                <ArrowUp size={14} />
              </a>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
