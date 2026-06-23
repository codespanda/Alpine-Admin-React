import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldWrapperProps {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

function FormFieldWrapper({
  label,
  error,
  description,
  required = false,
  children,
  className,
  htmlFor,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-1.5', className)} data-slot="form-field">
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div>{children}</div>
      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { FormFieldWrapper, type FormFieldWrapperProps };
