import { create } from 'zustand'
import { apiClient, toggleWatched as apiToggleWatched, getNotes as apiGetNotes, createNote as apiCreateNote, updateNote as apiUpdateNote, deleteNote as apiDeleteNote, Schedule, getUpcoming as apiGetUpcoming, createSchedule as apiCreateSchedule, completeSchedule as apiCompleteSchedule, rescheduleVideo as apiRescheduleVideo, deleteSchedule as apiDeleteSchedule } from '../api/client'

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

export { Schedule }

interface VideoStore {
  videos: Video[]
  categories: Category[]
  notes: Note[]
  upcoming: Schedule[]
  searchQuery: string
  selectedCategories: number[]
  searchType: 'title' | 'channel' | 'notes'
  fetchVideos: () => Promise<void>
  fetchCategories: () => Promise<void>
  addVideo: (video: Omit<Video, 'id' | 'created'>) => Promise<void>
  addCategory: (name: string, categoryType: string) => Promise<void>
  fetchNotes: (videoId: number) => Promise<void>
  createNote: (videoId: number, timestamp: number, content: string) => Promise<void>
  updateNote: (noteId: number, data: {timestamp?: number; content?: string}) => Promise<void>
  deleteNote: (noteId: number) => Promise<void>
  toggleWatched: (id: number, watched: boolean) => Promise<void>
  setSearchQuery: (query: string) => void
  setSearchType: (type: 'title' | 'channel' | 'notes') => void
  toggleCategory: (categoryId: number) => void
  getFilteredVideos: () => Video[]
  fetchUpcoming: () => Promise<void>
  createSchedule: (data: {video_id: number; scheduled_date: string; recurring?: boolean; recurring_type?: string | null}) => Promise<void>
  completeSchedule: (id: number) => Promise<void>
  reschedule: (id: number, scheduled_date: string) => Promise<void>
  removeSchedule: (id: number) => Promise<void>
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  categories: [],
  notes: [],
  upcoming: [],
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
  updateNote: async (noteId: number, data: {timestamp?: number; content?: string}) => {
    await apiUpdateNote(noteId, data)
  },
  deleteNote: async (noteId: number) => {
    await apiDeleteNote(noteId)
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
  },
  fetchUpcoming: async () => {
    const data = await apiGetUpcoming()
    set({ upcoming: data })
  },
  createSchedule: async (data) => {
    await apiCreateSchedule(data)
    get().fetchUpcoming()
  },
  completeSchedule: async (id: number) => {
    await apiCompleteSchedule(id)
    get().fetchUpcoming()
  },
  reschedule: async (id: number, scheduled_date: string) => {
    await apiRescheduleVideo(id, scheduled_date)
    get().fetchUpcoming()
  },
  removeSchedule: async (id: number) => {
    await apiDeleteSchedule(id)
    get().fetchUpcoming()
  }
}))