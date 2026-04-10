import { create } from 'zustand'
import { apiClient } from '../api/client'

export interface Video {
  id: number
  url: string
  title: string
  channel?: string
  duration?: number
  thumbnail?: string
  watched: boolean
  created: string
}

export interface Category {
  id: number
  name: string
  category_type: string
}

interface VideoStore {
  videos: Video[]
  categories: Category[]
  fetchVideos: () => Promise<void>
  fetchCategories: () => Promise<void>
  addVideo: (video: Omit<Video, 'id' | 'created'>) => Promise<void>
  addCategory: (name: string, categoryType: string) => Promise<void>
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  categories: [],
  fetchVideos: async () => {
    const res = await apiClient.get('/videos')
    set({ videos: res.data })
  },
  fetchCategories: async () => {
    const res = await apiClient.get('/categories')
    set({ categories: res.data })
  },
  addVideo: async (video) => {
    await apiClient.post('/videos', video)
    get().fetchVideos()
  },
  addCategory: async (name, categoryType) => {
    await apiClient.post('/categories', { name, category_type: categoryType })
    get().fetchCategories()
  }
}))