// Simple syntax highlighter for common languages
export function highlightCode(code, language = "javascript") {
  const keywords = {
    javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "async", "await", "try", "catch"],
    python: ["def", "class", "return", "if", "else", "for", "while", "import", "from", "try", "except", "async", "await"],
    html: ["div", "span", "p", "h1", "h2", "h3", "class", "id", "href", "src"],
  };

  const langKeywords = keywords[language] || keywords.javascript;

  let highlighted = code;

  // Highlight keywords
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });

  // Highlight strings
  highlighted = highlighted.replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

  // Highlight comments
  highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
  highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

  return highlighted;
}

export const codeHighlightCSS = `
  .code-block {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  .code-block .keyword {
    color: #38bdf8;
    font-weight: bold;
  }

  .code-block .string {
    color: #86efac;
  }

  .code-block .comment {
    color: #64748b;
    font-style: italic;
  }

  .code-block .number {
    color: #fbbf24;
  }

  .dark .code-block {
    background: #0f172a;
    color: #e2e8f0;
  }
`;
