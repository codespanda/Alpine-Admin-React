import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

export function GettingStartedPage() {
  return (
    <div>
      <H1>Getting Started</H1>
      <Lead>Have Alpine Admin running locally in less than two minutes.</Lead>

      <H2>Prerequisites</H2>
      <UL>
        <LI><strong>Node.js ≥ 18</strong> (Node 20 or 22 recommended) — <Code>node -v</Code> to check</LI>
        <LI><strong>npm ≥ 9</strong> or pnpm / yarn</LI>
        <LI>Git</LI>
      </UL>

      <H2>Installation</H2>

      <H3>1. Clone the repository</H3>
      <CodeBlock lang="bash" code={`git clone https://github.com/codespanda/Alpine-Admin-React.git\ncd Alpine-Admin-React`} />

      <H3>2. Install dependencies</H3>
      <CodeBlock lang="bash" code={`npm install`} />

      <H3>3. Start the dev server</H3>
      <CodeBlock lang="bash" code={`npm run dev`} />
      <P>
        Open <Code>http://localhost:5173</Code> in your browser. The root <Code>/</Code> serves
        these docs; the dashboard is at <Code>/dashboard</Code>.
      </P>

      <H2>Available Scripts</H2>
      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Command</th>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['npm run dev', 'Start Vite dev server with HMR'],
              ['npm run build', 'Type-check (tsc -b) and build to dist/'],
              ['npm run preview', 'Serve the production build locally'],
              ['npm run lint', 'Run ESLint across the project'],
            ].map(([cmd, desc], i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">{cmd}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Path Alias</H2>
      <P>
        The <Code>@</Code> alias maps to <Code>src/</Code>, configured in both{' '}
        <Code>vite.config.ts</Code> and <Code>tsconfig.json</Code>.
      </P>
      <CodeBlock lang="tsx" code={`import { Button } from '@/components/ui/button';\nimport { useAuthStore } from '@/stores/auth-store';`} />

      <H2>Folder Overview</H2>
      <CodeBlock lang="bash" code={`Alpine-Admin-React/
├── public/
├── src/
│   ├── app/              # Page components (admin + auth routes)
│   │   ├── (admin)/      # All dashboard pages
│   │   └── (auth)/       # Login, register, etc.
│   ├── components/
│   │   ├── ui/           # shadcn primitives
│   │   ├── shared/       # StatCard, PageHeader, EmptyState…
│   │   ├── data-table/   # Reusable TanStack Table wrapper
│   │   ├── charts/       # Recharts wrappers
│   │   └── layouts/      # AdminLayout, Sidebar, Header
│   ├── docs/             # ← You are here (standalone)
│   ├── features/         # Domain feature modules
│   ├── hooks/            # useDebounce, useMediaQuery…
│   ├── lib/              # Utilities, cn(), validators
│   ├── providers/        # ThemeProvider, etc.
│   ├── services/         # API client + mock service layer
│   ├── stores/           # Zustand stores
│   └── types/            # Shared TypeScript types
├── vite.config.ts
└── tsconfig.json`} />

      <H2>Removing the Docs</H2>
      <P>
        The entire documentation section lives in <Code>src/docs/</Code>. It is completely
        self-contained. To remove it:
      </P>
      <UL>
        <LI>Delete the <Code>src/docs/</Code> folder</LI>
        <LI>
          In <Code>src/App.tsx</Code>, remove the <Code>DocsPage</Code> import block and the{' '}
          <Code>{`<Route path="/docs">`}</Code> line — both are marked with a <Code>DOCS</Code> comment
        </LI>
        <LI>
          Change the root <Code>/</Code> route from <Code>DocsPage</Code> to{' '}
          <Code>{`<Navigate to="/dashboard" replace />`}</Code>
        </LI>
      </UL>
      <Callout type="warning">Nothing else in the app imports from src/docs/.</Callout>
    </div>
  );
}
