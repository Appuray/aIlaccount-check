import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Cpu, 
  ChevronLeft, ChevronRight, Layers, Globe, 
  Database, Server, Fingerprint, 
  BarChart3, RefreshCw, Terminal, Lock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

// --- Component: Magnetic (Refined) ---
const Magnetic: React.FC<{ children: React.ReactElement, strength?: number }> = ({ children, strength = 0.3 }) => {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!magnetic.current) return;
    const xTo = gsap.quickTo(magnetic.current, "x", {duration: 1, ease: "elastic.out(1, 0.3)"});
    const yTo = gsap.quickTo(magnetic.current, "y", {duration: 1, ease: "elastic.out(1, 0.3)"});

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const {height, width, left, top} = magnetic.current!.getBoundingClientRect();
      const x = clientX - (left + width/2);
      const y = clientY - (top + height/2);
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    magnetic.current?.addEventListener("mousemove", handleMouseMove);
    magnetic.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      magnetic.current?.removeEventListener("mousemove", handleMouseMove);
      magnetic.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return React.cloneElement(children as React.ReactElement<any>, { ref: magnetic });
};

// --- Component: Premium Logo ---
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute inset-0 bg-brand-accent/20 rounded-xl rotate-45 scale-75 blur-sm" />
      <svg viewBox="0 0 40 40" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="20" height="20" rx="6" stroke="var(--color-brand-text)" strokeWidth="2.5" />
        <path d="M14 20H26M20 14V26" stroke="var(--color-brand-accent)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill="var(--color-brand-bg)" />
      </svg>
    </div>
    <span className="text-[17px] font-black uppercase tracking-[-0.02em]">Quota<span className="text-brand-accent">Check</span></span>
  </div>
);

