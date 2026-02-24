// src/ScrollAnimations.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Seven generative canvas animations themed for Nanotoxi's deep-ocean blue
// brand DNA. Each animation can run in two modes:
//   1. RAF mode (default) — continuous animation for decorative use
//   2. Scroll-scrub mode — pass a Framer Motion scrollYProgress MotionValue
//      to drive the animation directly from scroll position.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';

const BG = 'transparent'; // let container bg show through for theme compat

// ─── Primary palette ──────────────────────────────────────────────────────────
const C_ACCENT    = '0,198,255';   // electric cyan-blue  #00c6ff
const C_BLUE      = '37,99,235';   // deep cobalt         #2563eb
const C_ACCENT2   = '0,120,200';   // mid blue
const C_DANGER    = '239,68,68';   // red for toxic

// ─── DUAL-MODE CANVAS HOOK ────────────────────────────────────────────────────
// If scrollProgress (Framer Motion MotionValue) is passed, the animation scrubs
// with scroll (t mapped 0→PI*10). Otherwise it runs a normal RAF loop.
export function useCanvas(drawFn, scrollProgress) {
  const ref = useRef(null);
  
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, rafId;
    let isVisible = true; // Track visibility

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // PERFORMANCE FIX: Only calculate animation math if canvas is on screen
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { rootMargin: "100px" } // Starts math right before it enters screen
    );
    io.observe(canvas);

    let t = 0;
    const tick = () => {
      // If it's invisible, we just skip the math entirely to save CPU!
      if (isVisible && W > 0 && H > 0) {
        t += 0.012;
        drawFn(ctx, W, H, t);
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();
    
    return () => { 
      cancelAnimationFrame(rafId); 
      ro.disconnect(); 
      io.disconnect(); 
    };
  }, [drawFn]); // Added drawFn dependency
  
  return ref;
}

