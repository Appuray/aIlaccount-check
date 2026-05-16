import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Server, Terminal, Zap } from 'lucide-react';
import Lenis from 'lenis';

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

export const Landing: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#F5F5F4] text-[#1C1917] min-h-[100dvh] font-sans selection:bg-[#C2410C] selection:text-white">
      {/* Structural Grid Background - Muted Stone lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(28,25,23,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,25,23,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-[#1C1917]/[0.06]" />
        <div className="absolute right-[10%] top-0 bottom-0 w-px bg-[#1C1917]/[0.06]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-[10%] py-8 flex justify-between items-center bg-[#F5F5F4]/80 backdrop-blur-md border-b border-[#1C1917]/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#1C1917] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#F5F5F4]" />
          </div>
          <span className="font-black tracking-tighter text-lg">QUOTACHECK</span>
        </div>
        <Link 
          to="/login"
          className="text-[11px] font-black tracking-widest uppercase hover:text-[#C2410C] transition-colors"
        >
          System Access
        </Link>
      </nav>

      {/* Hero Section - Asymmetric 70/30 Split */}
      <main className="relative z-10 pt-[25vh] px-[10%] min-h-[100dvh] flex flex-col md:flex-row gap-20">
        
        {/* Left Column - 70% */}
        <div className="md:w-[70%]">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-8 bg-[#C2410C]" />
            <span className="text-[10px] font-mono text-[#78716C] tracking-[0.2em] uppercase">Architecture Standard v5.0</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black leading-[0.9] tracking-tighter uppercase text-[#1C1917]">
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ ...SPRING, delay: 0.1 }}
            >
              Control
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ ...SPRING, delay: 0.2 }}
              className="flex items-center gap-4 my-2"
            >
              Intelligence
              {/* Inline Image Typography Replacement */}
              <div className="hidden md:flex h-[70px] w-[140px] bg-white border border-[#E7E5E4] rounded-full items-center justify-center overflow-hidden relative shadow-sm">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-10"
                >
                  <div className="w-full h-px bg-[#1C1917] absolute top-1/2 -translate-y-1/2" />
                  <div className="h-full w-px bg-[#1C1917] absolute left-1/2 -translate-x-1/2" />
                </motion.div>
                <Zap size={24} className="text-[#C2410C] relative z-10" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ ...SPRING, delay: 0.3 }}
            >
              At Scale.
            </motion.div>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING, delay: 0.5 }}
            className="mt-12 text-[#78716C] text-lg md:text-xl max-w-xl leading-relaxed font-medium"
          >
            A high-density terminal for balancing limits, tracking usage, and routing endpoints across multiple structural models. Not for generic workflows.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.6 }}
            className="mt-16"
          >
            <Link 
              to="/signup"
              className="inline-flex items-center gap-4 bg-[#1C1917] text-[#F5F5F4] px-8 py-5 font-black tracking-widest text-[11px] uppercase hover:bg-[#C2410C] transition-colors duration-300 group shadow-lg shadow-[#1C1917]/10"
            >
              Initialize Node
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column - 30% Asymmetric Balance */}
        <div className="md:w-[30%] pt-10 md:pt-32 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING, delay: 0.4 }}
            className="bg-white border border-[#E7E5E4] p-8 shadow-sm"
          >
            <p className="font-mono text-[#78716C] text-[10px] uppercase tracking-widest mb-6 border-b border-[#E7E5E4] pb-4">System Status</p>
            <div className="space-y-4">
              {[
                { label: 'Latency', val: '12ms', icon: Terminal },
                { label: 'Redundancy', val: 'Active', icon: Database },
                { label: 'Protocol', val: 'Secure', icon: Server }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#F5F5F4] last:border-0">
                  <div className="flex items-center gap-3">
                    <stat.icon size={14} className="text-[#C2410C]" />
                    <span className="text-[11px] font-bold tracking-widest text-[#1C1917] uppercase">{stat.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#78716C]">{stat.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="relative z-10 border-t border-[#1C1917]/[0.06] mx-[10%] py-12 flex justify-between items-center mt-20">
        <p className="text-[10px] font-mono text-[#78716C] uppercase tracking-widest">© 2026 QuotaCheck Architecture</p>
        <p className="text-[10px] font-mono text-[#C2410C] uppercase tracking-widest">v5.0.0 — Stable</p>
      </footer>
    </div>
  );
};
