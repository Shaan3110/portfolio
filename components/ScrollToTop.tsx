'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export default function ScrollToTop() {
  const scrollY = useScrollPosition();
  const isVisible = scrollY > 300;

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-primary via-purple-500 to-accent text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-pulse-glow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
