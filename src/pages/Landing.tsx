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
    <div className="bg-brand-bg text-brand-text min-h-[100dvh] w-full flex flex-col font-sans selection:bg-brand-accent selection:text-brand-bg relative">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-brand-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-border)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-brand-border hidden sm:block" />
        <div className="absolute right-[10%] top-0 bottom-0 w-px bg-brand-border hidden sm:block" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-5 sm:px-[10%] py-6 sm:py-8 flex justify-between items-center border-b border-brand-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-brand-text flex items-center justify-center rounded-sm">
            <div className="w-2 h-2 bg-brand-bg" />
          </div>
          <span className="font-black tracking-tighter text-lg">QUOTACHECK</span>
        </div>
        <Link 
          to="/login"
          className="text-[11px] font-black tracking-widest uppercase hover:text-brand-accent transition-colors"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center w-full px-5 sm:px-[10%] py-12 sm:py-0">
        <div className="w-full flex flex-col md:flex-row items-center gap-10 md:gap-20">
          
          {/* Left Column */}
          <div className="md:w-[70%] w-full flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-brand-accent" />
              <span className="text-[10px] font-mono text-brand-text-muted tracking-[0.2em] uppercase">Simple Account Manager</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[85px] font-black leading-[0.9] tracking-tighter uppercase text-brand-text">
              <motion.div 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ ...SPRING, delay: 0.1 }}
              >
                Manage
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ ...SPRING, delay: 0.2 }}
                className="flex items-center gap-4 my-2"
              >
                All AI
                {/* Inline Image Typography Replacement */}
                <div className="hidden md:flex h-[60px] w-[120px] bg-brand-surface border border-brand-border-strong rounded-full items-center justify-center overflow-hidden relative shadow-sm">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10"
                  >
                    <div className="w-full h-px bg-brand-text absolute top-1/2 -translate-y-1/2" />
                    <div className="h-full w-px bg-brand-text absolute left-1/2 -translate-x-1/2" />
                  </motion.div>
                  <Zap size={24} className="text-brand-accent relative z-10" />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ ...SPRING, delay: 0.3 }}
              >
                Accounts.
              </motion.div>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING, delay: 0.5 }}
              className="mt-6 sm:mt-8 text-brand-text-muted text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-medium"
            >
              A simple dashboard to track usage limits, manage multiple AI tools, and easily switch between accounts when limits are reached.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.6 }}
              className="mt-8 sm:mt-10"
            >
              <Link 
                to="/signup"
                className="inline-flex items-center gap-4 bg-brand-text text-brand-bg px-6 sm:px-8 py-4 sm:py-5 font-black tracking-widest text-[11px] uppercase hover:bg-brand-accent transition-colors duration-300 group shadow-lg rounded-lg"
              >
                Get Started
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Features Card */}
          <div className="md:w-[30%] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: 0.4 }}
              className="bg-brand-surface border border-brand-border-strong p-6 shadow-sm rounded-xl"
            >
              <p className="font-mono text-brand-text-muted text-[10px] uppercase tracking-widest mb-6 border-b border-brand-border-strong pb-4">Features</p>
              <div className="space-y-4">
                {[
                  { label: 'Fast Access', val: 'Active', icon: Terminal },
                  { label: 'Cloud Sync', val: 'Enabled', icon: Database },
                  { label: 'Encryption', val: 'Secure', icon: Server }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
                    <div className="flex items-center gap-3">
                      <stat.icon size={14} className="text-brand-accent" />
                      <span className="text-[11px] font-bold tracking-widest text-brand-text uppercase">{stat.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-brand-text-muted">{stat.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-border mx-5 sm:mx-[10%] py-6 flex justify-between items-center">
        <p className="text-[10px] font-mono text-brand-text-muted uppercase tracking-widest">© 2026 QuotaCheck</p>
        <p className="text-[10px] font-mono text-brand-accent uppercase tracking-widest">v5.0.0</p>
      </footer>
    </div>
  );
};
