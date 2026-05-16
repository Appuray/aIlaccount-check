import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useStore } from '../store';

export const Toast: React.FC = () => {
  const toast = useStore(state => state.toast);
  const clearToast = useStore(state => state.clearToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-[9999] w-full max-w-sm px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-brand-text text-brand-surface border border-brand-border px-5 py-3.5 pointer-events-auto flex items-center justify-between gap-4 rounded-none"
          >
            <span className="text-sm">{toast}</span>
            <button 
              onClick={clearToast}
              className="p-0.5 hover:opacity-70"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
