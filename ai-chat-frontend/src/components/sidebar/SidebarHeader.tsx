import { useEffect, useState } from "react";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (open: boolean) => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function SidebarHeader({
  isOpen,
  isCollapsed,
  setIsCollapsed,
}: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✨ Wait until sidebar animation completes before showing title
  useEffect(() => {
    let timeout: number;
    if (!isCollapsed) {
      timeout = window.setTimeout(() => setShowText(true), 350); // match animation duration
    } else {
      setShowText(false);
    }
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  const handleToggle = () => {
    if (!isMobile) setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="p-5 border-b border-gray-700 bg-gray-900 flex items-center justify-between">
      {/* Left section — assistant icon + title */}
      <div className="flex items-center gap-3 overflow-hidden">
        {!isMobile && isOpen && (
          <>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            {/* Smooth fade-in for title */}
            <h2
              className={`text-lg font-semibold text-white whitespace-nowrap transition-opacity duration-300 ${
                !isCollapsed && showText ? "opacity-100" : "opacity-0"
              }`}
            >
              AI Assistant
            </h2>
          </>
        )}
      </div>

      {/* Right chevron (only desktop) */}
      {!isMobile && (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </div>
  );
}
