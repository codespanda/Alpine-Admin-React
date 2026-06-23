interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel -- hidden on mobile */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-primary lg:flex">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--primary)/0.8)_50%,hsl(var(--primary)/0.6)_100%)]" />

        {/* Decorative circles */}
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -right-32 size-[32rem] rounded-full bg-primary-foreground/5" />
        <div className="absolute left-1/2 top-1/3 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]"
        />

        {/* Content */}
        <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
          <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
            <span className="text-2xl font-bold text-primary-foreground">AP</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-primary-foreground">
            AdminPanel
          </h1>
          <p className="text-base leading-relaxed text-primary-foreground/70">
            A production-grade admin dashboard for managing your workforce, departments,
            and day-to-day operations with ease.
          </p>

          {/* Feature dots */}
          <div className="mt-10 flex items-center gap-4">
            {['Secure', 'Fast', 'Modern'].map((feat) => (
              <div key={feat} className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary-foreground/50" />
                <span className="text-xs font-medium text-primary-foreground/60">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
