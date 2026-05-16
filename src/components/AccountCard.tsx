import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, RefreshCw, Trash2, Mail } from 'lucide-react';
import { Account } from '../types';
import { useStore } from '../store';
import { TimerDisplay } from './TimerDisplay';
import { LiveCountdown } from './LiveCountdown';

interface AccountCardProps {
  accounts: Account[]; // Group of accounts sharing the same name
}

export const AccountCard: React.FC<AccountCardProps> = ({ accounts }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const markExhausted = useStore(state => state.markExhausted);
  const resetAccount = useStore(state => state.resetAccount);
  const markRefreshed = useStore(state => state.markRefreshed);
  const deleteAccount = useStore(state => state.deleteAccount);
  const selectedAccounts = useStore(state => state.selectedAccounts);
  const toggleSelectAccount = useStore(state => state.toggleSelectAccount);

  // We use the first account for shared metadata (name, color, tier, email, tags)
  const baseAccount = accounts[0];
  const isSelected = accounts.some(acc => selectedAccounts.includes(acc.id));
  const isAllExhausted = accounts.every(acc => acc.resetAt !== null);

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
    // Select all accounts in this group
    accounts.forEach(acc => {
      if (!selectedAccounts.includes(acc.id)) toggleSelectAccount(acc.id);
    });
    // If all were selected, deselect all
    if (accounts.every(acc => selectedAccounts.includes(acc.id))) {
       accounts.forEach(acc => toggleSelectAccount(acc.id));
    }
  };

  const getRefreshInfo = (account: Account) => {
    if (!account.lastRefreshedAt) return { daysLeft: 0, refreshDate: null, relativeStr: '—' };
    const refreshTime = account.lastRefreshedAt + (account.refreshCycleDays || 1) * 24 * 60 * 60 * 1000;
    const diff = refreshTime - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
    const refreshDate = new Date(refreshTime);
    
    let relativeStr = '—';
    if (diff <= 0) relativeStr = 'Now';
    else if (diff < 60 * 60 * 1000) relativeStr = `${Math.ceil(diff / (60 * 1000))}m left`;
    else if (diff < 24 * 60 * 60 * 1000) relativeStr = `${Math.ceil(diff / (60 * 60 * 1000))}h left`;
    else relativeStr = `${daysLeft}d left`;
    
    return { daysLeft, refreshDate, relativeStr };
  };

  return (
    <motion.div
      layout
      id={`account-group-${baseAccount.name}`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={handleCardClick}
      className={`relative group cursor-pointer transition-all border bg-brand-surface rounded-xl ${
        isAllExhausted 
          ? 'border-brand-accent/40' 
          : 'border-brand-border hover:border-brand-text/30'
      } ${isSelected ? 'ring-2 ring-brand-accent' : ''}`}
    >
      <div className={`relative overflow-hidden p-5 h-full transition-colors ${
        isAllExhausted ? 'bg-brand-accent/5' : ''
      }`}>

        {/* SHARED HEADER */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div 
              className="w-9 h-9 flex items-center justify-center text-brand-accent-fg font-black text-[13px] rounded-lg shrink-0"
              style={{ backgroundColor: baseAccount.color }}
            >
              {baseAccount.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-brand-text truncate max-w-[120px] tracking-tight leading-none">{baseAccount.name}</h3>
                <span className={`text-[9px] px-2 py-0.5 font-black uppercase tracking-widest rounded-md leading-none ${
                  baseAccount.tier === 'pro' ? 'bg-brand-text text-brand-surface' : 'border border-brand-border text-brand-text-muted'
                }`}>
                  {baseAccount.tier}
                </span>
              </div>
              {baseAccount.email && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Mail size={8} className="text-brand-text-muted" />
                  <span className="text-[9px] text-brand-text-muted font-medium truncate max-w-[100px] leading-none">
                    {baseAccount.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-20 shrink-0" ref={menuRef} onClick={e => e.stopPropagation()}>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated transition-colors rounded-lg"
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
                    onClick={() => { accounts.forEach(a => markRefreshed(a.id)); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-brand-text-soft flex items-center gap-3 transition-colors uppercase"
                  >
                    <RefreshCw size={14} className="text-brand-text-muted" strokeWidth={2.5} /> Reset Quota
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { accounts.forEach(a => deleteAccount(a.id)); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] font-black tracking-widest text-red-500 hover:text-red-400 flex items-center gap-3 transition-colors uppercase border-t border-brand-border mt-1 pt-2"
                  >
                    <Trash2 size={14} strokeWidth={2.5} /> Delete Group
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SHARED TAGS */}
        {baseAccount.tags && baseAccount.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
            {baseAccount.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-0.5 border border-brand-border bg-brand-surface-elevated text-[9px] text-brand-text-muted font-bold uppercase tracking-widest rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* PROVIDER LIST */}
        <div className="space-y-4 relative z-10">
          {accounts.map((account, index) => {
            const isExhausted = account.resetAt !== null;
            const healthColor = account.health > 80 ? '#30A46C' : account.health > 50 ? '#E79D13' : '#E5484D';
            const { refreshDate, relativeStr } = getRefreshInfo(account);

            return (
              <div key={account.id} className={`pt-4 ${index > 0 ? "border-t border-brand-border/50" : "border-t border-brand-border"}`}>
                
                {/* Service Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-brand-text uppercase tracking-widest">
                      {account.service}
                    </span>
                  </div>
                  
                  {isExhausted ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      <span className="text-[9px] font-black tracking-widest text-brand-accent uppercase">Cooldown</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                      <span className="text-[9px] font-black tracking-widest text-brand-success uppercase">Active</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar Area */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2 w-full mr-4">
                      <div className="flex-1 h-1 bg-brand-border rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: healthColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${isExhausted ? 0 : account.health}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-brand-text font-mono w-6 text-right">{isExhausted ? 0 : account.health}%</span>
                    </div>
                  </div>
                </div>

                {/* Info Strip */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isExhausted ? 'text-brand-accent' : 'text-brand-text-muted'}`}>
                    {relativeStr}
                  </span>
                  <div className="flex items-center gap-1.5 text-brand-text-muted bg-brand-surface-elevated px-2.5 py-1 rounded-md border border-brand-border/50">
                    <RefreshCw size={10} strokeWidth={2.5} />
                    <span className="text-[10px] font-mono font-bold text-brand-text">
                      <LiveCountdown targetDate={refreshDate ? refreshDate.getTime() : null} />
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {isExhausted ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <TimerDisplay resetAt={account.resetAt!} id={account.id} />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); resetAccount(account.id); }}
                      className="px-4 py-2 bg-brand-surface-elevated border border-brand-accent/50 hover:bg-brand-accent/10 transition-colors rounded-lg text-brand-text font-black text-[9px] tracking-widest uppercase shrink-0"
                    >
                      Reset
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ backgroundColor: "var(--color-brand-surface-elevated)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.stopPropagation(); markExhausted(account.id); }}
                    className="w-full py-2 bg-brand-bg border border-brand-border transition-colors rounded-lg text-brand-text font-black text-[9px] tracking-widest uppercase"
                  >
                    Mark Exhausted
                  </motion.button>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
