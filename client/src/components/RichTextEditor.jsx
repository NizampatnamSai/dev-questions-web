import { useMemo, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TOOLBAR = [
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "code-block"],
  ["clean"],
];

// A quick chat message rarely needs the full 8-button toolbar — on a narrow
// mobile viewport those wrap to two rows and eat most of the composer's
// height before the user has typed a single character. This trims it down
// to what fits comfortably in one row at any width.
const COMPACT_TOOLBAR = [["bold", "italic"], ["link"], ["clean"]];

const MODULES = { toolbar: TOOLBAR };
const COMPACT_MODULES = { toolbar: COMPACT_TOOLBAR };

const FORMATS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "link",
  "code-block",
];

export function isRichTextEmpty(html) {
  return !html || html.replace(/<[^>]*>/g, "").trim().length === 0;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = "",
  onPasteImage, // (file: File) => void — clipboard image paste (e.g. a screenshot)
  onEnterSubmit, // chat-style composers: Enter sends, Shift+Enter still inserts a newline
  compact = false, // trims the toolbar to fit one row — for tight/mobile composers like chat
  spellCheck = true, // Quill's editing area has no prop for this — set directly on its DOM node below
  onReady, // (quillInstance) => void — escape hatch for callers needing direct Quill API access (e.g. cursor-position-aware @mentions), fired once after mount
}) {
  // ReactQuill renders its own contenteditable internally with no spellCheck
  // prop of its own, so the only way in is finding that node after mount and
  // setting the attribute directly. Relevant because macOS's own system-wide
  // spell-check (not a browser extension, not Chrome autofill) shows its
  // "Save to dictionary" popover on any contenteditable with an unrecognized
  // word — for a chat composer where people type shorthand/typos constantly,
  // that popover firing mid-message is disruptive enough to just turn off.
  const containerRef = useRef(null);
  useEffect(() => {
    const editor = containerRef.current?.querySelector(".ql-editor");
    if (editor) editor.setAttribute("spellcheck", String(spellCheck));
  }, [spellCheck]);

  // Read the latest callback via a ref so the Quill keyboard binding below
  // (built once and never recreated — `modules` is one of ReactQuill's
  // "dirtyProps" that fully re-instantiates the editor on change) never
  // closes over a stale composerHtml/activeChatId from the render it was
  // first created in.
  const onEnterSubmitRef = useRef(onEnterSubmit);
  useEffect(() => { onEnterSubmitRef.current = onEnterSubmit; }, [onEnterSubmit]);

  const quillComponentRef = useRef(null);
  useEffect(() => {
    onReady?.(quillComponentRef.current?.getEditor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whether this instance wants Enter-to-submit at all is a per-usage,
  // load-bearing decision that doesn't change during the component's
  // lifetime (Notes/WorkBoard never pass it, Messages always does) — safe
  // to decide once at mount rather than depend on the prop's identity.
  const modules = useMemo(() => {
    if (!onEnterSubmit) return compact ? COMPACT_MODULES : MODULES;
    return {
      toolbar: compact ? COMPACT_TOOLBAR : TOOLBAR,
      keyboard: {
        bindings: {
          submitOnEnter: {
            key: "Enter",
            shiftKey: false,
            handler() {
              onEnterSubmitRef.current?.();
              return false; // swallow — stops Quill's default newline-insert binding
            },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = (e) => {
    if (!onPasteImage) return;
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); // don't also let Quill inline it as a giant base64 image
          onPasteImage(file);
        }
        return;
      }
    }
  };

  return (
    <div ref={containerRef} className={`rich-text-editor ${className}`} onPaste={handlePaste}>
      <ReactQuill
        ref={quillComponentRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
}
