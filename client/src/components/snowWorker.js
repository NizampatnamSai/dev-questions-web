// Web Workers don't have requestAnimationFrame — use setTimeout
const FRAME_MS = 1000 / 24;

let ctx, W, H, flakes, timer, snowColor = "rgba(190,220,255,0.55)";

function initFlakes() {
  flakes = Array.from({ length: 45 }, () => ({
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     Math.random() * 2.2 + 1,
    speed: Math.random() * 0.6 + 0.25,
    drift: (Math.random() - 0.5) * 0.2,
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  for (const f of flakes) {
    ctx.moveTo(f.x + f.r, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    f.y += f.speed;
    f.x += f.drift;
    if (f.y > H + 5)  { f.y = -5;  f.x = Math.random() * W; }
    if (f.x < -5)      f.x = W + 5;
    if (f.x > W + 5)   f.x = -5;
  }
  ctx.fillStyle = snowColor;
  ctx.fill();
  timer = setTimeout(draw, FRAME_MS);
}

self.onmessage = ({ data }) => {
  if (data.type === 'init') {
    W = data.width; H = data.height;
    if (data.color) snowColor = data.color;
    ctx = data.canvas.getContext('2d', { alpha: true, desynchronized: true });
    initFlakes();
    draw();
  }
  if (data.type === 'resize') {
    W = data.width; H = data.height;
    for (const f of flakes) { if (f.x > W) f.x = Math.random() * W; }
  }
  if (data.type === 'stop') {
    clearTimeout(timer);
  }
};
