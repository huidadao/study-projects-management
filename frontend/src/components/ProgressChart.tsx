import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CategoryProgress {
  category_id: number
  category_name: string
  total_videos: number
  watched_videos: number
}

interface ProgressChartProps {
  data: CategoryProgress[]
}

const COLORS = ['#1b61c9', '#2d7ff9', '#5a92ff', '#86afff', '#b3ccff', '#d9e6ff']

export function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-6 mb-6">
        <p className="text-[rgba(4,14,32,0.69)]">No categories yet</p>
      </div>
    )
  }

  const chartData = data
    .filter((item) => item.watched_videos > 0)
    .map((item) => ({
      name: item.category_name,
      value: item.watched_videos,
      total: item.total_videos,
    }))

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-6 mb-6">
        <p className="text-[rgba(4,14,32,0.69)]">No watched videos yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e0e2e6] rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-medium text-[#181d26] mb-4">Progress by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}