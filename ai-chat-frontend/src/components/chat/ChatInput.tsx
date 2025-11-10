import { Send } from "lucide-react";
import LoaderSpinner from "../ui/LoaderSpinner";

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  generatingSummary: boolean;
  handleSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function ChatInput({
  input,
  setInput,
  loading,
  generatingSummary,
  handleSend,
  textareaRef,
}: Props) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading || generatingSummary}
            placeholder="Message AI Assistant..."
            rows={1}
            className="flex-1 resize-none border-0 focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 py-2 leading-relaxed max-h-32 bg-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || generatingSummary}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              input.trim() && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400"
            }`}
          >
            {loading ? (
              <LoaderSpinner size={20} color="border-white" />
            ) : (
              <Send size={18} className="translate-y-[0.5px]" />
            )}
          </button>
        </div>

        <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-3">
          AI can make mistakes. Consider checking important information. Created
          by Abid.
        </footer>
      </div>
    </div>
  );
}
