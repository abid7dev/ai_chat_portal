import { useEffect, useState } from "react";
import {
  getAllConversations,
  createConversation,
  deleteConversation,
  renameConversation,
  getConversation,
} from "../../api";
import type { Conversation } from "./Sidebar";

// Conversations CRUD + state
export function useConversations({
  refresh,
  deleteConfirm,
  setDeleteConfirm,
  editText,
  setEditingId,
  setMenuOpen,
  onSelect,
  onSummary,
}: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");

  const loadConversations = async () => {
    const data = await getAllConversations();
    setConversations(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadConversations();
  }, [refresh]);

  const handleNewChat = async () => {
    const emptyChat = conversations.find(
      (c) => !c.messages || c.messages.length === 0
    );
    if (emptyChat) {
      onSelect(emptyChat.id);
      setSearch("");
      if (window.innerWidth < 768) document.body.click();
      return;
    }
    const conv = await createConversation();
    await loadConversations();
    onSelect(conv.id);
    setSearch("");
    if (window.innerWidth < 768) document.body.click();
  };

  const handleRename = async (id: number) => {
    if (!editText.trim()) return;
    await renameConversation(id, editText.trim());
    setEditingId(null);
    setMenuOpen(null);
    await loadConversations();
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    await deleteConversation(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: null, title: "" });
    await loadConversations();
  };

  const handleSummary = async (id: number) => {
    setMenuOpen(null);
    const conv = await getConversation(id);
    if (conv.summary?.trim()) {
      onSummary(id, conv.summary);
    } else {
      alert("No summary available for this conversation yet.");
    }
  };

  return {
    conversations,
    filtered,
    setFiltered,
    search,
    setSearch,
    handleNewChat,
    handleRename,
    handleDelete,
    handleSummary,
  };
}

// Search filter logic
export function useSearchFilter(
  conversations: Conversation[],
  search: string,
  setFiltered: (c: Conversation[]) => void
) {
  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.started_at.toLowerCase().includes(lower)
      )
    );
  }, [search, conversations]);
}

// Responsive sidebar behavior
export function useResponsiveSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    let wasMobile = window.innerWidth < 768;
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      if (nowMobile !== wasMobile) {
        wasMobile = nowMobile;
        setIsMobile(nowMobile);
        setIsOpen(!nowMobile);
        if (nowMobile) setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isOpen, setIsOpen, isCollapsed, setIsCollapsed, isMobile };
}

// Outside click detection
export function useOutsideClick(ref: React.RefObject<any>, callback: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}
