import { H1, Lead, H2, H3, P, UL, LI, Code, Callout } from '../components/DocsProse';
import { CodeBlock } from '../CodeBlock';

export function DeploymentPage() {
  return (
    <div>
      <H1>Deployment</H1>
      <Lead>Build for production and deploy to any static host or Node server.</Lead>

      <H2>Production Build</H2>
      <CodeBlock lang="bash" code={`npm run build`} />
      <P>
        Runs TypeScript type-checking (<Code>tsc -b</Code>) then Vite's production bundler. Output
        goes to <Code>dist/</Code>.
      </P>

      <H2>Preview Locally</H2>
      <CodeBlock lang="bash" code={`npm run preview`} />
      <P>Serves the <Code>dist/</Code> folder at <Code>http://localhost:4173</Code>.</P>

      <H2>GitHub Pages</H2>
      <P>
        A <Code>.github/workflows/deploy.yml</Code> is already included. It builds and deploys on
        every push to <Code>main</Code>.
      </P>

      <H3>1. Set the base path</H3>
      <P>
        <Code>vite.config.ts</Code> is already configured to use the repo name as the base in
        production:
      </P>
      <CodeBlock lang="ts" code={`base: command === 'build' ? '/Alpine-Admin-React/' : '/',`} />
      <P>Change the string to match your repository name if you fork it.</P>

      <H3>2. Enable GitHub Pages</H3>
      <P>In your repo: <strong>Settings → Pages → Source → GitHub Actions</strong>.</P>

      <H3>3. Push</H3>
      <CodeBlock lang="bash" code={`git push origin main`} />
      <Callout type="info">
        Because this uses <Code>BrowserRouter</Code>, the workflow copies <Code>index.html</Code>{' '}
        to <Code>404.html</Code> so that deep links and page refreshes work on GitHub Pages.
      </Callout>

      <H2>Vercel</H2>
      <P>Connect your repository. Vercel auto-detects Vite — no extra config needed.</P>

      <H2>Netlify</H2>
      <P>Add a <Code>_redirects</Code> file to <Code>public/</Code>:</P>
      <CodeBlock lang="bash" code={`/* /index.html 200`} />

      <H2>Nginx</H2>
      <CodeBlock lang="nginx" code={`server {
  listen 80;
  root /var/www/alpine-admin/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}`} />

      <H2>Docker</H2>
      <CodeBlock lang="dockerfile" code={`FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80`} />

      <H2>Environment Variables</H2>
      <P>
        Vite embeds <Code>VITE_*</Code> variables at build time. Supply them as CI secrets or in{' '}
        <Code>.env.production</Code>.
      </P>
      <CodeBlock lang="bash" code={`# .env.production
VITE_API_BASE_URL=https://api.example.com`} />
      <Callout type="warning">
        Never put secret keys in <Code>VITE_*</Code> variables — they are visible in the browser
        bundle.
      </Callout>
    </div>
  );
}
