import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, LayoutDashboard, BarChart3, History, Settings as SettingsIcon, Zap, RefreshCw, Plus } from 'lucide-react';
import { useStore } from '../store';

interface CommandItem {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  subtitle?: string;
  color?: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const accounts = useStore(state => state.accounts);
  const setActiveView = useStore(state => state.setActiveView);
  const markExhausted = useStore(state => state.markExhausted);
  const resetAccount = useStore(state => state.resetAccount);
  const bulkReset = useStore(state => state.bulkReset);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const navigationItems: CommandItem[] = [
    { id: 'view-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => setActiveView('dashboard') },
    { id: 'view-analytics', label: 'Go to Analytics', icon: BarChart3, action: () => setActiveView('analytics') },
    { id: 'view-logs', label: 'Go to Audit Logs', icon: History, action: () => setActiveView('logs') },
    { id: 'view-settings', label: 'Go to Settings', icon: SettingsIcon, action: () => setActiveView('settings') },
  ];

  const systemActions: CommandItem[] = [
    { id: 'action-reset-all', label: 'Global Node Reset', icon: RefreshCw, action: bulkReset, color: 'text-brand-accent' },
    { id: 'action-add-node', label: 'Deploy New Node', icon: Plus, action: () => setActiveView('dashboard') }, // Actually open modal logic could be here
  ];

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(query.toLowerCase()) || 
    acc.service.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const results: CommandItem[] = [
    ...navigationItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    ...systemActions.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    ...filteredAccounts.map(acc => ({
      id: `acc-${acc.id}`,
      label: `Node: ${acc.name} (${acc.service})`,
      icon: Zap,
      action: () => {
        if (acc.resetAt) resetAccount(acc.id);
        else markExhausted(acc.id);
      },
      subtitle: acc.resetAt ? 'Status: Cooldown - Click to Reset' : 'Status: Operational - Click to Exhaust'
    }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-text/10 z-[1000]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[1001] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-brand-surface border border-brand-border overflow-hidden pointer-events-auto rounded-xl shadow-2xl"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center px-4 py-4 border-b border-brand-border">
                <Search size={20} className="text-brand-text-muted mr-3" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-brand-text placeholder-brand-text-muted text-[15px] font-medium"
                  placeholder="Type a command or search nodes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-border text-[10px] font-black text-brand-text-muted uppercase rounded-lg">
                  ESC
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((item, index) => (
                      <button
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3 transition-colors text-left rounded-xl ${
                          index === selectedIndex 
                            ? 'bg-brand-text text-brand-surface' 
                            : 'text-brand-text-soft hover:bg-brand-surface-elevated'
                        }`}
                      >
                        <div className={`p-2 ${index === selectedIndex ? '' : 'border border-brand-border'} rounded-lg`}>
                          <item.icon size={18} className={index === selectedIndex ? 'text-brand-surface' : ''} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-[14px] font-bold ${index === selectedIndex ? 'text-brand-surface' : 'text-brand-text'}`}>
                            {item.label}
                          </div>
                          {item.subtitle && (
                            <div className={`text-[11px] font-medium uppercase tracking-wider opacity-60 ${index === selectedIndex ? 'text-brand-surface' : 'text-brand-text-muted'}`}>
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                        {index === selectedIndex && (
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Execute</div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Command size={40} className="mx-auto text-brand-border mb-4 opacity-50" />
                    <p className="text-[13px] font-bold text-brand-text-muted uppercase tracking-widest">No matching commands found</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-brand-bg border-t border-brand-border flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-brand-surface border border-brand-border rounded text-[9px] font-bold text-brand-text-muted">↑↓</kbd>
                    <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-brand-surface border border-brand-border rounded text-[9px] font-bold text-brand-text-muted">↵</kbd>
                    <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Select</span>
                  </div>
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-text-muted opacity-40">
                  QuotaCheck Terminal v5.0
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

