import MarkdownRenderer from "../ui/MarkdownRenderer";
import LoaderSpinner from "../ui/LoaderSpinner";

interface ConversationInfo {
  title: string;
  started_at: string;
  messagesCount: number;
}

interface Props {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  insights: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  loading: boolean;
  onAsk: () => void;
  onClear: () => void;
  conversationInfo?: ConversationInfo | null;
}

export default function IntelligenceView({
  question,
  setQuestion,
  insights,
  loading,
  onAsk,
  conversationInfo,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-6">
        {/* Conversation metadata panel */}
        {conversationInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-8 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                  Title
                </p>
                <p className="text-gray-900 font-semibold truncate">
                  {conversationInfo.title}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                  Messages
                </p>
                <p className="text-gray-900 font-semibold">
                  {conversationInfo.messagesCount}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                  Started
                </p>
                <p className="text-gray-900 font-semibold">
                  {new Date(conversationInfo.started_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Query input section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">
            Analyze Conversation
          </h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && onAsk()}
                placeholder="Ask about decisions, action items, or key insights..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={loading}
              />
            </div>
            <button
              onClick={onAsk}
              disabled={loading || !question.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                loading || !question.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderSpinner size={16} color="border-white" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Ask"
              )}
            </button>
          </div>
        </div>

        {/* Insights feed */}
        <div className="space-y-6">
          {insights.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-600 font-medium mb-2">
                No insights yet
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Start by asking a question about the conversation to uncover key
                insights and patterns.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {insights
                .slice()
                .reverse()
                .map((insight, idx) => (
                  <div
                    key={`${insight.timestamp}-${idx}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-gray-900 font-medium">
                            {insight.question}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                          {insight.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                      <MarkdownRenderer content={insight.answer} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
