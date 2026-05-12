import { useEffect, useState } from 'react'
import { StatsCards } from './StatsCards'
import { ProgressChart } from './ProgressChart'
import { VideoGrid } from './VideoGrid'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import type { DashboardData } from '../types'

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    try {
      const d = await api.getDashboard()
      setData(d)
      setLoading(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard'
      showToast(msg, 'error')
      setError(msg)
      setLoading(false)
    }
  }

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
