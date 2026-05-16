import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { useStore } from '../store';
import { AccountCard } from './AccountCard';
import { NodeTag, Account } from '../types';

export const AccountGrid: React.FC = () => {
  const accounts = useStore((state) => state.accounts);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const selectedTag = useStore((state) => state.selectedTag);
  const setSelectedTag = useStore((state) => state.setSelectedTag);
  const selectedService = useStore((state) => state.selectedService);
  const setSelectedService = useStore((state) => state.setSelectedService);
  const selectedStatus = useStore((state) => state.selectedStatus);
  const setSelectedStatus = useStore((state) => state.setSelectedStatus);

  const tags: (NodeTag | 'all')[] = ['all', 'coding', 'creative', 'logic', 'image', 'fast'];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         acc.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || acc.tags.includes(selectedTag as NodeTag);
    const matchesService = selectedService === 'all' || acc.service === selectedService;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && acc.resetAt === null) ||
                         (selectedStatus === 'cooldown' && acc.resetAt !== null);
                         
    return matchesSearch && matchesTag && matchesService && matchesStatus;
  });

  const groupedAccounts = Object.values(
    filteredAccounts.reduce((acc, account) => {
      if (!acc[account.name]) acc[account.name] = [];
      acc[account.name].push(account);
      return acc;
    }, {} as Record<string, Account[]>)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between border-b border-brand-border pb-6 w-full min-w-0">
        <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto min-w-0">
          <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em] shrink-0">Status</span>
            <div className="flex items-center gap-1 overflow-x-auto scroll-hide pb-2 sm:pb-0 w-full snap-x">
              {(['all', 'active', 'cooldown'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap snap-start shrink-0 rounded-lg ${
                    selectedStatus === status 
                      ? 'bg-brand-text text-brand-surface shadow-sm' 
                      : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated'
                  }`}
                >
                  {status === 'active' ? 'Operational' : status === 'cooldown' ? 'Exhausted' : 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em] shrink-0">Caps</span>
            <div className="flex items-center gap-1 overflow-x-auto scroll-hide pb-2 sm:pb-0 w-full snap-x">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap snap-start shrink-0 rounded-lg ${
                    selectedTag === tag 
                      ? 'bg-brand-text text-brand-surface shadow-sm' 
                      : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono font-black text-brand-text-muted uppercase tracking-widest shrink-0 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-success" />
          {filteredAccounts.length} Nodes Online
        </div>
      </div>

      {accounts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="py-24 text-center border border-brand-border bg-brand-surface rounded-xl"
        >
          <div className="w-16 h-16 bg-brand-surface-elevated border border-brand-border flex items-center justify-center mx-auto mb-8 rounded-xl">
            <LayoutGrid size={32} strokeWidth={1.5} className="text-brand-text-muted" />
          </div>
          <h3 className="text-2xl font-black text-brand-text mb-2 tracking-tighter">Cluster Empty</h3>
          <p className="text-[13px] text-brand-text-soft font-medium max-w-[320px] mx-auto leading-relaxed">Deploy your first node to begin managing distributed AI quotas.</p>
        </motion.div>
      ) : filteredAccounts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center justify-center py-32 text-center border border-brand-border rounded-xl bg-brand-surface"
        >
          <div className="w-16 h-16 bg-brand-surface-elevated rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-brand-border-strong">
            <LayoutGrid size={24} className="text-brand-text-muted" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-black text-brand-text mb-2 tracking-tight">Cluster Empty</h3>
          <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest max-w-xs leading-relaxed">
            {searchQuery || selectedTag !== 'all' || selectedStatus !== 'all' 
              ? 'No nodes match your current telemetry filters.'
              : 'Deploy your first node to begin managing distributed AI quotas.'}
          </p>
          {(searchQuery || selectedTag !== 'all' || selectedStatus !== 'all') && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
                setSelectedService('all');
                setSelectedStatus('all');
              }}
              className="mt-8 py-3 px-8 bg-brand-text text-brand-surface font-black text-[11px] uppercase tracking-widest hover:bg-brand-accent transition-colors rounded-lg"
            >
              Reset All Filters
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {groupedAccounts.map((accountGroup) => (
              <motion.div 
                key={accountGroup[0].name} 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
                }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                <AccountCard accounts={accountGroup} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
