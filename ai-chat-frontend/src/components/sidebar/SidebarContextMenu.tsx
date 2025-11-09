import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Conversation } from "./Sidebar";
import { Edit3, FileText, Sparkles, Trash2 } from "lucide-react";

interface Props {
  menuRef: RefObject<HTMLDivElement | null>;
  conv: Conversation;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  setEditText: Dispatch<SetStateAction<string>>;
  setMenuOpen: Dispatch<SetStateAction<number | null>>;
  handleSummary: (id: number) => Promise<void>;
  setDeleteConfirm: Dispatch<
    SetStateAction<{ open: boolean; id: number | null; title: string }>
  >;
  onSummary: (id: number, summary: string) => void;
  onSelect: (id: number) => void; // ✅ add this
}

export default function SidebarContextMenu({
  menuRef,
  conv,
  setEditingId,
  setEditText,
  setMenuOpen,
  handleSummary,
  setDeleteConfirm,
  onSummary,
  onSelect, // ✅ receive here
}: Props) {
  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-12 bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-48 py-1 z-50 animate-fadeIn"
    >
      {/* Rename */}
      <button
        onClick={() => {
          setEditingId(conv.id);
          setEditText(conv.title);
          setMenuOpen(null);
        }}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-gray-200"
      >
        <Edit3 size={14} />
        Rename
      </button>

      {/* ✅ Summary: select and trigger */}
      {conv.status === "ended" && (
        <button
          onClick={() => {
            setMenuOpen(null);
            onSelect(conv.id); // ✅ highlight selected chat
            handleSummary(conv.id); // existing behavior
          }}
          className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-blue-400"
        >
          <FileText size={14} />
          Summary
        </button>
      )}

      {/* Delete */}
      <button
        onClick={() =>
          setDeleteConfirm({
            open: true,
            id: conv.id,
            title: conv.title,
          })
        }
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-red-400"
      >
        <Trash2 size={14} />
        Delete
      </button>

      {/* ✅ Insights: select and trigger */}
      {conv.status === "ended" && (
        <button
          onClick={() => {
            setMenuOpen(null);
            onSelect(conv.id); // ✅ highlight selected chat
            onSummary(conv.id, "__SHOW_INSIGHTS__"); // trigger insights
          }}
          className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-green-400"
        >
          <Sparkles size={14} />
          Insights
        </button>
      )}
    </div>
  );
}
