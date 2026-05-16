import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const accounts = useStore((state) => state.accounts);
  const getBestAccount = useStore((state) => state.getBestAccount);
  const showToast = useStore((state) => state.showToast);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const selectedService = useStore((state) => state.selectedService);
  const setSelectedService = useStore((state) => state.setSelectedService);
  const selectedStatus = useStore((state) => state.selectedStatus);
  const setSelectedStatus = useStore((state) => state.setSelectedStatus);

  const exhaustedCount = accounts.filter(a => a.resetAt !== null).length;
  const availableCount = accounts.length - exhaustedCount;

  // Typewriter placeholder logic
  const placeholders = ["Search accounts... (/)", "Find 'Personal Gemini'", "Search by tags (e.g. coding)", "Search by tier..."];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSmartSelect = () => {
    const best = getBestAccount();
    if (best) {
      showToast(`OPTIMIZED: Recommended node "${best.name}"`);
      const el = document.getElementById(`account-${best.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.classList.add('ring-2', 'ring-brand-accent');
      setTimeout(() => el?.classList.remove('ring-2', 'ring-brand-accent'), 3000);
    } else {
      showToast('CRITICAL: No nodes matching filters available');
    }
  };

  return (
    <header className="space-y-0 pb-0 animate-slide-up">
      {/* Hero Zone */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-brand-border">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-brand-accent" 
            />
            <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Account Control</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-brand-text leading-[1]">
            AI<br />Accounts
          </h1>
          <p className="text-[14px] text-brand-text-soft mt-4 leading-relaxed max-w-md font-medium">
            Manage your AI service accounts, track usage limits, and monitor account health.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 w-full lg:w-auto mt-6 lg:mt-0 lg:ml-auto">
          <div className="relative group flex-1 sm:w-64">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted transition-colors flex items-center justify-center z-10 pl-3">
              <Search size={14} strokeWidth={2.5} />
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-brand-surface border border-brand-border text-brand-text text-[11px] font-bold tracking-wide focus:border-brand-accent focus:outline-none transition-colors rounded-lg shadow-sm"
              />
              {!searchQuery && (
                <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none z-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-brand-text-muted text-[11px] font-bold tracking-wide whitespace-nowrap"
                    >
                      {placeholders[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleSmartSelect}
            className="flex items-center justify-center gap-2 px-5 py-2.5 font-black text-[10px] tracking-widest uppercase bg-brand-text text-brand-surface hover:bg-brand-accent transition-colors rounded-lg shadow-sm whitespace-nowrap"
          >
            <span>Auto-Select</span>
            <Zap size={14} fill="currentColor" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-brand-border w-full min-w-0">
        <div className="flex flex-col md:flex-row items-start md:items-center w-full xl:w-auto min-w-0">
          <div className="flex items-center gap-4 pr-0 md:pr-8 py-5 md:border-r border-brand-border w-full md:w-auto min-w-0">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em] min-w-[60px] shrink-0">Service</span>
            <div className="flex gap-1 overflow-x-auto scroll-hide pb-2 md:pb-0 w-full snap-x">
              {['all', 'gemini', 'chatgpt', 'claude'].map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedService(s as any)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg whitespace-nowrap snap-start shrink-0 ${
                    selectedService === s 
                      ? 'bg-brand-text text-brand-surface shadow-sm' 
                      : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 pl-0 md:pl-8 py-5 w-full md:w-auto border-t md:border-t-0 border-brand-border min-w-0">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em] min-w-[60px] shrink-0">Status</span>
            <div className="flex gap-1 overflow-x-auto scroll-hide pb-2 md:pb-0 w-full snap-x">
              {[
                { id: 'all', label: 'ALL' },
                { id: 'active', label: 'ACTIVE' },
                { id: 'cooldown', label: 'COOLDOWN' }
              ].map((st) => (
                <motion.button
                  key={st.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStatus(st.id as any)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg whitespace-nowrap snap-start shrink-0 ${
                    selectedStatus === st.id 
                      ? 'bg-brand-text text-brand-surface shadow-sm' 
                      : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated'
                  }`}
                >
                  {st.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8"
      >
        <StatCard label="Available" value={availableCount} color="text-brand-success" />
        <StatCard label="Cooldown" value={exhaustedCount} color="text-brand-accent" />
        <StatCard label="Healthy" value={accounts.filter(a => a.health > 80).length} color="text-brand-text" />
        <StatCard label="Total Accounts" value={accounts.length} color="text-brand-text" />
      </motion.div>
    </header>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
    }}
    className="py-6 px-6 border border-brand-border rounded-xl bg-brand-surface hover:bg-brand-surface-elevated transition-colors cursor-default shadow-sm"
  >
    <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-3xl font-black tracking-tighter font-mono ${color}`}>{value}</p>
  </motion.div>
);


