import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

const SCORE_COLOR = (s) => (s >= 75 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400");
const SCORE_RING = (s) => (s >= 75 ? "#4ade80" : s >= 50 ? "#facc15" : "#f87171");

function ScoreGauge({ score }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={SCORE_RING(score)} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black ${SCORE_COLOR(score)}`}>{score}</span>
        <span className="text-xs text-slate-400">ATS Score</span>
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileSelect(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.name.toLowerCase().endsWith(".pdf") || f.name.toLowerCase().endsWith(".docx");
    if (!ok) {
      toast.error("Only PDF and DOCX files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB).");
      return;
    }
    setFile(f);
    setResult(null);
  }

  async function analyze() {
    if (!file) return;
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) formData.append("job_description", jobDescription.trim());
      const { data } = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Analysis failed — try again shortly.");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setJobDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto text-slate-800 dark:text-white">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">📄</div>
        <h1 className="text-3xl font-bold mb-2">Resume & ATS Analyzer</h1>
        <p className="text-slate-400 text-sm">Upload your resume for an ATS-style score, gaps, and concrete fixes.</p>
      </div>

      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Resume (PDF or DOCX, max 5MB)</label>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileSelect}
              className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white file:font-semibold hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer" />
            {file && <p className="text-xs text-slate-400 mt-2">Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Target job description <span className="text-slate-400 font-normal">(optional — enables keyword matching)</span>
            </label>
            <textarea
              className="w-full h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:border-indigo-500"
              placeholder="Paste the job description you're targeting…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button onClick={analyze} disabled={!file || analyzing}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2">
            {analyzing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing your resume…
              </>
            ) : (
              "🔍 Analyze Resume"
            )}
          </button>
          <p className="text-xs text-slate-400 text-center">Up to 10 analyses/day. Your file is parsed for text only — never stored.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="glass-card p-6 text-center">
              <ScoreGauge score={result.atsScore ?? 0} />
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-4 leading-relaxed max-w-lg mx-auto">{result.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h3 className="font-bold text-sm text-green-400 mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {(result.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-green-400 flex-shrink-0">•</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-bold text-sm text-red-400 mb-3">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {(result.weaknesses || []).map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-red-400 flex-shrink-0">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.missingKeywords?.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-sm text-amber-400 mb-3">🔑 Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-amber-500/15 text-amber-500 dark:text-amber-400 rounded-full border border-amber-500/30">{k}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-3">📋 Sections Found</h3>
                <div className="flex flex-wrap gap-2">
                  {(result.sectionsFound || []).map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-green-500/15 text-green-500 dark:text-green-400 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              {result.sectionsMissing?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-3">❌ Sections Missing</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sectionsMissing.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-red-500/15 text-red-500 dark:text-red-400 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {result.formattingIssues?.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-bold text-sm text-orange-400 mb-3">🎨 Formatting Issues</h3>
                <ul className="space-y-2">
                  {result.formattingIssues.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"><span className="text-orange-400 flex-shrink-0">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={reset}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all">
              ↺ Analyze Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
