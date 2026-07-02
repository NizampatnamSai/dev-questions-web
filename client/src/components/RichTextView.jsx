import DOMPurify from "dompurify";

export default function RichTextView({ html, className = "", forwardedRef }) {
  if (!html || !html.trim()) return null;
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      ref={forwardedRef}
      className={`rich-text-view ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
