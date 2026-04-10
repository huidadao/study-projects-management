import { useState } from 'react'
import { useVideoStore } from '../store/useVideoStore'

interface ScheduleFormProps {
  videoId: number
  onClose: () => void
}

export function ScheduleForm({ videoId, onClose }: ScheduleFormProps) {
  const [date, setDate] = useState('')
  const [recurring, setRecurring] = useState(false)
  const { createSchedule } = useVideoStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSchedule({
      video_id: videoId,
      scheduled_date: date,
      recurring,
      recurring_type: recurring ? 'daily' : null
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-form" onClick={e => e.stopPropagation()}>
        <h3>Schedule Video</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              Daily recurring
            </label>
          </div>
          <div className="form-actions">
            <button type="submit">Schedule</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}