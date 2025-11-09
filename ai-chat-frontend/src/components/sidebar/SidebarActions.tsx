import { Plus, Search } from "lucide-react";

interface Props {
  isOpen: boolean;
  handleNewChat: () => void;
  search: string;
  setSearch: (v: string) => void;
  setShowSearchDialog: (v: boolean) => void;
}

export default function SidebarActions({
  isOpen,
  handleNewChat,
  search,
  setSearch,
  setShowSearchDialog,
}: Props) {
  if (!isOpen)
    return (
      <div className="space-y-3 px-2 hidden md:flex flex-col items-center pt-3">
        <button
          onClick={handleNewChat}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
          title="New chat"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={() => setShowSearchDialog(true)}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          title="Search chats"
        >
          <Search size={18} />
        </button>
      </div>
    );

  return (
    <>
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2.5 rounded-lg"
        >
          <Plus size={18} />
          <span className="font-medium">New chat</span>
        </button>
      </div>

      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      </div>
    </>
  );
}
