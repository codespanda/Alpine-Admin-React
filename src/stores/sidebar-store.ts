import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Sidebar Store Interface
// ============================================================================

interface SidebarStore {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  setMobileOpen: (open: boolean) => void;
}

// ============================================================================
// Sidebar Store (Persisted)
// ============================================================================

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggle: () => {
        set((state) => ({ isCollapsed: !state.isCollapsed }));
      },

      collapse: () => {
        set({ isCollapsed: true });
      },

      expand: () => {
        set({ isCollapsed: false });
      },

      setMobileOpen: (open: boolean) => {
        set({ isMobileOpen: open });
      },
    }),
    {
      name: 'admin-sidebar-storage',
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    },
  ),
);
