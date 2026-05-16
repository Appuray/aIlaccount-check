import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';
import { useStore } from '../store';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useStore(state => state.showToast);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isFirebaseConfigured) {
      setError("System architecture error: Missing secure environment variables (VITE_FIREBASE_API_KEY). Access denied.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Authentication Successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-brand-bg) flex items-center justify-center p-6 transition-colors selection:bg-(--color-brand-accent) selection:text-white">
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 group">
        <div className="w-8 h-8 bg-(--color-brand-text) rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
          <div className="w-3 h-3 bg-brand-surface rounded-sm rotate-45" />
        </div>
        <span className="text-base font-bold tracking-tight uppercase transition-colors group-hover:text-(--color-brand-accent)">QuotaCheck</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-sm"
      >
        <div className="card p-10 bg-brand-surface border border-(--color-brand-border)/50 shadow-2xl rounded-3xl">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-(--color-brand-text) mb-2 tracking-tighter uppercase">Welcome back</h2>
            <p className="text-[11px] text-(--color-brand-text-soft) font-bold uppercase tracking-widest">Enter your details to access the cluster.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-(--color-brand-text-muted) uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base w-full bg-(--color-brand-bg) border border-(--color-brand-border) focus:border-(--color-brand-accent) focus:ring-0 rounded-xl px-4 py-3 text-[13px] font-medium transition-all" 
                placeholder="operator@quotacheck.io"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black text-(--color-brand-text-muted) uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[9px] font-black text-(--color-brand-accent) uppercase tracking-[0.2em] hover:underline">Forgot?</button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base w-full bg-(--color-brand-bg) border border-(--color-brand-border) focus:border-(--color-brand-accent) focus:ring-0 rounded-xl px-4 py-3 text-[13px] font-medium transition-all" 
                placeholder="••••••••"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-(--color-brand-text) text-(--color-brand-bg) rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-(--color-brand-accent) hover:text-white transition-all duration-300 disabled:opacity-50 shadow-xl shadow-black/5 mt-4"
            >
              {loading ? 'Authenticating...' : 'Access Cluster'}
            </button>
          </form>
          
          <p className="text-center text-[10px] text-(--color-brand-text-muted) font-bold uppercase tracking-widest mt-10">
            Don't have an account? <br/>
            <Link to="/signup" className="text-(--color-brand-accent) hover:underline mt-2 inline-block">Deploy New Account</Link>
          </p>
        </div>
        
        <div className="mt-8 flex justify-center gap-6 opacity-30">
          <p className="text-[7px] font-black uppercase tracking-widest">Local Encrypted</p>
          <p className="text-[7px] font-black uppercase tracking-widest">SSL Secure</p>
          <p className="text-[7px] font-black uppercase tracking-widest">v5.0 Protocol</p>
        </div>
      </motion.div>
    </div>
  );
};

