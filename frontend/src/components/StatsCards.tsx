import { Folder, FolderOpen, Film, CheckCircle } from 'lucide-react'

interface StatsCardsProps {
  totalParentCategories: number
  totalChildCategories: number
  totalVideos: number
  watchedVideos: number
}

export function StatsCards({
  totalParentCategories,
  totalChildCategories,
  totalVideos,
  watchedVideos,
}: StatsCardsProps) {
  const completionRate = totalVideos > 0
    ? Math.round((watchedVideos / totalVideos) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Parent Categories */}
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
          <Folder className="w-5 h-5 text-[#1b61c9]" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#181d26]">{totalParentCategories}</p>
          <p className="text-xs text-[rgba(4,14,32,0.6)]">Parent Categories</p>
        </div>
      </div>

      {/* Child Categories */}
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 rounded-xl shrink-0">
          <FolderOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#181d26]">{totalChildCategories}</p>
          <p className="text-xs text-[rgba(4,14,32,0.6)]">Child Categories</p>
        </div>
      </div>

      {/* Total Videos */}
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 rounded-xl shrink-0">
          <Film className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#181d26]">{totalVideos}</p>
          <p className="text-xs text-[rgba(4,14,32,0.6)]">Total Videos</p>
        </div>
      </div>

      {/* Watched Videos */}
      <div className="bg-white border border-[#e0e2e6] rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 rounded-xl shrink-0">
          <CheckCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#181d26]">{watchedVideos}</p>
          <p className="text-xs text-[rgba(4,14,32,0.6)]">
            Watched ({completionRate}%)
          </p>
        </div>
      </div>
    </div>
  )
}
