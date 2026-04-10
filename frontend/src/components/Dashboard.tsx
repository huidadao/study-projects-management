import { useEffect, useState, useMemo } from 'react'
import { useVideoStore, Video } from '../store/useVideoStore'
import { VideoGrid } from './VideoGrid'
import { SearchBar } from './SearchBar'
import { CategorySidebar } from './CategorySidebar'
import { QuickAddForm } from './QuickAddForm'
import { UpcomingSection } from './UpcomingSection'

export function Dashboard() {
  const {
    videos,
    categories,
    searchQuery,
    selectedCategories,
    searchType,
    fetchVideos,
    fetchCategories,
    addVideo,
    toggleWatched,
    setSearchQuery,
    setSearchType,
    toggleCategory,
  } = useVideoStore()

  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchVideos(), fetchCategories()])
      setLoading(false)
    }
    load()
  }, [fetchVideos, fetchCategories])

  // Filter videos based on search and categories
  const filteredVideos = useMemo(() => {
    let result = videos

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((v: Video) => {
        if (searchType === 'title') {
          return v.title.toLowerCase().includes(query)
        } else if (searchType === 'channel') {
          return v.channel?.toLowerCase().includes(query)
        }
        return true
      })
    }

    // Filter by selected categories (if implemented)
    // Note: Category filtering would need video-category mapping
    // This is a placeholder for when category assignment is added

    return result
  }, [videos, searchQuery, selectedCategories, searchType])

  const handleAddVideo = async (url: string) => {
    await addVideo({ url, title: 'New Video', watched: false })
  }

  const handleToggleWatched = async (id: number, watched: boolean) => {
    await toggleWatched(id, watched)
  }

  const handleVideoClick = (video: Video) => {
    // Open YouTube link in new tab
    window.open(video.url, '_blank')
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <CategorySidebar
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>My Videos</h1>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchType={searchType}
          onTypeChange={setSearchType}
        />

        <QuickAddForm onAddVideo={handleAddVideo} />

        <UpcomingSection />

        <VideoGrid
          videos={filteredVideos}
          categories={categories}
          onToggleWatched={handleToggleWatched}
          onVideoClick={handleVideoClick}
        />
      </main>
    </div>
  )
}