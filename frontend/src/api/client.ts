import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Search videos by query
export const searchVideos = async (query: string, type: string = 'title') => {
  const res = await apiClient.get('/videos/search', { params: { q: query, type } })
  return res.data
}

// Toggle watched status
export const toggleWatched = async (id: number, watched: boolean) => {
  const res = await apiClient.patch(`/videos/${id}`, { watched })
  return res.data
}

// Notes API
export const getNotes = async (videoId: number) => {
  const res = await apiClient.get(`/videos/${videoId}/notes`)
  return res.data
}

export const createNote = async (videoId: number, timestamp: number, content: string) => {
  const res = await apiClient.post(`/videos/${videoId}/notes`, { timestamp, content })
  return res.data
}

export const updateNote = async (noteId: number, data: { timestamp?: number; content?: string }) => {
  const res = await apiClient.patch(`/notes/${noteId}`, data)
  return res.data
}

export const deleteNote = async (noteId: number) => {
  await apiClient.delete(`/notes/${noteId}`)
}