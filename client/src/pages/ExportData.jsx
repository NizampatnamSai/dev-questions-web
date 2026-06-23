import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ExportData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("csv"); // csv or pdf
  const [dataType, setDataType] = useState("users"); // users, questions, feedback

  // Check if admin
  if (!user || !["admin", "sub_admin"].includes(user.role)) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">❌ Admin only</p>
      </div>
    );
  }

  const exportData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/export/${dataType}`, {
        params: { format },
        responseType: format === "pdf" ? "blob" : "json",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${dataType}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${dataType}.${format}`);
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📥 Export Data</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Export user and question data (Admin only)</p>
      </div>

      <div className="glass-card p-6 max-w-md space-y-6">
        {/* Data type selector */}
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 block mb-3">What to export?</label>
          <div className="space-y-2">
            {[
              { id: "users", label: "👥 Users", desc: "All user accounts and profiles" },
              { id: "questions", label: "❓ Questions", desc: "All community questions" },
              { id: "feedback", label: "💬 Feedback", desc: "User feedback submissions" },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setDataType(opt.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  dataType === opt.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                <div className="font-medium text-slate-800 dark:text-slate-100">{opt.label}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Format selector */}
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 block mb-3">Export format?</label>
          <div className="flex gap-3">
            {[
              { id: "csv", label: "📊 CSV", desc: "Spreadsheet format" },
              { id: "pdf", label: "📄 PDF", desc: "Document format" },
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setFormat(fmt.id)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all text-center ${
                  format === fmt.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                }`}
              >
                <div className="font-medium text-slate-800 dark:text-slate-100">{fmt.label}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={exportData}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Exporting..." : "Export Data"}
        </button>

        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>💡 Tips:</p>
          <p>• Use CSV for spreadsheets (Excel, Google Sheets)</p>
          <p>• Use PDF for formal reports and sharing</p>
          <p>• Data is exported with all fields included</p>
        </div>
      </div>
    </motion.div>
  );
}
