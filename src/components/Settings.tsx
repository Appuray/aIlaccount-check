import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { RefreshCcw, Trash2, Cloud, CloudOff, Download, Upload, Sun, Moon, Monitor } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase';

export const Settings: React.FC = () => {
  const { accounts, bulkReset, clearHistory, exportAccounts, importAccounts, theme, setTheme, apiKeys, setApiKey } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showKeys, setShowKeys] = useState(false);

  const handleExport = () => {
    const json = exportAccounts();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotacheck-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importAccounts(content);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-0 animate-slide-up">
      {/* Header */}
      <div className="pb-12 border-b border-brand-border">
        <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.3em] mb-6">Configuration</p>
        <h2 className="text-3xl font-black text-brand-text tracking-tighter">System Settings</h2>
        <p className="text-[14px] text-brand-text-soft mt-3 font-medium">Manage preferences and cluster data.</p>
      </div>

      {/* Appearance */}
      <div className="py-8 border-b border-brand-border">
        <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest mb-6">Appearance</h3>
        <div className="flex gap-2 max-w-sm">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl ${
              theme === 'light' 
                ? 'bg-brand-text text-brand-surface shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text bg-brand-surface hover:bg-brand-surface-elevated'
            }`}
          >
            <Sun size={14} strokeWidth={2.5} /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl ${
              theme === 'dark' 
                ? 'bg-brand-text text-brand-surface shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text bg-brand-surface hover:bg-brand-surface-elevated'
            }`}
          >
            <Moon size={14} strokeWidth={2.5} /> Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl ${
              theme === 'system' 
                ? 'bg-brand-text text-brand-surface shadow-sm' 
                : 'text-brand-text-muted hover:text-brand-text bg-brand-surface hover:bg-brand-surface-elevated'
            }`}
          >
            <Monitor size={14} strokeWidth={2.5} /> System
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="py-8 border-b border-brand-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest">Cluster Connectivity</h3>
          <button 
            onClick={() => setShowKeys(!showKeys)}
            className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest hover:text-brand-text transition-colors"
          >
            {showKeys ? "Hide Keys" : "Reveal Keys"}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest mb-2 block">Gemini API Key</label>
            <input 
              type={showKeys ? "text" : "password"}
              value={apiKeys.gemini}
              onChange={(e) => setApiKey('gemini', e.target.value)}
              className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-[13px] font-mono focus:border-brand-accent outline-none transition-colors rounded-xl shadow-sm"
              placeholder="AI_STUDIO_KEY_..."
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-brand-text-muted uppercase tracking-widest mb-2 block">OpenAI API Key (Simulated)</label>
            <input 
              type={showKeys ? "text" : "password"}
              value={apiKeys.openai}
              onChange={(e) => setApiKey('openai', e.target.value)}
              className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-[13px] font-mono focus:border-brand-accent outline-none transition-colors rounded-xl shadow-sm"
              placeholder="sk-..."
            />
          </div>
        </div>
        <p className="text-[11px] text-brand-text-muted font-medium mt-4">
          Keys are stored locally in your browser context. Never shared with any third party except the respective AI providers.
        </p>
      </div>

      {/* Data Management */}
      <div className="py-8 border-b border-brand-border">
        <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest mb-6">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="py-3 px-6 text-[11px] font-black uppercase tracking-widest bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-elevated transition-colors flex items-center gap-2 rounded-xl shadow-sm"
          >
            <Download size={14} /> Export Nodes
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-6 text-[11px] font-black uppercase tracking-widest bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-surface-elevated transition-colors flex items-center gap-2 rounded-xl shadow-sm"
          >
            <Upload size={14} /> Import Config
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
        <p className="text-[11px] text-brand-text-muted font-medium mt-3">
          Backup or restore cluster state configurations.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-b border-brand-border">
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-8 pr-8 sm:border-r border-brand-border"
        >
          <div className="flex items-center gap-4 mb-6">
            <RefreshCcw size={18} className="text-brand-text-muted" />
            <div>
              <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest">Force Reset</h3>
              <p className="text-[11px] font-medium text-brand-text-soft mt-1">Clear all node cooldowns</p>
            </div>
          </div>
          <button
            onClick={bulkReset}
            className="w-full py-3 text-[11px] font-black uppercase tracking-widest bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-text hover:text-brand-surface transition-colors rounded-xl shadow-sm"
          >
            Reset Entire Cluster
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          viewport={{ once: true }}
          className="py-8 sm:pl-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Trash2 size={18} className="text-brand-accent" />
            <div>
              <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest">Clear Telemetry</h3>
              <p className="text-[11px] font-medium text-brand-text-soft mt-1">Delete usage history</p>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="w-full py-3 text-[11px] font-black uppercase tracking-widest bg-brand-surface border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-surface transition-colors rounded-xl shadow-sm"
          >
            Purge Logs
          </button>
        </motion.div>
      </div>

      {/* Active Nodes List */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[13px] font-black text-brand-text uppercase tracking-widest">Active Nodes ({accounts.length})</h3>
          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-success">
                <Cloud size={14} strokeWidth={2.5} /> Cloud Sync
              </span>
            ) : (
              <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-brand-text-muted">
                <CloudOff size={14} strokeWidth={2.5} /> Local State
              </span>
            )}
          </div>
        </div>
        <div className="space-y-0 max-h-[300px] overflow-y-auto scroll-hide border border-brand-border rounded-xl bg-brand-surface shadow-sm">
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between px-6 py-4 border-b border-brand-border last:border-b-0 hover:bg-brand-surface-elevated transition-colors">
              <div className="flex items-center gap-4">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: acc.color }}
                />
                <span className="text-[14px] font-bold text-brand-text">{acc.name}</span>
                <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">{acc.service}</span>
              </div>
              <span className={`text-[13px] font-mono font-black tabular-nums ${acc.health > 80 ? 'text-brand-success' : 'text-brand-accent'}`}>
                {acc.health}%
              </span>
            </div>
          ))}
          {accounts.length === 0 && (
            <p className="text-center py-12 text-[12px] font-bold text-brand-text-muted uppercase tracking-widest">No nodes deployed</p>
          )}
        </div>
      </div>
    </div>
  );
};
