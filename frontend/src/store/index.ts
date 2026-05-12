import { create } from 'zustand'
import type { Category, Video } from '../types'

interface AppState {
  categories: Category[]
  videos: Video[]
  setCategories: (categories: Category[]) => void
  setVideos: (videos: Video[]) => void
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  removeCategory: (id: number) => void
  addVideo: (video: Video) => void
  updateVideo: (video: Video) => void
  removeVideo: (id: number) => void
}

export const useStore = create<AppState>((set) => ({
  categories: [],
  videos: [],

  setCategories: (categories) => set({ categories }),
  setVideos: (videos) => set({ videos }),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  addVideo: (video) =>
    set((state) => ({ videos: [...state.videos, video] })),

  updateVideo: (video) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === video.id ? video : v)),
    })),

  removeVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    })),
}))
