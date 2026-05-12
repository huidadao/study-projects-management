import { useEffect, useState } from 'react'
import { Check, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { useStore } from '../store'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import type { Video } from '../types'

interface VideoGridProps {
  onAddVideo: () => void
  onEditVideo: (video: Video) => void
  onDeleteVideo: (video: Video) => void
}

export function VideoGrid({ onAddVideo, onEditVideo, onDeleteVideo }: VideoGridProps) {
  const { videos, setVideos, categories } = useStore()
  const [loading, setLoading] = useState(true)
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      const data = await api.getVideos()
      const categoriesMap = new Map(categories.map((c) => [c.id, c.name]))
      const videosWithCategory = data.map((v) => ({
        ...v,
        category_name: categoriesMap.get(v.category_id),
      }))
      setVideos(videosWithCategory)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch videos'
      showToast(msg, 'error')
      console.error('Failed to fetch videos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleWatched(video: Video) {
    try {
      const updated = await api.updateVideo(video.id, { watched: !video.watched })
      setVideos(
        videos.map((v) => (v.id === video.id ? { ...v, watched: updated.watched } : v))
      )
      showToast(updated.watched ? 'Marked as watched' : 'Marked as unwatched', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      showToast(msg, 'error')
      console.error('Failed to toggle watched:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[rgba(4,14,32,0.69)]">Loading...</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[rgba(4,14,32,0.69)]">No videos yet</p>
        <button
          onClick={onAddVideo}
          className="px-4 py-2 bg-[#1b61c9] text-white rounded-xl hover:bg-[#254fad] transition-colors"
        >
          Add Video
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-[#181d26]">Videos</h2>
        <button
          onClick={onAddVideo}
          className="px-4 py-2 bg-[#1b61c9] text-white rounded-xl hover:bg-[#254fad] transition-colors"
        >
          Add Video
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white border border-[#e0e2e6] rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-normal text-[#181d26] line-clamp-2">
                {video.title}
              </h3>
              <button
                onClick={() => toggleWatched(video)}
                className={`p-1 rounded transition-colors ${
                  video.watched
                    ? 'text-[#1b61c9] bg-[#1b61c9]/10'
                    : 'text-[rgba(4,14,32,0.69)] hover:bg-gray-100'
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>

            {video.category_name && (
              <p className="text-xs text-[rgba(4,14,32,0.69)] mb-2">
                {video.category_name}
              </p>
            )}

            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[#1b61c9] hover:underline mb-3"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Watch
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => onEditVideo(video)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-[#e0e2e6] rounded-lg text-[#181d26] hover:bg-[#f8fafc] transition-colors text-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => onDeleteVideo(video)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
