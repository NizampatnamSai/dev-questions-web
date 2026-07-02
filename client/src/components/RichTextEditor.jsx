import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block"],
    ["clean"],
  ],
};

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
}) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={MODULES}
        formats={FORMATS}
        placeholder={placeholder}
      />
    </div>
  );
}
