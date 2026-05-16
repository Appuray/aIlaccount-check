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
  const placeholders = ["Search nodes... (/)", "Find 'Cluster-Alpha'", "Search tags (e.g. coding)", "Search by tier..."];
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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-brand-border">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-brand-accent" 
            />
            <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Network Control</p>
          </div>
          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-brand-text leading-[0.9]">
            Account<br />Nodes
          </h1>
          <p className="text-[15px] text-brand-text-soft mt-8 leading-relaxed max-w-md font-medium">
            Operational dashboard for distributed AI quota management. Monitor health, priority, and cluster performance.
          </p>
        </motion.div>

        <div className="flex flex-col items-stretch gap-4 min-w-[320px]">
          <div className="relative group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-muted group-focus-within:text-brand-accent transition-colors flex items-center justify-center z-10 pl-4">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <div className="relative">
              <input 
                id="search-input"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-surface border border-brand-border text-brand-text text-[13px] font-bold tracking-wide focus:border-brand-accent focus:outline-none transition-colors rounded-none"
              />
              {!searchQuery && (
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none z-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-brand-text-muted text-[13px] font-bold tracking-wide whitespace-nowrap"
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
            className="group flex items-center justify-between w-full px-6 py-4 font-black text-[12px] tracking-widest uppercase bg-brand-text text-brand-surface hover:bg-brand-accent transition-colors rounded-none"
          >
            Smart Select
            <Zap size={18} fill="currentColor" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-0 border-b border-brand-border">
        <div className="flex items-center gap-4 pr-8 py-5 md:border-r border-brand-border">
          <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Service</span>
          <div className="flex gap-0">
            {['all', 'gemini', 'chatgpt', 'claude'].map((s) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedService(s as any)}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors rounded-none border-b-2 ${
                  selectedService === s 
                    ? 'text-brand-text border-brand-accent' 
                    : 'text-brand-text-muted border-transparent hover:text-brand-text'
                }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pl-0 md:pl-8 py-5">
          <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Status</span>
          <div className="flex gap-0">
            {[
              { id: 'all', label: 'ALL' },
              { id: 'active', label: 'ACTIVE' },
              { id: 'cooldown', label: 'COOLDOWN' }
            ].map((st) => (
              <motion.button
                key={st.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors rounded-none border-b-2 ${
                  selectedStatus === st.id 
                    ? 'text-brand-text border-brand-accent' 
                    : 'text-brand-text-muted border-transparent hover:text-brand-text'
                }`}
              >
                {st.label}
              </motion.button>
            ))}
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
        className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-brand-border"
      >
        <StatCard label="Available" value={availableCount} color="text-brand-success" />
        <StatCard label="Cooldown" value={exhaustedCount} color="text-brand-accent" />
        <StatCard label="Healthy" value={accounts.filter(a => a.health > 80).length} color="text-brand-text" />
        <StatCard label="Total Nodes" value={accounts.length} color="text-brand-text" />
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
    className="py-8 px-6 border-r border-brand-border last:border-r-0 bg-brand-surface hover:bg-brand-surface-elevated transition-colors cursor-default"
  >
    <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em] mb-3">{label}</p>
    <p className={`text-5xl font-black tracking-tighter font-mono ${color}`}>{value}</p>
  </motion.div>
);


