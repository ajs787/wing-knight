'use client';

/**
 * TrustGraph — Animated social compatibility network visualization.
 *
 * Renders a force-inspired network graph on a <canvas> element showing:
 *   - User nodes sized by trust centrality
 *   - Edges weighted by compatibility strength
 *   - Animated floating motion for organic feel
 *   - Rose highlight for the current user
 *   - Green edges for confirmed matches
 */

import { useEffect, useRef } from 'react';

// ─── Graph data ───────────────────────────────────────────────────────────────

const NODES = [
  { id: 'me',     label: 'You',     color: '#F472B6', glow: '#F472B6', size: 34, x: 0.50, y: 0.47, ring: true },
  { id: 'priya',  label: 'Priya',   color: '#8b5cf6', glow: '#8b5cf6', size: 26, x: 0.27, y: 0.22 },
  { id: 'maya',   label: 'Maya',    color: '#8b5cf6', glow: '#8b5cf6', size: 26, x: 0.73, y: 0.22 },
  { id: 'kevin',  label: 'Kevin',   color: '#10b981', glow: '#10b981', size: 22, x: 0.14, y: 0.64 },
  { id: 'fred',   label: 'Fred',    color: '#10b981', glow: '#10b981', size: 22, x: 0.36, y: 0.78 },
  { id: 'billy',  label: 'Billy',   color: '#64748b', glow: '#94a3b8', size: 18, x: 0.62, y: 0.78 },
  { id: 'george', label: 'George',  color: '#64748b', glow: '#94a3b8', size: 18, x: 0.80, y: 0.63 },
  { id: 'darren', label: 'Darren',  color: '#64748b', glow: '#94a3b8', size: 18, x: 0.89, y: 0.36 },
];

const EDGES = [
  { from: 'me',    to: 'priya',  strength: 0.95, color: '#8b5cf6', match: false },
  { from: 'me',    to: 'maya',   strength: 0.90, color: '#8b5cf6', match: false },
  { from: 'me',    to: 'kevin',  strength: 0.85, color: '#F472B6', match: true,  label: '85%' },
  { from: 'me',    to: 'fred',   strength: 0.72, color: '#F472B6', match: true,  label: '72%' },
  { from: 'priya', to: 'kevin',  strength: 0.88, color: '#6366f1', match: false },
  { from: 'priya', to: 'fred',   strength: 0.76, color: '#6366f1', match: false },
  { from: 'priya', to: 'billy',  strength: 0.44, color: '#475569', match: false },
  { from: 'maya',  to: 'billy',  strength: 0.82, color: '#6366f1', match: false },
  { from: 'maya',  to: 'george', strength: 0.67, color: '#6366f1', match: false },
  { from: 'maya',  to: 'darren', strength: 0.71, color: '#6366f1', match: false },
];

// Per-node oscillation parameters (deterministic variety)
const FLOATS = NODES.map((_, i) => ({
  ax: 0.004 + (i % 3) * 0.002,
  ay: 0.003 + (i % 4) * 0.0015,
  px: (i * 1.3) % (Math.PI * 2),
  py: (i * 2.1) % (Math.PI * 2),
  speed: 0.0004 + (i % 5) * 0.00015,
}));

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function nodePos(node, offset, W, H) {
  return {
    x: (node.x + offset.x) * W,
    y: (node.y + offset.y) * H,
  };
}

function drawEdge(ctx, p1, p2, edge, t) {
  const alpha = 0.15 + edge.strength * 0.55;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = edge.color;
  ctx.lineWidth = 1 + edge.strength * (edge.match ? 3.5 : 2);
  ctx.shadowColor = edge.color;
  ctx.shadowBlur = edge.match ? 14 : 6;

  // Dashed for weaker edges
  if (edge.strength < 0.5) ctx.setLineDash([4, 6]);

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label for match edges
  if (edge.label) {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 2 + 1);
    ctx.fillStyle = edge.color;
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 8;
    ctx.fillText(edge.label, mx, my - 8);
  }
  ctx.restore();
}

function drawNode(ctx, node, pos, t, isHovered) {
  const { x, y } = pos;
  const r = node.size + (isHovered ? 4 : 0);

  ctx.save();

  // Pulsing outer ring for current-user node
  if (node.ring) {
    const pulse = 0.3 + 0.25 * Math.sin(t * 2.5);
    ctx.globalAlpha = pulse;
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = node.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x, y, r + 10 + 5 * Math.sin(t * 1.8), 0, Math.PI * 2);
    ctx.stroke();
  }

  // Glow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = node.glow;
  ctx.shadowColor = node.glow;
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.fill();

  // Main circle
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
  grad.addColorStop(0, lighten(node.color, 40));
  grad.addColorStop(1, node.color);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Label
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#f8fafc';
  ctx.font = `${node.ring ? 'bold ' : ''}11px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 6;
  ctx.fillText(node.label, x, y + r + 4);

  ctx.restore();
}

// Very rough hex lighten (demo quality is fine)
function lighten(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrustGraph({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width  = rect.width  * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    function draw() {
      const W = canvas.width  / window.devicePixelRatio;
      const H = canvas.height / window.devicePixelRatio;
      tRef.current += 1;
      const t = tRef.current * 0.012;

      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = '#111116';
      ctx.fillRect(0, 0, W, H);

      // Grid dots
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#94a3b8';
      const spacing = 28;
      for (let gx = spacing; gx < W; gx += spacing)
        for (let gy = spacing; gy < H; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      ctx.globalAlpha = 1;

      // Compute animated positions
      const offsets = FLOATS.map((f) => ({
        x: f.ax * Math.sin(t * f.speed * 80 + f.px),
        y: f.ay * Math.cos(t * f.speed * 80 + f.py),
      }));
      const positions = NODES.map((n, i) => nodePos(n, offsets[i], W, H));
      const nodeMap   = Object.fromEntries(NODES.map((n, i) => [n.id, positions[i]]));

      // Edges
      for (const edge of EDGES) {
        drawEdge(ctx, nodeMap[edge.from], nodeMap[edge.to], edge, t);
      }

      // Nodes
      for (let i = 0; i < NODES.length; i++) {
        drawNode(ctx, NODES[i], positions[i], t, false);
      }

      // Draw vignette last
      ctx.save();
      ctx.globalAlpha = 1;
      const vg = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.75);
      vg.addColorStop(0, 'transparent');
      vg.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`w-full h-full block ${className}`}>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
}
