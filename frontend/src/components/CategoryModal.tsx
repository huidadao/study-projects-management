import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../store'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import type { Category } from '../types'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  onSuccess?: () => void
}

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const categories = useStore((state) => state.categories)
  const addCategory = useStore((state) => state.addCategory)
  const updateCategoryInStore = useStore((state) => state.updateCategory)
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<number | null>(null)
  const [newParentName, setNewParentName] = useState('')
  const [showNewParent, setShowNewParent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setParentId(category.parent_id)
    } else {
      setName('')
      setParentId(null)
      setNewParentName('')
      setShowNewParent(false)
    }
    setError('')
  }, [category, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    setLoading(true)
    setError('')

    try {
      let parentIdToUse = parentId

      if (showNewParent && newParentName.trim()) {
        const parentData = await api.createCategory({ name: newParentName.trim() })
        parentIdToUse = parentData.id
      }

      if (category) {
        const updated = await api.updateCategory(category.id, { name: name.trim() })
        updateCategoryInStore(updated)
        showToast('Category updated successfully', 'success')
      } else {
        const created = await api.createCategory({
          name: name.trim(),
          parent_id: parentIdToUse,
        })
        addCategory(created)
        showToast('Category created successfully', 'success')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const allCategories = categories.filter((c) => !category || c.id !== category.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-[#181d26]">
            {category ? 'Edit Category' : 'Add Category'}
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={onClose}>
            <X className="w-5 h-5 text-[rgba(4,14,32,0.69)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#181d26] mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
              placeholder="Category name"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {!category && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#181d26] mb-1">
                Parent Category (optional)
              </label>
              <select
                value={showNewParent ? 'new' : (parentId || '')}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setShowNewParent(true)
                    setParentId(null)
                  } else {
                    setShowNewParent(false)
                    setParentId(e.target.value ? Number(e.target.value) : null)
                  }
                }}
                className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
              >
                <option value="">No parent</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value="new">+ Create new parent</option>
              </select>
            </div>
          )}

          {showNewParent && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#181d26] mb-1">
                New Parent Category Name
              </label>
              <input
                type="text"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e0e2e6] rounded-md text-[#181d26] focus:outline-none focus:ring-2 focus:ring-[#1b61c9]"
                placeholder="Enter new parent category name"
              />
            </div>
          )}

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
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