// ─── 1. NANOPARTICLE AGGREGATION ─────────────────────────────────────────────
// Particles cluster into three dynamic groups with cyan bond lines
export function AggregationCanvas({ scrollProgress } = {}) {
  const stateRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!stateRef.current || stateRef.current._W !== W) {
      const N = 52;
      stateRef.current = {
        _W: W,
        particles: Array.from({ length: N }, () => ({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random()-0.5)*0.55, vy: (Math.random()-0.5)*0.55,
          r: Math.random()*4+2.5, phase: Math.random()*Math.PI*2,
          cluster: Math.floor(Math.random()*3),
        })),
        centers: [
          { x: W*0.26, y: H*0.38, vx:0.16, vy:0.12 },
          { x: W*0.70, y: H*0.58, vx:-0.12, vy:0.17 },
          { x: W*0.50, y: H*0.22, vx:0.14, vy:-0.13 },
        ],
      };
    }
    const { particles, centers } = stateRef.current;
    ctx.clearRect(0, 0, W, H);

    centers.forEach(c => {
      c.x += c.vx; c.y += c.vy;
      if (c.x < W*0.1 || c.x > W*0.9) c.vx *= -1;
      if (c.y < H*0.1 || c.y > H*0.9) c.vy *= -1;
    });
    particles.forEach(p => {
      const c = centers[p.cluster];
      const dx = c.x-p.x, dy = c.y-p.y;
      p.vx += dx*0.00015; p.vy += dy*0.00015;
      p.vx *= 0.97; p.vy *= 0.97;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0||p.x > W) p.vx *= -1;
      if (p.y < 0||p.y > H) p.vy *= -1;
    });

    // Bond lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 55) {
          const a = (1-d/55)*0.65;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${C_ACCENT},${a})`;
          ctx.lineWidth = a*2.2; ctx.stroke();
        }
      }
    }
    // Particles
    particles.forEach(p => {
      const pulse = (Math.sin(t*2.2+p.phase)+1)/2;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*2.8);
      g.addColorStop(0, `rgba(${C_ACCENT},${0.85*pulse+0.15})`);
      g.addColorStop(0.5, `rgba(${C_ACCENT},${0.2*pulse})`);
      g.addColorStop(1, `rgba(${C_ACCENT},0)`);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r*2.8, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${C_ACCENT},${0.65+pulse*0.35})`; ctx.fill();
    });
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 2. TOXICITY HEX GRID ────────────────────────────────────────────────────
// Blue hex lattice with red toxic cells — scroll-scrubbable wave sweep
export function ToxicityHexCanvas({ scrollProgress } = {}) {
  const hexRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!hexRef.current || hexRef.current._W !== W) {
      const S = 24, cols = Math.ceil(W/(S*1.73))+2, rows = Math.ceil(H/(S*1.5))+2;
      hexRef.current = { _W: W, hexes: [] };
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          hexRef.current.hexes.push({
            x: c*S*1.73+(r%2?S*0.87:0), y: r*S*1.5,
            phase: Math.random()*Math.PI*2,
            speed: 0.3+Math.random()*0.5,
            toxic: Math.random() < 0.2, s: S,
          });
    }
    ctx.clearRect(0, 0, W, H);

    hexRef.current.hexes.forEach(h => {
      const wave = (Math.sin(t*h.speed+h.phase)+1)/2;
      const s = h.s-2;
      const hex = () => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI/3*i-Math.PI/6;
          i===0 ? ctx.moveTo(h.x+Math.cos(a)*s, h.y+Math.sin(a)*s)
                : ctx.lineTo(h.x+Math.cos(a)*s, h.y+Math.sin(a)*s);
        }
        ctx.closePath();
      };
      hex();
      if (h.toxic) {
        ctx.fillStyle = `rgba(${C_DANGER},${wave*0.18})`; ctx.fill();
        ctx.strokeStyle = `rgba(${C_DANGER},${wave*0.75})`; ctx.lineWidth=0.8; ctx.stroke();
        if (wave > 0.8) {
          ctx.beginPath();
          for (let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;i===0?ctx.moveTo(h.x+Math.cos(a)*s*0.44,h.y+Math.sin(a)*s*0.44):ctx.lineTo(h.x+Math.cos(a)*s*0.44,h.y+Math.sin(a)*s*0.44);}
          ctx.closePath();
          ctx.fillStyle = `rgba(${C_DANGER},${(wave-0.8)*3})`; ctx.fill();
        }
      } else {
        ctx.fillStyle = `rgba(${C_ACCENT},${wave*0.07})`; ctx.fill();
        ctx.strokeStyle = `rgba(${C_ACCENT},${wave*0.28})`; ctx.lineWidth=0.6; ctx.stroke();
      }
    });

    // Scroll sweep line
    const sy = ((t*38)%(H+40))-20;
    const sg = ctx.createLinearGradient(0,sy-24,0,sy+24);
    sg.addColorStop(0,`rgba(${C_ACCENT},0)`);
    sg.addColorStop(0.5,`rgba(${C_ACCENT},0.1)`);
    sg.addColorStop(1,`rgba(${C_ACCENT},0)`);
    ctx.fillStyle = sg; ctx.fillRect(0,sy-24,W,48);
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 3. CYTOTOXICITY MEMBRANE ─────────────────────────────────────────────────
// Cell membrane with blue glow organelles and attacker particles
export function CytotoxicityCanvas({ scrollProgress } = {}) {
  const stateRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!stateRef.current) {
      stateRef.current = {
        organelles: Array.from({length:6},(_,i)=>({
          angle:(i/6)*Math.PI*2, rr:0.38+Math.random()*0.2,
          size:6+Math.random()*6, speed:(Math.random()-0.5)*0.007,
        })),
        attackers: Array.from({length:14},()=>({
          angle:Math.random()*Math.PI*2,
          orbit:1.22+Math.random()*0.35,
          speed:0.007+Math.random()*0.007,
          breach:Math.random()<0.3, bp:Math.random(),
        })),
      };
    }
    const { organelles, attackers } = stateRef.current;
    const cx = W/2, cy = H/2, R = Math.min(W,H)*0.29;

    ctx.clearRect(0,0,W,H);

    // Outer glow ring
    const gg = ctx.createRadialGradient(cx,cy,R*0.7,cx,cy,R*1.3);
    gg.addColorStop(0,`rgba(${C_ACCENT},0.04)`);
    gg.addColorStop(0.5,`rgba(${C_ACCENT},0.08)`);
    gg.addColorStop(1,`rgba(${C_ACCENT},0)`);
    ctx.beginPath(); ctx.arc(cx,cy,R*1.3,0,Math.PI*2);
    ctx.fillStyle=gg; ctx.fill();

    // Membrane
    const memPulse = (Math.sin(t*0.8)+1)/2;
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.arc(cx,cy,R+(i-1)*4,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${C_ACCENT},${0.18-i*0.06+memPulse*0.06})`;
      ctx.lineWidth=1.5-i*0.4; ctx.stroke();
    }

    // Nucleus
    const ng = ctx.createRadialGradient(cx,cy,0,cx,cy,R*0.22);
    ng.addColorStop(0,`rgba(${C_ACCENT},0.18)`);
    ng.addColorStop(1,`rgba(${C_ACCENT},0)`);
    ctx.beginPath(); ctx.arc(cx,cy,R*0.22,0,Math.PI*2);
    ctx.fillStyle=ng; ctx.fill();

    // Organelles
    organelles.forEach(o => {
      o.angle += o.speed;
      const ox=cx+Math.cos(o.angle)*R*o.rr, oy=cy+Math.sin(o.angle)*R*o.rr;
      const og=ctx.createRadialGradient(ox,oy,0,ox,oy,o.size*1.8);
      og.addColorStop(0,`rgba(${C_BLUE},0.7)`);
      og.addColorStop(1,`rgba(${C_BLUE},0)`);
      ctx.beginPath(); ctx.arc(ox,oy,o.size*1.8,0,Math.PI*2);
      ctx.fillStyle=og; ctx.fill();
      ctx.beginPath(); ctx.arc(ox,oy,o.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(${C_BLUE},0.6)`; ctx.fill();
    });

    // Attackers
    attackers.forEach(a => {
      a.angle += a.speed;
      const ax=cx+Math.cos(a.angle)*R*a.orbit, ay=cy+Math.sin(a.angle)*R*a.orbit;
      const col = a.breach ? C_DANGER : C_ACCENT;
      const ag=ctx.createRadialGradient(ax,ay,0,ax,ay,7);
      ag.addColorStop(0,`rgba(${col},0.9)`);
      ag.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(ax,ay,7,0,Math.PI*2);
      ctx.fillStyle=ag; ctx.fill();
      ctx.beginPath(); ctx.arc(ax,ay,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(${col},0.95)`; ctx.fill();
    });
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 4. RISK RADAR ────────────────────────────────────────────────────────────
// Rotating radar sweep with risk points — deep blue background
export function RiskRadarCanvas({ scrollProgress } = {}) {
  const stateRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!stateRef.current) {
      stateRef.current = {
        pts: Array.from({length:18},()=>({
          angle: Math.random()*Math.PI*2,
          dist: 0.25+Math.random()*0.72,
          isHigh: Math.random()<0.33,
          visible: false, alpha: 0, fadedFor: 0,
        })),
      };
    }
    const { pts } = stateRef.current;
    const cx=W/2, cy=H/2, R=Math.min(W,H)*0.38;
    const sweep = (t*0.55) % (Math.PI*2);

    ctx.clearRect(0,0,W,H);

    // Rings
    for(let i=1;i<=4;i++){
      ctx.beginPath(); ctx.arc(cx,cy,R*(i/4),0,Math.PI*2);
      ctx.strokeStyle=`rgba(${C_ACCENT},0.08)`; ctx.lineWidth=0.7; ctx.stroke();
    }
    // Cross hairs
    [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach(a=>{
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
      ctx.strokeStyle=`rgba(${C_ACCENT},0.07)`; ctx.lineWidth=0.6; ctx.stroke();
    });

    // Sweep fill
    for(let i=0;i<50;i++){
      const ta=sweep-(i/50)*Math.PI*0.44;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,ta-0.05,ta); ctx.closePath();
      ctx.fillStyle=`rgba(${C_ACCENT},${(1-i/50)*0.06})`; ctx.fill();
    }

    // Sweep line
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(sweep)*R,cy+Math.sin(sweep)*R);
    const lg=ctx.createLinearGradient(cx,cy,cx+Math.cos(sweep)*R,cy+Math.sin(sweep)*R);
    lg.addColorStop(0,`rgba(${C_ACCENT},0.9)`); lg.addColorStop(1,`rgba(${C_ACCENT},0.05)`);
    ctx.strokeStyle=lg; ctx.lineWidth=2; ctx.stroke();

    // Points
    pts.forEach(p => {
      const ad=((sweep-p.angle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      if(ad<0.18){p.visible=true;p.alpha=1;p.fadedFor=0;}
      if(p.visible){
        p.fadedFor+=0.007; p.alpha=Math.max(0.1,1-p.fadedFor*0.5);
        const px=cx+Math.cos(p.angle)*p.dist*R, py=cy+Math.sin(p.angle)*p.dist*R;
        const col=p.isHigh?C_DANGER:C_ACCENT, sz=p.isHigh?6:4;
        const g=ctx.createRadialGradient(px,py,0,px,py,sz*3.5);
        g.addColorStop(0,`rgba(${col},${p.alpha})`); g.addColorStop(1,`rgba(${col},0)`);
        ctx.beginPath(); ctx.arc(px,py,sz*3.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,sz,0,Math.PI*2); ctx.fillStyle=`rgba(${col},${p.alpha})`; ctx.fill();
      }
    });
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle=`rgba(${C_ACCENT},0.9)`; ctx.fill();
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 5. DATA HELIX ───────────────────────────────────────────────────────────
// Double helix — cyan + cobalt strands, scroll-scrubbable rotation
export function DataHelixCanvas({ scrollProgress } = {}) {
  const LABELS = ['Au','TiO₂','ZnO','Ag','Fe₃O₄','SiO₂','C₆₀','CdSe','Pt','CuO'];
  const draw = useRef((ctx, W, H, t) => {
    ctx.clearRect(0,0,W,H);
    const cx=W/2, AMP=W*0.22, TURNS=3.5, N=90;
    const s1=[],s2=[];
    for(let i=0;i<=N;i++){
      const p=i/N, a=p*Math.PI*2*TURNS+t, y=p*H, d=Math.sin(a);
      s1.push({x:cx+Math.cos(a)*AMP,y,d});
      s2.push({x:cx+Math.cos(a+Math.PI)*AMP,y,d:-d});
    }
    // Bridge rungs
    for(let i=0;i<N;i+=5){
      const a=(s1[i].d+s2[i].d)/2, al=((a+1)/2)*0.3+0.04;
      ctx.beginPath(); ctx.moveTo(s1[i].x,s1[i].y); ctx.lineTo(s2[i].x,s2[i].y);
      ctx.strokeStyle=`rgba(${C_ACCENT},${al})`; ctx.lineWidth=0.8; ctx.stroke();
      if(i%15===0&&i>0){
        const label=LABELS[(i/15)%LABELS.length];
        const mx=(s1[i].x+s2[i].x)/2, my=(s1[i].y+s2[i].y)/2;
        const fa=(s1[i].d+1)/2;
        ctx.font=`${9+fa*5}px 'DM Sans',sans-serif`;
        ctx.fillStyle=`rgba(${C_ACCENT},${fa*0.7})`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label,mx,my);
      }
    }
    const drawStrand=(strand,rgb)=>{
      const segs=strand.slice(0,-1).map((p,i)=>({i,d:p.d})).sort((a,b)=>a.d-b.d);
      segs.forEach(({i})=>{
        const p=strand[i],pn=strand[i+1],dd=(p.d+1)/2;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pn.x,pn.y);
        ctx.strokeStyle=`rgba(${rgb},${0.12+dd*0.88})`; ctx.lineWidth=1.5+dd*3.5; ctx.lineCap='round'; ctx.stroke();
        if(i%9===0){
          const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,10);
          g.addColorStop(0,`rgba(${rgb},${dd*0.9})`); g.addColorStop(1,`rgba(${rgb},0)`);
          ctx.beginPath(); ctx.arc(p.x,p.y,10,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x,p.y,3.5,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},${dd})`; ctx.fill();
        }
      });
    };
    drawStrand(s1,C_ACCENT); drawStrand(s2,C_BLUE);
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 6. MOLECULAR REPORT RAIN ─────────────────────────────────────────────────
// Matrix-rain of nanotoxicology terms — blue theme
export function ReportMatrixCanvas({ scrollProgress } = {}) {
  const CHARS = 'TOXIC NON-TOXIC 0.952 ZnO Au TiO₂ Ag ROS IC₅₀ EC₅₀ 0.88 LD₅₀ CdSe pH ζ= 95.2% HIGH LOW SAFE NP'.split(' ');
  const dropsRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!dropsRef.current || dropsRef.current._W !== W) {
      const F=11, cols=Math.floor(W/(F*4.5));
      dropsRef.current = {
        _W:W, F,
        drops:Array.from({length:cols},()=>Math.random()*H/F),
        speeds:Array.from({length:cols},()=>0.3+Math.random()*0.8),
        hi:Array.from({length:cols},()=>Math.random()<0.18),
      };
    }
    const {F,drops,speeds,hi} = dropsRef.current;
    const cols=drops.length;
    ctx.fillStyle='rgba(4,8,16,0.11)'; ctx.fillRect(0,0,W,H);
    const colW=W/cols;
    drops.forEach((d,i)=>{
      const txt=CHARS[Math.floor(Math.random()*CHARS.length)];
      const x=i*colW, y=d*F;
      ctx.font=`bold ${F}px 'DM Mono',monospace`;
      ctx.fillStyle = hi[i]&&txt==='TOXIC'
        ? 'rgba(239,68,68,0.95)'
        : hi[i]&&txt==='NON-TOXIC'
        ? `rgba(${C_ACCENT},1)`
        : hi[i]
        ? `rgba(180,220,255,0.9)`
        : `rgba(${C_ACCENT},0.65)`;
      ctx.fillText(txt,x,y);
      ctx.fillStyle=`rgba(${C_ACCENT},0.15)`; ctx.font=`${F}px 'DM Mono',monospace`;
      if(y>F*3)ctx.fillText(CHARS[Math.floor(Math.random()*CHARS.length)],x,y-F*2);
      drops[i]+=speeds[i];
      if(drops[i]*F>H+80){drops[i]=-Math.random()*18; hi[i]=Math.random()<0.18;}
    });
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── 7. NEURAL VALIDATION MESH ───────────────────────────────────────────────
// Neural net with animated signal pulses — cyan positive, red negative
export function ValidationMeshCanvas({ scrollProgress } = {}) {
  const stateRef = useRef(null);
  const draw = useRef((ctx, W, H, t) => {
    if (!stateRef.current) {
      const LAYERS=[{c:3,x:0.12},{c:5,x:0.37},{c:5,x:0.63},{c:3,x:0.88}];
      stateRef.current = {
        nodes: LAYERS.flatMap((l,li)=>Array.from({length:l.c},(_,ni)=>({lx:l.x,nc:l.c,ni,layer:li,phase:Math.random()*Math.PI*2}))),
        signals: [], lastSpawn: 0,
      };
    }
    const { nodes, signals } = stateRef.current;
    ctx.clearRect(0,0,W,H);

    const nx = n => n.lx*W;
    const ny = n => H/2+(n.ni-(n.nc-1)/2)*(H/(n.nc+0.9));

    // Edges
    for(let li=0;li<3;li++){
      const fn=nodes.filter(n=>n.layer===li), tn=nodes.filter(n=>n.layer===li+1);
      fn.forEach(f=>tn.forEach(tt=>{
        ctx.beginPath(); ctx.moveTo(nx(f),ny(f)); ctx.lineTo(nx(tt),ny(tt));
        ctx.strokeStyle=`rgba(${C_ACCENT},0.05)`; ctx.lineWidth=0.5; ctx.stroke();
      }));
    }

    // Spawn signals
    if(t-stateRef.current.lastSpawn>0.28){
      const fl=Math.floor(Math.random()*3);
      const fn=nodes.filter(n=>n.layer===fl), tn=nodes.filter(n=>n.layer===fl+1);
      signals.push({
        from:fn[Math.floor(Math.random()*fn.length)],
        to:tn[Math.floor(Math.random()*tn.length)],
        p:0, speed:0.013+Math.random()*0.01,
        pos:Math.random()>0.15,
      });
      stateRef.current.lastSpawn=t;
    }

    for(let i=signals.length-1;i>=0;i--){
      const s=signals[i]; s.p+=s.speed;
      if(s.p>1){signals.splice(i,1);continue;}
      const px=nx(s.from)+(nx(s.to)-nx(s.from))*s.p;
      const py=ny(s.from)+(ny(s.to)-ny(s.from))*s.p;
      const col=s.pos?C_ACCENT:C_DANGER;
      for(let j=0;j<10;j++){
        const tp=Math.max(0,s.p-j*0.022);
        const tx=nx(s.from)+(nx(s.to)-nx(s.from))*tp;
        const ty=ny(s.from)+(ny(s.to)-ny(s.from))*tp;
        ctx.beginPath(); ctx.arc(tx,ty,3.5-j*0.28,0,Math.PI*2);
        ctx.fillStyle=`rgba(${col},${(1-j/10)*0.8})`; ctx.fill();
      }
      const g=ctx.createRadialGradient(px,py,0,px,py,10);
      g.addColorStop(0,`rgba(${col},0.9)`); g.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(px,py,10,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    }

    nodes.forEach(n=>{
      const act=(Math.sin(t*1.4+n.phase)+1)/2, a=0.28+act*0.72, sz=5+act*6;
      const px=nx(n), py=ny(n);
      const g=ctx.createRadialGradient(px,py,0,px,py,sz*3);
      g.addColorStop(0,`rgba(${C_ACCENT},${a*0.7})`); g.addColorStop(1,`rgba(${C_ACCENT},0)`);
      ctx.beginPath(); ctx.arc(px,py,sz*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(px,py,sz,0,Math.PI*2); ctx.fillStyle=`rgba(${C_ACCENT},${a})`; ctx.fill();
      ctx.beginPath(); ctx.arc(px,py,sz-2,0,Math.PI*2); ctx.fillStyle=`rgba(4,8,16,${a*0.6})`; ctx.fill();
    });
  }).current;

  const ref = useCanvas(draw, scrollProgress);
  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ─── SHARED CARD WRAPPER ─────────────────────────────────────────────────────
// Updated with blue brand DNA — subtle glass + deep navy bg
export const AnimCanvas = ({ children, className='' }) => (
  <div
    className={`rounded-2xl overflow-hidden border aspect-video relative ${className}`}
    style={{
      borderColor: 'rgba(0,198,255,0.18)',
      background: 'linear-gradient(135deg, rgba(4,8,16,0.95) 0%, rgba(8,14,28,0.98) 100%)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,198,255,0.08) inset',
    }}>
    <div className="absolute inset-0">{children}</div>
  </div>
);
