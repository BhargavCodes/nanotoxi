// src/Signup.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from './App';
import { useToast } from './App';

const MoleculeCanvas = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const isLight = theme === 'light';

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.5,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = isLight ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.18)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        pts.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const a = (1 - d / 120) * 0.4;
            ctx.strokeStyle = isLight ? `rgba(0,0,0,${a * 0.3})` : `rgba(130,130,130,${a})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        });
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize); };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 canvas-bg" style={{ opacity: 0.32 }} />;
};

// Password strength helper
const getStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#00ff9d'];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  const strength = getStrength(password);

  const inputBase = {
    width: '100%',
    background: 'rgba(0,0,0,0.32)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '13px 16px',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) { showToast('Please agree to the Terms & Conditions.', 'error'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Account created! Welcome to Convexia.');
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ background: 'var(--bg)' }}>
      <MoleculeCanvas />

      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'var(--glow-accent)', filter: 'blur(120px)' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'var(--glow-blue)', filter: 'blur(120px)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="https://cdn.prod.website-files.com/685df7190351aa65bc34fcae/685ea8d37aa433f7055dce72_Convexia%20Logo.svg"
              alt="Convexia" className="h-7 hover:opacity-75 transition-opacity" />
          </Link>
        </div>

        <div className="rounded-2xl border p-8 md:p-10 shadow-2xl relative overflow-hidden"
          style={{ background: 'rgba(15,15,15,0.65)', backdropFilter: 'blur(24px)', borderColor: 'var(--border)' }}>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Create Account
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Join the platform redefining drug sourcing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider ml-0.5" style={{ color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <input type="text" required placeholder="John Doe" style={inputBase}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider ml-0.5" style={{ color: 'var(--text-muted)' }}>
                Work Email
              </label>
              <input type="email" required placeholder="name@company.com" style={inputBase}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider ml-0.5" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required
                  placeholder="Create a strong password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className="flex-1 h-1 rounded-full transition-all duration-400"
                        style={{ background: strength >= s ? strengthColor[strength] : 'var(--border)' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor[strength] || 'var(--text-muted)' }}>
                    {strengthLabel[strength]}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <div
                onClick={() => setAgreed(!agreed)}
                className="mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all"
                style={{
                  background: agreed ? 'var(--accent)' : 'transparent',
                  borderColor: agreed ? 'var(--accent)' : 'var(--border)',
                }}>
                {agreed && <Check size={13} strokeWidth={3} color="#000" />}
              </div>
              <p className="text-xs leading-relaxed cursor-pointer" style={{ color: 'var(--text-muted)' }}
                onClick={() => setAgreed(!agreed)}>
                I agree to the{' '}
                <a href="#" className="underline hover:opacity-80" style={{ color: 'var(--text)' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:opacity-80" style={{ color: 'var(--text)' }}>Privacy Policy</a>.
              </p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 group mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'var(--text)', color: 'var(--bg)' }}>
              {isLoading
                ? <Loader2 className="animate-spin" size={19} />
                : <><span>Get Started</span><ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>

          <div className="text-center mt-7 pt-6 border-t relative z-10" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
