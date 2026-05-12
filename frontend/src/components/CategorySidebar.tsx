import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import type { Category } from '../types'

interface CategorySidebarProps {
  onAddCategory: () => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (category: Category) => void
}

export function CategorySidebar({ onAddCategory, onEditCategory, onDeleteCategory }: CategorySidebarProps) {
  const { categories, setCategories } = useStore()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const data = await api.getCategoryTree()
      setCategories(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch categories'
      showToast(msg, 'error')
      console.error('Failed to fetch categories:', err)
    }
  }

  function toggleExpand(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function renderCategory(category: Category, depth: number = 0): JSX.Element {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedIds.has(category.id)

    return (
      <div key={category.id}>
        <div
          className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-[#f8fafc] transition-colors duration-150"
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => hasChildren && toggleExpand(category.id)}
        >
          {hasChildren ? (
            <button className="p-1 hover:bg-gray-200 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-[rgba(4,14,32,0.69)]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[rgba(4,14,32,0.69)]" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span className="flex-1 text-[#181d26] text-base font-normal">
            {category.name}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={(e) => { e.stopPropagation(); onEditCategory(category) }}
            >
              <Edit2 className="w-3.5 h-3.5 text-[rgba(4,14,32,0.69)]" />
            </button>
            <button
              className="p-1 hover:bg-red-100 rounded"
              onClick={(e) => { e.stopPropagation(); onDeleteCategory(category) }}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children?.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 h-screen border-r border-[#e0e2e6] flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-[#e0e2e6]">
        <h2 className="text-lg font-medium text-[#181d26]">Categories</h2>
        <button
          className="p-1.5 hover:bg-[#f8fafc] rounded-md transition-colors"
          onClick={onAddCategory}
        >
          <Plus className="w-5 h-5 text-[#1b61c9]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((cat) => (
          <div key={cat.id} className="group">
            {renderCategory(cat)}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-2 text-[rgba(4,14,32,0.69)] text-sm">
            No categories yet
          </p>
        )}
      </div>
    </aside>
  )
}
