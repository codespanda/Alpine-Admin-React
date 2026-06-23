# React + Vite admin panel

This app was converted from Next.js (App Router) to **React + Vite** with **react-router-dom**.

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx` (route table).
- Routing: `react-router-dom`. Page components still live under `src/app/(admin)` and `src/app/(auth)` (default exports) and are wired up explicitly in `src/App.tsx`.
- `src/lib/router.tsx` is a compatibility shim that maps the old Next navigation API (`Link`, `usePathname`, `useRouter`, `useParams`, `useSearchParams`) onto react-router. Import navigation helpers from `@/lib/router`, not `next/*`.
- Styling: Tailwind v4 via PostCSS (`postcss.config.mjs`) + shadcn. Fonts load from Google Fonts in `index.html`.
- Theming: `next-themes` (framework-agnostic) is kept as-is.
