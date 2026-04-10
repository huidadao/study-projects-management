import { useState } from 'react'

interface QuickAddFormProps {
  onAddVideo: (url: string) => Promise<void>
}

// YouTube URL patterns
const YOUTUBE_WATCH_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
const YOUTUBE_URL_PATTERNS = [
  'youtube.com/watch?v=',
  'youtu.be/',
  'youtube.com/embed/',
  'youtube.com/v/',
]

export function QuickAddForm({ onAddVideo }: QuickAddFormProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidYouTubeUrl = (url: string): boolean => {
    return YOUTUBE_URL_PATTERNS.some(pattern => url.includes(pattern)) && 
           YOUTUBE_WATCH_REGEX.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Use youtube.com/watch?v= or youtu.be/')
      return
    }

    setLoading(true)
    try {
      await onAddVideo(url)
      setUrl('')
      setError('')
    } catch (err) {
      setError('Failed to add video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="quick-add-form" onSubmit={handleSubmit}>
      <div className="quick-add-input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL..."
          className="quick-add-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="quick-add-button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="quick-add-error">{error}</p>}
    </form>
  )
}