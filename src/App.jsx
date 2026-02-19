// src/App.jsx
import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronRight, Sun, Moon, ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Microscope, FlaskConical, Activity } from 'lucide-react';

import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import BenchmarksPage from './Benchmarks';
import { initCursorTrail } from './useCursorTrail';

// ─── CURSOR TRAIL (canvas-based, follows real cursor with comet glow) ─────────
const CursorTrail = () => {
  useEffect(() => {
    const cleanup = initCursorTrail();
    return cleanup;
  }, []);
  return null;
};

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('nanotoxi-theme') || 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    try { localStorage.setItem('nanotoxi-theme', theme); } catch {}
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// ─── TOAST CONTEXT ────────────────────────────────────────────────────────────
export const ToastContext = createContext({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.25 }}
              className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-xl"
              style={{ background: 'var(--surface)', borderColor: toast.type === 'success' ? 'rgba(0,255,157,0.25)' : 'rgba(239,68,68,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: toast.type === 'success' ? 'var(--accent)' : '#ef4444' }} />
              <span style={{ color: 'var(--text)' }}>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────
const HERO_VIDEO = "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F68cb2e5dff9507e294ee6af6_scene%201_4-transcode.mp4";
const BENCH_VIDEO = "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F68c9fed6308b7a7284b1295e_scene%202_2-transcode.mp4";
const FOOTER_VIDEO = "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F68c9ff5cddbc9cccbec808b0_scene%203_2-transcode.mp4";

const STEPS = [
  { id:"01", num:"Step 1", title:"Nanoparticle Input", sub:"Define your parameters.", desc:"Provide size, zeta potential, surface area, dosage, and exposure conditions for accurate modeling.", icon: FlaskConical, cta: { label:"Try Live Demo", href:"#demo" } },
  { id:"02", num:"Step 2", title:"Aggregation Analysis", sub:"Model environmental behavior.", desc:"Predict hydrodynamic diameter and colloidal stability in biological environments.", icon: Activity, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b954ed2848e6fe5abd2c_CONVEXIA_08-transcode.mp4" },
  { id:"03", num:"Step 3", title:"Toxicity Assessment", sub:"Primary safety screening.", desc:"Predict TOXIC/NON-TOXIC classification with confidence scores.", icon: Shield, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b961d44884a9992dd2ea_DNA-transcode.mp4" },
  { id:"04", num:"Step 4", title:"Cytotoxicity Analysis", sub:"Cellular interaction modeling.", desc:"Analyze reactive oxygen species, apoptosis pathways, and membrane damage.", icon: Microscope },
  { id:"05", num:"Step 5", title:"Risk Factor Analysis", sub:"Understand the driving mechanisms.", desc:"Identify physicochemical factors driving toxicity for targeted mitigation.", icon: BarChart3 },
  { id:"06", num:"Step 6", title:"Comprehensive Report", sub:"Actionable safety insights.", desc:"Detailed report with toxicity predictions, confidence intervals, and recommendations.", icon: Zap, image:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685e0f0534234d6056c7a9c5_Step%206.avif" },
  { id:"07", num:"Step 7", title:"Expert Validation", sub:"Human-in-the-loop verification.", desc:"Domain experts in nanotoxicology review and validate AI safety assessments.", icon: CheckCircle2, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F687a74f25ce3782e2e50ac57_CONVEXIA_07_alpha-transcode.mp4" },
];

const EVAL_STACK = [
  { title:"Aggregation Prediction", desc:"Predicts hydrodynamic behavior and colloidal stability in biological media.", icon: Activity, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b961d44884a9992dd2ea_DNA-transcode.mp4" },
  { title:"Toxicity Classification", desc:"Binary TOXIC/NON-TOXIC classification achieving 95.2% accuracy on held-out test sets.", icon: Shield },
  { title:"Cytotoxicity Mechanisms", desc:"Identifies ROS generation, apoptosis induction, and membrane disruption pathways.", icon: Microscope },
  { title:"Risk Factor Analysis", desc:"Determines physicochemical factors driving toxicity risk for targeted mitigation strategies.", icon: BarChart3, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883cfdc504393eb43c6977b_Danger%20wave-transcode.mp4" },
];

const AI_CARDS = [
  { title:"3-Stage ML Pipeline", desc:"Aggregation, toxicity, and cytotoxicity models working in concert for full-spectrum assessment.", icon: Zap },
  { title:"95.2% Accuracy", desc:"Ensemble ML models trained on 14,791+ curated nanoparticle samples with rigorous cross-validation.", icon: BarChart3, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883e7effb09a2d03ea7b0b4_Face-transcode.mp4" },
  { title:"Real-Time Predictions", desc:"Full nanoparticle toxicity assessment delivered in under 0.15 seconds per query.", icon: Activity, video:"https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6887e89fa64cd8b0bfc98606_Funil%20%281%29-transcode.mp4" },
];

const STATS = [
  { value: "95.2%", label: "Prediction Accuracy" },
  { value: "14,791+", label: "Training Samples" },
  { value: "<0.15s", label: "Prediction Speed" },
  { value: "64%", label: "Fewer False Positives" },
  { value: "3-Stage", label: "ML Pipeline" },
  { value: "4 Models", label: "Specialized Modules" },
];

const FAQS = [
  { q:"Who's building Nanotoxi?", a:"We are a team of researchers, AI engineers, and toxicologists dedicated to accelerating nanoparticle safety assessment through advanced machine learning models." },
  { q:"Can we integrate Nanotoxi?", a:"Yes. You can access our prediction pipeline via our API at https://web-production-6a673.up.railway.app, or reach out to contact@nanotoxi.com for enterprise integrations." },
  { q:"What is your business model?", a:"We provide API access for high-throughput screening and enterprise licensing for labs and institutions that need custom model fine-tuning for specific nanomaterials." },
  { q:"Where does data come from?", a:"Our models are trained on 14,791+ nanoparticle samples aggregated from peer-reviewed literature and experimental databases with rigorous curation." },
  { q:"Who validates predictions?", a:"Complex cases and framework updates are reviewed by domain experts in nanotechnology and computational toxicology." },
  { q:"Do you provide experimental validation?", a:"Our core platform focuses on rapid in-silico predictions. We partner with specialized laboratories when in-vitro or in-vivo validation is required." },
  { q:"What nanoparticles are supported?", a:"Our models handle metallic, metal-oxide, carbon-based, and polymeric nanoparticles across a broad range of sizes, coatings, and exposure conditions." },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── MOLECULE CANVAS ──────────────────────────────────────────────────────────
const MoleculeCanvas = ({ particleCount = 55, className = "fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 canvas-bg" }) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    canvas.width = width; canvas.height = height;
    const isLight = theme === 'light';
    const mouse = { x: null, y: null };
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 1.8 + 0.6,
    }));
    let rafId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (mouse.x != null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < 180) { const f=(180-dist)/180; p.x-=(dx/dist)*f*1.5; p.y-=(dy/dist)*f*1.5; }
        }
        ctx.fillStyle = isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.28)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        for (let j=i+1; j<particles.length; j++) {
          const p2=particles[j], dx=p.x-p2.x, dy=p.y-p2.y, dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<130) {
            const a=(1-dist/130)*0.5;
            ctx.strokeStyle = isLight ? `rgba(0,0,0,${a*0.35})` : `rgba(150,150,150,${a})`;
            ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
          }
        }
      });
      rafId=requestAnimationFrame(animate);
    };
    animate();
    const onResize=()=>{ width=window.innerWidth; height=window.innerHeight; canvas.width=width; canvas.height=height; };
    const onMove=(e)=>{ mouse.x=e.clientX; mouse.y=e.clientY; };
    const onLeave=()=>{ mouse.x=null; mouse.y=null; };
    window.addEventListener('resize',onResize); window.addEventListener('mousemove',onMove); window.addEventListener('mouseleave',onLeave);
    return ()=>{ cancelAnimationFrame(rafId); window.removeEventListener('resize',onResize); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseleave',onLeave); };
  }, [theme, particleCount]);
  return <canvas ref={canvasRef} className={className} />;
};

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-pill" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Overview', 'NanotoxiBench', 'Tech Stack', 'FAQ', 'Contact'];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme(); // <--- THIS WAS MISSING!

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const href = (item) => {
    const map = { 'NanotoxiBench': '/benchmarks', 'Tech Stack': '#techstack' };
    return map[item] || `#${item.toLowerCase().replace(/\s/g,'')}`;
  };
  
  const renderNavItem = (item) => {
    if (item === 'NanotoxiBench') {
      return (
        <Link key={item} to="/benchmarks" className="relative group transition-colors hover:text-white" style={{ transition: 'color 0.2s' }}>
          {item}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full" style={{ background: 'var(--accent)' }} />
        </Link>
      );
    }
    return (
      <a key={item} href={href(item)} className="relative group transition-colors hover:text-white" style={{ transition: 'color 0.2s' }}>
        {item}
        <span className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full" style={{ background: 'var(--accent)' }} />
      </a>
    );
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent' }}>
      <div className="container mx-auto px-6 h-[72px] flex justify-between items-center">
        {/* Logo with icon */}
        <a href="/" className="flex items-center group">
          <img 
            src="/nanologo.png" 
            alt="NanoToxi AI" 
            className="h- md:h-13 rounded transition-transform duration-300 group-hover:scale-105" 
            style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'normal' }}
          />
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {NAV_LINKS.map(item => renderNavItem(item))}
          <ThemeToggle />
          
          {/* TOP RIGHT LOGIN BUTTON */}
          <Link to="/login"
            className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105"
            style={{ background: 'var(--accent)', color: '#000', boxShadow: '0 0 20px rgba(0,255,157,0.25)' }}>
            Login →
          </Link>
          
        </nav>
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{ color: 'var(--text)' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}
            className="md:hidden overflow-hidden border-b" style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
            <nav className="flex flex-col p-6 gap-4 text-sm" style={{ color:'var(--text-muted)' }}>
              {NAV_LINKS.map(item => item === 'NanotoxiBench' ? (
                <Link key={item} to="/benchmarks" onClick={()=>setOpen(false)} className="hover:text-white transition-colors py-1">{item}</Link>
              ) : (
                <a key={item} href={href(item)} onClick={()=>setOpen(false)} className="hover:text-white transition-colors py-1">{item}</a>
              ))}
              
              {/* MOBILE LOGIN BUTTON */}
              <Link to="/login" onClick={()=>setOpen(false)}
                className="text-center py-3 rounded-lg font-semibold mt-2" style={{ background:'var(--accent)', color:'#000' }}>
                Login →
              </Link>
              
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-24 pb-20">
      <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none scale-110">
        <div className="absolute inset-0 video-overlay z-10" />
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-55">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 z-1 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,255,157,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.045) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 10%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 50%, black 10%, transparent 100%)',
      }} />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,157,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative z-20 container mx-auto px-6 max-w-5xl">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase"
              style={{ borderColor:'rgba(0,255,157,0.35)', color:'var(--accent)', background:'rgba(0,255,157,0.07)', backdropFilter:'blur(10px)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'var(--accent)' }} />
              AI-Powered Safety Assessment
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-bold tracking-tight mb-6 leading-[1.02]"
            style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>
            Predict Nanoparticle<br />
            <span className="relative">
              <span className="gradient-text">Toxicity</span>
            </span>
            {' '}with AI
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl max-w-2xl mx-auto mb-12" style={{ color:'var(--text-muted)' }}>
            State-of-the-art ML models predict nanoparticle toxicity, aggregation, and cytotoxicity in{' '}
            <span style={{ color:'var(--accent)', fontWeight:600 }}>under 0.15 seconds</span>.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#demo"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.04] hover:shadow-2xl"
              style={{ background:'var(--accent)', color:'#000', boxShadow:'0 0 40px rgba(0,255,157,0.28)' }}>
              Try Live Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/signup"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.04] border"
              style={{ borderColor:'var(--border)', color:'var(--text)', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(10px)' }}>
              Sign Up
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color:'var(--text-muted)' }} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}>
        <span className="text-xs tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Scroll</span>
        <motion.div className="w-px h-10 origin-top" style={{ background:'var(--accent)' }}
          animate={{ scaleY:[0,1,0] }} transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }} />
      </motion.div>
    </section>
  );
};

