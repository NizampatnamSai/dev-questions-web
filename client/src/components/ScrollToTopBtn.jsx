import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-40 right-4 z-[9998] w-11 h-11 rounded-2xl shadow-lg
            bg-gradient-to-br from-indigo-500 to-purple-500
            hover:from-indigo-400 hover:to-purple-400
            flex items-center justify-center text-white text-lg
            hover:shadow-indigo-500/40 hover:shadow-xl transition-shadow
            md:bottom-24 md:right-8"
          aria-label="Scroll to top"
          title="Back to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
