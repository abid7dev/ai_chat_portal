import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";

export default function SummaryView({ summary }: { summary: any }) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-300 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles size={24} className="text-white dark:text-text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-white">
                {summary.source === "sidebar"
                  ? "Conversation Summary"
                  : "Chat Summary"}
              </h2>
              <p className="text-gray-600 text-sm">
                {summary.source === "sidebar"
                  ? "Here's the saved summary of this conversation"
                  : "Here's a summary of your conversation"}
              </p>
            </div>
          </div>
          <ReactMarkdown>{summary.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
