import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { X, Check, Clock, Calendar } from 'lucide-react';
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
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['gemini']);
  const [tier, setTier] = useState<TierType>('free');
  const [refreshMode, setRefreshMode] = useState<'days' | 'exact'>('days');
  const [refreshCycle, setRefreshCycle] = useState(1);
  const [exactResetDate, setExactResetDate] = useState('');
  const [exactHour, setExactHour] = useState('12');
  const [exactMinute, setExactMinute] = useState('00');
  const [exactAmPm, setExactAmPm] = useState('AM');
  const [selectedTags, setSelectedTags] = useState<NodeTag[]>([]);
  const [priority, setPriority] = useState(3);
  const [notes, setNotes] = useState('');
  const [email, setEmail] = useState('');
  const [maxDailyUses, setMaxDailyUses] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const addAccount = useStore(state => state.addAccount);

  const availableTags: NodeTag[] = ['coding', 'creative', 'logic', 'image', 'fast'];

  const serviceOptions: { value: ServiceType; label: string; sub: string }[] = [
    { value: 'gemini', label: 'Gemini', sub: 'Google AI' },
    { value: 'claude', label: 'Claude', sub: 'Anthropic' },
    { value: 'chatgpt', label: 'ChatGPT', sub: 'OpenAI' },
    { value: 'copilot', label: 'Copilot', sub: 'Microsoft' },
    { value: 'other', label: 'Other', sub: 'Custom' },
  ];

  const toggleService = (svc: ServiceType) => {
    setSelectedServices(prev => {
      if (prev.includes(svc)) {
        // Don't allow deselecting if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== svc);
      } else {
        // Max 2 selections
        if (prev.length >= 2) {
          // Replace the oldest selection
          return [prev[1], svc];
        }
        return [...prev, svc];
      }
    });
  };

  const toggleTag = (tag: NodeTag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Compute the preview reset time
  const resetPreview = useMemo(() => {
    if (refreshMode === 'exact' && exactResetDate) {
      let h = parseInt(exactHour);
      if (exactAmPm === 'PM' && h < 12) h += 12;
      if (exactAmPm === 'AM' && h === 12) h = 0;
      const hStr = h.toString().padStart(2, '0');
      const mStr = exactMinute.padStart(2, '0');
      
      const dateStr = `${exactResetDate}T${hStr}:${mStr}`;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    } else {
      const d = new Date();
      d.setDate(d.getDate() + refreshCycle);
      return d;
    }
  }, [refreshMode, refreshCycle, exactResetDate, exactHour, exactMinute, exactAmPm]);

  // Compute actual refreshCycleDays for the store
  const computedCycleDays = useMemo(() => {
    if (refreshMode === 'exact' && resetPreview) {
      const diffMs = resetPreview.getTime() - Date.now();
      return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    return refreshCycle;
  }, [refreshMode, resetPreview, refreshCycle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedServices.length === 0) return;
    // Create one account per selected provider
    for (const svc of selectedServices) {
      const accountName = selectedServices.length > 1 ? `${name} (${svc})` : name;
      await addAccount(accountName, svc, tier, priority, selectedTags, computedCycleDays, notes, maxDailyUses, email);
    }
    setName('');
    setSelectedServices(['gemini']);
    setTier('free');
    setRefreshCycle(1);
    setRefreshMode('days');
    setExactResetDate('');
    setExactHour('12');
    setExactMinute('00');
    setExactAmPm('AM');
    setSelectedTags([]);
    setPriority(3);
    setNotes('');
    setEmail('');
    setMaxDailyUses(0);
    setShowAdvanced(false);
    onClose();
  };

  // Get today's date for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

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
                  <h2 className="text-2xl font-black text-brand-text tracking-tighter">Add Account</h2>
                  <p className="text-[12px] text-brand-text-muted font-bold mt-1 uppercase tracking-widest">Account Details</p>
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
                  <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Account Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none transition-colors text-[15px] font-bold py-3.5 px-4 rounded-xl shadow-sm"
                    placeholder="e.g. Personal Gemini"
                    autoFocus
                  />
                </motion.div>

                {/* Provider Selection — Multi-Select Grid (up to 2) */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Provider</label>
                    <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">{selectedServices.length}/2 selected</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {serviceOptions.map(opt => (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => toggleService(opt.value)}
                        className={`py-3 px-2 text-center transition-all border rounded-xl shadow-sm ${
                          selectedServices.includes(opt.value) 
                            ? 'bg-brand-text text-brand-surface border-brand-text' 
                            : 'bg-brand-surface text-brand-text-muted border-brand-border hover:border-brand-text hover:text-brand-text'
                        }`}
                      >
                        <span className="text-[12px] font-black tracking-wide block">{opt.label}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 block ${
                          selectedServices.includes(opt.value) ? 'opacity-60' : 'opacity-40'
                        }`}>{opt.sub}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Refresh Cycle — Dual Mode */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Quota Reset</label>
                    <div className="flex gap-1 bg-brand-surface-elevated rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setRefreshMode('days')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
                          refreshMode === 'days' 
                            ? 'bg-brand-text text-brand-surface shadow-sm' 
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                      >
                        <Clock size={10} strokeWidth={2.5} /> Days
                      </button>
                      <button
                        type="button"
                        onClick={() => setRefreshMode('exact')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
                          refreshMode === 'exact' 
                            ? 'bg-brand-text text-brand-surface shadow-sm' 
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                      >
                        <Calendar size={10} strokeWidth={2.5} /> Exact
                      </button>
                    </div>
                  </div>

                  {refreshMode === 'days' ? (
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={refreshCycle}
                        onChange={(e) => setRefreshCycle(parseInt(e.target.value) || 1)}
                        className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold py-3.5 pl-4 pr-16 rounded-xl shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Days</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">Date</span>
                        <input
                          type="date"
                          min={todayStr}
                          value={exactResetDate}
                          onChange={(e) => setExactResetDate(e.target.value)}
                          className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold text-[13px] py-3 px-3 rounded-xl shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">Time</span>
                        <div className="flex items-center gap-1">
                          <select 
                            value={exactHour}
                            onChange={(e) => setExactHour(e.target.value)}
                            className="bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold text-[13px] py-3 px-2 rounded-xl shadow-sm appearance-none text-center flex-1"
                          >
                            {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                              <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                          <span className="text-brand-text font-black">:</span>
                          <select 
                            value={exactMinute}
                            onChange={(e) => setExactMinute(e.target.value)}
                            className="bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold text-[13px] py-3 px-2 rounded-xl shadow-sm appearance-none text-center flex-1"
                          >
                            {Array.from({length: 60}, (_, i) => i).map(m => (
                              <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                          <select 
                            value={exactAmPm}
                            onChange={(e) => setExactAmPm(e.target.value)}
                            className="bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold text-[13px] py-3 px-2 rounded-xl shadow-sm appearance-none text-center w-16"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Reset Preview */}
                  {resetPreview && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-3 bg-brand-surface-elevated border border-brand-border rounded-xl px-4 py-3"
                    >
                      <Clock size={14} className="text-brand-accent shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-brand-text-muted uppercase tracking-widest">Quota Refreshes On</p>
                        <p className="text-[13px] font-bold text-brand-text mt-0.5">
                          {resetPreview.toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}, {resetPreview.toLocaleTimeString('en-US', { 
                            hour: 'numeric', minute: '2-digit', hour12: true 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  )}
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
                  <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Tags / Categories</label>
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

                {/* Advanced Options Toggle */}
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between py-3 px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest bg-brand-surface-elevated border border-brand-border rounded-xl hover:border-brand-text hover:text-brand-text transition-colors"
                  >
                    <span>Advanced Options</span>
                    <motion.span
                      animate={{ rotate: showAdvanced ? 180 : 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="text-[14px]"
                    >▾</motion.span>
                  </button>
                </motion.div>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* Priority Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Priority Level</label>
                          <span className="text-[12px] font-mono font-black text-brand-text tabular-nums">{priority}/5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={priority}
                          onChange={(e) => setPriority(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-brand-border rounded-full appearance-none cursor-pointer accent-brand-accent"
                        />
                        <div className="flex justify-between px-1">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className={`text-[8px] font-black uppercase tracking-widest ${priority === n ? 'text-brand-accent' : 'text-brand-text-muted'}`}>
                              {n === 1 ? 'Low' : n === 3 ? 'Normal' : n === 5 ? 'Critical' : '·'}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Email / Account ID */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Linked Email / Account</label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none transition-colors text-[13px] font-medium py-3 px-4 rounded-xl shadow-sm"
                          placeholder="user@gmail.com"
                        />
                      </div>

                      {/* Max Daily Uses */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Max Daily Uses</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            value={maxDailyUses}
                            onChange={(e) => setMaxDailyUses(parseInt(e.target.value) || 0)}
                            className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none font-bold py-3.5 pl-4 pr-24 rounded-xl shadow-sm"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">
                            {maxDailyUses === 0 ? 'Unlimited' : 'per day'}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-brand-text-soft uppercase tracking-[0.2em]">Notes / Memo</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          maxLength={200}
                          className="w-full bg-brand-surface border border-brand-border focus:border-brand-accent focus:outline-none transition-colors text-[13px] font-medium py-3 px-4 rounded-xl shadow-sm resize-none"
                          placeholder="e.g. Personal account, shared with team, project-specific..."
                        />
                        <p className="text-[9px] text-brand-text-muted font-bold text-right">{notes.length}/200</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={!name.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 text-[13px] font-black uppercase tracking-widest rounded-xl shadow-md bg-brand-accent text-brand-accent-fg hover:bg-brand-text transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:bg-brand-surface-elevated disabled:text-brand-text-muted disabled:transform-none disabled:shadow-none"
                  >
                    Add Account
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
