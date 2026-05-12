import { useEffect, useState } from 'react'
import { StatsCards } from './StatsCards'
import { ProgressChart } from './ProgressChart'
import { VideoGrid } from './VideoGrid'

interface CategoryProgress {
  category_id: number
  category_name: string
  total_videos: number
  watched_videos: number
}

interface DashboardData {
  total_categories: number
  total_videos: number
  watched_videos: number
  progress_by_category: CategoryProgress[]
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/dashboard')
      .then((res) => res.json())
      .then((d: DashboardData) => {
        setData(d)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard:', err)
        setError('Failed to load dashboard')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[rgba(4,14,32,0.69)]">Loading...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium tracking-normal text-[#181d26] mb-6">
        Dashboard
      </h1>

      <StatsCards
        totalCategories={data.total_categories}
        totalVideos={data.total_videos}
        watchedVideos={data.watched_videos}
      />

      <ProgressChart data={data.progress_by_category} />

      <VideoGrid
        onAddVideo={() => {}}
        onEditVideo={() => {}}
        onDeleteVideo={() => {}}
      />
    </div>
  )
}