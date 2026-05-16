import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, RefreshCw, Trash2, Copy, Mail, StickyNote, Zap, Hash } from 'lucide-react';
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
  const duplicateAccount = useStore(state => state.duplicateAccount);
  const selectedAccounts = useStore(state => state.selectedAccounts);
  const toggleSelectAccount = useStore(state => state.toggleSelectAccount);
  const showToast = useStore(state => state.showToast);

  const isSelected = selectedAccounts.includes(account.id);
  const isExhausted = account.resetAt !== null;

  const getRefreshInfo = () => {
    if (!account.lastRefreshedAt) return { daysLeft: 0, refreshDate: null, relativeStr: '—' };
    const refreshTime = account.lastRefreshedAt + (account.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
    const diff = refreshTime - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
    const refreshDate = new Date(refreshTime);
    
    // Build relative string
    let relativeStr = '—';
    if (diff <= 0) {
      relativeStr = 'Now';
    } else if (diff < 60 * 60 * 1000) {
      relativeStr = `${Math.ceil(diff / (60 * 1000))}m left`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      relativeStr = `${Math.ceil(diff / (60 * 60 * 1000))}h left`;
    } else {
      relativeStr = `${daysLeft}d left`;
    }
    
    return { daysLeft, refreshDate, relativeStr };
  };

  const { refreshDate, relativeStr } = getRefreshInfo();
  const usageCount = account.usageCount || 0;
  const maxDailyUses = account.maxDailyUses || 0;

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

  const healthColor = account.health > 80 ? '#30A46C' : account.health > 50 ? '#E79D13' : '#E5484D';

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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest">{account.service}</p>
                {account.email && (
                  <span className="text-[9px] text-brand-text-muted font-medium truncate max-w-[100px] flex items-center gap-1">
                    <Mail size={8} /> {account.email}
                  </span>
                )}
              </div>
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
                  className="absolute right-0 mt-2 w-52 bg-brand-surface border border-brand-border z-50 overflow-hidden py-1 rounded-lg shadow-lg"
                >
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { markRefreshed(account.id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-text-soft flex items-center gap-3 transition-colors uppercase"
                  >
                    <RefreshCw size={14} className="text-brand-text-muted" strokeWidth={2.5} /> Reset Quota
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { duplicateAccount(account.id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-text-soft flex items-center gap-3 transition-colors uppercase"
                  >
                    <Copy size={14} className="text-brand-text-muted" strokeWidth={2.5} /> Duplicate Account
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { 
                      navigator.clipboard.writeText(account.id);
                      showToast(`Account ID copied: ${account.id.substring(0, 12)}...`);
                      setIsMenuOpen(false); 
                    }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-text-soft flex items-center gap-3 transition-colors uppercase"
                  >
                    <Hash size={14} className="text-brand-text-muted" strokeWidth={2.5} /> Copy Account ID
                  </motion.button>
                  <div className="h-px bg-brand-border mx-2" />
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { deleteAccount(account.id); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-accent flex items-center gap-3 transition-colors uppercase"
                  >
                    <Trash2 size={14} strokeWidth={2.5} /> Delete Account
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
              <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-2">Account Exhausted</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-success" />
                <span className="text-[11px] font-black text-brand-success uppercase tracking-widest">Active</span>
              </div>
              <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest">Ready to use</p>
            </div>
          )}
        </div>

        {/* Stats Row */}
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
            <div className="flex items-center gap-1.5 ml-4 px-2.5 py-1 border border-brand-border rounded-md">
              <span className="text-[10px] font-mono font-black text-brand-accent tabular-nums">{relativeStr}</span>
            </div>
          </div>

          {/* Exact Refresh Date */}
          {refreshDate && (
            <div className="flex items-center gap-2 px-3 py-2 bg-brand-surface-elevated border border-brand-border rounded-lg">
              <RefreshCw size={10} className="text-brand-text-muted shrink-0" />
              <span className="text-[10px] font-bold text-brand-text-muted">Refreshes:</span>
              <span className="text-[10px] font-mono font-black text-brand-text">
                {refreshDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {refreshDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
          )}

          {/* Usage & Limit Indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-surface-elevated border border-brand-border rounded-md">
              <Zap size={10} className="text-brand-accent" />
              <span className="text-[10px] font-mono font-black text-brand-text tabular-nums">{usageCount}</span>
              {maxDailyUses > 0 && (
                <span className="text-[10px] font-mono font-bold text-brand-text-muted tabular-nums">/{maxDailyUses}</span>
              )}
            </div>
            {account.priority > 3 && (
              <span className="px-2 py-1 bg-brand-text text-brand-surface text-[9px] font-bold uppercase tracking-widest rounded-md">
                P{account.priority}
              </span>
            )}
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
          </div>

          {/* Notes Preview */}
          {account.notes && (
            <div className="flex items-start gap-2 mt-1 px-3 py-2 bg-brand-surface-elevated border border-brand-border rounded-lg">
              <StickyNote size={10} className="text-brand-text-muted shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-text-muted font-medium leading-relaxed line-clamp-2">{account.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-0" onClick={e => e.stopPropagation()}>
          {!isExhausted ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => markExhausted(account.id)}
              className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest border border-brand-border bg-brand-surface text-brand-text hover:bg-brand-text hover:text-brand-surface hover:border-brand-text transition-colors rounded-lg"
            >
              Mark as Exhausted
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => resetAccount(account.id)}
              className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest bg-brand-text text-brand-surface hover:bg-brand-accent transition-colors rounded-lg"
            >
              Reset Account
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
