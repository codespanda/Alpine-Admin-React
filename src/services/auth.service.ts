import type {
  User,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  ApiResponse,
} from '@/types';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Simulate an async network delay (300-800ms).
 */
function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 500) + 300;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// ============================================================================
// Mock User for Auth Operations
// ============================================================================

const mockAuthUser: User = {
  id: 'usr-001',
  email: 'admin@company.com',
  firstName: 'Admin',
  lastName: 'User',
  avatar: undefined,
  role: 'admin',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-03-01T00:00:00Z',
};

// ============================================================================
// Auth Service
// ============================================================================

export const authService = {
  /**
   * Authenticate a user with email and password.
   * Returns the authenticated user on success.
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(600);

    if (
      credentials.email === 'admin@company.com' &&
      credentials.password === 'admin123'
    ) {
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: mockAuthUser,
          token: 'mock-jwt-token-abc123',
        },
      };
    }

    throw new Error('Invalid email or password');
  },

  /**
   * Register a new user account.
   * Returns the newly created user.
   */
  async register(
    data: RegisterData,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: undefined,
      role: 'employee',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: newUser,
        token: `mock-jwt-token-${Date.now()}`,
      },
    };
  },

  /**
   * Log out the current user and clear the session.
   */
  async logout(): Promise<ApiResponse<null>> {
    await delay(300);

    return {
      success: true,
      message: 'Logged out successfully',
      data: null,
    };
  },

  /**
   * Request a password reset email.
   */
  async forgotPassword(
    email: string,
  ): Promise<ApiResponse<null>> {
    await delay(500);

    // Always return success to prevent email enumeration
    void email;
    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      data: null,
    };
  },

  /**
   * Reset the user's password using a reset token.
   */
  async resetPassword(
    data: ResetPasswordData,
  ): Promise<ApiResponse<null>> {
    await delay(500);

    if (!data.token) {
      throw new Error('Invalid or expired reset token');
    }

    return {
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
      data: null,
    };
  },

  /**
   * Get the currently authenticated user's profile.
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(400);

    return {
      success: true,
      message: 'User retrieved successfully',
      data: mockAuthUser,
    };
  },
};
