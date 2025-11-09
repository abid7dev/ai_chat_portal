import { useState, useRef } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarActions from "./SidebarActions";
import SidebarList from "./SidebarList";
import SidebarSearchDialog from "./SidebarSearchDialog";
import DeleteDialog from "./DeleteDialog";
import { Menu, X } from "lucide-react";
import {
  useConversations,
  useResponsiveSidebar,
  useOutsideClick,
  useSearchFilter,
} from "./hooks";

export interface Conversation {
  id: number;
  title: string;
  started_at: string;
  status: string;
  summary?: string;
  messages?: any[];
}

interface Props {
  activeId: number | null;
  onSelect: (id: number) => void;
  refresh: number;
  onSummary: (id: number, summary: string) => void;
}

export default function Sidebar({
  activeId,
  onSelect,
  refresh,
  onSummary,
}: Props) {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null as number | null,
    title: "",
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    conversations,
    filtered,
    setFiltered,
    search,
    setSearch,
    handleRename,
    handleDelete,
    handleNewChat,
    handleSummary,
  } = useConversations({
    refresh,
    deleteConfirm,
    setDeleteConfirm,
    editText,
    setEditingId,
    setMenuOpen,
    onSelect,
    onSummary,
  });

  useSearchFilter(conversations, search, setFiltered);
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed, isMobile } =
    useResponsiveSidebar();
  useOutsideClick(menuRef, () => setMenuOpen(null));

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-lg border shadow-sm transition-all
            ${
              isOpen
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          style={{
            transform: isOpen ? "translateX(260px)" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] opacity-100 animate-fadeIn md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative h-full flex flex-col z-40 bg-gray-900 text-white
    transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${isCollapsed ? "md:w-16" : "md:w-80"}
  `}
      >
        <SidebarHeader
          isOpen={isOpen}
          isCollapsed={isCollapsed}
          setIsOpen={setIsOpen}
          setIsCollapsed={setIsCollapsed}
        />

        {isOpen && !isCollapsed && (
          <>
            <SidebarActions
              isOpen={isOpen}
              handleNewChat={handleNewChat}
              search={search}
              setSearch={setSearch}
              setShowSearchDialog={setShowSearchDialog}
            />
            <SidebarList
              activeId={activeId}
              filtered={filtered}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              setEditingId={setEditingId}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onSelect={onSelect}
              handleRename={handleRename}
              handleSummary={handleSummary}
              setDeleteConfirm={setDeleteConfirm}
              onSummary={onSummary}
              menuRef={menuRef}
            />
          </>
        )}

        {isOpen && isCollapsed && (
          <SidebarActions
            isOpen={false}
            handleNewChat={handleNewChat}
            search={search}
            setSearch={setSearch}
            setShowSearchDialog={setShowSearchDialog}
          />
        )}
      </div>

      <SidebarSearchDialog
        showSearchDialog={showSearchDialog}
        setShowSearchDialog={setShowSearchDialog}
        search={search}
        setSearch={setSearch}
        filtered={filtered}
        onSelect={onSelect}
        setIsOpen={setIsOpen}
      />

      <DeleteDialog
        open={deleteConfirm.open}
        title={deleteConfirm.title}
        onCancel={() => setDeleteConfirm({ open: false, id: null, title: "" })}
        onDelete={handleDelete}
      />
    </>
  );
}
