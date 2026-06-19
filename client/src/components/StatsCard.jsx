import { motion } from "framer-motion";

export default function StatsCard({ icon, label, value, accent = "from-cyan-400 to-blue-500", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-5 card-hover relative overflow-hidden group"
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${accent} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

      <div className="flex items-center gap-4 relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-xl shrink-0 shadow-lg`}>
          {icon}
        </div>
        <div>
          <motion.p
            key={value}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold leading-tight text-slate-800 dark:text-slate-100"
          >
            {value}
          </motion.p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