// --- Component: ComputeStack (Isometric Architectural Visual - Ultra Premium) ---
const ComputeStack: React.FC = () => {
  const visualRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!visualRef.current) return;
    
    // 1. Floating planes with phase-shifted motion
    gsap.to('.layer-foundation', { y: -15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to('.layer-logic', { y: -25, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.3 });
    gsap.to('.layer-intel', { y: -35, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.6 });
    
    // 2. Intelligence Core Energy
    gsap.to('.core-glow', {
      scale: 1.3,
      opacity: 0.5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // 3. Vertical Data Conduits (Dash Flow)
    gsap.to('.stream-dash', {
      strokeDashoffset: -100,
      duration: 1.2,
      repeat: -1,
      ease: "none"
    });

    // 4. Subtle rotation of the entire stack
    gsap.to(visualRef.current, {
      rotate: 3,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 5. Activity pings on nodes
    gsap.to('.node-ping', {
      opacity: 1,
      scale: 2,
      duration: 1.5,
      stagger: { amount: 4, from: "random", repeat: -1 }
    });

    // 6. Data Rings Rotation
    gsap.to('.data-ring-1', {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });
    gsap.to('.data-ring-2', {
      rotate: -360,
      duration: 15,
      repeat: -1,
      ease: "none"
    });

  }, { scope: visualRef });

  return (
    <div className="relative w-full aspect-square flex items-center justify-center scale-110 lg:scale-125 select-none pointer-events-none">
      {/* Volumetric Lighting Effect */}
      <div className="absolute inset-0 bg-brand-accent/5 blur-[140px] rounded-full scale-100 animate-pulse" />
      
      <svg 
        ref={visualRef}
        viewBox="0 0 600 600" 
        className="relative z-10 w-full h-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
            <feOffset dx="0" dy="20" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer>
            <feMerge> 
              <feMergeNode />
              <feMergeNode in="SourceGraphic" /> 
            </feMerge>
          </filter>
          
          <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-surface)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-brand-bg)" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="intelCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-brand-accent)" />
            <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Global Vertical Connectors */}
        <g className="conduits opacity-[0.2]">
          <path d="M300 80V520" stroke="var(--color-brand-text)" strokeWidth="0.5" />
          <path className="stream-dash" d="M300 80V520" stroke="var(--color-brand-accent)" strokeWidth="2" strokeDasharray="12,24" />
          
          <path d="M200 120V580" stroke="var(--color-brand-text)" strokeWidth="0.5" />
          <path className="stream-dash" d="M200 120V580" stroke="var(--color-brand-accent)" strokeWidth="1.5" strokeDasharray="8,28" />
          
          <path d="M400 120V580" stroke="var(--color-brand-text)" strokeWidth="0.5" />
          <path className="stream-dash" d="M400 120V580" stroke="var(--color-brand-accent)" strokeWidth="1.5" strokeDasharray="8,28" />
        </g>

        {/* --- FOUNDATION LAYER --- */}
        <g className="layer-foundation" filter="url(#premiumShadow)">
          <path d="M60 430L300 280L540 430L300 580L60 430Z" fill="url(#planeGrad)" stroke="var(--color-brand-border)" strokeWidth="0.5" />
          <circle cx="300" cy="430" r="50" stroke="var(--color-brand-accent)" strokeWidth="0.5" strokeDasharray="6,6" />
          <text x="240" y="540" fill="var(--color-brand-text-muted)" className="text-[8px] font-black uppercase tracking-[0.6em] opacity-40">Infra Foundation 01</text>
        </g>

        {/* --- LOGIC LAYER --- */}
        <g className="layer-logic" filter="url(#premiumShadow)">
          <path d="M90 320L300 190L510 320L300 450L90 320Z" fill="url(#planeGrad)" stroke="var(--color-brand-border)" strokeWidth="1" />
          <rect x="275" y="300" width="50" height="50" rx="16" fill="var(--color-brand-surface)" stroke="var(--color-brand-accent)" strokeWidth="1.5" transform="rotate(45 300 325)" />
          <circle className="node-ping opacity-0" cx="210" cy="320" r="3" fill="var(--color-brand-accent)" />
          <circle className="node-ping opacity-0" cx="390" cy="320" r="3" fill="var(--color-brand-accent)" />
          <text x="255" y="405" fill="var(--color-brand-text-muted)" className="text-[8px] font-black uppercase tracking-[0.6em] opacity-40">Neural Logic</text>
        </g>

        {/* --- INTELLIGENCE LAYER --- */}
        <g className="layer-intel" filter="url(#premiumShadow)">
          <path d="M120 210L300 90L480 210L300 330L120 210Z" fill="url(#planeGrad)" stroke="var(--color-brand-accent)" strokeWidth="2.5" strokeOpacity="0.8" />
          
          {/* Outer Rotating Data Rings */}
          <circle className="data-ring-1" cx="300" cy="210" r="110" fill="none" stroke="var(--color-brand-text)" strokeWidth="0.5" strokeDasharray="4,12" opacity="0.3" transform-origin="300 210" />
          <circle className="data-ring-2" cx="300" cy="210" r="95" fill="none" stroke="var(--color-brand-accent)" strokeWidth="1" strokeDasharray="20,10,5,10" opacity="0.5" transform-origin="300 210" />

          {/* Central Intelligence Hub */}
          <circle className="core-glow" cx="300" cy="210" r="70" fill="url(#intelCore)" />
          <g className="hub-geometry">
             <path d="M300 155L340 210L300 265L260 210L300 155Z" fill="var(--color-brand-accent)" />
             <path d="M300 170L325 210L300 250L275 210L300 170Z" fill="var(--color-brand-text)" />
             <rect x="292" y="202" width="16" height="16" rx="4" fill="white" className="animate-pulse" />
          </g>
          
          <text x="260" y="80" fill="var(--color-brand-accent)" className="text-[12px] font-black uppercase tracking-[0.5em]">Consensus v5</text>
        </g>

        {/* Technical Data Tags */}
        <g className="tech-tags opacity-40">
          <text x="480" y="270" fill="var(--color-brand-text)" className="text-[7px] font-black uppercase tracking-[0.3em]">Scalable</text>
          <text x="80" y="270" fill="var(--color-brand-text)" className="text-[7px] font-black uppercase tracking-[0.3em]">Secure</text>
        </g>
      </svg>
    </div>
  );
};

