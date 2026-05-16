import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';
import { useStore } from '../store';

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

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
      console.warn("Firebase not configured. Bypassing login for local development.");
      setTimeout(() => {
        showToast('Dev Mode: Logged in successfully');
        navigate('/dashboard');
      }, 800);
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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 selection:bg-brand-accent selection:text-brand-bg font-sans">
      
      {/* Absolute Logo */}
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 group text-brand-text">
        <div className="w-8 h-8 bg-brand-text flex items-center justify-center transition-transform duration-500 group-hover:rotate-90 rounded-sm">
          <div className="w-2 h-2 bg-brand-bg" />
        </div>
        <span className="text-sm font-black tracking-tighter uppercase group-hover:text-brand-accent transition-colors">QuotaCheck</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="w-full max-w-md"
      >
        <div className="bg-brand-surface border border-brand-border-strong p-12 shadow-sm rounded-2xl">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-brand-text mb-2 tracking-tighter uppercase">Welcome Back</h2>
            <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest">Sign in to your account.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.2em]">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border-strong focus:border-brand-accent focus:ring-0 px-4 py-4 text-[13px] font-medium transition-colors outline-none rounded-xl placeholder:text-brand-text-muted/60 text-brand-text" 
                placeholder="operator@quotacheck.io"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em] hover:text-brand-text transition-colors">Forgot?</button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border-strong focus:border-brand-accent focus:ring-0 px-4 py-4 text-[13px] font-medium transition-colors outline-none rounded-xl placeholder:text-brand-text-muted/60 text-brand-text" 
                placeholder="••••••••"
                required 
              />
            </div>
            <motion.button 
              whileTap={{ y: 1 }}
              transition={SPRING}
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-brand-text text-brand-bg font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-accent transition-colors duration-300 disabled:opacity-50 mt-6 rounded-xl"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </motion.button>
          </form>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between opacity-40">
          <p className="text-[9px] font-mono text-brand-text uppercase tracking-widest">
            Don't have an account? <Link to="/signup" className="text-brand-accent hover:underline ml-1">Sign up</Link>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0 text-brand-text">
            <span className="text-[9px] font-mono uppercase tracking-widest">Secure</span>
            <span className="text-[9px] font-mono uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
