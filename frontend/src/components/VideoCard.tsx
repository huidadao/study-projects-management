import { useState } from 'react'
import { Video, Category } from '../store/useVideoStore'
import { NotesModal } from './NotesModal'

interface VideoCardProps {
  video: Video
  categories?: Category[]
  onToggleWatched?: (id: number, watched: boolean) => void
  onClick?: () => void
}

// Format duration as mm:ss
const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoCard({ video, categories = [], onToggleWatched, onClick }: VideoCardProps) {
  const [notesOpen, setNotesOpen] = useState(false)

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleWatched?.(video.id, !video.watched)
  }

  const handleLinkClick = () => {
    onClick?.()
  }

  const handleNotesClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotesOpen(true)
  }

  return (
    <div className="video-card" onClick={handleLinkClick}>
      <div className="video-card-thumbnail">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} />
        ) : (
          <div className="video-card-placeholder">▶</div>
        )}
        <span className="video-card-duration">{formatDuration(video.duration)}</span>
      </div>
      
      <div className="video-card-content">
        <h3 className="video-card-title">{video.title}</h3>
        {video.channel && <p className="video-card-channel">{video.channel}</p>}
        
        <div className="video-card-meta">
          <span className={`video-card-badge ${video.watched ? 'watched' : 'unwatched'}`}>
            {video.watched ? 'Watched' : 'Unwatched'}
          </span>
          
          <button 
            className="video-card-toggle"
            onClick={handleToggleClick}
            title={video.watched ? 'Mark as unwatched' : 'Mark as watched'}
          >
            {video.watched ? '↩' : '✓'}
          </button>

          <button 
            className="video-card-notes"
            onClick={handleNotesClick}
            title="View notes"
          >
            📝
          </button>
        </div>
        
        {categories.length > 0 && (
          <div className="video-card-categories">
            {categories.map(cat => (
              <span key={cat.id} className="category-badge">
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <NotesModal
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        videoId={video.id}
        videoTitle={video.title}
        videoUrl={video.url}
      />
    </div>
  )
}