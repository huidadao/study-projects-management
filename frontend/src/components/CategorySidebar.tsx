import { Category } from '../store/useVideoStore'

interface CategorySidebarProps {
  categories: Category[]
  selectedCategories: number[]
  onToggleCategory: (id: number) => void
}

export function CategorySidebar({ categories, selectedCategories, onToggleCategory }: CategorySidebarProps) {
  const handleClearAll = () => {
    categories.forEach(cat => {
      if (selectedCategories.includes(cat.id)) {
        onToggleCategory(cat.id)
      }
    })
  }

  return (
    <aside className="category-sidebar">
      <div className="sidebar-header">
        <h3>Categories</h3>
        {selectedCategories.length > 0 && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            Clear
          </button>
        )}
      </div>
      
      <div className="category-list">
        {categories.length === 0 ? (
          <p className="empty-categories">No categories yet.</p>
        ) : (
          categories.map(category => (
            <label key={category.id} className="category-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => onToggleCategory(category.id)}
              />
              <span className="category-label">
                {category.name}
                <span className="category-type">({category.category_type})</span>
              </span>
            </label>
          ))
        )}
      </div>
    </aside>
  )
}