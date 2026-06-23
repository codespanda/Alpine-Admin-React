import { z } from 'zod';

// ---------------------------------------------------------------------------
// Auth Schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be 50 characters or less'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be 50 characters or less'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ---------------------------------------------------------------------------
// Employee Schema
// ---------------------------------------------------------------------------

const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Street address is required'),
  city: z
    .string()
    .min(1, 'City is required'),
  state: z
    .string()
    .min(1, 'State is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^[0-9A-Za-z\s-]{3,10}$/, 'Please enter a valid ZIP code'),
  country: z
    .string()
    .min(1, 'Country is required'),
});

const emergencyContactSchema = z.object({
  name: z
    .string()
    .min(1, 'Emergency contact name is required'),
  relationship: z
    .string()
    .min(1, 'Relationship is required'),
  phone: z
    .string()
    .min(1, 'Emergency contact phone is required')
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Please enter a valid phone number',
    ),
});

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Please enter a valid phone number',
    ),
  department: z
    .string()
    .min(1, 'Department is required'),
  designation: z
    .string()
    .min(1, 'Designation is required'),
  joiningDate: z
    .string()
    .min(1, 'Joining date is required'),
  salary: z
    .number({ message: 'Salary must be a number' })
    .positive('Salary must be a positive number')
    .max(10000000, 'Salary exceeds the maximum allowed value'),
  status: z.enum(['active', 'inactive', 'on-leave', 'terminated'], {
    message: 'Please select a valid status',
  }),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
});

// ---------------------------------------------------------------------------
// Department Schema
// ---------------------------------------------------------------------------

export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  headOfDepartmentId: z
    .string()
    .min(1, 'Head of department is required'),
  status: z.enum(['active', 'inactive'], {
    message: 'Please select a valid status',
  }),
});

// ---------------------------------------------------------------------------
// Leave Request Schema
// ---------------------------------------------------------------------------

export const leaveRequestSchema = z
  .object({
    type: z.enum(
      ['annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid'],
      { message: 'Please select a valid leave type' },
    ),
    startDate: z
      .string()
      .min(1, 'Start date is required'),
    endDate: z
      .string()
      .min(1, 'End date is required'),
    reason: z
      .string()
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason must be 500 characters or less'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });

// ---------------------------------------------------------------------------
// Inferred Types
// ---------------------------------------------------------------------------

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
