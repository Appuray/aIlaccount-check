import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid } from 'lucide-react';
import { useStore } from '../store';
import { AccountCard } from './AccountCard';
import { NodeTag } from '../types';

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

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between border-b border-brand-border pb-6">
        <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Status</span>
            <div className="flex items-center gap-1">
              {(['all', 'active', 'cooldown'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap rounded-lg ${
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

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Caps</span>
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto scroll-hide pb-1 sm:pb-0">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap rounded-lg ${
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="py-24 text-center border border-brand-border bg-brand-surface rounded-xl"
        >
          <div className="w-16 h-16 bg-brand-surface-elevated border border-brand-border flex items-center justify-center mx-auto mb-8 rounded-xl">
            <Search size={32} strokeWidth={1.5} className="text-brand-text-muted" />
          </div>
          <h3 className="text-2xl font-black text-brand-text mb-2 tracking-tighter">No Matching Nodes</h3>
          <p className="text-[13px] text-brand-text-soft font-medium mb-10 max-w-[360px] mx-auto leading-relaxed">Refine your capability tags or cluster status filters to find specific nodes.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('all');
              setSelectedService('all');
              setSelectedStatus('all');
            }}
            className="py-3 px-8 bg-brand-text text-brand-surface font-black text-[11px] uppercase tracking-widest hover:bg-brand-accent transition-colors rounded-lg"
          >
            Reset All Filters
          </motion.button>
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
            {filteredAccounts.map((account) => (
              <motion.div 
                key={account.id} 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
                }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                <AccountCard account={account} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
