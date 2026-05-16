import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { Account } from '../types';
import { useStore } from '../store';
import { TimerDisplay } from './TimerDisplay';

interface AccountCardProps {
  account: Account;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const markExhausted = useStore(state => state.markExhausted);
  const resetAccount = useStore(state => state.resetAccount);
  const markRefreshed = useStore(state => state.markRefreshed);
  const deleteAccount = useStore(state => state.deleteAccount);
  const selectedAccounts = useStore(state => state.selectedAccounts);
  const toggleSelectAccount = useStore(state => state.toggleSelectAccount);

  const isSelected = selectedAccounts.includes(account.id);
  const isExhausted = account.resetAt !== null;

  const getDaysUntilRefresh = () => {
    if (!account.lastRefreshedAt) return 0;
    const refreshTime = account.lastRefreshedAt + (account.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
    const diff = refreshTime - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  const daysLeft = getDaysUntilRefresh();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    toggleSelectAccount(account.id);
  };

  const healthColor = account.health > 80 ? '#00A651' : account.health > 50 ? '#F59E0B' : '#FF3B00';

  return (
    <motion.div
      layout
      id={`account-${account.id}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={handleCardClick}
      className={`relative group cursor-pointer transition-all border bg-brand-surface rounded-xl ${
        isExhausted 
          ? 'border-brand-accent/40' 
          : 'border-brand-border hover:border-brand-text/30'
      } ${isSelected ? 'ring-2 ring-brand-accent' : ''}`}
    >
      <div className={`relative overflow-hidden p-5 h-full transition-colors ${
        isExhausted ? 'bg-brand-accent/5' : ''
      }`}>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div 
              className="w-9 h-9 flex items-center justify-center text-brand-accent-fg font-black text-[13px] rounded-lg"
              style={{ backgroundColor: account.color }}
            >
              {account.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-[16px] font-black text-brand-text truncate max-w-[140px] tracking-tight">{account.name}</h3>
                <span className={`text-[9px] px-2 py-0.5 font-black uppercase tracking-widest rounded-md ${
                  account.tier === 'pro' ? 'bg-brand-text text-brand-surface' : 'border border-brand-border text-brand-text-muted'
                }`}>
                  {account.tier}
                </span>
              </div>
              <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest mt-1">{account.service}</p>
            </div>
          </div>

          <div className="relative z-20" ref={menuRef} onClick={e => e.stopPropagation()}>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated transition-colors rounded-lg"
            >
              <MoreHorizontal size={20} strokeWidth={2.5} />
            </motion.button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ transformOrigin: "top right" }}
                  className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-border z-50 overflow-hidden py-1 rounded-lg"
                >
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { markRefreshed(account.id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-text-soft flex items-center gap-3 transition-colors uppercase"
                  >
                    <RefreshCw size={14} className="text-brand-text-muted" strokeWidth={2.5} /> Restore Quota
                  </motion.button>
                  <div className="h-px bg-brand-border mx-2" />
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { deleteAccount(account.id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-accent flex items-center gap-3 transition-colors uppercase"
                  >
                    <Trash2 size={14} strokeWidth={2.5} /> Purge Node
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`h-20 flex flex-col items-center justify-center mb-4 transition-colors border rounded-lg ${
          isExhausted ? 'bg-brand-accent/5 border-brand-accent/20' : 'bg-brand-surface-elevated border-brand-border'
        }`}>
          {isExhausted ? (
            <div className="text-center">
              <TimerDisplay resetAt={account.resetAt!} id={account.id} />
              <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-2">Node Re-routing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-success" />
                <span className="text-[11px] font-black text-brand-success uppercase tracking-widest">Live</span>
              </div>
              <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest">Optimized &amp; Ready</p>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 h-1.5 bg-brand-border overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${account.health}%` }}
                  transition={{ duration: 1, type: "spring" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: healthColor }}
                />
              </div>
              <span className="text-[12px] font-mono font-black text-brand-text w-12 tabular-nums text-right">{account.health}%</span>
            </div>
            <div className="flex items-center gap-2 ml-4 px-2.5 py-1 border border-brand-border rounded-md">
              <span className="text-[11px] font-mono font-black text-brand-text-muted tabular-nums">{daysLeft}d</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {account.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-0.5 border border-brand-border text-[9px] text-brand-text-muted font-bold uppercase tracking-widest rounded-md"
              >
                {tag}
              </span>
            ))}
            {account.priority > 3 && (
              <span className="px-2 py-0.5 bg-brand-text text-brand-surface text-[9px] font-bold uppercase tracking-widest rounded-md">
                Priority
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-0" onClick={e => e.stopPropagation()}>
          {!isExhausted ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => markExhausted(account.id)}
              className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest border border-brand-border bg-brand-surface text-brand-text hover:bg-brand-text hover:text-brand-surface hover:border-brand-text transition-colors rounded-lg"
            >
              Mark Used
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => resetAccount(account.id)}
              className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest bg-brand-text text-brand-surface hover:bg-brand-accent transition-colors rounded-lg"
            >
              Reset Node
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
