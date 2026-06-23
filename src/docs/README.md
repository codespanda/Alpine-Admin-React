# `src/docs` — template documentation (optional)

This folder is a **self-contained** documentation site for the Alpine Admin template,
served at **`/docs`**.

- It imports **nothing** from the rest of the app.
- Nothing in the app imports from it, **except** one clearly-marked, lazy-loaded
  `DocsPage` route block in [`src/App.tsx`](../App.tsx).
- It ships its own styles (`docs.css`, all scoped under `.alpine-docs`) — no Tailwind,
  no shadcn.

## Removing it

1. Delete this folder: `rm -rf src/docs`
2. In `src/App.tsx`, delete the two `DOCS`-commented blocks (the `DocsPage` import and
   the `<Route path="/docs" …/>` line).

The rest of the template keeps working untouched.

## Files

| File            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `DocsPage.tsx`  | The full docs page (default export, routed entry). |
| `CodeBlock.tsx` | Code block with copy-to-clipboard.                 |
| `docs.css`      | Scoped, self-contained styles.                     |
