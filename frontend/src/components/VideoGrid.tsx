import { Video, Category } from '../store/useVideoStore'
import { VideoCard } from './VideoCard'

interface VideoGridProps {
  videos: Video[]
  categories?: Category[]
  onToggleWatched?: (id: number, watched: boolean) => void
  onVideoClick?: (video: Video) => void
}

export function VideoGrid({ videos, categories = [], onToggleWatched, onVideoClick }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="video-grid-empty">
        <p>No videos found.</p>
        <p className="empty-hint">Add your first video to get started.</p>
      </div>
    )
  }

  return (
    <div className="video-grid">
      {videos.map(video => (
        <VideoCard
          key={video.id}
          video={video}
          categories={categories}
          onToggleWatched={onToggleWatched}
          onClick={() => onVideoClick?.(video)}
        />
      ))}
    </div>
  )
}