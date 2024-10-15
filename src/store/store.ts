import { create } from 'zustand'

export const useUserStore = create((set) => ({
  currentTool: "Brush",
  setCurrentTool: (newTool:string) => set({ currentTool:newTool})
}))