import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useStore } from '../store';
import { ServiceType, TierType, NodeTag } from '../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Emil's Spring physics for drawer
const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0, 
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 200,
      mass: 0.8,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    x: '100%', 
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 200,
      mass: 0.8 
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  }
};

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [service, setService] = useState<ServiceType>('gemini');
  const [tier, setTier] = useState<TierType>('free');
  const [refreshCycle, setRefreshCycle] = useState(1);
  const [selectedTags, setSelectedTags] = useState<NodeTag[]>([]);
  const addAccount = useStore(state => state.addAccount);

  const availableTags: NodeTag[] = ['coding', 'creative', 'logic', 'image', 'fast'];

  const toggleTag = (tag: NodeTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAccount(name, service, tier, 3, selectedTags, refreshCycle);
    setName('');
    setService('gemini');
    setTier('free');
    setRefreshCycle(1);
    setSelectedTags([]);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 bg-brand-text/10"
            onClick={onClose}
          />
          
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-brand-surface border-l border-brand-border h-full overflow-y-auto"
          >
            <div className="p-8">
              <motion.div variants={itemVariants} className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-brand-text tracking-tighter">Deploy Node</h2>
                  <p className="text-[12px] text-brand-text-muted font-bold mt-1 uppercase tracking-widest">Cluster Configuration</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2.5 text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-elevated border border-brand-border transition-colors rounded-xl"
                >
                  <X size={18} strokeWidth={2.5} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={itemVariants} className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Node Designation</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none transition-colors text-[15px] font-bold py-3.5 px-4 rounded-xl shadow-sm"
                    placeholder="e.g. Neural-Alpha-01"
                    autoFocus
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Provider</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value as ServiceType)}
                      className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none appearance-none cursor-pointer font-bold text-[13px] py-3.5 px-4 rounded-xl shadow-sm"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="copilot">Copilot</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Cycle (Days)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={refreshCycle}
                        onChange={(e) => setRefreshCycle(parseInt(e.target.value) || 1)}
                        className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold py-3.5 pl-4 pr-10 rounded-xl shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-text-muted">DAYS</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">License Tier</label>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setTier('pro')}
                      className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm ${
                        tier === 'pro' 
                          ? 'bg-brand-text text-brand-surface' 
                          : 'text-brand-text-muted hover:text-brand-text bg-brand-surface border border-brand-border hover:border-brand-text'
                      }`}
                    >
                      {tier === 'pro' && <Check size={14} strokeWidth={3} className="text-brand-accent" />}
                      Pro
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setTier('free')}
                      className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm ${
                        tier === 'free' 
                          ? 'bg-brand-text text-brand-surface' 
                          : 'text-brand-text-muted hover:text-brand-text bg-brand-surface border border-brand-border hover:border-brand-text'
                      }`}
                    >
                      {tier === 'free' && <Check size={14} strokeWidth={3} className="text-brand-accent" />}
                      Free
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Neural Tags</label>
                  <div className="flex flex-wrap gap-2.5">
                    {availableTags.map(tag => (
                      <motion.button
                        key={tag}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all border rounded-xl shadow-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-brand-text text-brand-surface border-brand-text'
                            : 'bg-brand-surface text-brand-text-muted border-brand-border hover:border-brand-text hover:text-brand-text'
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-8">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[13px] font-black uppercase tracking-widest rounded-xl shadow-md bg-brand-accent text-brand-accent-fg hover:bg-brand-text transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:bg-brand-surface-elevated disabled:text-brand-text-muted disabled:transform-none disabled:shadow-none"
                  >
                    Deploy to Cluster
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
