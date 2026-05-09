import { create } from 'zustand'
export const useCompanyUiStore = create((set) => ({
  expandedId: null,
  setExpandedId: (id) =>
    set({
      expandedId: id,
    }),
}))
