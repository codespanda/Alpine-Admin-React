import { useEffect, useState } from 'react';

/**
 * Returns whether the component has mounted on the client.
 *
 * This is essential for avoiding hydration mismatches with
 * SSR/SSG in Next.js when rendering content that differs
 * between server and client (e.g., values from localStorage,
 * window dimensions, or theme state).
 *
 * @returns `true` after the component has mounted, `false` during SSR
 *          and the initial render.
 *
 * @example
 * ```tsx
 * const isMounted = useMounted();
 *
 * if (!isMounted) {
 *   return <Skeleton />;
 * }
 *
 * return <div>Client-only content: {window.innerWidth}px</div>;
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
