import { useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { CategorySidebar } from './components/CategorySidebar'
import { CategoryModal } from './components/CategoryModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { VideoGrid } from './components/VideoGrid'
import { VideoModal } from './components/VideoModal'
import { Dashboard } from './components/Dashboard'

interface Category {
  id: number
  name: string
  parent_id: number | null
  created_at: string
  children?: Category[]
}

interface Video {
  id: number
  title: string
  url: string
  category_id: number
  watched: boolean
}

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard'>('main')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteType, setDeleteType] = useState<'category' | 'video'>('category')
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

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

  async function confirmDelete() {
    try {
      if (deleteType === 'category' && selectedCategory) {
        await fetch(`http://localhost:8000/categories/${selectedCategory.id}`, {
          method: 'DELETE'
        })
      } else if (deleteType === 'video' && selectedVideo) {
        await fetch(`http://localhost:8000/videos/${selectedVideo.id}`, {
          method: 'DELETE'
        })
      }
      window.location.reload()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <CategorySidebar
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
    </div>
  )
}

export default App