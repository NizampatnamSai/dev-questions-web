import { memo, useMemo } from "react";
import DOMPurify from "dompurify";

// DOMPurify's default allowed-attributes list does NOT include `target` — it
// gets silently stripped from every <a>, including ones from Quill's own
// "link" toolbar button, so links always navigated away in the same tab
// instead of opening in a new one. This is DOMPurify's own documented
// pattern for fixing that: force target="_blank" + rel="noopener noreferrer"
// (required alongside target=_blank — without it the new tab can control
// window.opener on this one) on every link, everywhere RichTextView is used.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

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
