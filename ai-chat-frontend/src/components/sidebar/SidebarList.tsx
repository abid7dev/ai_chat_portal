import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Conversation } from "./Sidebar";
import { MessageSquare, MoreVertical, Star } from "lucide-react";
import SidebarContextMenu from "./SidebarContextMenu";

interface Props {
  activeId: number | null;
  filtered: Conversation[];
  editingId: number | null;
  editText: string;
  setEditText: Dispatch<SetStateAction<string>>;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  menuOpen: number | null;
  setMenuOpen: Dispatch<SetStateAction<number | null>>;
  onSelect: (id: number) => void;
  handleRename: (id: number) => Promise<void>;
  handleSummary: (id: number) => Promise<void>;
  setDeleteConfirm: Dispatch<
    SetStateAction<{ open: boolean; id: number | null; title: string }>
  >;
  onSummary: (id: number, summary: string) => void;
  menuRef: RefObject<HTMLDivElement | null>;
}

export default function SidebarList({
  activeId,
  filtered,
  editingId,
  editText,
  setEditText,
  setEditingId,
  menuOpen,
  setMenuOpen,
  onSelect,
  handleRename,
  handleSummary,
  setDeleteConfirm,
  onSummary,
  menuRef,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto py-2">
      <div className="space-y-1 px-2">
        {filtered.map((conv) => (
          <div
            key={conv.id}
            className={`relative group rounded-lg transition-all ${
              activeId === conv.id
                ? "bg-gray-800 border border-gray-600"
                : "hover:bg-gray-800 border border-transparent"
            }`}
          >
            <div
              onClick={() => {
                onSelect(conv.id);
                if (window.innerWidth < 768) document.body.click();
              }}
              className="p-3 cursor-pointer"
            >
              {editingId === conv.id ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleRename(conv.id) : null
                  }
                  onBlur={() => handleRename(conv.id)}
                  className="w-full px-2 py-1 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              ) : (
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="font-medium text-white text-sm truncate">
                        {conv.title}
                      </span>
                      {conv.status === "ended" && (
                        <Star
                          size={12}
                          className="text-yellow-500 flex-shrink-0"
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 ml-6">
                      {new Date(conv.started_at).toLocaleDateString()} •{" "}
                      {new Date(conv.started_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === conv.id ? null : conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded transition-all"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              )}
            </div>

            {menuOpen === conv.id && (
              <SidebarContextMenu
                menuRef={menuRef}
                conv={conv}
                setEditingId={setEditingId}
                setEditText={setEditText}
                setMenuOpen={setMenuOpen}
                handleSummary={handleSummary}
                setDeleteConfirm={setDeleteConfirm}
                onSummary={onSummary}
                onSelect={onSelect}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
