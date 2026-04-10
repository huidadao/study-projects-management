import { useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  searchType: 'title' | 'channel' | 'notes'
  onTypeChange: (type: 'title' | 'channel' | 'notes') => void
}

export function SearchBar({ value, onChange, searchType, onTypeChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, onChange])

  // Sync when value changes externally
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search videos..."
        className="search-input"
      />
      
      <select
        value={searchType}
        onChange={(e) => onTypeChange(e.target.value as 'title' | 'channel' | 'notes')}
        className="search-type-select"
      >
        <option value="title">Title</option>
        <option value="channel">Channel</option>
        <option value="notes">Notes</option>
      </select>
      
      {inputValue && (
        <button className="search-clear" onClick={handleClear} title="Clear search">
          ✕
        </button>
      )}
    </div>
  )
}