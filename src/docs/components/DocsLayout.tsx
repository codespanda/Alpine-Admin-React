import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Mountain,
  BookOpen,
  Rocket,
  Layers,
  Puzzle,
  Component,
  ShieldCheck,
  Palette,
  Server,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    group: 'Overview',
    links: [
      { label: 'Introduction', href: '/docs/introduction', icon: BookOpen },
      { label: 'Getting Started', href: '/docs/getting-started', icon: Rocket },
    ],
  },
  {
    group: 'Core Concepts',
    links: [
      { label: 'Architecture', href: '/docs/architecture', icon: Layers },
      { label: 'Features & Pages', href: '/docs/features', icon: Puzzle },
      { label: 'Authentication', href: '/docs/auth', icon: ShieldCheck },
    ],
  },
  {
    group: 'UI',
    links: [
      { label: 'Components', href: '/docs/components', icon: Component },
      { label: 'Theming', href: '/docs/theming', icon: Palette },
    ],
  },
  {
    group: 'Deployment',
    links: [{ label: 'Deployment', href: '/docs/deployment', icon: Server }],
  },
];

export function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentLabel =
    navItems.flatMap((g) => g.links).find((l) => l.href === location.pathname)?.label ?? 'Docs';

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Mountain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Alpine Admin Docs</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.links.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <NavLink
                      to={href}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Back to App
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 lg:px-8">
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Docs</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{currentLabel}</span>
          </div>
          <div className="ml-auto">
            <a
              href="https://codespanda.github.io/Alpine-Admin-React/dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Live Demo
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
