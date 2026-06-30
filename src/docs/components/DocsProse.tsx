import type { ReactNode } from 'react';

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">{children}</h1>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-8 text-lg text-muted-foreground">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 border-b border-border pb-2 text-xl font-semibold text-foreground">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-6 text-base font-semibold text-foreground">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-7 text-muted-foreground">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-4 ml-5 list-disc space-y-1.5 text-muted-foreground">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="leading-7">{children}</li>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

export function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip';
  children: ReactNode;
}) {
  const styles = {
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
    warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    tip: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
  };
  const labels = { info: 'Note', warning: 'Warning', tip: 'Tip' };
  return (
    <div className={`mb-4 rounded-lg border-l-4 px-4 py-3 ${styles[type]}`}>
      <span className="mr-2 font-semibold">{labels[type]}:</span>
      {children}
    </div>
  );
}
