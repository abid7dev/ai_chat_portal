import { Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteDialog({
  open,
  title,
  onCancel,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
        <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Trash2 className="text-red-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-center mb-2 text-white">
          Delete Chat?
        </h3>
        <p className="text-sm text-gray-300 text-center mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-white">"{title}"</strong>? This action cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
