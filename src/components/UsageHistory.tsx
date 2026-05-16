import React from 'react';
import { motion } from 'motion/react';
import { History } from 'lucide-react';
import { useStore } from '../store';

export const UsageHistory: React.FC = () => {
  const usageHistory = useStore(state => state.usageHistory);
  const accounts = useStore(state => state.accounts);

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId.slice(0, 8);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const groupedHistory = usageHistory.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, typeof usageHistory>);

  return (
    <div className="space-y-10 animate-slide-up">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-accent" />
          <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">Audit Logs</p>
        </div>
        <h2 className="text-3xl font-extrabold text-brand-text tracking-tight">System Events</h2>
        <p className="text-[13px] text-brand-text-soft mt-1">Immutable record of node exhaustion and recovery events within the cluster.</p>
      </div>

      {usageHistory.length === 0 ? (
        <div className="card p-20 text-center bg-gradient-to-b from-white to-[#F9FAFB]">
          <History size={40} className="mx-auto text-brand-border mb-4" />
          <p className="text-[14px] font-bold text-brand-text-muted uppercase tracking-widest">No history recorded</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedHistory).map(([date, events]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-[11px] font-extrabold text-brand-text uppercase tracking-[0.2em] whitespace-nowrap">{date}</p>
                <div className="h-px w-full bg-brand-border" />
              </div>
              <div className="space-y-3">
                {events.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="card p-4 flex items-center justify-between hover:border-[#D1D5DB] transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] text-brand-text-muted font-bold font-mono">{formatDate(log.timestamp).split(',')[1]}</span>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-brand-text">{getAccountName(log.accountId)}</span>
                        <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">{log.service}</span>
                      </div>
                    </div>
                    <span className="badge badge-danger px-3 py-1 text-[10px]">EXHAUSTED</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
