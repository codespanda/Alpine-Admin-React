import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

const BASE = 'https://codespanda.github.io/Alpine-Admin-React';

export function AuthPage() {
  return (
    <div>
      <H1>Authentication</H1>
      <Lead>Auth pages, the Zustand auth store, and how to wire up a real auth provider.</Lead>

      <H2>Auth Pages</H2>
      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Route</th>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Page file</th>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {([
              ['/login', 'login/page.tsx', 'Email + password sign-in'],
              ['/register', 'register/page.tsx', 'New account creation'],
              ['/forgot-password', 'forgot-password/page.tsx', 'Send reset link'],
              ['/reset-password', 'reset-password/page.tsx', 'Set new password with token'],
              ['/verify-email', 'verify-email/page.tsx', 'Confirm email address'],
            ] as const).map(([route, file, purpose], i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2.5">
                  <a
                    href={`${BASE}${route}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-primary underline underline-offset-2 hover:opacity-80"
                  >
                    {route}
                  </a>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{file}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Auth Store</H2>
      <P><Code>src/stores/auth-store.ts</Code> holds the current user and session state.</P>
      <CodeBlock lang="tsx" code={`import { useAuthStore } from '@/stores/auth-store';

// Read state
const user = useAuthStore((s) => s.user);
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

// Actions
const { login, logout } = useAuthStore();`} />

      <H2>Protecting Routes</H2>
      <P>
        The current template does not include a route guard. To add one, create an{' '}
        <Code>AuthGuard</Code> component and wrap the admin routes in <Code>App.tsx</Code>:
      </P>
      <CodeBlock lang="tsx" code={`// src/components/AuthGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// In App.tsx, wrap the AdminLayout route:
<Route element={<AuthGuard />}>
  <Route element={<AdminLayout><Outlet /></AdminLayout>}>
    {/* … admin routes */}
  </Route>
</Route>`} />

      <H2>Connecting a Real Auth Provider</H2>
      <H3>Option A — REST API</H3>
      <P>
        Update <Code>src/services/auth.service.ts</Code> to call your backend. The service already
        exports <Code>login</Code>, <Code>logout</Code>, and <Code>getUser</Code>.
      </P>
      <H3>Option B — Supabase / Firebase / Auth0</H3>
      <CodeBlock lang="tsx" code={`// src/stores/auth-store.ts  (example with Supabase)
import { supabase } from '@/lib/supabase';

login: async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  set({ user: data.user, isAuthenticated: true });
},`} />

      <Callout type="warning">
        Never store raw JWT tokens in <Code>localStorage</Code>. Use <Code>httpOnly</Code> cookies
        or the provider's recommended session strategy.
      </Callout>

      <H2>Form Validation</H2>
      <P>
        Auth forms use <strong>React Hook Form</strong> with <strong>Zod</strong> schemas in{' '}
        <Code>src/features/auth/schemas.ts</Code>.
      </P>
    </div>
  );
}
