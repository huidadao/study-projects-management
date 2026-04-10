import { useEffect } from 'react'
import { useVideoStore, Video, Schedule } from '../store/useVideoStore'

interface UpcomingItem extends Schedule {
  video_title?: string
  video_thumbnail?: string
  video_channel?: string
}

export function UpcomingSection() {
  const { upcoming, fetchUpcoming, completeSchedule, removeSchedule, videos, fetchVideos } = useVideoStore()

  useEffect(() => {
    fetchVideos()
    fetchUpcoming()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (upcoming.length === 0) return null

  const enrichedUpcoming: UpcomingItem[] = upcoming.map(s => {
    const video = videos.find(v => v.id === s.video_id)
    return {
      ...s,
      video_title: video?.title,
      video_thumbnail: video?.thumbnail,
      video_channel: video?.channel
    }
  })

  return (
    <div className="upcoming-section">
      <h2>Upcoming</h2>
      <div className="upcoming-list">
        {enrichedUpcoming.map((schedule) => (
          <div key={schedule.id} className="upcoming-item">
            <div className="upcoming-date">{formatDate(schedule.scheduled_date)}</div>
            <div className="upcoming-info">
              {schedule.video_thumbnail && (
                <img src={schedule.video_thumbnail} alt="" className="upcoming-thumbnail" />
              )}
              <div className="upcoming-text">
                <span className="upcoming-title">{schedule.video_title || `Video ${schedule.video_id}`}</span>
                {schedule.video_channel && (
                  <span className="upcoming-channel">{schedule.video_channel}</span>
                )}
              </div>
              {schedule.recurring && (
                <span className="recurring-badge">{schedule.recurring_type}</span>
              )}
            </div>
            <div className="upcoming-actions">
              <button 
                onClick={() => completeSchedule(schedule.id)}
                className="btn-complete"
              >
                Complete
              </button>
              <button 
                onClick={() => removeSchedule(schedule.id)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}