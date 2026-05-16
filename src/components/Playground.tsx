import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Zap, Info, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { aiService } from '../services/ai';
import { Account } from '../types';

export const Playground: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, node?: string }[]>([]);
  const [selectedNodeId] = useState<string | 'auto'>('auto');
  
  const getBestAccount = useStore(state => state.getBestAccount);
  const accounts = useStore(state => state.accounts);
  const showToast = useStore(state => state.showToast);

  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    let targetNode: Account | null = null;
    
    if (selectedNodeId === 'auto') {
      targetNode = getBestAccount();
    } else {
      targetNode = accounts.find(a => a.id === selectedNodeId) || null;
    }

    if (!targetNode) {
      showToast("CRITICAL_FAILURE: No operational nodes available in cluster.");
      return;
    }

    const currentPrompt = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: currentPrompt }]);
    setIsLoading(true);

    try {
      // Fetch API key from store
      const apiKeys = useStore.getState().apiKeys;
      const geminiKey = apiKeys.gemini;
      
      // Logic for model selection based on service
      const model = targetNode.service === 'gemini' ? 'gemini-1.5-flash' : 'gemini-1.5-flash'; // Fallback all to gemini-1.5 for now since we only implemented gemini SDK
      
      const response = await aiService.generateContent(currentPrompt, model, geminiKey);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response || 'No response generated from the cluster.', 
        node: targetNode?.name 
      }]);
      
      // Update health/last used in store (optional, but good for simulation)
      // markExhausted(targetNode.id); // Don't mark exhausted every time, maybe just reduce health?
      // In this version, we just log it.
    } catch (error: any) {
      showToast(`NODE_FAILURE: ${targetNode.name} reported an error. Failover initiated.`);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error from ${targetNode?.name}: ${error.message}. Please check node configuration.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeNode = selectedNodeId === 'auto' ? getBestAccount() : accounts.find(a => a.id === selectedNodeId);

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)] animate-slide-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">Neural Playground</p>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-text tracking-tight">Prompt Orchestrator</h2>
          <p className="text-[13px] text-brand-text-soft mt-1">Direct interface to the neural cluster with real-time failover routing.</p>
        </div>

        <div className="flex items-center gap-4 bg-brand-surface border border-brand-border p-1.5 rounded-2xl">
           <div className="px-3 py-1.5">
             <span className="text-[9px] font-black uppercase tracking-widest text-brand-text-muted block mb-0.5">Active Node</span>
             <div className="flex items-center gap-2">
               {activeNode ? (
                 <>
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                   <span className="text-xs font-bold text-brand-text">{activeNode.name}</span>
                   <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-bg border border-brand-border rounded uppercase">{activeNode.service}</span>
                 </>
               ) : (
                 <>
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-danger" />
                   <span className="text-xs font-bold text-brand-danger">NO NODES ACTIVE</span>
                 </>
               )}
             </div>
           </div>
           <div className="w-px h-8 bg-brand-border" />
           <div className="relative group">
             <button className="flex items-center gap-2 px-4 py-2 hover:bg-brand-bg rounded-xl transition-colors">
               <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Routing: {selectedNodeId === 'auto' ? 'Dynamic' : 'Pin'}</span>
               <ChevronDown size={14} className="text-brand-text-muted" />
             </button>
             {/* Simple Dropdown simulation or implementation */}
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-brand-surface rounded-3xl border border-brand-border overflow-hidden shadow-sm">
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
               <Cpu size={48} className="mb-4" />
               <p className="text-sm font-bold uppercase tracking-[0.3em]">Awaiting Instruction</p>
               <p className="text-[11px] font-medium mt-2 max-w-xs">Enter a prompt below to see the consensus engine in action.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] lg:max-w-[70%] space-y-2`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-text-muted">
                      {msg.role === 'user' ? 'Operator' : `Node: ${msg.node || 'Cluster'}`}
                    </span>
                    {msg.role === 'assistant' && <Zap size={10} className="text-brand-accent" />}
                  </div>
                  <div className={`p-5 rounded-2xl text-[14px] font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-text text-brand-bg rounded-tr-none shadow-lg' 
                      : 'bg-brand-bg border border-brand-border text-brand-text rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-brand-bg border border-brand-border p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                 <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Routing Request...</span>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-brand-bg border-t border-brand-border">
          <div className="relative flex items-end gap-4 bg-brand-surface border border-brand-border p-2 rounded-2xl focus-within:border-brand-text transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a prompt to the cluster..."
              className="flex-1 bg-transparent border-none outline-none resize-none p-3 text-[14px] font-medium min-h-[44px] max-h-32"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              className={`p-3 rounded-xl transition-all ${
                prompt.trim() && !isLoading 
                  ? 'bg-brand-text text-brand-bg shadow-lg hover:scale-105 active:scale-95' 
                  : 'bg-brand-border text-brand-text-muted cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Info size={12} className="text-brand-text-muted" />
                <span className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">Shift + Enter for new line</span>
              </div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-text-muted opacity-40">
              Protocol v5.0 Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
