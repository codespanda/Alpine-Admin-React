'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/lib/router';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    setIsResending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsResending(false);
    setCooldown(COOLDOWN_SECONDS);
    toast.success('Verification email sent', {
      description: 'Please check your inbox for the verification link.',
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Mail icon */}
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="size-8 text-primary" />
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We&apos;ve sent a verification email to your address. Please click the
          link in the email to verify your account and get started.
        </p>
      </div>

      {/* Decorative inbox illustration */}
      <div className="flex items-center justify-center gap-1.5 py-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Resend button */}
      <div className="flex w-full flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={cooldown > 0 || isResending}
          onClick={handleResend}
        >
          {isResending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            'Resend verification email'
          )}
        </Button>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>

      {/* Hint */}
      <p className="text-xs text-muted-foreground">
        Didn&apos;t receive the email? Check your spam folder or try resending.
      </p>
    </div>
  );
}
