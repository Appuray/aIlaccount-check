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
    <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center p-6 selection:bg-[#C2410C] selection:text-white font-sans">
      
      {/* Absolute Logo */}
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-3 group text-[#1C1917]">
        <div className="w-8 h-8 bg-[#1C1917] flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
          <div className="w-2 h-2 bg-[#F5F5F4]" />
        </div>
        <span className="text-sm font-black tracking-tighter uppercase group-hover:text-[#C2410C] transition-colors">QuotaCheck</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="w-full max-w-md"
      >
        <div className="bg-[#E7E5E4] border border-[#D6D3D1] p-12 shadow-sm rounded-2xl">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#1C1917] mb-2 tracking-tighter uppercase">Welcome Back</h2>
            <p className="text-[11px] text-[#78716C] font-bold uppercase tracking-widest">Sign in to your account.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-[#FEF2F2] border border-[#FCA5A5] text-[10px] font-bold text-[#DC2626] uppercase tracking-widest leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono font-bold text-[#78716C] uppercase tracking-[0.2em]">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#E7E5E4] border border-[#D6D3D1] focus:border-[#C2410C] focus:ring-0 px-4 py-4 text-[13px] font-medium transition-colors outline-none rounded-xl" 
                placeholder="operator@quotacheck.io"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-mono font-bold text-[#78716C] uppercase tracking-[0.2em]">Password</label>
                <button type="button" className="text-[9px] font-bold text-[#C2410C] uppercase tracking-[0.2em] hover:text-[#1C1917] transition-colors">Forgot?</button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#E7E5E4] border border-[#D6D3D1] focus:border-[#C2410C] focus:ring-0 px-4 py-4 text-[13px] font-medium transition-colors outline-none rounded-xl" 
                placeholder="••••••••"
                required 
              />
            </div>
            <motion.button 
              whileTap={{ y: 1 }}
              transition={SPRING}
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-[#1C1917] text-[#F5F5F4] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#C2410C] transition-colors duration-300 disabled:opacity-50 mt-6 rounded-xl"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </motion.button>
          </form>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between opacity-40">
          <p className="text-[9px] font-mono text-[#1C1917] uppercase tracking-widest">
            Don't have an account? <Link to="/signup" className="text-[#C2410C] hover:underline ml-1">Sign up</Link>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-[9px] font-mono uppercase tracking-widest">Secure</span>
            <span className="text-[9px] font-mono uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
