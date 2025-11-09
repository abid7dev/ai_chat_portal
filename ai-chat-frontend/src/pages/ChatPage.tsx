import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";
import SummaryView from "../components/chat/SummaryView";
import IntelligenceView from "../components/chat/IntelligenceView";
import SummaryPrompt from "../components/chat/SummaryPrompt";

import {
  createConversation,
  sendMessage,
  getConversation,
  endConversation,
  askIntelligence,
} from "../api";

// -------------------------
// Types
// -------------------------
interface Message {
  sender: "user" | "assistant";
  content: string;
  type?: "normal" | "typing";
  timestamp?: string;
}

interface Insight {
  question: string;
  answer: string;
  timestamp: string;
}

interface ConversationInfo {
  title: string;
  started_at: string;
  messagesCount: number;
  status?: string;
}

// -------------------------
// Typing effect config
// -------------------------
const TYPING_INTERVAL_MS = 20; // lower = faster typing

// -------------------------
// Component
// -------------------------
export default function ChatPage() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversationInfo, setConversationInfo] =
    useState<ConversationInfo | null>(null);
  const [conversationStatus, setConversationStatus] = useState<
    "active" | "ended" | undefined
  >();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);

  const [summaryView, setSummaryView] = useState<null | {
    id: number;
    text: string;
    source: string;
  }>(null);

  const [intelligenceMode, setIntelligenceMode] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [question, setQuestion] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const [showSummaryPrompt, setShowSummaryPrompt] = useState(false);
  const [totalMessageCount, setTotalMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  // Load or create conversation
  useEffect(() => {
    const initializeChat = async () => {
      const storedId = localStorage.getItem("activeConversationId");
      if (storedId) {
        const id = Number(storedId);
        try {
          const conv = await getConversation(id);
          const sortedMessages = (conv.messages || [])
            .map((m: any) => ({
              sender: m.sender,
              content: m.content,
              timestamp:
                m.timestamp || m.created_at || new Date().toISOString(),
            }))
            .sort(
              (a: any, b: any) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            );
          setConversationId(id);
          setMessages(sortedMessages);
          setConversationInfo({
            title: conv.title,
            started_at: conv.started_at,
            messagesCount: sortedMessages.length,
            status: conv.status,
          });
          setConversationStatus(conv.status);
          setTotalMessageCount(sortedMessages.length);
          const stored = localStorage.getItem(`insights_${id}`);
          setInsights(stored ? JSON.parse(stored) : []);
          return;
        } catch {
          localStorage.removeItem("activeConversationId");
        }
      }

      const newConv = await createConversation();
      setConversationId(newConv.id);
      localStorage.setItem("activeConversationId", String(newConv.id));
      setConversationInfo({
        title: newConv.title || "New Chat",
        started_at: newConv.started_at || new Date().toISOString(),
        messagesCount: 0,
        status: newConv.status || "active",
      });
      setConversationStatus("active");
      setMessages([]);
      setInsights([]);
    };
    initializeChat();
  }, []);

  // Show summary prompt every 4 messages
  useEffect(() => {
    if (conversationStatus === "ended") return;
    if (totalMessageCount > 0 && totalMessageCount % 4 === 0) {
      setShowSummaryPrompt(true);
    }
  }, [totalMessageCount, conversationStatus]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleSelectConversation = async (id: number) => {
    localStorage.setItem("activeConversationId", String(id));
    setSummaryView(null);
    setIntelligenceMode(false);
    setConversationId(id);
    setShowSummaryPrompt(false);
    setTotalMessageCount(0);

    const conv = await getConversation(id);
    const sortedMessages = (conv.messages || [])
      .map((m: any) => ({
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp || m.created_at || new Date().toISOString(),
      }))
      .sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    setMessages(sortedMessages);
    setConversationInfo({
      title: conv.title,
      started_at: conv.started_at,
      messagesCount: sortedMessages.length,
      status: conv.status,
    });
    setConversationStatus(conv.status);
    setTotalMessageCount(sortedMessages.length);

    const stored = localStorage.getItem(`insights_${id}`);
    setInsights(stored ? JSON.parse(stored) : []);
  };

  // ✨ ChatGPT-style typing assistant
  const handleSend = async () => {
    if (!input.trim() || !conversationId || generatingSummary) return;
    if (conversationStatus === "ended") return;

    const text = input.trim();
    const userTimestamp = new Date().toISOString();
    setInput("");
    setSummaryView(null);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: text, timestamp: userTimestamp },
    ]);
    setTotalMessageCount((prev) => prev + 1);

    // Typing placeholder
    setMessages((prev) => [
      ...prev,
      { sender: "assistant", content: "", type: "typing" },
    ]);
    setLoading(true);

    try {
      const response = await sendMessage(conversationId, "user", text);
      const assistantContent = response?.[1]?.content || "No response";
      const assistantTimestamp =
        response?.[1]?.timestamp ||
        response?.[1]?.created_at ||
        new Date().toISOString();

      // Remove typing placeholder
      setMessages((prev) => prev.filter((m) => m.type !== "typing"));

      // Add assistant message (empty to start typing)
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", content: "", timestamp: assistantTimestamp },
      ]);

      // Animate text
      let index = 0;
      const interval = setInterval(() => {
        index++;
        if (index > assistantContent.length) {
          clearInterval(interval);
          setLoading(false);
          setRefreshSidebar((p) => p + 1);
          return;
        }

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.sender === "assistant") {
            last.content = assistantContent.slice(0, index);
          }
          return [...updated];
        });

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, TYPING_INTERVAL_MS);
    } catch {
      setMessages((prev) => {
        const updated = prev.filter((m) => m.type !== "typing");
        updated.push({
          sender: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        });
        return updated;
      });
      setTotalMessageCount((prev) => prev + 1);
      setLoading(false);
    }
  };

  const handleEndChat = async () => {
    if (!conversationId || generatingSummary) return;
    setGeneratingSummary(true);
    setShowSummaryPrompt(false);

    try {
      const data = await endConversation(conversationId);
      setSummaryView({
        id: conversationId,
        text: data.summary,
        source: "endchat",
      });
      setConversationStatus("ended");
      setConversationInfo((prev) =>
        prev ? { ...prev, status: "ended" } : prev
      );
    } catch {
      setSummaryView({
        id: conversationId,
        text: "Failed to generate summary.",
        source: "endchat",
      });
    } finally {
      setGeneratingSummary(false);
      setTotalMessageCount(0);
      setRefreshSidebar((prev) => prev + 1);
    }
  };

  const handleAskInsight = async () => {
    if (!question.trim() || !conversationId) return;
    setLoadingInsight(true);

    const newInsight: Insight = {
      question,
      answer: "Thinking...",
      timestamp: new Date().toLocaleString(),
    };

    setInsights((prev) => [...prev, newInsight]);
    setQuestion("");

    try {
      const result = await askIntelligence(conversationId, question);
      const updated = { ...newInsight, answer: result.answer || "No answer" };

      setInsights((prev) => {
        const updatedList = [...prev.slice(0, -1), updated];
        localStorage.setItem(
          `insights_${conversationId}`,
          JSON.stringify(updatedList)
        );
        return updatedList;
      });
    } catch {
      setInsights((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].answer =
            "Failed to fetch AI response. Please try again.";
        }
        return updated;
      });
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleClearInsights = () => {
    if (!conversationId) return;
    localStorage.removeItem(`insights_${conversationId}`);
    setInsights([]);
  };

  const handleSidebarAction = async (id: number, summary: string) => {
    if (summary === "__SHOW_INSIGHTS__") {
      setIntelligenceMode(true);
      setSummaryView(null);

      const conv = await getConversation(id);
      const sortedMessages = (conv.messages || [])
        .map((m: any) => ({
          sender: m.sender,
          content: m.content,
          timestamp: m.timestamp || m.created_at || new Date().toISOString(),
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      setConversationInfo({
        title: conv.title,
        started_at: conv.started_at,
        messagesCount: sortedMessages.length,
        status: conv.status,
      });
      setConversationStatus(conv.status);
      setMessages(sortedMessages);

      const stored = localStorage.getItem(`insights_${id}`);
      setInsights(stored ? JSON.parse(stored) : []);
      return;
    }

    const conv = await getConversation(id);
    if (!conv.summary || conv.summary.trim() === "") {
      const data = await endConversation(id);
      setSummaryView({ id, text: data.summary, source: "sidebar" });
      return;
    }

    setSummaryView({ id, text: conv.summary, source: "sidebar" });
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="flex h-screen bg-white relative">
      <Sidebar
        activeId={conversationId}
        onSelect={handleSelectConversation}
        refresh={refreshSidebar}
        onSummary={handleSidebarAction}
      />

      <div className="flex flex-col flex-1 min-w-0 relative">
        <ChatHeader
          intelligenceMode={intelligenceMode}
          summaryView={summaryView}
          generatingSummary={generatingSummary}
          conversationId={conversationId}
          handleEndChat={handleEndChat}
          handleClearInsights={handleClearInsights}
        />

        {showSummaryPrompt &&
          !generatingSummary &&
          conversationStatus !== "ended" && (
            <SummaryPrompt
              onLater={() => {
                setShowSummaryPrompt(false);
                setTotalMessageCount(0);
              }}
              onSummarize={handleEndChat}
            />
          )}

        {intelligenceMode ? (
          <IntelligenceView
            question={question}
            setQuestion={setQuestion}
            insights={insights}
            loading={loadingInsight}
            onAsk={handleAskInsight}
            onClear={handleClearInsights}
            conversationInfo={conversationInfo}
          />
        ) : summaryView ? (
          <SummaryView summary={summaryView} />
        ) : (
          <>
            <ChatMessages
              messages={messages}
              copiedMessage={copiedMessage}
              copyToClipboard={async (text, i) => {
                try {
                  await navigator.clipboard.writeText(text);
                  setCopiedMessage(i);
                  setTimeout(() => setCopiedMessage(null), 2000);
                } catch {
                  // ignore clipboard errors silently
                }
              }}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput
              input={input}
              setInput={setInput}
              loading={loading}
              generatingSummary={generatingSummary}
              handleSend={handleSend}
              textareaRef={textareaRef}
            />
          </>
        )}
      </div>
    </div>
  );
}
