interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scaleIn">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-text-muted-dark mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-border-dark dark:hover:bg-surface-dark transition dark:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
