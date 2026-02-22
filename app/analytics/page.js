'use client';

export const dynamic = 'force-dynamic';

/**
 * WingRU Analytics Command Center
 *
 * Sections:
 *   1. Metric tiles — Social Alignment Index, Friend Alignment Rate, etc.
 *   2. TrustGraph — animated canvas social network
 *   3. AI Insights panel — Gemini-generated behavioral analysis
 *   4. Compatibility timeline — area chart of scores over time
 */

import { useState, useEffect } from 'react';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Brain, Users, Activity, Shield, TrendingUp, Zap } from 'lucide-react';

// Dynamic import: TrustGraph uses canvas + window, must be client-only
const TrustGraph = nextDynamic(() => import('@/components/TrustGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl bg-panel wing-skeleton" style={{ height: 380 }} />
  ),
});

// ─── Recharts area chart (client-only) ────────────────────────────────────────

function CompatibilityTimeline() {
  const [Charts, setCharts] = useState(null);

  useEffect(() => {
    import('recharts').then(setCharts);
  }, []);

  const data = [
    { day: 'Feb 15', score: 0,  kevin: 0,  fred: 0  },
    { day: 'Feb 16', score: 0,  kevin: 0,  fred: 0  },
    { day: 'Feb 17', score: 0,  kevin: 0,  fred: 0  },
    { day: 'Feb 18', score: 0,  kevin: 0,  fred: 0  },
    { day: 'Feb 19', score: 78, kevin: 85, fred: 0  },
    { day: 'Feb 20', score: 83, kevin: 85, fred: 72 },
    { day: 'Feb 21', score: 85, kevin: 85, fred: 72 },
  ];

  if (!Charts) {
    return (
      <div className="h-52 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted2 text-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          analyzing with gemini…
        </div>
      </div>
    );
  }

  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Charts;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gKevin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gFred" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1B1B22" />
        <XAxis dataKey="day" tick={{ fill: '#71717A', fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#71717A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#0E0E11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: '#A1A1AA' }}
          itemStyle={{ color: '#F4F4F5' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#71717A' }} />
        <Area type="monotone" dataKey="kevin" name="Kevin" stroke="#f43f5e" strokeWidth={2} fill="url(#gKevin)" dot={false} />
        <Area type="monotone" dataKey="fred"  name="Fred"  stroke="#8b5cf6" strokeWidth={2} fill="url(#gFred)"  dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    const delay = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(delay);
  }, [target, duration]);

  return <>{val}{suffix}</>;
}

// ─── Metric tile ──────────────────────────────────────────────────────────────

function MetricTile({ icon: Icon, iconColor, iconBg, label, value, suffix, sub, trend }) {
  return (
    <div className="rounded-2xl bg-panel shadow-card border border-stroke hover:border-stroke2 hover:bg-panel2 transition-all p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-text mb-0.5 tabular-nums">
        <AnimatedNumber target={value} suffix={suffix} />
      </div>
      <div className="text-xs font-semibold text-muted mb-1">{label}</div>
      {sub && <div className="text-xs text-muted2 leading-snug">{sub}</div>}
    </div>
  );
}

// ─── AI Insight item ──────────────────────────────────────────────────────────

const INSIGHTS = [
  { icon: Brain,    color: 'text-pink',         text: 'Your social graph shows above-average edge density — indicating strong trust network formation relative to platform baseline.' },
  { icon: Users,    color: 'text-violet-400',   text: 'Friend alignment rate of 94% suggests your delegated wingmen accurately model your stated preferences with high fidelity.' },
  { icon: Activity, color: 'text-emerald-400',  text: 'Compatibility trajectory is trending upward. Both confirmed matches scored in the top 20% for long-term bonding probability.' },
  { icon: Shield,   color: 'text-yellow-400',   text: 'Trust-layer consistency is high. Zero contradictory signals detected across independent swipe patterns.' },
];

function AIInsightsPanel() {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready'

  useEffect(() => {
    const id = setTimeout(() => setPhase('ready'), 1400);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="rounded-2xl bg-panel border border-stroke h-full p-s4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-pink" />
        <span className="text-xs font-semibold text-muted uppercase tracking-widest">
          Gemini AI Insights
        </span>
        <div className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${phase === 'loading' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-pink/10 text-pink'}`}>
          {phase === 'loading' ? 'Analyzing…' : 'Ready'}
        </div>
      </div>

      {phase === 'loading' ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 rounded-full bg-panel2 wing-skeleton" style={{ width: `${60 + i * 8}%` }} />
          ))}
          <div className="flex items-center gap-2 mt-4 text-muted2 text-xs">
            <Zap className="w-3 h-3 animate-pulse" />
            Connecting to Gemini 1.5 Flash…
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {INSIGHTS.map(({ icon: Icon, color, text }, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-sm text-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Graph legend ─────────────────────────────────────────────────────────────

const LEGEND = [
  { color: '#F472B6', label: 'You' },
  { color: '#8b5cf6', label: 'Friends (wingmen)' },
  { color: '#10b981', label: 'Confirmed matches' },
  { color: '#64748b', label: 'Swiped profiles' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-bg text-text">

      {/* Header */}
      <div className="border-b border-stroke bg-bg/80 backdrop-blur-sm sticky top-0 z-10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="text-muted hover:text-text hover:bg-panel2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-text">Analytics</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-xs text-muted2">Powered by Gemini AI · Live</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 wing-glass rounded-full px-s3 py-s1 border border-stroke">
            <Sparkles className="w-3 h-3 text-pink" />
            <span className="text-xs text-muted font-medium">WingRU Intelligence v2.0</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Metric tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTile
            icon={Activity}
            iconColor="text-pink"
            iconBg="bg-pink/10"
            label="Social Alignment Index"
            value={87}
            sub="Above platform baseline by 23 pts"
            trend="+5 pts"
          />
          <MetricTile
            icon={Users}
            iconColor="text-violet-400"
            iconBg="bg-violet-500/10"
            label="Friend Alignment Rate"
            value={94}
            suffix="%"
            sub="Priya's picks match your preferences"
            trend="+2%"
          />
          <MetricTile
            icon={Brain}
            iconColor="text-yellow-400"
            iconBg="bg-yellow-500/10"
            label="Selectivity Score"
            value={62}
            sub="Moderate — quality over volume profile"
          />
          <MetricTile
            icon={Shield}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10"
            label="Trust Consistency"
            value={91}
            sub="High cross-pattern signal coherence"
            trend="+3 pts"
          />
        </div>

        {/* TrustGraph + AI Insights */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* TrustGraph */}
          <div className="lg:col-span-3 bg-panel border border-stroke rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-text">Social Trust Graph</h2>
                <p className="text-xs text-muted2 mt-0.5">Edge weight = compatibility strength</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-semibold">Live</span>
              </div>
            </div>

            <div className="relative rounded-3xl bg-panel border border-stroke shadow-card overflow-hidden">
              <TrustGraph className="h-80 sm:h-96" />
              <div className="absolute top-s3 left-s3 wing-glass rounded-2xl px-s3 py-s2 text-xs text-muted border border-stroke">
                Social Trust Graph
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4">
              {LEGEND.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted2">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-2">
            <AIInsightsPanel />
          </div>
        </div>

        {/* Compatibility Timeline */}
        <div className="rounded-2xl bg-panel border border-stroke p-s4">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-text">Compatibility Score Timeline</h2>
            <p className="text-xs text-muted2 mt-0.5">Gemini-scored compatibility as matches progressed</p>
          </div>
          <CompatibilityTimeline />
        </div>

        {/* System status */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Gemini API',            status: 'Mock mode',   color: 'text-yellow-400', dot: 'bg-yellow-400' },
            { label: 'TrustGraph engine',      status: 'Operational', color: 'text-emerald-400', dot: 'bg-emerald-400' },
            { label: 'Compatibility scoring',  status: 'Operational', color: 'text-emerald-400', dot: 'bg-emerald-400' },
          ].map(({ label, status, color, dot }) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-panel border border-stroke px-s3 py-s2">
              <span className="text-xs text-muted">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
                <span className={`text-xs font-semibold ${color}`}>{status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
