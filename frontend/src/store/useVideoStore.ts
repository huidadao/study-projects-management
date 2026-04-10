import { create } from 'zustand'
import { apiClient, toggleWatched as apiToggleWatched, getNotes as apiGetNotes, createNote as apiCreateNote } from '../api/client'

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

export interface Note {
  id: number
  video_id: number
  timestamp: number
  content: string
  created: string
}

interface VideoStore {
  videos: Video[]
  categories: Category[]
  notes: Note[]
  searchQuery: string
  selectedCategories: number[]
  searchType: 'title' | 'channel' | 'notes'
  fetchVideos: () => Promise<void>
  fetchCategories: () => Promise<void>
  addVideo: (video: Omit<Video, 'id' | 'created'>) => Promise<void>
  addCategory: (name: string, categoryType: string) => Promise<void>
  fetchNotes: (videoId: number) => Promise<void>
  createNote: (videoId: number, timestamp: number, content: string) => Promise<void>
  toggleWatched: (id: number, watched: boolean) => Promise<void>
  setSearchQuery: (query: string) => void
  setSearchType: (type: 'title' | 'channel' | 'notes') => void
  toggleCategory: (categoryId: number) => void
  getFilteredVideos: () => Video[]
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  categories: [],
  notes: [],
  searchQuery: '',
  selectedCategories: [],
  searchType: 'title',
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
  },
  fetchNotes: async (videoId: number) => {
    const res = await apiGetNotes(videoId)
    set({ notes: res.data })
  },
  createNote: async (videoId: number, timestamp: number, content: string) => {
    await apiCreateNote(videoId, timestamp, content)
  },
  toggleWatched: async (id: number, watched: boolean) => {
    await apiToggleWatched(id, watched)
    get().fetchVideos()
  },
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSearchType: (type) => set({ searchType: type }),
  toggleCategory: (categoryId: number) => {
    const { selectedCategories } = get()
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    set({ selectedCategories: newSelected })
  },
  getFilteredVideos: () => {
    const { videos, searchQuery, selectedCategories, searchType } = get()
    let filtered = videos
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v => {
        if (searchType === 'title') {
          return v.title.toLowerCase().includes(query)
        } else if (searchType === 'channel') {
          return v.channel?.toLowerCase().includes(query)
        }
        return true
      })
    }
    
    // Filter by categories (if selected)
    if (selectedCategories.length > 0) {
      // For now, just return filtered by search - category filtering would need video->category mapping
      // This will be enhanced when category assignment is implemented
    }
    
    return filtered
  }
}))