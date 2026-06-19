// Renders answer text. Handles:
// 1. Markdown fenced code blocks (```lang ... ```)
// 2. Plain-text code with \n line breaks (detected by code-like patterns)

function looksLikeCode(text) {
  return /^\s*(function |const |let |var |class |import |export |if\s*\(|for\s*\(|\{[\s\S]*\}|\/\/|=>)/.test(text.trim());
}

function splitByFences(text) {
  const parts = [];
  const fence = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match;
  while ((match = fence.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", content: match[2].trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts.length ? parts : [{ type: "text", content: text }];
}

export default function AnswerBlock({ text, questionType }) {
  if (!text) return null;

  const parts = splitByFences(text);

  // If no fences found but the whole thing looks like code (Coding question), treat as code block
  if (parts.length === 1 && parts[0].type === "text" && questionType === "Coding") {
    const content = parts[0].content;
    // Split on the first blank line — code first, then explanation
    const blankLine = content.search(/\n\s*\n/);
    if (blankLine !== -1 && looksLikeCode(content.slice(0, blankLine))) {
      const codePart = content.slice(0, blankLine).trim();
      const explainPart = content.slice(blankLine).trim();
      return (
        <div className="space-y-2">
          <pre className="overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-3 text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre">
            {codePart}
          </pre>
          {explainPart && (
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {explainPart}
            </p>
          )}
        </div>
      );
    }
    if (looksLikeCode(content)) {
      return (
        <pre className="overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-3 text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre">
          {content}
        </pre>
      );
    }
  }

  return (
    <div className="space-y-2">
      {parts.map((part, i) =>
        part.type === "code" ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-3 text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre"
          >
            {part.content}
          </pre>
        ) : (
          <p key={i} className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {part.content.trim()}
          </p>
        )
      )}
    </div>
  );
}
