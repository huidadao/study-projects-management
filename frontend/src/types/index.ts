export interface Category {
  id: number
  name: string
  parent_id: number | null
  created_at: string
  children?: Category[]
}

export interface Video {
  id: number
  title: string
  url: string
  category_id: number
  watched: boolean
  created_at: string
  category_name?: string
}

export interface CategoryProgress {
  category_id: number
  category_name: string
  total_videos: number
  watched_videos: number
}

export interface DashboardData {
  total_parent_categories: number
  total_child_categories: number
  total_videos: number
  watched_videos: number
  progress_by_category: CategoryProgress[]
}

export interface ApiError {
  detail: string
}
