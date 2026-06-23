// Optimized rain animation using requestAnimationFrame (60 FPS)
let ctx, W, H, drops = [], animationId, heavy = false;

function initDrops() {
  drops = [];
  const count = heavy ? 40 : 25;  // Reduced from 80/50 for better performance
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.random() * W,
      y: Math.random() * H - H,
      len: 10 + Math.random() * 20,
      speed: 5 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
    });
  }
}

function draw() {
  // Clear canvas once
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(147,197,253,0.7)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  // Batch draw all drops
  ctx.beginPath();
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    d.y += d.speed;
    d.x += (Math.random() - 0.5) * 0.5;  // Slight drift

    if (d.y > H) {
      d.y = -10;
      d.x = Math.random() * W;
    }

    if (d.x < 0) d.x = W;
    if (d.x > W) d.x = 0;

    ctx.globalAlpha = d.opacity;
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.len);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  animationId = requestAnimationFrame(draw);
}

self.onmessage = ({ data }) => {
  if (data.type === "init") {
    W = data.width;
    H = data.height;
    heavy = data.heavy || false;
    ctx = data.canvas.getContext("2d", { alpha: true, desynchronized: true });
    initDrops();
    draw();
  }

  if (data.type === "resize") {
    W = data.width;
    H = data.height;
    // Adjust drops that are out of bounds
    drops.forEach(d => {
      if (d.x > W) d.x = Math.random() * W;
      if (d.y > H) d.y = -10;
    });
  }

  if (data.type === "stop") {
    cancelAnimationFrame(animationId);
  }
};
