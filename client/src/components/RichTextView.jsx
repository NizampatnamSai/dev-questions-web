import { memo, useMemo } from "react";
import DOMPurify from "dompurify";

// Memoized: DOMPurify.sanitize() does real work (parses + walks the HTML tree)
// and this component renders once per item in lists (Notes, Snippet
// descriptions, etc.) — without memoization every unrelated re-render of an
// ancestor re-sanitizes every visible item's HTML for no reason.
function RichTextView({ html, className = "", forwardedRef }) {
  const clean = useMemo(() => (html && html.trim() ? DOMPurify.sanitize(html) : ""), [html]);
  if (!clean) return null;
  return (
    <div
      ref={forwardedRef}
      className={`rich-text-view ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default memo(RichTextView);
