import { useEffect, useState, useCallback } from 'react'
import { Check, Edit2, Trash2, Play } from 'lucide-react'
import { useStore } from '../store'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import { getYouTubeVideoId, getYouTubeThumbnailUrl } from '../lib/youtube'
import type { Video } from '../types'

interface VideoGridProps {
  onAddVideo: () => void
  onEditVideo: (video: Video) => void
  onDeleteVideo: (video: Video) => void
}

function VideoThumbnail({ url, title, watched }: { url: string; title: string; watched: boolean }) {
  const [imgError, setImgError] = useState(false)
  const videoId = getYouTubeVideoId(url)
  const thumbnailUrl = videoId
    ? getYouTubeThumbnailUrl(videoId, 'hq')
    : null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block w-full aspect-video rounded-xl overflow-hidden group cursor-pointer bg-gray-900"
      title={title}
    >
      {thumbnailUrl && !imgError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Play className="w-12 h-12 text-white/60" />
        </div>
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

      {/* Play button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-red-600 ml-0.5" fill="currentColor" />
        </div>
      </div>

      {/* Watched badge */}
      {watched && (
        <div className="absolute top-2 right-2 bg-[#1b61c9] text-white text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
          <Check className="w-3 h-3" />
          Watched
        </div>
      )}
    </a>
  )
}

export function VideoGrid({ onAddVideo, onEditVideo, onDeleteVideo }: VideoGridProps) {
  const { videos, setVideos, categories, selectedCategoryId } = useStore()
  const [loading, setLoading] = useState(true)
  const showToast = useToastStore((s) => s.showToast)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getVideos(
        selectedCategoryId ?? undefined,
        selectedCategoryId ? true : undefined,
      )
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
  }, [selectedCategoryId, categories, setVideos, showToast])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

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

  const displayVideos = videos

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[rgba(4,14,32,0.69)]">Loading videos...</p>
      </div>
    )
  }

  if (displayVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[rgba(4,14,32,0.69)]">
          {selectedCategoryId ? 'No videos in this category' : 'No videos yet'}
        </p>
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
        <h2 className="text-xl font-medium text-[#181d26]">
          {selectedCategoryId
            ? categories.find((c) => c.id === selectedCategoryId)?.name || 'Videos'
            : 'All Videos'}
        </h2>
        <button
          onClick={onAddVideo}
          className="px-4 py-2 bg-[#1b61c9] text-white rounded-xl hover:bg-[#254fad] transition-colors"
        >
          Add Video
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white border border-[#e0e2e6] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Thumbnail */}
            <VideoThumbnail
              url={video.url}
              title={video.title}
              watched={video.watched}
            />

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3
                  className="text-sm font-medium text-[#181d26] line-clamp-2 flex-1"
                  title={video.title}
                >
                  {video.title}
                </h3>
                <button
                  onClick={() => toggleWatched(video)}
                  className={`shrink-0 p-1 rounded transition-colors ${
                    video.watched
                      ? 'text-[#1b61c9] bg-[#1b61c9]/10'
                      : 'text-[rgba(4,14,32,0.3)] hover:bg-gray-100'
                  }`}
                  title={video.watched ? 'Mark as unwatched' : 'Mark as watched'}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {video.category_name && (
                <p className="text-xs text-[rgba(4,14,32,0.5)] mb-2">
                  {video.category_name}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditVideo(video)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-[#e0e2e6] rounded-lg text-[#181d26] hover:bg-[#f8fafc] transition-colors text-xs"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteVideo(video)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
