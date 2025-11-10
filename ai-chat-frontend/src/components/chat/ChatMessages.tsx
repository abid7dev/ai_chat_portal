import { Bot, User, Copy, CheckCheck } from "lucide-react";
import MarkdownRenderer from "../ui/MarkdownRenderer";

interface Message {
  sender: "user" | "assistant";
  content: string;
  type?: "normal" | "typing";
  timestamp?: string;
}

interface Props {
  messages: Message[];
  copiedMessage: number | null;
  copyToClipboard: (text: string, index: number) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  copiedMessage,
  copyToClipboard,
  messagesEndRef,
}: Props) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-background-dark flex-1 transition-colors">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Bot size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          How can I help you today?
        </h2>
        <p className="text-gray-600 dark:text-text-muted-dark max-w-md mx-auto">
          Start a conversation by typing a message below.
        </p>
      </div>
    );
  }

  const formatTimestamp = (ts?: string) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark transition-colors">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        {messages.map((msg, i) => {
          const isAssistant = msg.sender === "assistant";
          const isTyping = msg.type === "typing";

          return (
            <div
              key={i}
              className={`flex flex-col ${
                isAssistant ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`relative flex items-start gap-3 w-full ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {/* Assistant Avatar */}
                {isAssistant && (
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}

                {/* Assistant message */}
                {isAssistant ? (
                  isTyping ? (
                    // Typing indicator
                    <div className="flex items-center gap-1 mt-2 ml-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  ) : (
                    // Assistant response container
                    <div className="relative w-full rounded-2xl px-5 py-4 text-sm leading-relaxed bg-gray-100 dark:bg-gray-200 text-gray-800 dark:text-gray-500 overflow-visible transition-colors">
                      <div className="overflow-x-auto">
                        <MarkdownRenderer content={msg.content} />
                      </div>

                      {/* Copy icon */}
                      <button
                        onClick={() => copyToClipboard(msg.content, i)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {copiedMessage === i ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )
                ) : (
                  // User message
                  <div className="flex items-end flex-col w-1/3 ">
                    <div className="bg-gray-100 dark:bg-gray-200 text-black dark:text-text-muted-dark text-sm rounded-2xl px-4 py-3 whitespace-pre-wrap break-words inline-flex flex-col items-end transition-colors dark:text-white">
                      <MarkdownRenderer content={msg.content} />

                      <div className="flex items-center gap-2 text-xs text-gray-500  mt-1">
                        {msg.timestamp && (
                          <span className="italic">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                        )}
                        <button
                          onClick={() => copyToClipboard(msg.content, i)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {copiedMessage === i ? (
                            <CheckCheck size={12} />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Avatar */}
                {!isAssistant && (
                  <div className="w-9 h-9 bg-gray-600  rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-colors">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