export const Landing: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollDistance = container.clientWidth * 0.8;
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollDistance : scrollDistance);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  useGSAP(() => {
    // 1. Preloader Animation
    const tl = gsap.timeline();

    tl.to('.preloader-bar', {
      scaleX: 1,
      duration: 1.2, ease: "power2.inOut"
    }, 0);

    tl.to(counterRef.current, {
      innerText: 100,
      duration: 1.2,
      snap: { innerText: 1 },
      ease: "power2.inOut"
    }, 0);

    tl.to('.preloader-spin', {
      rotate: 360,
      duration: 1.2,
      ease: "power2.inOut"
    }, 0);

    tl.to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.6, ease: "expo.inOut"
    }, ">+0.1")
    .from('.hero-reveal', {
      opacity: 0,
      y: 60,
      duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.2")
    .from('.hero-visual', {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 1, ease: "back.out(1.2)" }, "-=0.6");

    // 2. Bento Grid Parallax Tilt
    const cards = gsap.utils.toArray('.stagger-reveal');
    cards.forEach((card: any) => {
      gsap.to(card, {
        y: -40,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    // 3. Section Reveal animations
    const reveals = gsap.utils.toArray('.reveal');
    reveals.forEach((el: any) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.4, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // 4. Metric Counters
    gsap.utils.toArray('.metric-val').forEach((el: any) => {
      gsap.from(el, {
        innerText: 0,
        duration: 2.5,
        snap: { innerText: 0.1 },
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        }
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="bg-(--color-brand-bg) text-(--color-brand-text) font-sans selection:bg-(--color-brand-accent) selection:text-(--color-brand-accent-fg)">
      
      {/* PRELOADER */}
      <div ref={preloaderRef} className="fixed inset-0 z-100 bg-brand-text flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[120vw] h-[120vw] border-[1px] border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[80vw] h-[80vw] border-[1px] border-white/30 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="flex flex-col gap-8 w-full max-w-sm text-center relative z-10">
           <Logo className="justify-center text-brand-bg scale-150 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
           <div className="flex items-center justify-center gap-4">
             <div className="preloader-spin w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full" />
             <div className="text-brand-bg text-[12px] font-mono font-bold tracking-widest flex items-center gap-1">
               SYS.BOOT // <span ref={counterRef}>0</span>%
             </div>
           </div>
           <div className="w-full h-1 bg-white/5 relative overflow-hidden rounded-full">
             <div className="preloader-bar absolute top-0 left-0 h-full w-full bg-brand-accent origin-left scale-x-0 shadow-[0_0_10px_var(--color-brand-accent)]" />
           </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 z-50 w-full px-6 lg:px-12 py-7 flex items-center justify-between pointer-events-auto transition-all duration-500 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-border/30">
        <Magnetic strength={0.1}>
          <Link to="/" className="pointer-events-auto">
            <Logo />
          </Link>
        </Magnetic>
        
        <div className="flex items-center gap-10">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-brand-accent transition-colors hidden md:block">Authenticate</Link>
          <Magnetic strength={0.05}>
            <Link to="/signup" className="px-7 py-3 bg-brand-text text-brand-bg rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-accent hover:text-white transition-all duration-500 shadow-xl shadow-black/5">
              Access Cluster
            </Link>
          </Magnetic>
        </div>
      </nav>

      <main className={cn("pt-24")}>
        
        {/* HERO SECTION - Refined Grid */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 max-w-450 mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7 flex flex-col gap-8 lg:gap-10">
              <div className="hero-reveal flex items-center gap-3 px-4 py-2 bg-brand-surface border border-brand-border rounded-full w-max shadow-sm">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-text-muted">v5.0 Infrastructure Live</span>
              </div>
              
              <h1 className="hero-reveal text-[clamp(2rem,6vw,5.5rem)] font-display font-black leading-[0.9] tracking-tighter uppercase">
                Orchestrate <br/>
                <span className="text-brand-text-muted">Your Neural</span> <br/>
                Cluster.
              </h1>
              
              <div className="hero-reveal flex flex-col gap-10 mt-2 max-w-2xl">
                <p className="text-lg md:text-2xl font-medium text-brand-text-soft leading-relaxed tracking-tight">
                  High-performance quota management for scaling AI applications. Route prompts across GPT, Claude, and Gemini with zero latency.
                </p>
                
                <Magnetic strength={0.2}>
                  <Link to="/signup" className="group flex items-center gap-5 text-[15px] font-black uppercase tracking-[0.4em] border-b-2 border-brand-text pb-2 w-max hover:text-brand-accent hover:border-brand-accent transition-all duration-500">
                    Initialize <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Premium Animated SVG Visual */}
            <div className="lg:col-span-5 hidden lg:block hero-visual pr-8">
               <ComputeStack />
            </div>
          </div>
          
          {/* Scroll Visual */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
             <div className="w-px h-12 bg-current animate-pulse" />
          </div>
        </section>

        {/* REVEAL SECTION */}
        <section className="px-6 lg:px-24 py-24 lg:py-40 bg-(--color-brand-surface) border-y border-(--color-brand-border)">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="reveal text-xl md:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-(--color-brand-text) uppercase">
              The era of single-provider dependency is over. QuotaCheck detects exhaustion in milliseconds, hot-swapping your API keys to ensure <span className="text-(--color-brand-accent)">zero-downtime intelligence.</span>
            </h2>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="px-6 lg:px-12 py-24 lg:py-40 max-w-450 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 lg:mb-16">
            <h2 className="reveal text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              System <br/><span className="text-(--color-brand-text-muted)">Core.</span>
            </h2>
            <p className="reveal text-[10px] font-bold uppercase tracking-widest text-(--color-brand-text-muted) max-w-50 text-right">
              Precision engineered for sub-ms latency and absolute reliability.
            </p>
          </div>

          <div className="stagger-container grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 auto-rows-[280px] md:auto-rows-[320px]">
            {/* Feature 1 */}
            <div className="stagger-reveal md:col-span-12 lg:col-span-7 bg-brand-text text-brand-bg rounded-3xl p-8 lg:p-12 flex flex-col justify-between overflow-hidden relative group border border-white/5">
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                   <Cpu size={28} />
                 </div>
                 <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Intelligent <br/>Node Routing</h3>
                 <p className="text-brand-bg/80 text-base max-w-sm font-medium">Auto-detecting service tiers and priority weighting to ensure your prompts always get the best available intelligence.</p>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 scale-150">
                 <Fingerprint size={240} />
               </div>
            </div>

            {/* Feature 2 */}
            <div className="stagger-reveal md:col-span-6 lg:col-span-5 bg-brand-surface-elevated border border-(--color-brand-border) rounded-3xl p-8 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-(--color-brand-bg) flex items-center justify-center border border-(--color-brand-border)">
                    <BarChart3 size={20} />
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full border border-(--color-brand-border) text-[8px] font-black uppercase tracking-widest">Real-time</div>
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Live Metrics</h3>
                  <p className="text-(--color-brand-text-soft) text-[13px] font-medium leading-relaxed">Visualize token burn, provider uptime, and cost optimization in a single architectural dashboard.</p>
               </div>
            </div>

            {/* Feature 3 */}
            <div className="stagger-reveal md:col-span-6 lg:col-span-4 bg-(--color-brand-bg) border border-(--color-brand-border) rounded-3xl p-8 flex flex-col justify-between group">
               <div className="w-10 h-10 rounded-lg bg-(--color-brand-surface) flex items-center justify-center mb-4">
                 <Lock size={18} />
               </div>
               <h3 className="text-lg font-black uppercase tracking-tighter mb-1.5">Zero-Trust</h3>
               <p className="text-[11px] text-(--color-brand-text-muted) font-medium leading-relaxed">Your API keys never leave your browser context. Local-first encryption as standard.</p>
            </div>

            {/* Feature 4 */}
            <div className="stagger-reveal md:col-span-12 lg:col-span-8 bg-(--color-brand-accent) text-white rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-10 group">
               <div className="flex-1 text-center md:text-left">
                 <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-none">Stack Agnostic.</h3>
                 <p className="opacity-80 text-sm font-medium">Seamless integration with OpenAI, Anthropic, Google Vertex, and local Llama nodes. One interface, infinite power.</p>
               </div>
               <div className="grid grid-cols-3 gap-3">
                 {[Globe, Database, Server].map((Icon, i) => (
                   <div key={i} className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Icon size={20} />
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* SHOWCASE CAROUSEL */}
        <section className="py-24 lg:py-40 overflow-hidden">
          <div className="px-6 lg:px-12 mb-10 flex justify-between items-end">
            <h2 className="reveal text-3xl md:text-5xl font-black uppercase tracking-tighter">Node <br/><span className="text-(--color-brand-text-muted)">Infrastructure.</span></h2>
            <div className="flex gap-3">
               <button 
                 onClick={() => scrollCarousel('left')}
                 className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-text hover:text-brand-bg transition-colors cursor-pointer group"
               >
                 <ChevronLeft size={18} />
               </button>
               <button 
                 onClick={() => scrollCarousel('right')}
                 className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-text hover:text-brand-bg transition-colors cursor-pointer group"
               >
                 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scroll-hide snap-x snap-mandatory px-6 lg:px-12 gap-5 lg:gap-6 pb-10 scroll-smooth"
          >
            {[
              { t: 'Neural Routing', d: 'Proprietary consensus algorithm for sub-ms provider switching.', i: Zap },
              { t: 'Token Optimization', d: 'Context-aware prompt caching to reduce token overhead by up to 40%.', i: Layers },
              { t: 'Failover Redundancy', d: 'Multi-region failover with automatic health re-validation.', i: RefreshCw },
              { t: 'Priority Scheduling', d: 'Assign compute weights for guaranteed latency on critical tasks.', i: Terminal },
            ].map((card, i) => (
              <div key={i} className="shrink-0 w-[80vw] md:w-112.5 snap-center p-8 lg:p-12 bg-(--color-brand-surface) border border-(--color-brand-border) rounded-[2.5rem] flex flex-col justify-between aspect-4/5 md:h-112.5 hover:border-(--color-brand-text-muted) transition-colors">
                <div className="w-12 h-12 rounded-xl bg-(--color-brand-bg) border border-(--color-brand-border) flex items-center justify-center mb-8">
                  <card.i size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">{card.t}</h3>
                  <p className="text-(--color-brand-text-soft) text-base font-medium leading-relaxed">{card.d}</p>
                </div>
                <div className="flex items-center gap-2.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40">System Operational</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* METRICS SECTION */}
        <section className="py-24 lg:py-40 bg-(--color-brand-text) text-(--color-brand-bg) px-6 lg:px-12">
          <div className="max-w-450 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="reveal flex flex-col items-center text-center pt-8 md:pt-0">
               <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-3"><span className="metric-val">99.9</span>%</div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Uptime Protocol</p>
            </div>
            <div className="reveal flex flex-col items-center text-center pt-16 md:pt-0">
               <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-3"><span className="metric-val">40</span>%</div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Cost Reduction</p>
            </div>
            <div className="reveal flex flex-col items-center text-center pt-16 md:pt-0">
               <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-3"><span className="metric-val">12</span>ms</div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Routing Latency</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative px-6 lg:px-12 py-24 lg:py-48 flex flex-col items-center justify-center text-center overflow-hidden min-h-[60vh]">
          <div className="max-w-3xl flex flex-col items-center gap-8 lg:gap-10 relative z-10">
             <h2 className="reveal text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
               Final <br/><span className="text-(--color-brand-text-muted)">Consensus.</span>
             </h2>
             <p className="reveal text-base md:text-xl font-medium text-(--color-brand-text-soft) max-w-lg leading-snug">
               Ready to transcend rate limits? Join 10k+ developers orchestrating their neural infrastructure with QuotaCheck.
             </p>
             <Link to="/signup" className="reveal group px-8 lg:px-12 py-5 lg:py-8 bg-(--color-brand-accent) text-white rounded-full flex items-center gap-6 text-lg lg:text-xl font-black uppercase tracking-widest hover:scale-105 transition-transform duration-500 shadow-2xl">
                <span>Access Neural Link</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-700" />
             </Link>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen z-0 opacity-[0.02] pointer-events-none">
             <div className="absolute inset-0 border border-current rounded-full" />
             <div className="absolute inset-[15vw] border border-current rounded-full" />
             <div className="absolute inset-[30vw] border border-current rounded-full" />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 lg:px-12 py-12 bg-(--color-brand-bg) border-t border-(--color-brand-border)">
          <div className="max-w-450 mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-(--color-brand-text) flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-brand-surface rounded-sm rotate-45" />
                </div>
                <span className="text-lg font-bold tracking-tight uppercase">QuotaCheck</span>
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-(--color-brand-text-muted)">Neural Infrastructure Protocol v5.0</p>
            </div>
            
            <div className="flex flex-wrap gap-10 lg:gap-20">
              <div className="flex flex-col gap-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-(--color-brand-text-muted)">Platform</p>
                <div className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-tight">
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Neural Link</span>
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Consensus API</span>
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Node Telemetry</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-(--color-brand-text-muted)">Legal</p>
                <div className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-tight">
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Terms</span>
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">Compliance</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-(--color-brand-text-muted)">Social</p>
                <div className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-tight">
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">X.com</span>
                  <span className="hover:text-(--color-brand-accent) cursor-pointer transition-colors">GitHub</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-(--color-brand-border) flex flex-col md:flex-row justify-between items-center gap-4 opacity-20">
            <p className="text-[7px] font-bold uppercase tracking-[0.5em]">Engineered for Absolute Clarity</p>
            <p className="text-[7px] font-bold uppercase tracking-[0.5em]">© 2026 QuotaCheck Neural Systems</p>
          </div>
        </footer>

      </main>
    </div>
  );
};