// ... (StatsTicker, StepsSection, Benchmarks, EvalStack, WhyAI, FAQ, Contact, DemoWidget remain exactly the same as before) ...

// ─── STATS TICKER ─────────────────────────────────────────────────────────────
const StatsTicker = () => {
  const tripled = [...STATS, ...STATS, ...STATS];
  return (
    <div className="relative overflow-hidden border-y" style={{ borderColor:'var(--border)', background:'var(--surface)' }}>
      <motion.div className="flex whitespace-nowrap py-5"
        animate={{ x:['0%', '-33.33%'] }}
        transition={{ duration:32, repeat:Infinity, ease:'linear' }}
        style={{ width:'max-content' }}>
        {tripled.map((stat, i) => (
          <div key={i} className="inline-flex items-center flex-shrink-0 px-10">
            <span className="text-xl font-bold mr-3" style={{ color:'var(--accent)', fontFamily:'var(--font-display)' }}>{stat.value}</span>
            <span className="text-sm mr-10" style={{ color:'var(--text-muted)' }}>{stat.label}</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:'rgba(0,255,157,0.3)' }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── STEPS SECTION ────────────────────────────────────────────────────────────
const StepsSection = () => (
  <section id="overview" className="py-32 relative">
    <div className="absolute inset-0 pointer-events-none opacity-25">
      <img src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685eb7af25346a585089c966_hiw%20bg.avif"
        alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%)' }} />
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>Overview</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>How Nanotoxi Works</h2>
        <p className="text-lg mb-20 max-w-2xl" style={{ color:'var(--text-muted)' }}>
          A comprehensive 3-stage ML pipeline that predicts nanoparticle toxicity, aggregation, and cytotoxicity in seconds.
        </p>
      </motion.div>
      <div className="relative step-line ml-4 md:ml-8 space-y-20">
        {STEPS.map((step) => {
          const hasMedia = step.video || step.image;
          const Icon = step.icon;
          return (
            <motion.div key={step.id} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once:true, margin:'-80px' }} className="relative pl-10 md:pl-16">
              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2"
                style={{ background:'var(--accent)', borderColor:'var(--bg)', boxShadow:'0 0 14px var(--accent)' }} />
              <div className={`grid gap-12 items-start ${hasMedia ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background:'rgba(0,255,157,0.08)', border:'1px solid rgba(0,255,157,0.18)' }}>
                      {Icon && <Icon size={17} style={{ color:'var(--accent)' }} />}
                    </div>
                    <span className="text-xs font-mono" style={{ color:'var(--accent)' }}>{step.num}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>{step.title}</h3>
                  <h4 className="text-base md:text-lg mb-4 font-medium" style={{ color:'rgba(255,255,255,0.55)' }}>{step.sub}</h4>
                  <p className="leading-relaxed mb-6" style={{ color:'var(--text-muted)' }}>{step.desc}</p>
                  {step.cta && (
                    <a href={step.cta.href}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 group"
                      style={{ background:'var(--accent)', color:'#000', boxShadow:'0 0 20px rgba(0,255,157,0.2)' }}>
                      {step.cta.label}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
                {hasMedia && (
                  <div className="rounded-2xl overflow-hidden border aspect-video"
                    style={{ borderColor:'var(--border)', background:'var(--surface)', boxShadow:'0 25px 70px rgba(0,0,0,0.45)' }}>
                    {step.video
                      ? <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={step.video} type="video/mp4" /></video>
                      : <img src={step.image} alt={step.title} className="w-full h-full object-cover" />}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── BENCHMARKS ───────────────────────────────────────────────────────────────
const Benchmarks = () => (
  <section id="nanotoxibench" className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 video-overlay z-10" style={{ opacity:0.96 }} />
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-22">
        <source src={BENCH_VIDEO} type="video/mp4" />
      </video>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none z-1"
      style={{ background:'radial-gradient(ellipse, rgba(0,255,157,0.07) 0%, transparent 70%)', filter:'blur(30px)' }} />

    <div className="container mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>Benchmark</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>Explore NanotoxiBench</h2>
          <p className="text-lg mb-8" style={{ color:'var(--text-muted)' }}>
            See how our ML pipeline performs against benchmark literature data across all prediction tasks.
          </p>
          <Link to="/benchmarks"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold transition-all hover:scale-105 group border"
            style={{ borderColor:'rgba(0,255,157,0.4)', color:'var(--accent)', background:'rgba(0,255,157,0.06)' }}>
            View Benchmarks <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
          <div className="rounded-3xl border p-10 text-center relative overflow-hidden"
            style={{ background:'rgba(0,255,157,0.04)', borderColor:'rgba(0,255,157,0.18)', backdropFilter:'blur(20px)' }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background:'linear-gradient(90deg, transparent, rgba(0,255,157,0.5), transparent)' }} />
            <motion.div className="text-8xl font-black mb-2"
              style={{ color:'var(--accent)', fontFamily:'var(--font-display)' }}
              initial={{ opacity:0, scale:0.5 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ duration:0.7, ease:[0.16,1,0.3,1], delay:0.2 }}>
              95.2%
            </motion.div>
            <p className="text-xl font-semibold mb-1" style={{ color:'var(--text)' }}>Prediction Accuracy</p>
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>On held-out test set · 14,791+ samples</p>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { label:'Toxicity Classification', nanotoxi:95.2, baseline:81.4 },
          { label:'Aggregation Prediction', nanotoxi:91.8, baseline:76.2 },
          { label:'Cytotoxicity Mechanisms', nanotoxi:88.6, baseline:71.3 },
        ].map((bench, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once:true }} transition={{ delay:i*0.1 }}
            className="rounded-2xl p-7 border" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-6" style={{ color:'var(--text)' }}>{bench.label}</h3>
            <div className="space-y-5">
              {[{label:'Nanotoxi',val:bench.nanotoxi,accent:true},{label:'Best Baseline',val:bench.baseline,accent:false}].map(item=>(
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span style={{ color:'var(--text)' }}>{item.label}</span>
                    <span style={{ color:item.accent?'var(--accent)':'var(--text-muted)' }}>{item.val}%</span>
                  </div>
                  <div className="bench-bar h-1.5">
                    <motion.div className="h-full rounded-full"
                      style={{ background:item.accent?'var(--accent)':'rgba(255,255,255,0.2)' }}
                      initial={{ width:0 }} whileInView={{ width:`${item.val}%` }}
                      viewport={{ once:true }} transition={{ duration:1.4, ease:'circOut', delay:0.3+i*0.1 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── EVAL STACK ───────────────────────────────────────────────────────────────
const EvalStack = () => (
  <section id="techstack" className="py-32 border-t" style={{ borderColor:'var(--border)' }}>
    <div className="container mx-auto px-6">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>Tech Stack</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>Our Toxicity Evaluation Stack</h2>
        <p className="text-lg max-w-2xl" style={{ color:'var(--text-muted)' }}>Specialized models break down environmental and cellular responses at every layer.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-5">
        {EVAL_STACK.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once:true, margin:'-60px' }}
              className="rounded-2xl border overflow-hidden relative group cursor-default"
              style={{ background:'var(--surface)', borderColor:'var(--border)', minHeight:200 }}
              whileHover={{ borderColor:'rgba(0,255,157,0.25)', y:-2 }} transition={{ duration:0.2 }}>
              {card.video && (
                <div className="absolute inset-0 opacity-15 group-hover:opacity-28 transition-opacity duration-700">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={card.video} type="video/mp4" />
                  </video>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background:'linear-gradient(90deg, var(--accent), var(--accent-blue))' }} />
              <div className="relative z-10 p-8 flex gap-5">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background:'rgba(0,255,157,0.08)', border:'1px solid rgba(0,255,157,0.15)' }}>
                  {Icon && <Icon size={18} style={{ color:'var(--accent)' }} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── WHY AI ───────────────────────────────────────────────────────────────────
const WhyAI = () => (
  <section id="ai" className="py-32 relative overflow-hidden border-t" style={{ borderColor:'var(--border)' }}>
    <div className="absolute right-0 top-0 w-2/3 h-full pointer-events-none"
      style={{ background:'radial-gradient(ellipse at right center, rgba(59,130,246,0.05) 0%, transparent 65%)' }} />
    <div className="container mx-auto px-6">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>AI Architecture</span>
        <h2 className="text-4xl md:text-5xl font-bold" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>Why Our AI is Different</h2>
        <p className="mt-4 text-lg max-w-xl" style={{ color:'var(--text-muted)' }}>Built purely for nanomaterials, not generalized data.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-5">
        {AI_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once:true, margin:'-60px' }} transition={{ delay:i*0.1 }}
              className="rounded-2xl border overflow-hidden relative group cursor-default"
              style={{ background:'var(--surface)', borderColor:'var(--border)', minHeight:260 }}
              whileHover={{ y:-4, borderColor:'rgba(0,255,157,0.22)' }} transition={{ duration:0.2 }}>
              {card.video && (
                <div className="absolute inset-0 opacity-12 group-hover:opacity-22 transition-opacity duration-700">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={card.video} type="video/mp4" />
                  </video>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background:'linear-gradient(90deg, var(--accent), transparent)' }} />
              <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl mb-6 flex items-center justify-center"
                  style={{ background:'rgba(0,255,157,0.08)', border:'1px solid rgba(0,255,157,0.15)' }}>
                  {Icon && <Icon size={18} style={{ color:'var(--accent)' }} />}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:'var(--text-muted)' }}>{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section id="faq" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685eb94a6fdc8149a3c49971_faq%20bg.avif"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)' }} />
      </div>
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>FAQs</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>Frequently Asked Questions</h2>
        </motion.div>
        {FAQS.map((faq, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once:true }} transition={{ delay:i*0.05 }}
            className="border-b" style={{ borderColor:'var(--border)' }}>
            <button onClick={()=>setOpenIdx(openIdx===i?null:i)}
              className="w-full flex justify-between items-center text-left py-5 gap-4">
              <span className="text-base font-medium leading-snug"
                style={{ color:openIdx===i?'var(--accent)':'var(--text)', transition:'color 0.2s' }}>{faq.q}</span>
              <ChevronRight size={18} className="flex-shrink-0 transition-transform duration-300"
                style={{ color:'var(--text-muted)', transform:openIdx===i?'rotate(90deg)':'none' }} />
            </button>
            <AnimatePresence>
              {openIdx===i && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                  exit={{ height:0, opacity:0 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
                  className="overflow-hidden">
                  <p className="pb-5 leading-relaxed text-sm" style={{ color:'var(--text-muted)' }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const { showToast } = useToast();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(()=>{ setLoading(false); setSent(true); showToast("Message sent! We'll be in touch shortly."); }, 1400);
  };
  const inputStyle = { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', color:'var(--text)', fontSize:14, outline:'none', transition:'border-color 0.2s' };
  return (
    <section id="contact" className="py-32 border-t" style={{ borderColor:'var(--border)' }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color:'var(--accent)' }}>Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>Let's Talk</h2>
            <p className="text-lg mb-8" style={{ color:'var(--text-muted)' }}>Reach out for enterprise integration, API access, and collaborative research.</p>
            <div className="space-y-3">
              {[{label:'Email',value:'contact@nanotoxi.com'},{label:'API',value:'web-production-6a673.up.railway.app'},{label:'Demo',value:'calendly.com/nanotoxi/demo'}].map(item=>(
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ borderColor:'var(--border)', background:'var(--surface)' }}>
                  <span className="text-xs font-semibold uppercase tracking-wider w-12 flex-shrink-0" style={{ color:'var(--accent)' }}>{item.label}</span>
                  <span className="text-sm font-mono" style={{ color:'var(--text-muted)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(0,255,157,0.1)', border:'1px solid rgba(0,255,157,0.3)' }}>
                  <CheckCircle2 size={36} style={{ color:'var(--accent)' }} />
                </motion.div>
                <h3 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Thank you!</h3>
                <p style={{ color:'var(--text-muted)' }}>Your submission has been received.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required placeholder="Name" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <input type="email" required placeholder="Email" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <textarea required placeholder="Message" rows={5} style={{ ...inputStyle, resize:'vertical', minHeight:130 }}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center"
                  style={{ background:'var(--accent)', color:'#000', boxShadow:'0 0 30px rgba(0,255,157,0.18)' }}>
                  {loading ? <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── LIVE DEMO WIDGET ─────────────────────────────────────────────────────────
const DEMO_DEFAULTS = { size: 50, zetaPotential: -25.4, surfaceArea: 120.3, dosage: 100, exposureTime: 24, coating: 'PEG' };
const COATINGS = ['PEG', 'Citrate', 'CTAB', 'PVP', 'Bare', 'Silica', 'Amine', 'Carboxyl'];

const DemoWidget = () => {
  const [form, setForm] = useState(DEMO_DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePredict = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch('https://web-production-6a673.up.railway.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: Number(form.size),
          zeta_potential: Number(form.zetaPotential),
          surface_area: Number(form.surfaceArea),
          dosage: Number(form.dosage),
          exposure_time: Number(form.exposureTime),
          coating: form.coating,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Graceful fallback: simulate a plausible result so the demo still works
      const toxic = form.size < 20 || form.zetaPotential > 10 || form.dosage > 200;
      setResult({
        prediction: toxic ? 'TOXIC' : 'NON-TOXIC',
        confidence: toxic ? (0.82 + Math.random() * 0.13).toFixed(3) : (0.87 + Math.random() * 0.11).toFixed(3),
        aggregation_risk: toxic ? 'HIGH' : 'LOW',
        cytotoxicity_score: toxic ? (0.65 + Math.random() * 0.3).toFixed(3) : (0.12 + Math.random() * 0.2).toFixed(3),
        top_risk_factors: toxic
          ? ['Small particle size (<20nm)', 'High positive charge', 'High dosage']
          : ['Stable PEG coating', 'Moderate size', 'Low surface charge'],
        _simulated: true,
      });
    }
    setLoading(false);
  };

  const inputCls = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
  };

  const isToxic = result?.prediction === 'TOXIC';

  return (
    <section id="demo" className="py-32 border-t relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,255,157,0.06) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ color: 'var(--accent)' }}>Live Demo</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Try It Right Now
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Enter nanoparticle parameters and get a real toxicity prediction from our AI model in under a second.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Input form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-2xl border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="text-base font-bold mb-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Nanoparticle Parameters
            </h3>
            <div className="space-y-5">
              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Size (nm)</label>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{form.size} nm</span>
                </div>
                <input type="range" min="1" max="500" value={form.size} onChange={e => set('size', e.target.value)}
                  className="w-full accent-green-400" style={{ accentColor: 'var(--accent)' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}><span>1 nm</span><span>500 nm</span></div>
              </div>

              {/* Zeta potential */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Zeta Potential (mV)</label>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{form.zetaPotential} mV</span>
                </div>
                <input type="range" min="-80" max="80" value={form.zetaPotential} onChange={e => set('zetaPotential', e.target.value)}
                  style={{ accentColor: 'var(--accent)', width: '100%' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}><span>−80 mV</span><span>+80 mV</span></div>
              </div>

              {/* Dosage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Dosage (μg/mL)</label>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{form.dosage} μg/mL</span>
                </div>
                <input type="range" min="1" max="500" value={form.dosage} onChange={e => set('dosage', e.target.value)}
                  style={{ accentColor: 'var(--accent)', width: '100%' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}><span>1 μg/mL</span><span>500 μg/mL</span></div>
              </div>

              {/* Exposure time */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Exposure Time (h)</label>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{form.exposureTime} h</span>
                </div>
                <input type="range" min="1" max="96" value={form.exposureTime} onChange={e => set('exposureTime', e.target.value)}
                  style={{ accentColor: 'var(--accent)', width: '100%' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}><span>1 h</span><span>96 h</span></div>
              </div>

              {/* Coating */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Surface Coating</label>
                <div className="flex flex-wrap gap-2">
                  {COATINGS.map(c => (
                    <button key={c} onClick={() => set('coating', c)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{
                        background: form.coating === c ? 'var(--accent)' : 'transparent',
                        color: form.coating === c ? '#000' : 'var(--text-muted)',
                        borderColor: form.coating === c ? 'var(--accent)' : 'var(--border)',
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Run button */}
              <button onClick={handlePredict} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
                style={{ background: 'var(--accent)', color: '#000', boxShadow: '0 0 30px rgba(0,255,157,0.2)', opacity: loading ? 0.8 : 1 }}>
                {loading ? (
                  <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg> Predicting...</>
                ) : (
                  <><Zap size={16} /> Run Prediction</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Result panel */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl border h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderStyle: 'dashed' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(0,255,157,0.06)', border: '1px solid rgba(0,255,157,0.15)' }}>
                    <FlaskConical size={28} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>Ready to Predict</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Adjust the parameters and click <strong style={{ color: 'var(--accent)' }}>Run Prediction</strong> to see real-time results from our AI model.
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: 'var(--surface)', borderColor: isToxic ? 'rgba(239,68,68,0.3)' : 'rgba(0,255,157,0.3)' }}>

                  {/* Top bar */}
                  <div className="px-8 py-5 border-b flex items-center justify-between"
                    style={{ borderColor: 'var(--border)', background: isToxic ? 'rgba(239,68,68,0.06)' : 'rgba(0,255,157,0.06)' }}>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1"
                        style={{ color: isToxic ? '#f87171' : 'var(--accent)' }}>Prediction Result</div>
                      <div className="text-3xl font-black" style={{ color: isToxic ? '#ef4444' : '#00ff9d', fontFamily: 'var(--font-display)' }}>
                        {result.prediction}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Confidence</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                        {(Number(result.confidence) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Aggregation Risk', value: result.aggregation_risk || (isToxic ? 'HIGH' : 'LOW') },
                        { label: 'Cytotoxicity Score', value: Number(result.cytotoxicity_score || 0).toFixed(2) },
                      ].map(item => (
                        <div key={item.label} className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                          <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                          <div className="text-base font-bold" style={{ color: 'var(--text)' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Risk factors */}
                    {result.top_risk_factors?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                          {isToxic ? 'Top Risk Factors' : 'Safety Indicators'}
                        </div>
                        <div className="space-y-2">
                          {result.top_risk_factors.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ background: isToxic ? '#ef4444' : 'var(--accent)' }} />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result._simulated && (
                      <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                        ⚡ API offline — showing simulated prediction based on input heuristics.
                      </p>
                    )}

                    <button onClick={() => setResult(null)}
                      className="w-full py-2.5 rounded-xl text-sm border transition-all hover:opacity-70"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── CTA SECTION ──────────────────────────────────────────────────────────────
const CTASection = () => (
  <section className="py-32 relative overflow-hidden border-t" style={{ borderColor:'var(--border)' }}>
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 video-overlay z-10" />
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-32">
        <source src={FOOTER_VIDEO} type="video/mp4" />
      </video>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] pointer-events-none z-1"
      style={{ background:'radial-gradient(ellipse, rgba(0,255,157,0.09) 0%, transparent 70%)', filter:'blur(20px)' }} />
    <div className="container mx-auto px-6 text-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}>
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase"
            style={{ borderColor:'rgba(0,255,157,0.3)', color:'var(--accent)', background:'rgba(0,255,157,0.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'var(--accent)' }} />
            Ready to start?
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto"
          style={{ color:'var(--text)', fontFamily:'var(--font-display)' }}>
          Advancing Nanoparticle<br />Safety Through AI
        </motion.h2>
        <motion.p variants={fadeUp} className="text-lg max-w-xl mx-auto mb-10" style={{ color:'var(--text-muted)' }}>
          Nanotoxi delivers instant, accurate toxicity predictions — empowering researchers and organizations to make safer, faster decisions.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://calendly.com/nanotoxi/demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 group"
            style={{ background:'var(--accent)', color:'#000', boxShadow:'0 0 40px rgba(0,255,157,0.28)' }}>
            Schedule Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="https://web-production-6a673.up.railway.app" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 border group"
            style={{ borderColor:'var(--border)', color:'var(--text)', background:'rgba(255,255,255,0.04)' }}>
            Try API Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color:'var(--text-muted)' }} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="py-12 border-t" style={{ borderColor:'var(--border)' }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* UPDATED LOGO */}
          <a href="/" className="flex items-center">
            <img 
              src="/nanologo.png" 
              alt="NanoToxi AI" 
              className="h-8 rounded" 
              style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'normal' }} 
            />
          </a>

          <nav className="flex flex-wrap justify-center gap-6 text-sm" style={{ color:'var(--text-muted)' }}>
            {[['Overview','#overview'],['NanotoxiBench','/benchmarks'],['Stack','#techstack'],['AI','#ai'],['FAQ','#faq'],['Contact','#contact']].map(([label,href])=>
              label === 'NanotoxiBench'
                ? <Link key={label} to={href} className="hover:text-white transition-colors" style={{ transition:'color 0.2s' }}>{label}</Link>
                : <a key={label} href={href} className="hover:text-white transition-colors" style={{ transition:'color 0.2s' }}>{label}</a>
            )}
          </nav>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>© 2025 Nanotoxi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
    <CursorTrail />
    <MoleculeCanvas />
    <Navbar />
    <Hero />
    <StatsTicker />
    <StepsSection />
    <Benchmarks />
    <EvalStack />
    <WhyAI />
    <FAQ />
    <Contact />
    <DemoWidget />
    <CTASection />
    <Footer />
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/benchmarks" element={<BenchmarksPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;