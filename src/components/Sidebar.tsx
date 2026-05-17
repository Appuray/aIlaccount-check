import React from 'react';
import { LayoutDashboard, Zap, BarChart3, History, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (val: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const activeView = useStore(state => state.activeView);
  const setActiveView = useStore(state => state.setActiveView);
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'playground', icon: Zap, label: 'Neural Playground' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'logs', icon: History, label: 'Audit Logs' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ] as const;

  const NavContent = () => (
    <>
      <div className="mb-20 px-4">
        <div className="flex items-center gap-4 mb-2">
          <motion.div 
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-10 h-10 bg-brand-text flex items-center justify-center cursor-pointer rounded-xl"
          >
            <div className="w-3 h-3 bg-brand-surface rounded-sm" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-brand-text uppercase">QuotaCheck</h1>
            <p className="text-[9px] text-brand-text-muted font-bold uppercase tracking-[0.3em] mt-1">Control Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => {
              setActiveView(item.id);
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[13px] font-black tracking-widest uppercase transition-all ${
              activeView === item.id 
                ? 'text-brand-text bg-brand-surface-elevated shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated/50'
            }`}
          >
            <span className="relative z-10 flex items-center gap-4">
              <item.icon size={18} strokeWidth={activeView === item.id ? 2.5 : 2} className={activeView === item.id ? "text-brand-accent" : ""} />
              {item.label}
            </span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-brand-border space-y-0">
        {user && (
          <motion.button 
            whileHover={{ x: 4, backgroundColor: "var(--color-brand-surface-elevated)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[12px] font-black tracking-widest text-brand-danger uppercase transition-colors"
          >
            <LogOut size={16} strokeWidth={2.5} />
            Disconnect
          </motion.button>
        )}
        <div className="px-6 py-6 bg-brand-surface">
          <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em] mb-3">System Status</p>
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-brand-success" 
            />
            <span className="text-[12px] font-mono font-black tracking-widest text-brand-text">ALL ONLINE</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand-text/20 backdrop-blur-md z-[60] lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-[280px] xl:w-[320px] fixed inset-y-0 z-50 bg-brand-surface border-r border-brand-border">
        <div className="flex flex-col h-full py-12">
          <NavContent />
        </div>
      </aside>

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
        className="fixed inset-y-0 left-0 w-[300px] z-[70] lg:hidden bg-brand-surface border-r border-brand-border"
      >
        <div className="flex flex-col h-full py-12 overflow-y-auto">
          <NavContent />
        </div>
      </motion.aside>
    </>
  );
};
