interface SummaryPromptProps {
  onLater: () => void;
  onSummarize: () => void;
}

export default function SummaryPrompt({
  onLater,
  onSummarize,
}: SummaryPromptProps) {
  return (
    <div className="absolute top-16 right-6 z-50 animate-slideDownFadeIn">
      <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-4 w-80">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          💡 End Conversation?
        </h3>
        <p className="text-xs text-gray-600 mb-3 leading-snug">
          You’ve exchanged several messages — would you like to end this chat
          and generate a summary?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onLater}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Later
          </button>
          <button
            onClick={onSummarize}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            End & Summarize
          </button>
        </div>
      </div>
    </div>
  );
}
