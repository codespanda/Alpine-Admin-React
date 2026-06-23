import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User, UserRole } from '@/types';

// ============================================================================
// Auth Store Interface
// ============================================================================

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// Default Mock User
// ============================================================================

const defaultMockUser: User = {
  id: 'usr-001',
  email: 'admin@company.com',
  firstName: 'Admin',
  lastName: 'User',
  avatar: undefined,
  role: 'admin' as UserRole,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-03-01T00:00:00Z',
};

// ============================================================================
// Mock Credentials Map (for simulated login)
// ============================================================================

const mockCredentials: Record<string, { password: string; user: User }> = {
  'admin@company.com': {
    password: 'admin123',
    user: defaultMockUser,
  },
  'manager@company.com': {
    password: 'manager123',
    user: {
      id: 'usr-002',
      email: 'manager@company.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      avatar: undefined,
      role: 'manager',
      createdAt: '2021-03-15T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
  },
  'employee@company.com': {
    password: 'employee123',
    user: {
      id: 'usr-003',
      email: 'employee@company.com',
      firstName: 'Bob',
      lastName: 'Smith',
      avatar: undefined,
      role: 'employee',
      createdAt: '2021-06-01T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
  },
  'viewer@company.com': {
    password: 'viewer123',
    user: {
      id: 'usr-004',
      email: 'viewer@company.com',
      firstName: 'Carol',
      lastName: 'Davis',
      avatar: undefined,
      role: 'viewer',
      createdAt: '2022-01-10T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
  },
};

// ============================================================================
// Auth Store (Persisted)
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate API call with network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const credentials = mockCredentials[email.toLowerCase()];

        if (!credentials || credentials.password !== password) {
          set({ isLoading: false });
          throw new Error('Invalid email or password');
        }

        set({
          user: credentials.user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
