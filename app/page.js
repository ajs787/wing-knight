'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Network, BarChart3, ArrowRight, Shield, Zap, Brain } from 'lucide-react';

// ─── Subtle animated grid background ─────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)' }}
      />
      <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
      />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-text mb-0.5">{value}</div>
      <div className="text-xs text-muted2 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, iconBg, iconColor, title, description, tag }) {
  return (
    <div className="relative group rounded-2xl bg-panel shadow-card border border-stroke p-7 transition-all duration-300 hover:bg-panel2 hover:shadow-lift"
      style={{ backdropFilter: 'blur(12px)' }}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {tag && (
        <span className="text-xs font-semibold text-muted2 uppercase tracking-widest mb-3 block">{tag}</span>
      )}
      <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen wing-bg flex flex-col text-text">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-stroke bg-bg/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text">WingRU</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/analytics" className="text-sm text-muted hover:text-text transition-colors hidden sm:block">
            Analytics
          </Link>
          <Link href="/login">
            <Button size="sm" variant="outline" className="font-semibold">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden min-h-[80vh]">
        <GridBackground />

        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
            AI Compatibility Engine · Beta
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-text leading-[1.05] mb-6">
            Love, Curated by
            <br />
            <span className="text-text">
              Intelligence.
            </span>
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Using behavioral modeling and trust-layer validation to create
            high-confidence social matches — powered by Gemini AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 border-0 shadow-lg shadow-rose-500/25 text-white font-semibold px-8">
                Launch App <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button size="lg" variant="outline" className="gap-2 border-stroke2 text-muted hover:text-text hover:border-stroke2 bg-transparent">
                View Analytics <BarChart3 className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10 sm:gap-16 border-t border-stroke pt-10">
            <Stat value="94%" label="Match Accuracy" />
            <div className="w-px h-8 bg-white/8" />
            <Stat value="3 layers" label="Trust Validation" />
            <div className="w-px h-8 bg-white/8" />
            <Stat value="Gemini" label="AI Backend" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-stroke">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">Platform Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text">
              Trust-Validated Social Matching.
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              WingRU is an AI-powered compatibility graph engine.
              Every match is validated across three independent trust layers before surfacing.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <FeatureCard
              icon={Brain}
              iconBg="bg-rose-500/10"
              iconColor="text-rose-400"
              tag="Core capability"
              title="AI Compatibility Scoring"
              description="Multi-dimensional analysis across cognitive alignment, social energy, and value congruence — driven by Gemini AI reasoning models."
            />
            <FeatureCard
              icon={Network}
              iconBg="bg-violet-500/10"
              iconColor="text-violet-400"
              tag="Visualization"
              title="TrustGraph Engine"
              description="Real-time social graph mapping trust relationships and compatibility strengths across your network with edge-weighted force simulation."
            />
            <FeatureCard
              icon={BarChart3}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-400"
              tag="Intelligence layer"
              title="Behavioral Analytics"
              description="Social Alignment Index, Friend Alignment Rate, and Selectivity Score — derived from swipe patterns to surface deeper compatibility signals."
            />
          </div>
        </div>
      </section>

      {/* Trust capabilities strip */}
      <section className="py-14 px-6 border-t border-stroke">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Trust-layer verified',  desc: 'Friend validation reduces false positives by 3.2×.' },
              { icon: Zap,      color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  label: 'Sub-second analysis',   desc: 'Gemini 1.5 Flash delivers compatibility scores in under 800ms.' },
              { icon: Sparkles, color: 'text-rose-400',    bg: 'bg-rose-500/10',    label: 'NetID-gated network',   desc: 'Verified institutional identity — one account per Rutgers NetID.' },
            ].map(({ icon: Icon, color, bg, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{label}</p>
                  <p className="text-xs text-muted2 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-stroke px-6 bg-bg/40">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-muted2">WingRU</span>
          </div>
          <p className="text-xs text-muted2">
            AI-Powered Compatibility Engine · Est. 2026 · Rutgers University
          </p>
          <Link href="/login" className="text-xs text-muted2 hover:text-text transition-colors">
            Sign in →
          </Link>
        </div>
      </footer>
    </div>
  );
}
