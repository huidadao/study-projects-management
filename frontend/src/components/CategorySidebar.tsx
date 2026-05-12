import { useEffect, useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { useToastStore } from '../store/toast'
import { useStore } from '../store'
import type { Category } from '../types'

interface CategorySidebarProps {
  refreshKey?: number
  onAddCategory: () => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (category: Category) => void
}

export function CategorySidebar({ refreshKey = 0, onAddCategory, onEditCategory, onDeleteCategory }: CategorySidebarProps) {
  const { setCategories, setSelectedCategoryId, selectedCategoryId } = useStore()
  const [tree, setTree] = useState<Category[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const showToast = useToastStore((s) => s.showToast)

  useEffect(() => {
    loadData()
  }, [refreshKey])

  async function loadData() {
    setLoading(true)
    try {
      // Fetch tree for sidebar
      const treeData = await api.getCategoryTree()
      setTree(treeData)

      // Fetch flat list for store (dropdowns, mappings)
      const flatData = await api.getCategories()
      setCategories(flatData)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load categories'
      showToast(msg, 'error')
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(false)
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

  function handleSelectCategory(id: number | null) {
    setSelectedCategoryId(id)
  }

  function renderCategory(category: Category, depth: number = 0): JSX.Element {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedIds.has(category.id)
    const isSelected = selectedCategoryId === category.id

    return (
      <div key={category.id}>
        <div
          className={`
            group flex items-center gap-1.5 py-2 pr-3 cursor-pointer
            hover:bg-[#f8fafc] transition-colors duration-150
            ${isSelected ? 'bg-[#eef4ff]' : ''}
          `}
          style={{ paddingLeft: `${10 + depth * 18}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(category.id)
            }
            handleSelectCategory(category.id)
          }}
        >
          {/* Expand/Collapse chevron */}
          <button
            className={`
              p-0.5 rounded transition-colors shrink-0
              ${hasChildren ? 'hover:bg-gray-200' : 'invisible'}
            `}
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleExpand(category.id)
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[rgba(4,14,32,0.5)]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[rgba(4,14,32,0.5)]" />
              )
            ) : (
              <span className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Category name */}
          <span className={`
            flex-1 text-sm truncate select-none
            ${isSelected ? 'text-[#1b61c9] font-medium' : 'text-[#181d26] font-normal'}
          `}>
            {category.name}
          </span>

          {/* Action buttons - visible on hover */}
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              className="p-1 hover:bg-gray-200 rounded"
              onClick={(e) => { e.stopPropagation(); onEditCategory(category) }}
              title="Edit"
            >
              <Edit2 className="w-3 h-3 text-[rgba(4,14,32,0.5)]" />
            </button>
            <button
              className="p-1 hover:bg-red-100 rounded"
              onClick={(e) => { e.stopPropagation(); onDeleteCategory(category) }}
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-60 h-screen border-r border-[#e0e2e6] flex flex-col bg-white shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e0e2e6]">
        <h2 className="text-sm font-semibold text-[#181d26] uppercase tracking-wide">Categories</h2>
        <button
          className="p-1.5 hover:bg-[#f8fafc] rounded-md transition-colors"
          onClick={onAddCategory}
          title="Add category"
        >
          <Plus className="w-4 h-4 text-[#1b61c9]" />
        </button>
      </div>

      {/* Category count */}
      <div className="px-4 py-2 border-b border-[#e0e2e6]">
        <button
          onClick={() => handleSelectCategory(null)}
          className={`
            text-sm w-full text-left py-1.5 px-2 rounded-lg transition-colors
            ${selectedCategoryId === null
              ? 'bg-[#eef4ff] text-[#1b61c9] font-medium'
              : 'text-[rgba(4,14,32,0.69)] hover:bg-[#f8fafc]'
            }
          `}
        >
          All Videos
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="px-4 py-3">
            <p className="text-sm text-[rgba(4,14,32,0.5)]">Loading categories...</p>
          </div>
        ) : tree.length === 0 ? (
          <div className="px-4 py-3">
            <p className="text-sm text-[rgba(4,14,32,0.5)]">No categories yet</p>
            <button
              onClick={onAddCategory}
              className="mt-2 text-sm text-[#1b61c9] hover:underline"
            >
              Create your first category
            </button>
          </div>
        ) : (
          tree.map((cat) => renderCategory(cat))
        )}
      </div>
    </aside>
  )
}
