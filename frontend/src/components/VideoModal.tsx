import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../store'

interface Video {
  id: number
  title: string
  url: string
  category_id: number
  watched: boolean
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video?: Video | null
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  const { categories, setCategories } = useStore()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [categoryId, setCategoryId] = useState<number>(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (video) {
      setTitle(video.title)
      setUrl(video.url)
      setCategoryId(video.category_id)
    } else {
      setTitle('')
      setUrl('')
      setCategoryId(categories.length > 0 ? (categories[0] as {id: number}).id : 0)
    }
    setError('')
  }, [video, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!url.trim()) {
      setError('URL is required')
      return
    }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('URL must be a valid YouTube URL')
      return
    }
    if (!categoryId) {
      setError('Please select a category')
      return
    }
    setLoading(true)
    setError('')

    try {
      const apiUrl = video
        ? `http://localhost:8000/videos/${video.id}`
        : 'http://localhost:8000/videos'
      const method = video ? 'PUT' : 'POST'

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title.trim(), 
          url: url.trim(),
          category_id: categoryId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to save video')
      }

      onClose()
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-[#181d26]">
            {video ? 'Edit Video' : 'Add Video'}
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={onClose}>
            <X className="w-5 h-5 text-[rgba(4,14,32,0.69)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#181d26] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
              placeholder="Video title"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#181d26] mb-1">
              YouTube URL
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#181d26] mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
            >
              <option value={0}>Select a category</option>
              {(categories as Array<{id: number, name: string}>).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e0e2e6] rounded-xl text-[#181d26] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#1b61c9] text-white rounded-xl hover:bg-[#254fad] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : video ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}