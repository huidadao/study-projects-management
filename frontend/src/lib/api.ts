import type { Category, Video, DashboardData } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const api = {
  // Categories
  getCategories: () => request<Category[]>('/categories'),
  getCategoryTree: () => request<Category[]>('/categories/tree'),
  getCategory: (id: number) => request<Category>(`/categories/${id}`),
  createCategory: (data: { name: string; parent_id?: number | null }) =>
    request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: { name?: string }) =>
    request<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: 'DELETE' }),

  // Videos
  getVideos: (categoryId?: number) =>
    request<Video[]>(categoryId ? `/videos?category_id=${categoryId}` : '/videos'),
  getVideo: (id: number) => request<Video>(`/videos/${id}`),
  createVideo: (data: { title: string; url: string; category_id: number; watched?: boolean }) =>
    request<Video>('/videos', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id: number, data: Partial<Omit<Video, 'id' | 'created_at'>>) =>
    request<Video>(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVideo: (id: number) =>
    request<void>(`/videos/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboard: () => request<DashboardData>('/dashboard'),
}
