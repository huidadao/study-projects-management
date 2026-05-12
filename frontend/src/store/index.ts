import { create } from 'zustand'

interface AppState {
  categories: unknown[]
  videos: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const useStore = create<AppState>((set) => ({
  categories: [],
  videos: [],
  setCategories: (categories: unknown[]) => set({ categories }),
  setVideos: (videos: unknown[]) => set({ videos }),
}))