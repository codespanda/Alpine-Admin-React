import { H1, Lead, H2, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

export function ThemingPage() {
  return (
    <div>
      <H1>Theming</H1>
      <Lead>Light and dark mode, CSS custom properties, and how to change the brand color.</Lead>

      <H2>Light & Dark Mode</H2>
      <P>
        Theme switching uses <strong>next-themes</strong>. The <Code>ThemeProvider</Code> wraps the
        app in <Code>src/providers/</Code> and applies a <Code>dark</Code> class on the{' '}
        <Code>{'<html>'}</Code> element, persisting the preference to <Code>localStorage</Code>.
      </P>
      <CodeBlock lang="tsx" code={`import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}`} />

      <H2>CSS Custom Properties</H2>
      <P>
        All colors are defined as CSS custom properties in <Code>src/app/globals.css</Code> and
        referenced via Tailwind's <Code>hsl(var(--token))</Code> pattern. Both{' '}
        <Code>:root</Code> (light) and <Code>.dark</Code> values are declared there.
      </P>
      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Token</th>
              <th className="px-4 py-2.5 text-left font-semibold text-foreground">Usage</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['--background', 'Page background'],
              ['--foreground', 'Primary text'],
              ['--muted', 'Subtle backgrounds (cards, inputs)'],
              ['--muted-foreground', 'Secondary / placeholder text'],
              ['--primary', 'Brand accent, active states'],
              ['--primary-foreground', 'Text on primary-colored backgrounds'],
              ['--border', 'Borders and dividers'],
              ['--ring', 'Focus rings'],
              ['--destructive', 'Error states, delete actions'],
            ].map(([token, usage], i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2.5 font-mono text-xs text-foreground">{token}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Changing the Brand Color</H2>
      <CodeBlock lang="css" code={`:root {
  /* Default */
  --primary: 221.2 83.2% 53.3%;

  /* Indigo */
  --primary: 243 75% 59%;

  /* Emerald */
  --primary: 152 76% 40%;
}`} />
      <Callout type="tip">
        Use{' '}
        <a
          href="https://www.tints.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-2"
        >
          tints.dev
        </a>{' '}
        to convert a hex color into an HSL palette.
      </Callout>

      <H2>Typography</H2>
      <P>
        The default font stack is the system font (<Code>font-sans</Code>). To add a custom font,
        import it in <Code>index.html</Code> and set <Code>fontFamily.sans</Code> in your Tailwind
        config or CSS layer.
      </P>

      <H2>Adding a New Color Token</H2>
      <CodeBlock lang="css" code={`/* globals.css */
:root {
  --sidebar: 240 5% 96%;
}
.dark {
  --sidebar: 240 5% 10%;
}

/* Usage in JSX */
<div className="bg-[hsl(var(--sidebar))]" />`} />
    </div>
  );
}
