import { create } from 'zustand'
export const useUiStore = create((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) =>
    set({
      mobileMenuOpen: open,
    }),
  toast: null,
  showToast: (t) =>
    set({
      toast: t,
    }),
  clearToast: () =>
    set({
      toast: null,
    }),
}))
