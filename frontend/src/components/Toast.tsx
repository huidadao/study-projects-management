import { useToastStore } from '../store/toast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[300px] animate-in slide-in-from-right fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="p-1 hover:bg-black/5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
