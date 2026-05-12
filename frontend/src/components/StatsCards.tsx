interface StatsCardsProps {
  totalCategories: number
  totalVideos: number
  watchedVideos: number
}

export function StatsCards({ totalCategories, totalVideos, watchedVideos }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4">
        <p className="text-3xl font-medium text-[#181d26]">{totalCategories}</p>
        <p className="text-sm text-[rgba(4,14,32,0.69)]">Total Categories</p>
      </div>
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4">
        <p className="text-3xl font-medium text-[#181d26]">{totalVideos}</p>
        <p className="text-sm text-[rgba(4,14,32,0.69)]">Total Videos</p>
      </div>
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4">
        <p className="text-3xl font-medium text-[#181d26]">{watchedVideos}</p>
        <p className="text-sm text-[rgba(4,14,32,0.69)]">Watched Videos</p>
      </div>
    </div>
  )
}