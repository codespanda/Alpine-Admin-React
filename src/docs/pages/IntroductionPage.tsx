import { Link } from 'react-router-dom';
import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import {
  Users,
  LayoutDashboard,
  CalendarCheck,
  DollarSign,
  BarChart3,
  Palette,
  Shield,
  Zap,
  ExternalLink,
} from 'lucide-react';

const BASE = 'https://codespanda.github.io/Alpine-Admin-React';

const features = [
  { icon: LayoutDashboard, label: 'Dashboard', desc: 'KPIs, charts, activity', href: `${BASE}/dashboard` },
  { icon: Users, label: 'Employees', desc: 'Profiles, CRUD, details', href: `${BASE}/employees` },
  { icon: CalendarCheck, label: 'Attendance', desc: 'Tracking & timesheets', href: `${BASE}/attendance` },
  { icon: DollarSign, label: 'Payroll', desc: 'Salaries & pay runs', href: `${BASE}/payroll` },
  { icon: BarChart3, label: 'Reports', desc: 'HR analytics & exports', href: `${BASE}/reports` },
  { icon: Palette, label: 'Theming', desc: 'Light / dark, CSS vars', href: `${BASE}/components` },
  { icon: Shield, label: 'Auth Pages', desc: 'Login, register, reset', href: `${BASE}/login` },
  { icon: Zap, label: 'Fast & Typed', desc: 'React 19 + Vite + TS', href: `${BASE}/dashboard` },
];

export function IntroductionPage() {
  return (
    <div>
      <H1>Alpine Admin</H1>
      <Lead>
        A production-ready HR admin dashboard template built with React 19, Vite 6, Tailwind CSS
        v4, and shadcn/ui components.
      </Lead>

      {/* Live demo banner */}
      <div className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Live Demo</p>
          <p className="text-xs text-muted-foreground">Deployed on GitHub Pages</p>
        </div>
        <a
          href={BASE}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open App
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <Callout type="tip">
        New here? Jump to{' '}
        <Link to="/docs/getting-started" className="font-medium underline underline-offset-2">
          Getting Started
        </Link>{' '}
        to have the app running in under two minutes.
      </Callout>

      <H2>What is Alpine Admin?</H2>
      <P>
        Alpine Admin is a feature-complete HR & employee management dashboard starter. It ships
        with 40+ pages covering the full employee lifecycle — from onboarding through payroll,
        performance, and offboarding — so you can focus on business logic instead of rebuilding
        common HR UI from scratch.
      </P>

      <H2>Features at a Glance</H2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {features.map(({ icon: Icon, label, desc, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-1.5 rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">{desc}</span>
          </a>
        ))}
      </div>

      <H2>Tech Stack</H2>
      <UL>
        <LI><strong>React 19</strong> — latest React with concurrent features</LI>
        <LI><strong>Vite 6</strong> — instant HMR, fast production builds</LI>
        <LI><strong>TypeScript</strong> — end-to-end type safety</LI>
        <LI><strong>Tailwind CSS v4</strong> — utility-first styling</LI>
        <LI><strong>shadcn/ui</strong> — accessible, unstyled component primitives</LI>
        <LI><strong>React Router v7</strong> — client-side routing</LI>
        <LI><strong>Zustand</strong> — lightweight global state (auth, sidebar)</LI>
        <LI><strong>React Hook Form + Zod</strong> — form management & validation</LI>
        <LI><strong>TanStack Table</strong> — sortable, paginated data tables</LI>
        <LI><strong>Recharts</strong> — composable charting</LI>
        <LI><strong>next-themes</strong> — light/dark mode with system preference</LI>
        <LI><strong>Lucide React</strong> — icon library</LI>
      </UL>

      <H2>Project Goals</H2>
      <H3>HR-focused, domain-complete</H3>
      <P>
        Alpine Admin covers the full employee lifecycle out of the box: onboarding, attendance,
        leaves, payroll, performance reviews, training, surveys, offboarding. Each domain is a
        self-contained feature module.
      </P>
      <H3>Mock-data driven</H3>
      <P>
        All pages work with mock data returned from <Code>src/services/</Code>. Replacing mock
        responses with real API calls is a single-file change per domain.
      </P>
      <H3>Standalone documentation</H3>
      <P>
        These docs live in <Code>src/docs/</Code> and are completely self-contained. Delete the
        folder and nothing else in the app breaks.
      </P>
    </div>
  );
}
