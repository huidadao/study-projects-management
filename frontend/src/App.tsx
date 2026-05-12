import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { CategorySidebar } from './components/CategorySidebar'
import { CategoryModal } from './components/CategoryModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { VideoGrid } from './components/VideoGrid'
import { VideoModal } from './components/VideoModal'
import { Dashboard } from './components/Dashboard'
import { ToastContainer } from './components/Toast'
import { api } from './lib/api'
import { useStore } from './store'
import { useToastStore } from './store/toast'
import type { Category, Video } from './types'

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard'>('main')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteType, setDeleteType] = useState<'category' | 'video'>('category')
  const [refreshCategories, setRefreshCategories] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const showToast = useToastStore((s) => s.showToast)
  const removeCategory = useStore((s) => s.removeCategory)
  const removeVideo = useStore((s) => s.removeVideo)
  const setSelectedCategoryId = useStore((s) => s.setSelectedCategoryId)

  function handleAddCategory() {
    setSelectedCategory(null)
    setShowCategoryModal(true)
  }

  function handleEditCategory(category: Category) {
    setSelectedCategory(category)
    setShowCategoryModal(true)
  }

  function handleDeleteCategory(category: Category) {
    setSelectedCategory(category)
    setDeleteType('category')
    setShowDeleteConfirm(true)
  }

  function handleAddVideo() {
    setSelectedVideo(null)
    setShowVideoModal(true)
  }

  function handleEditVideo(video: Video) {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  function handleDeleteVideo(video: Video) {
    setSelectedVideo(video)
    setDeleteType('video')
    setShowDeleteConfirm(true)
  }

  function triggerRefresh() {
    setRefreshCategories((k) => k + 1)
  }

  async function confirmDelete() {
    try {
      if (deleteType === 'category' && selectedCategory) {
        await api.deleteCategory(selectedCategory.id)
        removeCategory(selectedCategory.id)
        // If the deleted category was selected, clear selection
        setSelectedCategoryId(null)
        showToast(`Category "${selectedCategory.name}" deleted`, 'success')
        triggerRefresh()
      } else if (deleteType === 'video' && selectedVideo) {
        await api.deleteVideo(selectedVideo.id)
        removeVideo(selectedVideo.id)
        showToast(`Video "${selectedVideo.title}" deleted`, 'success')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      showToast(msg, 'error')
      console.error('Delete failed:', err)
    } finally {
      setShowDeleteConfirm(false)
      setSelectedCategory(null)
      setSelectedVideo(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <CategorySidebar
        refreshKey={refreshCategories}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium tracking-normal text-[#181d26]">
            YouTube Learning Tracker
          </h1>
          <button
            onClick={() => setCurrentView(currentView === 'main' ? 'dashboard' : 'main')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              currentView === 'dashboard'
                ? 'bg-[#1b61c9] text-white'
                : 'border border-[#e0e2e6] text-[#181d26] hover:bg-[#f8fafc]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            {currentView === 'main' ? 'Dashboard' : 'Main'}
          </button>
        </div>

        {currentView === 'main' ? (
          <VideoGrid
            onAddVideo={handleAddVideo}
            onEditVideo={handleEditVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        ) : (
          <Dashboard />
        )}
      </main>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategory}
        onSuccess={triggerRefresh}
      />

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        video={selectedVideo}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={`Delete ${deleteType === 'category' ? 'Category' : 'Video'}`}
        message={
          deleteType === 'category'
            ? `Are you sure you want to delete "${selectedCategory?.name}"? This will also delete all child categories and videos.`
            : `Are you sure you want to delete "${selectedVideo?.title}"?`
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ToastContainer />
    </div>
  )
}

export default App
