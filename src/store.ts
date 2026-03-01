import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  compareList: string[];
  savedUniversities: string[];
  checklists: Record<string, Record<string, boolean>>;
  notes: Record<string, string>;
  
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  toggleSaved: (id: string) => void;
  toggleChecklistItem: (uniId: string, itemId: string) => void;
  updateNote: (uniId: string, note: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      compareList: [],
      savedUniversities: [],
      checklists: {},
      notes: {},
      
      toggleCompare: (id) => set((state) => {
        const exists = state.compareList.includes(id);
        if (exists) {
          return { compareList: state.compareList.filter(i => i !== id) };
        }
        if (state.compareList.length >= 3) return state;
        return { compareList: [...state.compareList, id] };
      }),
      
      clearCompare: () => set({ compareList: [] }),
      
      toggleSaved: (id) => set((state) => {
        const exists = state.savedUniversities.includes(id);
        return {
          savedUniversities: exists 
            ? state.savedUniversities.filter(i => i !== id) 
            : [...state.savedUniversities, id]
        };
      }),
      
      toggleChecklistItem: (uniId, itemId) => set((state) => {
        const uniChecklist = state.checklists[uniId] || {};
        return {
          checklists: {
            ...state.checklists,
            [uniId]: {
              ...uniChecklist,
              [itemId]: !uniChecklist[itemId]
            }
          }
        };
      }),
      
      updateNote: (uniId, note) => set((state) => ({
        notes: {
          ...state.notes,
          [uniId]: note
        }
      })),
    }),
    {
      name: 'eduabroad-storage',
    }
  )
);
