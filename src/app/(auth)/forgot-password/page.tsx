'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/validations';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSubmittedEmail(data.email);
    setIsSuccess(true);
    toast.success('Reset link sent', {
      description: 'Check your email for the password reset link.',
    });
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2 className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-medium text-foreground">{submittedEmail}</span>.
            Please check your inbox and follow the instructions.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              setIsSuccess(false);
              setSubmittedEmail('');
            }}
          >
            Try another email
          </Button>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // Default state — form
  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
          <Mail className="size-6 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormFieldWrapper
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              className="pl-8"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>
        </FormFieldWrapper>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      {/* Back to sign in */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
