import { MessageSquare, X } from "lucide-react";
import type { Conversation } from "./Sidebar";

interface Props {
  showSearchDialog: boolean;
  setShowSearchDialog: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  filtered: Conversation[];
  onSelect: (id: number) => void;
  setIsOpen: (v: boolean) => void;
}

export default function SidebarSearchDialog({
  showSearchDialog,
  setShowSearchDialog,
  search,
  setSearch,
  filtered,
  onSelect,
  setIsOpen,
}: Props) {
  if (!showSearchDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-32 z-50">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl shadow-xl border border-gray-700 animate-fadeIn mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Search Chats</h3>
          <button
            onClick={() => setShowSearchDialog(false)}
            className="text-gray-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <input
            autoFocus
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-100 placeholder-gray-400"
          />
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  onSelect(conv.id);
                  setSearch("");
                  setShowSearchDialog(false);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-gray-800 rounded-lg transition-all text-gray-200"
              >
                <MessageSquare size={16} />
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{conv.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(conv.started_at).toLocaleDateString()} •{" "}
                    {new Date(conv.started_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4 text-sm">
              No chats found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
