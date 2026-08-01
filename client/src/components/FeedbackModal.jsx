import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";
import RichTextEditor, { isRichTextEmpty } from "./RichTextEditor";

export default function FeedbackModal({ open, onClose, isGuest }) {
  const [type, setType] = useState("feature");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);      // uploaded Cloudinary URLs
  const [uploading, setUploading] = useState(false);

  const MAX_IMAGES = 4;

  // Uploads go through the existing POST /uploads/image (Cloudinary), which
  // requires a login — so guests get the picker hidden rather than a 401 after
  // they have already chosen a file.
  const pickImages = async (files) => {
    const chosen = Array.from(files || []);
    if (!chosen.length) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) return toast.error(`You can attach at most ${MAX_IMAGES} images`);
    setUploading(true);
    try {
      for (const file of chosen.slice(0, room)) {
        const form = new FormData();
        form.append("file", file);
        const { data } = await api.post("/uploads/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!title.trim() || isRichTextEmpty(message)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isGuest && !guestName.trim()) {
      toast.error("Please enter a name so we know who this is from");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/feedback", {
        type,
        title: title.trim(),
        message,
        rating,
        guestName: isGuest ? guestName.trim() : undefined,
        images,
      });
      toast.success("Thank you for your feedback! 💙");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setType("feature");
    setTitle("");
    setMessage("");
    setRating(5);
    setGuestName("");
    setImages([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">💭 Send Feedback</h2>
                <p className="text-xs text-slate-400 mt-1">Help us improve Dev Life with your thoughts</p>
              </div>

              {/* Guest name */}
              {isGuest && (
                <div>
                  <label
                    className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                    title="You're not logged in, so this is how we'll know who sent it — please use your real name so we can follow up if needed."
                  >
                    Your Name <span className="text-slate-400 font-normal">(shown to admins — please use your real name)</span>
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Sneha Kumar"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Feedback Type</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { id: "bug", label: "🐛 Bug", emoji: "🐛" },
                    { id: "feature", label: "✨ Feature", emoji: "✨" },
                    { id: "improvement", label: "💡 Improvement", emoji: "💡" },
                    { id: "other", label: "💬 Other", emoji: "💬" },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        type === t.id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">How satisfied are you?</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        rating === r
                          ? "bg-yellow-500 text-white"
                          : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20"
                      }`}
                    >
                      {"⭐".repeat(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Brief summary..."
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Details</label>
                <div className="mt-1">
                  <RichTextEditor
                    value={message}
                    onChange={setMessage}
                    placeholder="Tell us more..."
                  />
                </div>
              </div>

              {/* Screenshots — hidden for guests, since /uploads/image needs a login */}
              {!isGuest && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Screenshots <span className="font-normal text-slate-400">(optional, up to {MAX_IMAGES})</span>
                  </label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {images.map((url) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt="Attached screenshot"
                          className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                          aria-label="Remove screenshot"
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-slate-800 text-white text-xs font-bold leading-none opacity-90 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <label
                        className={`h-16 w-16 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-white/15 text-slate-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-400 transition-colors ${
                          uploading ? "opacity-60 pointer-events-none" : ""
                        }`}
                      >
                        <span className="text-lg leading-none">{uploading ? "…" : "+"}</span>
                        <span className="text-[9px] font-semibold mt-0.5">
                          {uploading ? "Uploading" : "Add"}
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            pickImages(e.target.files);
                            e.target.value = ""; // let the same file be picked again after a remove
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Sending…" : "Send Feedback"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
