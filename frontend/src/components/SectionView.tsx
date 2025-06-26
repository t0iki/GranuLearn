import type { Section } from "../types/course.types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SectionViewProps {
  section: Section;
  onComplete: () => void;
  isCompleted: boolean;
}

export function SectionView({ section, onComplete, isCompleted }: SectionViewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <span className="text-sm text-gray-500">予想時間: {section.estimatedMinutes}分</span>
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{section.type}</div>
      </div>

      <div className="prose prose-lg max-w-none mb-8">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>

      {section.codeExamples && section.codeExamples.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">コード例</h3>
          {section.codeExamples.map((example) => (
            <div key={example.id} className="mb-6">
              <div className="mb-2">
                <span className="text-sm text-gray-600">{example.language}</span>
              </div>
              <SyntaxHighlighter language={example.language} style={tomorrow} customStyle={{ borderRadius: "0.5rem" }}>
                {example.code}
              </SyntaxHighlighter>
              <p className="mt-2 text-sm text-gray-600">{example.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {section.mediaAttachments && section.mediaAttachments.length > 0 && (
        <div className="mb-8">
          {section.mediaAttachments.map((media) => (
            <div key={media.id} className="mb-4">
              {media.type === "image" && media.url && (
                <div>
                  <img src={media.url} alt={media.caption} className="rounded-lg" />
                  <p className="text-sm text-gray-600 mt-2">{media.caption}</p>
                </div>
              )}
              {media.type === "code_snippet" && media.data && (
                <div>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{media.data}</code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">{media.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-lg font-medium ${
            isCompleted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isCompleted ? "完了済み" : "次へ進む"}
        </button>
      </div>
    </div>
  );
}
