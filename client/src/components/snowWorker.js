// Snow drifts slowly, so it doesn't need a full 60 FPS to look smooth —
// throttled to ~30 FPS, which halves how often this canvas repaints. That
// matters more than it sounds: BrightnessControl.jsx overlays the whole
// page with a mix-blend-mode layer whenever brightness isn't at 100%, and
// mix-blend-mode forces the browser to recomposite everything beneath it
// on every repaint of this canvas — halving the repaint rate roughly halves
// that compositing cost too.
const FRAME_INTERVAL_MS = 1000 / 30;
let ctx, W, H, flakes, animationId, snowColor = "rgba(190,220,255,0.55)";
let lastDrawTime = 0;

function initFlakes() {
  flakes = Array.from({ length: 35 }, () => ({  // Reduced from 45 for better perf
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.8,
    speed: Math.random() * 0.4 + 0.1,
    drift: (Math.random() - 0.5) * 0.15,
    wobble: Math.random() * 2,
  }));
}

function draw(timestamp) {
  animationId = requestAnimationFrame(draw);

  if (!lastDrawTime) lastDrawTime = timestamp;
  const elapsed = timestamp - lastDrawTime;
  if (elapsed < FRAME_INTERVAL_MS) return; // throttle to ~30 FPS

  // Delta time (relative to the last actual draw, not every raf tick) for
  // smooth frame-rate-independent animation regardless of the throttle above.
  const deltaTime = Math.min(elapsed / 16.67, 2);  // 16.67ms = 60 FPS baseline
  lastDrawTime = timestamp;

  // Clear once, draw all flakes efficiently
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = snowColor;
  ctx.beginPath();

  for (const f of flakes) {
    // Update position with delta time
    f.y += f.speed * deltaTime;
    f.x += f.drift * Math.sin(f.wobble) * deltaTime;
    f.wobble += 0.05;

    // Wrap around screen
    if (f.y > H + 5) {
      f.y = -5;
      f.x = Math.random() * W;
    }
    if (f.x < -5) f.x = W + 5;
    if (f.x > W + 5) f.x = -5;

    // Draw flake
    ctx.moveTo(f.x + f.r, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }

  ctx.fill();
}

self.onmessage = ({ data }) => {
  if (data.type === "init") {
    W = data.width;
    H = data.height;
    if (data.color) snowColor = data.color;
    ctx = data.canvas.getContext("2d", { alpha: true, desynchronized: true });
    initFlakes();
    draw(performance.now());
  }

  if (data.type === "resize") {
    W = data.width;
    H = data.height;
    for (const f of flakes) {
      if (f.x > W) f.x = Math.random() * W;
    }
  }

  if (data.type === "pause") {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (data.type === "resume" && !animationId) {
    lastDrawTime = 0; // avoid a huge deltaTime jump after being paused
    animationId = requestAnimationFrame(draw);
  }

  if (data.type === "stop") {
    cancelAnimationFrame(animationId);
  }
};
