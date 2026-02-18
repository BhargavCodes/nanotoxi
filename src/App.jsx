// src/App.jsx
import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Menu, X, ChevronRight, Sun, Moon, ArrowRight, CheckCircle2 } from 'lucide-react';

import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('cvx-theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    try { localStorage.setItem('cvx-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
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
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-xl"
              style={{
                background: 'var(--surface)',
                borderColor: toast.type === 'success' ? 'rgba(0,255,157,0.25)' : 'rgba(239,68,68,0.25)',
                color: toast.type === 'success' ? 'var(--accent)' : '#f87171',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: toast.type === 'success' ? 'var(--accent)' : '#ef4444' }} />
              <span style={{ color: 'var(--text)' }}>{message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ─── SCROLL TO TOP ────────────────────────────────────────────────────────────
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
  {
    id: "01", num: "Step 1",
    title: "Asset Discovery Agent",
    sub: "We scan the globe for overlooked drug assets.",
    desc: "From preclinical biotech to abandoned pharma IP, our AI pulls in structured and unstructured data to find high-potential candidates.",
    cta: { label: "Start Using for $199/mo", href: "https://www.app.convexia.bio/" },
  },
  {
    id: "02", num: "Step 2",
    title: "Scientific Evaluation Stack",
    sub: "We run deep in silico simulations.",
    desc: "Over 50 custom-tuned models assess binding, toxicity, ADME/PK, immunogenicity, and mechanistic fit.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b954ed2848e6fe5abd2c_CONVEXIA_08-transcode.mp4",
  },
  {
    id: "03", num: "Step 3",
    title: "Specialist Human Review",
    sub: "Experts validate the science.",
    desc: "PhDs with domain expertise review each asset's biology, risks, and translatability before greenlighting it for development.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b961d44884a9992dd2ea_DNA-transcode.mp4",
  },
  {
    id: "04", num: "Step 4",
    title: "Market Insight Agent",
    sub: "Uncovers the strongest signals in the market.",
    desc: "Every asset is ranked based on unmet need, competitive landscape, IP positioning, reimbursement signals, financial projections, and other market-shaping factors.",
  },
  {
    id: "05", num: "Step 5",
    title: "Operational Risk Agent",
    sub: "Digital twin simulations to score execution risk before trials start.",
    desc: "CRO fragility, CMC complexity, site readiness, and real-world disruption are modeled to flag trial fragility and avoid costly delays.",
  },
  {
    id: "06", num: "Step 6",
    title: "Probability of Success Model",
    sub: "Go/No-Go decisions anchored to historical benchmarks.",
    desc: "We predict success likelihood using a proprietary model and scoring rubric developed with VCs, pharma, and KOLs, aggregating outputs from all agents and benchmarking against analog deals.",
    image: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685e0f0534234d6056c7a9c5_Step%206.avif",
  },
  {
    id: "07", num: "Step 7",
    title: "Final Human Review",
    sub: "A live roundtable with KOLs makes the final call.",
    desc: "Scientific, regulatory, commercial, and clinical leaders align on risk, timing, and exit strategy before making a go/no-go decision.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F687a74f25ce3782e2e50ac57_CONVEXIA_07_alpha-transcode.mp4",
  },
];

const EVAL_STACK = [
  {
    title: "Binding & Mechanistic Coherence",
    desc: "Evaluates whether a molecule binds its target and drives the desired downstream effects, using structure-based docking and pathway-aware models.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883b961d44884a9992dd2ea_DNA-transcode.mp4",
  },
  {
    title: "ADME & Pharmacokinetics",
    desc: "Predicts absorption, distribution, metabolism, and excretion using validated ML models, flagging liabilities like poor bioavailability or rapid clearance.",
  },
  {
    title: "Toxicity & Safety Profiling",
    desc: "Screens for general and organ-specific toxicity risks using multi-modal predictors trained on human and animal datasets.",
  },
  {
    title: "Off-Target & Immunogenicity Risk",
    desc: "Scans for unintended interactions and immune triggers using structure- and sequence-based predictors to minimize adverse effects and immune rejection.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883cfdc504393eb43c6977b_Danger%20wave-transcode.mp4",
  },
];

const AI_CARDS = [
  {
    title: "Modular Agents, Not Monolithic Models",
    desc: "Each step of the drug lifecycle is handled by a specialized agent tuned for its specific role.",
  },
  {
    title: "Human-in-the-Loop by Design",
    desc: "Expert review is integrated into every decision layer, improving accuracy, interpretability, and trust.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6883e7effb09a2d03ea7b0b4_Face-transcode.mp4",
  },
  {
    title: "Smarter Training with Unlabeled Data",
    desc: "We use semi-supervised learning and synthetic augmentation to train on scarce or unlabeled biomedical data.",
    video: "https://cdn.prod.website-files.com/685df7190351aa65bc34fcae%2F6887e89fa64cd8b0bfc98606_Funil%20%281%29-transcode.mp4",
  },
];

const FAQS = [
  { q: "Who's building Convexia?", a: "We're a Stanford- and YC-backed team with experience across biotech, venture, and AI. We're supported by advisors from leading pharma, regulatory bodies, and computational biology groups — all aligned around accelerating overlooked therapeutics." },
  { q: "Can we license individual components of your platform?", a: "Yes. You can access specific modules, including our sourcing engine, diligence stack, and BD agent. Reach out to schedule a pilot at founders@convexia.bio." },
  { q: "What is your business model?", a: "Our long-term goal is to operate the full drug lifecycle ourselves — acquiring assets, running clinical trials, and selling them to strategic buyers. As a first step, we are licensing components of our platform and running pilots with pharma, biotech, and investment groups to demonstrate value and build traction." },
  { q: "Where do your assets come from?", a: "We source globally from academia, stealth biotech, early-stage pharma, and overlooked IP repositories, surfacing high-potential assets often missed by traditional scouts." },
  { q: "Who reviews the assets beyond the AI agents?", a: "Each AI-prioritized asset is reviewed by internal scientists and a rotating panel of domain experts in drug development, regulatory strategy, and translational research." },
  { q: "Do you have your own wet lab or trials infrastructure?", a: "We don't operate a wet lab. Instead, we partner with CROs for IND-enabling studies and early trials." },
  { q: "Do you design drugs, or only evaluate existing ones?", a: "Not currently. We focus on sourcing and evaluating existing assets, not designing new molecules." },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// ─── SHARED: MOLECULE CANVAS ──────────────────────────────────────────────────
const MoleculeCanvas = ({ particleCount = 55, className = "fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 canvas-bg" }) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isLight = theme === 'light';
    const mouse = { x: null, y: null };

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
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
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const f = (180 - dist) / 180;
            p.x -= (dx / dist) * f * 1.5;
            p.y -= (dy / dist) * f * 1.5;
          }
        }

        ctx.fillStyle = isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.28)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.5;
            ctx.strokeStyle = isLight ? `rgba(0,0,0,${alpha * 0.35})` : `rgba(150,150,150,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
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
const NAV_LINKS = ['Overview', 'ConvexiaBench', 'Tech Stack', 'FAQ', 'Contact'];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const href = (item) => `#${item.toLowerCase().replace(/\s/g, '')}`;

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="container mx-auto px-6 h-[72px] flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img
            src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685ea8d37aa433f7055dce72_Convexia%20Logo.svg"
            alt="Convexia" className="h-[22px]"
          />
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {NAV_LINKS.map(item => (
            <a key={item} href={href(item)}
              className="relative group transition-colors hover:text-white"
              style={{ transition: 'color 0.2s' }}
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--accent)' }} />
            </a>
          ))}
          <ThemeToggle />
          <a
            href="https://www.app.convexia.bio/"
            className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            Login →
          </a>
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{ color: 'var(--text)' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-b"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
          >
            <nav className="flex flex-col p-6 gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {NAV_LINKS.map(item => (
                <a key={item} href={href(item)} onClick={() => setOpen(false)}
                  className="hover:text-white transition-colors py-1">
                  {item}
                </a>
              ))}
              <a href="https://www.app.convexia.bio/"
                className="text-center py-3 rounded-lg font-semibold mt-2"
                style={{ background: 'var(--accent)', color: '#000' }}>
                Login →
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-24 pb-20">
    {/* Background video */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 video-overlay z-10" />
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
    </div>

    <div className="relative z-20 container mx-auto px-6 max-w-5xl">
      <motion.div variants={stagger} initial="hidden" animate="visible">

        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase"
            style={{ borderColor: 'rgba(0,255,157,0.3)', color: 'var(--accent)', background: 'rgba(0,255,157,0.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            Stanford & YC-Backed
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          Uncover Drug Assets<br />
          <span className="gradient-text">10x faster</span>
        </motion.h1>

        <motion.p variants={fadeUp}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--text-muted)' }}>
          Find and evaluate drugs better than ever before. An end-to-end AI stack that replaces months of manual diligence.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="https://www.app.convexia.bio/"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all hover:scale-[1.03] hover:shadow-2xl"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}>
            Test the Agents
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Free to try. No credit card.</p>
        </motion.div>

      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
      <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Scroll</span>
      <motion.div className="w-px h-10 origin-top" style={{ background: 'var(--accent)' }}
        animate={{ scaleY: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
    </motion.div>
  </section>
);

// ─── STEPS SECTION ────────────────────────────────────────────────────────────
const StepsSection = () => (
  <section id="overview" className="py-28 relative">
    {/* Background image */}
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <img src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685eb7af25346a585089c966_hiw%20bg.avif"
        alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%)' }} />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>Overview</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>How Convexia Works</h2>
        <p className="text-lg mb-20" style={{ color: 'var(--text-muted)' }}>
          An end-to-end AI stack that replaces months of manual diligence with fast execution.
        </p>
      </motion.div>

      <div className="relative step-line ml-4 md:ml-8 space-y-20">
        {STEPS.map((step, idx) => {
          const hasMedia = step.video || step.image;
          return (
            <motion.div key={step.id}
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="relative pl-10 md:pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 shadow-lg"
                style={{ background: 'var(--accent)', borderColor: 'var(--bg)', boxShadow: '0 0 12px var(--accent)' }} />

              <div className={`grid gap-12 items-start ${hasMedia ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
                <div>
                  <span className="text-xs font-mono mb-2 block" style={{ color: 'var(--accent)' }}>{step.num}</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <h4 className="text-base md:text-lg mb-4 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{step.sub}</h4>
                  <p className="leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                  {step.cta && (
                    <a href={step.cta.href}
                      className="inline-flex items-center gap-2 border px-6 py-2.5 rounded text-sm font-medium transition-all hover:shadow-lg group"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {step.cta.label}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>

                {hasMedia && (
                  <div className="rounded-2xl overflow-hidden border aspect-video"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                    {step.video ? (
                      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src={step.video} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    )}
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
  <section id="convexiabench" className="py-28 relative overflow-hidden">
    {/* Background video */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 video-overlay z-10" style={{ opacity: 0.97 }} />
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
        <source src={BENCH_VIDEO} type="video/mp4" />
      </video>
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="max-w-xl mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>Explore</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: 'var(--text)' }}>Explore ConvexiaBench</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
          Step inside the ConvexiaBench — a showcase of our AI agents in action. From sourcing overlooked molecules to predicting clinical feasibility, see how our tools compare to legacy tools and frontier LLMs.
        </p>
        <a href="/benchmarks"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold transition-all hover:scale-105 hover:shadow-xl group"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}>
          View the Benchmarks
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>

      {/* Benchmark bars */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mt-16">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="rounded-2xl p-8 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-base font-semibold mb-7" style={{ color: 'var(--text)' }}>Recall at High Precision</h3>
          <div className="space-y-7">
            {[{ label: 'Convexia', val: 92.1, accent: true }, { label: 'Best Baseline', val: 81.4, accent: false }].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2.5">
                  <span style={{ color: 'var(--text)' }}>{item.label}</span>
                  <span style={{ color: item.accent ? 'var(--accent)' : 'var(--text-muted)' }}>{item.val}%</span>
                </div>
                <div className="bench-bar h-2">
                  <motion.div className="h-full rounded-full"
                    style={{ background: item.accent ? 'var(--accent)' : 'rgba(255,255,255,0.25)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: 'circOut', delay: 0.2 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="rounded-2xl p-8 border flex flex-col justify-center text-center"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-6xl font-bold mb-2" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>64%</div>
          <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>Fewer False Positives</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Compared to standard vector search</p>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── EVAL STACK SECTION ───────────────────────────────────────────────────────
const EvalStack = () => (
  <section id="techstack" className="py-28 border-t" style={{ borderColor: 'var(--border)' }}>
    <div className="container mx-auto px-6">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>Explore</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: 'var(--text)' }}>
          Explore Our In-Silico Drug Evaluation Stack
        </h2>
        <p className="text-lg max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          We combine 50+ models to assess every asset across molecular, structural, and translational domains.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {EVAL_STACK.map((card, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="rounded-2xl border overflow-hidden relative"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', minHeight: 220 }}>
            {card.video && (
              <div className="absolute inset-0 opacity-20">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={card.video} type="video/mp4" />
                </video>
              </div>
            )}
            <div className="relative z-10 p-8">
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── WHY AI SECTION ───────────────────────────────────────────────────────────
const WhyAI = () => (
  <section id="ai" className="py-28 border-t" style={{ borderColor: 'var(--border)' }}>
    <div className="container mx-auto px-6">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>AI</span>
        <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text)' }}>Why Our AI is Different</h2>
        <p className="mt-4 text-lg max-w-xl" style={{ color: 'var(--text-muted)' }}>
          Built for real-world drug development, not just to say we use AI.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {AI_CARDS.map((card, i) => (
          <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border overflow-hidden relative group"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', minHeight: 260 }}>
            {card.video && (
              <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={card.video} type="video/mp4" />
                </video>
              </div>
            )}
            <div className="relative z-10 p-8 flex flex-col h-full">
              <div className="w-8 h-8 rounded-lg mb-6 flex items-center justify-center"
                style={{ background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <img src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685eb94a6fdc8149a3c49971_faq%20bg.avif"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)' }} />
      </div>

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>FAQs</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: 'var(--text)' }}>Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-0">
          {FAQS.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex justify-between items-center text-left py-5 gap-4 group"
              >
                <span className="text-base font-medium leading-snug"
                  style={{ color: openIdx === i ? 'var(--accent)' : 'var(--text)', transition: 'color 0.2s' }}>
                  {faq.q}
                </span>
                <ChevronRight size={18} className="flex-shrink-0 transition-transform duration-300"
                  style={{ color: 'var(--text-muted)', transform: openIdx === i ? 'rotate(90deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden">
                    <p className="pb-5 leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
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
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast('Message sent! We\'ll be in touch shortly.');
    }, 1400);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '14px 16px',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" className="py-28 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>Contact</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: 'var(--text)' }}>Let's Talk</h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              We're actively seeking collaborators, pilot customers, and discovery partners.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)' }}>
                  <CheckCircle2 size={28} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Thank you!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Your submission has been received.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required placeholder="Name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <input type="email" required placeholder="Email"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <textarea required placeholder="Message" rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── CTA FOOTER SECTION ───────────────────────────────────────────────────────
const CTASection = () => (
  <section className="py-28 relative overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 video-overlay z-10" />
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
        <source src={FOOTER_VIDEO} type="video/mp4" />
      </video>
    </div>
    <div className="container mx-auto px-6 text-center relative z-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto" style={{ color: 'var(--text)' }}>
          Reprogramming Biotech from the Ground Up
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-muted)' }}>
          Convexia builds autonomous AI agents to scout, vet, and accelerate the world's most overlooked drug assets before anyone else sees them.
        </p>
        <a href="https://calendly.com/ayaan-convexia/demo"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-base transition-all hover:scale-105 hover:shadow-2xl group"
          style={{ background: 'var(--text)', color: 'var(--bg)' }}>
          Book a Demo
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="py-12 border-t" style={{ borderColor: 'var(--border)' }}>
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <img
          src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685ea8d37aa433f7055dce72_Convexia%20Logo.svg"
          alt="Convexia" className="h-5 opacity-80"
        />
        <nav className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          {[['Overview', '#hiw'], ['Stack', '#techstack'], ['AI', '#ai'], ['FAQ', '#faq'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} className="hover:text-white transition-colors" style={{ transition: 'color 0.2s' }}>{label}</a>
          ))}
        </nav>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 Convexia. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
    <MoleculeCanvas />
    <Navbar />
    <Hero />
    <StepsSection />
    <Benchmarks />
    <EvalStack />
    <WhyAI />
    <FAQ />
    <Contact />
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
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
