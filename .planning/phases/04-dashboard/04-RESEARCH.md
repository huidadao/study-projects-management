# Phase 4: Dashboard - Research

**Researched:** 2026-04-12

## Domain: Dashboard Visualization

### What to Implement

Phase 4 builds a dashboard view showing learning progress with:
- Stats cards (total categories, total videos, watched videos)
- Pie chart showing progress by category
- Video cards grid below chart

### Technical Approach

**Backend Already Done:**
- `GET /dashboard` endpoint implemented in `backend/main.py` (lines 256-298)
- Returns: `{ total_categories, total_videos, watched_videos, progress_by_category[] }`
- `progress_by_category[]`: `{ category_id, category_name, total_videos, watched_videos }`

**Frontend Technologies:**
- React + Vite + TypeScript (existing)
- Tailwind CSS with Airtable colors (`#181d26`, `#1b61c9`)
- Recharts library for pie chart (per D-04)

### Recharts Implementation

**Pie Chart Setup:**
```tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
```

**Data Format for Pie:**
```typescript
const data = progressByCategory.map(cat => ({
  name: cat.category_name,
  value: cat.watched_videos,
  total: cat.total_videos,
}))
```

**Colors:** Use Tailwind colors or custom array for slices.

### Responsive Design

- Stats cards: 3-column grid on desktop (grid-cols-3), stacked on mobile (grid-cols-1)
- Video grid: reuse existing VideoGrid component pattern
- Chart: ResponsiveContainer to fit parent

### Integration

**Fetch Dashboard Data:**
```typescript
const response = await fetch('http://localhost:8000/dashboard')
const data = await response.json()
```

**Component Structure:**
```
Dashboard.tsx (new page)
├── StatsCards component
├── ProgressChart component (pie)
└── VideoGrid (existing, reuse)
```

### Airtable Design Alignment

From PAGE-DESIGN.md:
- Primary text: `#181d26` (deep navy)
- CTA/accent: `#1b61c9` (airtable blue)
- Card border: `#e0e2e6`
- Card radius: 16px-24px
- Shadow: blue-tinted multi-layer

---

## Validation Architecture

### What Needs Verification

1. **Dimension 1 - Correctness:**
   - Dashboard page loads without errors
   - API returns valid data structure

2. **Dimension 3 - Integration:**
   - Frontend connects to `/dashboard` endpoint
   - Stats display correctly
   - Chart renders with real data

3. **Dimension 5 - Visual:**
   - Pie chart displays category progress
   - Stats cards show numbers
   - Responsive on mobile

### Verification Commands

```bash
# Backend runs
curl http://localhost:8000/health

# Frontend builds
cd frontend && npm run build

# Verify no console errors (manual)
# Visit http://localhost:5173
```

---

*Research: Phase 04-dashboard*