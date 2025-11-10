import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import LoaderSpinner from "../ui/LoaderSpinner";
import ConfirmDialog from "../ui/ConfirmDialog";

interface Props {
  intelligenceMode: boolean;
  summaryView: any;
  generatingSummary: boolean;
  conversationId: number | null;
  handleEndChat: () => void;
  handleClearInsights: () => void;
}

export default function ChatHeader({
  intelligenceMode,
  summaryView,
  generatingSummary,
  conversationId,
  handleEndChat,
  handleClearInsights,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700  dark:bg-background-dark transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              {intelligenceMode ? "Conversation Intelligence" : "AI Assistant"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-text-muted-dark">
              {intelligenceMode
                ? "Ask questions about this conversation"
                : "Always here to help"}
            </p>
          </div>
        </div>

        {intelligenceMode ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Insights
          </button>
        ) : (
          !summaryView &&
          conversationId && (
            <button
              onClick={handleEndChat}
              disabled={generatingSummary}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white rounded-lg transition-all font-medium text-sm"
            >
              {generatingSummary ? (
                <div className="flex items-center gap-2">
                  <LoaderSpinner size={16} color="border-white" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <Sparkles size={16} />
                  End Chat
                </>
              )}
            </button>
          )
        )}
      </header>

      {showConfirm && (
        <ConfirmDialog
          title="Clear All Insights?"
          message="This will permanently remove all AI-generated insights for this conversation. Are you sure you want to continue?"
          confirmText="Yes, Clear All"
          cancelText="Cancel"
          onConfirm={() => {
            handleClearInsights();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
