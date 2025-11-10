import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, CheckCheck } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  content: string;
}

// ✅ Safe cleaner — handles all markdown structures, never truncates
function cleanMarkdown(content: string) {
  if (!content) return "";
  let cleaned = content.trim();

  // 1️⃣ Unwrap top-level ```markdown``` fences
  const markdownWrapper = /^```markdown\s*([\s\S]*?)```$/i;
  if (markdownWrapper.test(cleaned)) {
    cleaned = cleaned.replace(markdownWrapper, "$1").trim();
  }

  // 2️⃣ Normalize excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 3️⃣ Fix partially malformed ```markdown
  if (/^```markdown/i.test(cleaned) && !/```$/.test(cleaned)) {
    cleaned = cleaned.replace(/^```markdown\s*/i, "").trim();
  }

  return cleaned;
}

export default function MarkdownRenderer({ content }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const cleaned = cleanMarkdown(content);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <>
      <style>
        {`
          .prose pre {
            background-color: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .prose pre code {
            background: transparent !important;
          }
        `}
      </style>

      <div className="prose max-w-none prose-gray ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-bold mt-6 mb-4 text-gray-900 border-b border-gray-200 pb-1"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-semibold mt-5 mb-3 text-gray-900"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-semibold mt-4 mb-2 text-gray-800"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="mb-4 text-gray-700 leading-relaxed last:mb-0"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc list-inside mb-3 space-y-1 text-gray-700 ml-4"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-inside mb-3 space-y-1 text-gray-700 ml-4"
                {...props}
              />
            ),
            li: ({ node, children, ...props }) => {
              const textContent = String(children).trim();
              if (!textContent) return null;
              const hasNestedList =
                Array.isArray(children) &&
                children.some(
                  (child: any) =>
                    typeof child === "object" &&
                    child?.props?.node?.tagName &&
                    ["ul", "ol"].includes(child.props.node.tagName)
                );
              return (
                <li
                  className={`leading-relaxed text-gray-700 ${
                    hasNestedList ? "ml-4 mt-1" : "ml-2"
                  }`}
                  {...props}
                >
                  {children}
                </li>
              );
            },
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-gray-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-400 bg-blue-50 text-gray-700 italic pl-4 pr-2 py-2 mb-4 rounded-r-md"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-gray-300 text-sm text-left text-gray-800 rounded-lg overflow-hidden">
                  {props.children}
                </table>
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-100 text-gray-900 font-semibold">
                {props.children}
              </thead>
            ),
            tbody: ({ node, ...props }) => <tbody>{props.children}</tbody>,
            tr: ({ node, ...props }) => (
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {props.children}
              </tr>
            ),
            th: ({ node, ...props }) => (
              <th className="px-4 py-2 border border-gray-300 text-left font-semibold text-gray-900">
                {props.children}
              </th>
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 border border-gray-300 align-top text-gray-700">
                {props.children}
              </td>
            ),

            // ✅ ChatGPT-style code block rendering
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const codeText = String(children).replace(/\n$/, "");

              if (inline) {
                return (
                  <code
                    className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative group my-4">
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(codeText)}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {copiedCode === codeText ? (
                      <CheckCheck size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>

                  {/* Syntax highlighting */}
                  <SyntaxHighlighter
                    language={match ? match[1] : "text"}
                    style={oneDark}
                    PreTag="div"
                    showLineNumbers={false}
                    wrapLines={true}
                    customStyle={{
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      background: "#0f1117",
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                  >
                    {codeText}
                  </SyntaxHighlighter>
                </div>
              );
            },
          }}
        >
          {cleaned}
        </ReactMarkdown>
      </div>
    </>
  );
}
