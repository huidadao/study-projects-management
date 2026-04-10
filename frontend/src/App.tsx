import { useEffect, useState } from 'react'
import { useVideoStore } from './store/useVideoStore'

function App() {
  const { videos, categories, fetchVideos, fetchCategories, addVideo, addCategory } = useVideoStore()
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    fetchVideos()
    fetchCategories()
  }, [])

  return (
    <div className="app">
      <header>
        <h1>YouTube Video Study Manager</h1>
      </header>
      
      <main>
        {/* Video Form */}
        <section className="form-section">
          <h2>Add New Video</h2>
          <div className="form-row">
            <input 
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="YouTube URL"
            />
            <button onClick={() => {
              addVideo({ url: newVideoUrl, title: 'New Video', watched: false })
              setNewVideoUrl('')
            }}>
              Add Video
            </button>
          </div>
        </section>

        {/* Video List */}
        <section className="list-section">
          <h2>Videos ({videos.length})</h2>
          {videos.length === 0 ? (
            <p className="empty">No videos yet. Add your first video above.</p>
          ) : (
            <ul className="video-list">
              {videos.map(video => (
                <li key={video.id} className="video-item">
                  <span className="video-title">{video.title}</span>
                  {video.channel && <span className="video-channel">{video.channel}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Category Form */}
        <section className="form-section">
          <h2>Add Category</h2>
          <div className="form-row">
            <input 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
            />
            <button onClick={() => {
              addCategory(newCategoryName, 'major')
              setNewCategoryName('')
            }}>
              Add Category
            </button>
          </div>
        </section>

        {/* Category List */}
        <section className="list-section">
          <h2>Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <p className="empty">No categories yet. Add your first category above.</p>
          ) : (
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat.id} className="category-item">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-type">({cat.category_type})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App