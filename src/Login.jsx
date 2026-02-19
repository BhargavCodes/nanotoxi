// src/Login.jsx
// ─────────────────────────────────────────────────────────────────────────────
// OAUTH SETUP (one-time, ~5 min each):
//
// GOOGLE:
//  1. Go to https://console.cloud.google.com/
//  2. Create project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
//  3. Application type: Web app
//  4. Authorised JS origins: http://localhost:5173 + https://yourdomain.com
//  5. Copy the Client ID → paste into .env as: VITE_GOOGLE_CLIENT_ID=your_id_here
//
// GITHUB:
//  1. Go to https://github.com/settings/developers → OAuth Apps → New OAuth App
//  2. Homepage URL: http://localhost:5173
//  3. Authorization callback URL: http://localhost:5173/auth/github/callback
//  4. Copy Client ID → paste into .env as: VITE_GITHUB_CLIENT_ID=your_id_here
//  5. Note: GitHub requires a backend to exchange the code for a token.
//     Add a /auth/github/callback route to your backend, then redirect the user.
//
// Create a .env file in your project root:
//   VITE_GOOGLE_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
//   VITE_GITHUB_CLIENT_ID=Ov23liXXXXXXXXXXXX
// ─────────────────────────────────────────────────────────────────────────────
// src/Login.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme, useToast } from './App';

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
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.45, vy: (Math.random()-0.5)*0.45,
      size: Math.random()*1.8+0.5,
    }));
    let rafId;
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      pts.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        ctx.fillStyle=isLight?'rgba(0,0,0,0.16)':'rgba(255,255,255,0.22)';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
        pts.slice(i+1).forEach(p2 => {
          const dx=p.x-p2.x,dy=p.y-p2.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<110){
            const a=(1-dist/110)*0.45;
            ctx.strokeStyle=isLight?`rgba(0,0,0,${a*0.3})`:`rgba(140,140,140,${a})`;
            ctx.lineWidth=0.7;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
          }
        });
      });
      rafId=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{w=window.innerWidth;h=window.innerHeight;canvas.width=w;canvas.height=h;};
    window.addEventListener('resize',onResize);
    return ()=>{cancelAnimationFrame(rafId);window.removeEventListener('resize',onResize);};
  },[theme]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 canvas-bg" style={{opacity:0.35}} />;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const { showToast } = useToast();
  const { theme } = useTheme(); // <-- ADDED THEME HERE
  const navigate = useNavigate();

  const handleMockLogin = (type) => {
    setOauthLoading(type);
    setTimeout(() => {
      setOauthLoading(null);
      showToast('Backend not connected yet. Simulated login successful!');
      navigate('/');
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Backend not connected yet. Simulated login successful!');
      navigate('/');
    }, 1500);
  };

  const inputBase = {
    width:'100%', background:'rgba(0,0,0,0.35)', border:'1px solid var(--border)',
    borderRadius:10, padding:'13px 16px', color:'var(--text)', fontSize:14,
    outline:'none', transition:'border-color 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:'var(--bg)'}}>
      <MoleculeCanvas />
      <div className="absolute top-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{background:'var(--glow-accent)',filter:'blur(100px)'}} />
      <div className="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{background:'var(--glow-blue)',filter:'blur(100px)'}} />

      <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}}
        transition={{duration:0.45,ease:[0.16,1,0.3,1]}}
        className="w-full max-w-md px-6 relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-8 relative z-10">
          <Link to="/" className="flex items-center group">
            <img 
              src="/nanologo.png" 
              alt="NanoToxi AI" 
              className="h-10 md:h-15 transition-transform duration-300 group-hover:scale-105 rounded"
              style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'normal' }} 
            />
          </Link>
        </div>

        <div className="rounded-2xl border p-8 shadow-2xl relative overflow-hidden"
          style={{background:'rgba(15,15,15,0.65)',backdropFilter:'blur(24px)',borderColor:'var(--border)'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{background:'linear-gradient(90deg, transparent, rgba(0,255,157,0.4), transparent)'}} />

          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold mb-1.5" style={{color:'var(--text)',fontFamily:'var(--font-display)'}}>Welcome Back</h2>
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Sign in to access the platform.</p>
          </div>

          {/* OAuth Buttons (Mocked) */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleMockLogin('google')} disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.02] hover:border-white/20 active:scale-[0.98] disabled:opacity-60"
              style={{background:'rgba(255,255,255,0.04)',borderColor:'var(--border)',color:'var(--text)'}}>
              {oauthLoading === 'google' ? <Loader2 size={17} className="animate-spin"/>
                : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              }
              Continue with Google
            </button>

            <button onClick={() => handleMockLogin('github')} disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.02] hover:border-white/20 active:scale-[0.98] disabled:opacity-60"
              style={{background:'rgba(255,255,255,0.04)',borderColor:'var(--border)',color:'var(--text)'}}>
              {oauthLoading === 'github' ? <Loader2 size={17} className="animate-spin"/>
                : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              }
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{borderColor:'var(--border)'}} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs" style={{background:'rgba(10,10,10,0.85)',color:'var(--text-muted)'}}>or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider ml-0.5" style={{color:'var(--text-muted)'}}>Email Address</label>
              <input type="email" required placeholder="name@company.com" style={inputBase}
                onFocus={e=>e.target.style.borderColor='var(--accent)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider ml-0.5" style={{color:'var(--text-muted)'}}>Password</label>
                <Link to="/forgot-password" className="text-xs hover:opacity-80 transition-opacity" style={{color:'var(--accent)'}}>Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPassword?'text':'password'} required placeholder="••••••••"
                  style={{...inputBase,paddingRight:44}}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <button type="button" onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-100"
                  style={{color:'var(--text-muted)',opacity:0.7}}>
                  {showPassword?<EyeOff size={17}/>:<Eye size={17}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{background:'var(--accent)',color:'#000',boxShadow:'0 0 25px rgba(0,255,157,0.2)'}}>
              {isLoading ? <Loader2 className="animate-spin" size={19}/> : <><span>Sign In</span><ArrowRight size={17}/></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{color:'var(--text-muted)'}}>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold hover:opacity-80 transition-opacity" style={{color:'var(--accent)'}}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;