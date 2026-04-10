import { useEffect, useState } from 'react'
import { useVideoStore, Note } from '../store/useVideoStore'
import { updateNote as apiUpdateNote, deleteNote as apiDeleteNote } from '../api/client'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: number
  videoTitle: string
  videoUrl: string
}

// Format timestamp as mm:ss or hh:mm:ss
const formatTimestamp = (seconds: number): string => {
  if (seconds < 0) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function NotesModal({ isOpen, onClose, videoId, videoTitle, videoUrl }: NotesModalProps) {
  const { notes, fetchNotes, createNote } = useVideoStore()
  
  const [timestamp, setTimestamp] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTimestamp, setEditTimestamp] = useState('')
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (isOpen && videoId) {
      fetchNotes(videoId)
    }
  }, [isOpen, videoId, fetchNotes])
  
  useEffect(() => {
    if (!isOpen) {
      setTimestamp('')
      setContent('')
      setEditingId(null)
      setError('')
    }
  }, [isOpen])
  
  const handleAddNote = async () => {
    const ts = parseInt(timestamp, 10)
    if (isNaN(ts) || ts < 0) {
      setError('Timestamp must be a non-negative number')
      return
    }
    if (!content.trim()) {
      setError('Note content cannot be empty')
      return
    }
    if (content.length > 1000) {
      setError('Note content must be 1000 characters or less')
      return
    }
    
    setError('')
    await createNote(videoId, ts, content.trim())
    setTimestamp('')
    setContent('')
    fetchNotes(videoId)
  }
  
  const handleEditClick = (note: Note) => {
    setEditingId(note.id)
    setEditTimestamp(note.timestamp.toString())
    setEditContent(note.content)
  }
  
  const handleSaveEdit = async () => {
    const ts = parseInt(editTimestamp, 10)
    if (isNaN(ts) || ts < 0) {
      setError('Timestamp must be a non-negative number')
      return
    }
    if (!editContent.trim()) {
      setError('Note content cannot be empty')
      return
    }
    if (editContent.length > 1000) {
      setError('Note content must be 1000 characters or less')
      return
    }
    
    setError('')
    await apiUpdateNote(editingId!, { timestamp: ts, content: editContent.trim() })
    setEditingId(null)
    fetchNotes(videoId)
  }
  
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTimestamp('')
    setEditContent('')
    setError('')
  }
  
  const handleDeleteNote = async (noteId: number) => {
    await apiDeleteNote(noteId)
    fetchNotes(videoId)
  }
  
  const handleNoteClick = (note: Note) => {
    // Open YouTube at timestamp in new tab
    const videoId = extractYouTubeId(videoUrl)
    if (videoId) {
      const url = `https://youtube.com/watch?v=${videoId}&t=${note.timestamp}`
      window.open(url, '_blank')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="notes-modal-overlay" onClick={onClose}>
      <div className="notes-modal" onClick={e => e.stopPropagation()}>
        <div className="notes-modal-header">
          <h2>{videoTitle}</h2>
          <button className="notes-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="notes-modal-list">
          {notes.length === 0 ? (
            <p className="notes-empty">No notes yet. Add your first note below.</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-item">
                {editingId === note.id ? (
                  <div className="note-edit-form">
                    <div className="note-edit-row">
                      <label>Timestamp (seconds):</label>
                      <input
                        type="number"
                        value={editTimestamp}
                        onChange={e => setEditTimestamp(e.target.value)}
                        min="0"
                      />
                    </div>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      placeholder="Note content..."
                      maxLength={1000}
                    />
                    <div className="note-edit-actions">
                      <button onClick={handleSaveEdit} className="btn-save">Save</button>
                      <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="note-content-wrapper" onClick={() => handleNoteClick(note)}>
                      <span className="note-timestamp">{formatTimestamp(note.timestamp)}</span>
                      <p className="note-content">{note.content}</p>
                    </div>
                    <div className="note-actions">
                      <button onClick={() => handleEditClick(note)} className="btn-edit" title="Edit note">✎</button>
                      <button onClick={() => handleDeleteNote(note.id)} className="btn-delete" title="Delete note">✕</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="notes-modal-form">
          {error && <p className="notes-error">{error}</p>}
          
          <div className="note-form-row">
            <label>Timestamp (seconds):</label>
            <input
              type="number"
              value={timestamp}
              onChange={e => setTimestamp(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a note..."
            maxLength={1000}
          />
          
          <button onClick={handleAddNote} className="btn-add-note">
            Add Note
          </button>
        </div>
      </div>
    </div>
  )
}
