import React, { useState, useEffect } from 'react';
import { Plus, Menu, Trash2, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { AccountGrid } from '../components/AccountGrid';
import { AddAccountModal } from '../components/AddAccountModal';
import { CommandPalette } from '../components/CommandPalette';
import { Toast } from '../components/Toast';
import { useStore } from '../store';
import { UsageStats } from '../components/UsageStats';
import { UsageHistory } from '../components/UsageHistory';
import { Playground } from '../components/Playground';
import { Settings } from '../components/Settings';
import { Sidebar } from '../components/Sidebar';
import { isFirebaseConfigured } from '../firebase';

const BulkToolbar: React.FC = () => {
  const selectedAccounts = useStore(state => state.selectedAccounts);
  const bulkMarkExhausted = useStore(state => state.bulkMarkExhausted);
  const bulkResetAccounts = useStore(state => state.bulkResetAccounts);
  const bulkDeleteAccounts = useStore(state => state.bulkDeleteAccounts);
  const deselectAllAccounts = useStore(state => state.deselectAllAccounts);
  const selectAllAccounts = useStore(state => state.selectAllAccounts);

  if (selectedAccounts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-0 left-0 lg:left-64 right-0 z-[100] bg-brand-surface border-t border-brand-border px-4 sm:px-8 py-4 pb-safe flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"
    >
      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-[12px] sm:text-[14px] font-black text-brand-text uppercase tracking-tight">{selectedAccounts.length} nodes selected</span>
        <div className="w-px h-6 bg-brand-border hidden sm:block" />
        <div className="flex gap-4">
          <button onClick={selectAllAccounts} className="text-[11px] font-bold text-brand-accent hover:text-brand-text uppercase tracking-widest transition-colors">Select all</button>
          <button onClick={deselectAllAccounts} className="text-[11px] font-bold text-brand-text-muted hover:text-brand-text uppercase tracking-widest transition-colors">Deselect</button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={bulkResetAccounts} 
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 sm:px-6 bg-brand-surface text-brand-text border border-brand-border font-bold text-[11px] sm:text-[12px] uppercase tracking-widest hover:bg-brand-surface-elevated hover:border-brand-text transition-colors rounded-lg shadow-sm"
        >
          <RefreshCw size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Reset</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={bulkMarkExhausted} 
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 sm:px-6 bg-brand-surface text-brand-text border border-brand-border font-bold text-[11px] sm:text-[12px] uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors rounded-lg shadow-sm"
        >
          <Zap size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Exhaust</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={bulkDeleteAccounts} 
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 sm:px-6 bg-brand-text text-brand-surface font-bold text-[11px] sm:text-[12px] uppercase tracking-widest hover:bg-brand-accent transition-colors rounded-lg shadow-sm"
        >
          <Trash2 size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Delete</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const accounts = useStore(state => state.accounts);
  const activeCount = accounts.filter(a => a.resetAt === null).length;
  const cooldownCount = accounts.filter(a => a.resetAt !== null).length;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } } }}
        className="p-5 border border-brand-border rounded-xl flex flex-col justify-between bg-brand-surface hover:bg-brand-surface-elevated transition-colors"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">Operational Nodes</span>
          <div className="w-2 h-2 rounded-full bg-brand-success" />
        </div>
        <div>
          <p className="text-4xl font-black tracking-tighter text-brand-text mb-3">{activeCount}</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-brand-border overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(activeCount/Math.max(1, accounts.length))*100}%` }}
                transition={{ duration: 1, type: "spring" }}
                className="h-full bg-brand-success rounded-full" 
              />
            </div>
            <span className="text-[12px] font-mono font-bold text-brand-text">{Math.round((activeCount/Math.max(1, accounts.length))*100 || 0)}%</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } } }}
        className="p-5 border border-brand-border rounded-xl flex flex-col justify-between bg-brand-surface hover:bg-brand-surface-elevated transition-colors"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">Cooling Down</span>
          <div className="w-2 h-2 rounded-full bg-brand-warning" />
        </div>
        <div>
          <p className="text-4xl font-black tracking-tighter text-brand-text mb-3">{cooldownCount}</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-brand-border overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(cooldownCount/Math.max(1, accounts.length))*100}%` }}
                transition={{ duration: 1, type: "spring" }}
                className="h-full bg-brand-warning rounded-full" 
              />
            </div>
            <span className="text-[12px] font-mono font-bold text-brand-text">{Math.round((cooldownCount/Math.max(1, accounts.length))*100 || 0)}%</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } } }}
        className="p-5 border border-brand-border rounded-xl flex flex-col justify-center items-start bg-brand-surface hover:bg-brand-surface-elevated transition-colors"
      >
        <Zap size={24} strokeWidth={2} className="text-brand-accent mb-4" />
        <h3 className="text-lg font-black text-brand-text tracking-tight uppercase">Smart Routing Active</h3>
        <p className="text-[11px] text-brand-text-muted mt-2 font-bold uppercase tracking-widest leading-relaxed">Automatically selects<br/>the best account.</p>
      </motion.div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeView = useStore(state => state.activeView);
  const setActiveView = useStore(state => state.setActiveView);
  const initialize = useStore(state => state.initialize);
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isFirebaseConfigured && !user) {
      const timeout = setTimeout(() => {
         if (!useStore.getState().user) navigate('/login');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }

      if (e.key === 'Escape') {
        useStore.getState().deselectAllAccounts();
      }
      if (e.key === '1' && !e.metaKey && !e.ctrlKey) setActiveView('dashboard');
      if (e.key === '2' && !e.metaKey && !e.ctrlKey) setActiveView('analytics');
      if (e.key === '3' && !e.metaKey && !e.ctrlKey) setActiveView('logs');
      if (e.key === '4' && !e.metaKey && !e.ctrlKey) setActiveView('settings');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 xl:pl-80">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-text flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-surface" />
            </div>
            <span className="text-[16px] font-black text-brand-text tracking-tighter uppercase">QuotaCheck</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-brand-text hover:text-brand-accent transition-colors">
            <Menu size={24} strokeWidth={2.5} />
          </button>
        </header>

        <main className="flex-1 w-full mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8 xl:px-24">
          <div className="animate-slide-up max-w-[1400px]">
            <Header />
            
            <div className="mt-10">
              <AnimatePresence mode="wait">
                {activeView === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BulkToolbar />
                    <Stats />
                    <AccountGrid />
                    
                    <div className="mt-24 pt-8 border-t border-brand-border flex items-center justify-between">
                      <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">QuotaCheck Terminal v5.0</p>
                      <div className="flex items-center gap-4">
                        <kbd className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 border border-brand-border text-[10px] font-black text-brand-text-muted uppercase">
                          <span>⌘</span> K
                        </kbd>
                        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest">System Operational</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeView === 'playground' && (
                  <motion.div
                    key="playground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Playground />
                  </motion.div>
                )}

                {activeView === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UsageStats />
                  </motion.div>
                )}

                {activeView === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings />
                  </motion.div>
                )}

                {activeView === 'logs' && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UsageHistory />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <AddAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CommandPalette />
      <Toast />
      
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 bg-brand-text text-brand-surface px-5 py-3.5 hover:bg-brand-accent transition-colors z-50 rounded-xl shadow-lg group"
      >
        <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Add Account</span>
      </motion.button>
    </div>
  );
}



