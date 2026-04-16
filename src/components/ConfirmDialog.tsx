interface Props {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-xl bg-[var(--color-bg)] p-6 shadow-lg border border-[var(--color-border)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium mb-2">{title}</h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-border)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
