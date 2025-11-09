import { Search } from "lucide-react";

interface Props {
  isOpen: boolean;
  search: string;
  setSearch: (val: string) => void;
}

export default function SidebarSearch({ isOpen, search, setSearch }: Props) {
  if (!isOpen) return null;

  return (
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
          className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 transition-all text-gray-200"
        />
      </div>
    </div>
  );
}
