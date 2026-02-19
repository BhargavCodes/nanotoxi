// src/useCursorTrail.js
// Attaches a green comet-trail canvas to the document body.
// Call once at app root level. Returns a cleanup function.

export function initCursorTrail() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const mouse = { x: -500, y: -500 };
  const points = [];
  const MAX = 28;

  const onMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    points.unshift({ x: e.clientX, y: e.clientY, age: 0 });
    if (points.length > MAX) points.length = MAX;
  };

  const onResize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  };

  document.addEventListener('mousemove', onMove);
  window.addEventListener('resize', onResize);

  let rafId;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    points.forEach((pt) => { pt.age += 1; });

    // Draw the comet trail as a connected tapered stroke
    if (points.length > 1) {
      for (let i = 0; i < points.length - 1; i++) {
        const t = i / MAX;
        const alpha = Math.max(0, 1 - t * 1.1) * 0.85;
        const lineW = Math.max(0.2, (1 - t) * 9);

        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    }

    // Bright dot at tip
    if (points.length > 0) {
      const tip = points[0];
      const grad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 10);
      grad.addColorStop(0, 'rgba(0,255,157,0.9)');
      grad.addColorStop(0.4, 'rgba(0,255,157,0.4)');
      grad.addColorStop(1, 'rgba(0,255,157,0)');
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Age out and remove old points
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i].age > 18) points.splice(i, 1);
    }

    rafId = requestAnimationFrame(draw);
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMove);
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}
