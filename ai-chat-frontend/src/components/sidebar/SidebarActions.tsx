import { useEffect, useState } from "react";
import { Plus, Search, Moon, Sun } from "lucide-react";

interface Props {
  isOpen: boolean;
  isCollapsed: boolean;
  handleNewChat: () => void;
  search: string;
  setSearch: (v: string) => void;
  setShowSearchDialog: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export default function SidebarActions({
  isCollapsed,
  handleNewChat,
  search,
  setSearch,
  setShowSearchDialog,
  darkMode,
  setDarkMode,
}: Props) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (!isCollapsed) {
      timeout = window.setTimeout(() => setShowContent(true), 350);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  // Collapsed Sidebar
  if (isCollapsed)
    return (
      <div className="space-y-3 px-2 hidden md:flex flex-col items-center pt-3 transition-opacity duration-300 opacity-100">
        <button
          onClick={handleNewChat}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer"
          title="New chat"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={() => setShowSearchDialog(true)}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg cursor-pointer"
          title="Search chats"
        >
          <Search size={18} />
        </button>
      </div>
    );

  // Expanded Sidebar layout
  return (
    <div
      className={`transition-opacity duration-300 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
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
    </div>
  );
}
