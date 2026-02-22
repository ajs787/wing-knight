'use client';

/**
 * CompatibilityModal — Full AI breakdown when a match card is clicked.
 *
 * Shows:
 *   - Radar chart (Recharts) across 5 dimensions
 *   - Gemini AI explanation text
 *   - "Why WingRU Approved This Match" trust layer
 *   - Animated score reveal on open
 */

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Sparkles, Shield, Brain, Zap, Heart } from 'lucide-react';

// Recharts loaded only client-side (avoids SSR window errors)
let RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip;

function ChartSection({ data }) {
  const [loaded, setLoaded] = useState(false);
  const [Charts, setCharts] = useState(null);

  useEffect(() => {
    import('recharts').then((m) => {
      setCharts(m);
      setLoaded(true);
    });
  }, []);

  if (!loaded || !Charts) {
    return (
      <div className="h-52 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full border-2 border-dashed border-stroke2 wing-skeleton" />
      </div>
    );
  }

  const {
    RadarChart: RC,
    Radar: RR,
    PolarGrid: PG,
    PolarAngleAxis: PAA,
    ResponsiveContainer: RespC,
  } = Charts;

  return (
    <RespC width="100%" height={220}>
      <RC data={data} cx="50%" cy="50%" outerRadius="72%">
        <PG stroke="#1B1B22" strokeDasharray="3 3" />
        <PAA
          dataKey="subject"
          tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'Inter, system-ui' }}
        />
        <RR
          dataKey="score"
          stroke="#F472B6"
          fill="#F472B6"
          fillOpacity={0.18}
          strokeWidth={2}
        />
      </RC>
    </RespC>
  );
}

// ─── Animated score counter ───────────────────────────────────────────────────

function AnimatedScore({ target, duration = 1000 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3); // ease-out cubic
      setDisplay(Math.round(ease * target));
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span>{display}</span>;
}

// ─── Sub-score bar ────────────────────────────────────────────────────────────

function SubScoreBar({ label, value, icon: Icon, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-xs font-medium text-muted">{label}</span>
        </div>
        <span className={`text-xs font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-panel2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: color.includes('rose')
              ? 'linear-gradient(90deg, #f43f5e, #ec4899)'
              : color.includes('violet')
              ? 'linear-gradient(90deg, #8b5cf6, #6366f1)'
              : 'linear-gradient(90deg, #10b981, #06b6d4)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CompatibilityModal({ match, analysis, trigger }) {
  const [open, setOpen] = useState(false);

  if (!analysis) return trigger;

  const radarData = [
    { subject: 'Cognitive',    score: analysis.cognitive },
    { subject: 'Social',       score: analysis.social    },
    { subject: 'Values',       score: analysis.values    },
    { subject: 'Energy',       score: Math.min(analysis.cognitive + 4, 99) },
    { subject: 'Trust',        score: Math.min(analysis.values + 2, 99)    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        <Dialog.Content
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto
            bg-panel border border-stroke2 rounded-3xl shadow-lift
            data-[state=open]:animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="px-s4 pt-s4 pb-s3 border-b border-stroke">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-pink" />
                  <span className="text-xs font-semibold text-pink uppercase tracking-widest">
                    Gemini AI Analysis
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-text">
                  {match.name} &amp; You
                </h2>
                <p className="text-sm text-muted">Compatibility deep-dive</p>
              </div>
              <Dialog.Close asChild>
                <button className="w-8 h-8 rounded-xl bg-panel2 border border-stroke flex items-center justify-center hover:bg-panel hover:border-stroke2 transition-all">
                  <X className="w-4 h-4 text-muted" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Overall score */}
          <div className="px-s4 py-s4 border-b border-stroke flex items-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-black text-pink wing-textglow leading-none tabular-nums">
                <AnimatedScore target={analysis.overall} />
                <span className="text-3xl">%</span>
              </div>
              <div className="text-xs text-muted2 mt-1 font-medium uppercase tracking-widest">
                Overall
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <SubScoreBar label="Cognitive Alignment" value={analysis.cognitive} icon={Brain}  color="text-rose-400" />
              <SubScoreBar label="Social Energy"        value={analysis.social}    icon={Zap}    color="text-violet-400" />
              <SubScoreBar label="Value Alignment"      value={analysis.values}    icon={Heart}  color="text-emerald-400" />
            </div>
          </div>

          {/* Radar chart */}
          <div className="px-s4 py-s3 border-b border-stroke">
            <p className="text-xs font-semibold text-muted2 uppercase tracking-widest mb-3">
              Dimensional Profile
            </p>
            <ChartSection data={radarData} />
          </div>

          {/* AI explanation */}
          <div className="px-s4 py-s3 border-b border-stroke">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink" />
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">
                AI Reasoning
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed">{analysis.explanation}</p>
          </div>

          {/* Trust layer */}
          <div className="px-s4 py-s4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">
                trust layer validation
              </p>
            </div>
            <div className="rounded-2xl bg-bg border border-stroke px-s3 py-s3">
              <p className="text-sm text-emerald-400/90 leading-relaxed">
                {analysis.trustLayer}
              </p>
            </div>
            <p className="text-xs text-muted2 mt-s2 text-center">
              Analysis powered by Gemini AI · WingRU v2.0
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
