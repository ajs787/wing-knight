'use client';

export const dynamic = 'force-dynamic';

/**
 * My Matches — AI-enhanced match cards with Gemini compatibility analysis.
 *
 * On mount: triggers generateCompatibilityAnalysis for each match (800ms mock delay).
 * Each card shows:
 *   - Overall score with animated counter
 *   - Sub-score bars (cognitive, social, values)
 *   - "View Full Analysis" → opens CompatibilityModal (radar chart + trust layer)
 *   - Why AI Wingman Approved (expandable trust reasoning)
 *   - Friend note + photo
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft, Heart, Sparkles, MessageCircle,
  ChevronDown, ChevronUp, Brain, Zap, Shield, BarChart2,
} from 'lucide-react';
import { generateCompatibilityAnalysis } from '@/lib/gemini';
import CompatibilityModal from '@/components/CompatibilityModal';

// ─── Match data ───────────────────────────────────────────────────────────────

const MY_PROFILE = {
  name: 'Audrey',
  major: 'Computer Science',
  personality_answer: 'Night owl 🦉',
};

const MY_MATCHES = [
  {
    id: 'match-kevin',
    name: 'Kevin',
    age: 21,
    year: 'Junior',
    major: 'Finance',
    personality_answer: 'Extrovert 🎉',
    photos: ['/kevin1.jpg', '/kevin2.jpg'],
    tag: 'Funny 😂',
    matchedDate: 'Feb 20',
    matchedBy: { name: 'Priya', photo: '/friend1.jpg' },
    friendNote: 'I literally thought of you the second I saw him. Same vibe, same humor. I feel like you two would never run out of things to talk about.',
    prompts: [
      { q: "The way to my heart is...", a: "good food, bad movies, and decent company" },
      { q: "I'm secretly really good at...", a: "parallel parking on the first try" },
    ],
  },
  {
    id: 'match-fred',
    name: 'Fred',
    age: 22,
    year: 'Senior',
    major: 'Communications',
    personality_answer: 'Ambivert ⚖️',
    photos: ['/fred1.jpg', '/fred2.jpg'],
    tag: 'Green flag 💚',
    matchedDate: 'Feb 21',
    matchedBy: { name: 'Priya', photo: '/friend1.jpg' },
    friendNote: "He's lowkey really sweet and super easy to talk to. I think you'd like him a lot after like five minutes of conversation.",
    prompts: [
      { q: "We'll get along if...", a: "you're down for late-night Insomnia runs" },
      { q: "My go-to stress reliever...", a: "long drives with no destination" },
    ],
  },
];

// ─── Animated score counter ───────────────────────────────────────────────────

function AnimatedScore({ target, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{display}</span>;
}

// ─── Sub-score bar ────────────────────────────────────────────────────────────

function SubBar({ label, value, icon: Icon, gradFrom, gradTo }) {
  const [w, setW] = useState(0);
  useEffect(() => { const id = setTimeout(() => setW(value), 200); return () => clearTimeout(id); }, [value]);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-muted" />
          <span className="text-xs text-muted">{label}</span>
        </div>
        <span className="text-xs font-bold text-text">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-panel2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${w}%`, background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})` }}
        />
      </div>
    </div>
  );
}

// ─── Match card ───────────────────────────────────────────────────────────────

function MatchCard({ match }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promptsOpen, setPromptsOpen] = useState(false);

  useEffect(() => {
    generateCompatibilityAnalysis(MY_PROFILE, match).then((result) => {
      setAnalysis(result);
      setLoading(false);
    });
  }, [match]);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-stroke bg-panel">

      {/* Main photo + name */}
      <div className="relative aspect-[3/4]">
        <img src={match.photos[0]} alt={match.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-4 right-4">
          <div className="bg-bg/80 backdrop-blur-sm rounded-full px-s3 py-s1 flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-pink fill-pink" />
            <span className="text-xs font-semibold text-text">{match.matchedDate}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-text text-2xl font-semibold">{match.name}, {match.age}</h3>
          <p className="text-muted text-sm mt-0.5">{match.year} · {match.major}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-white/15 text-text/80 border-transparent">{match.personality_answer}</Badge>
            {match.tag && <Badge variant="secondary" className="text-xs bg-white/15 text-text/80 border-transparent">{match.tag}</Badge>}
          </div>
        </div>
      </div>

      {/* AI Compatibility panel */}
      <div className="bg-bg px-s4 py-s4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-pink" />
          <span className="text-xs font-semibold text-muted2 uppercase tracking-widest">Gemini AI Analysis</span>
          {!loading && (
            <span className="ml-auto bg-pink/10 text-pink rounded-full text-xs font-semibold px-s2 py-0.5">
              Complete
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted2 text-sm">
              <Zap className="w-3.5 h-3.5 animate-pulse text-yellow-500" />
              analyzing with gemini…
            </div>
            <div className="h-1.5 rounded-full bg-panel2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full wing-skeleton" style={{ width: '60%' }} />
            </div>
            <div className="h-12 bg-panel rounded-xl wing-skeleton" />
          </div>
        ) : (
          <>
            {/* Score + sub-bars */}
            <div className="flex items-center gap-5 mb-4">
              <div className="text-center flex-shrink-0">
                <div className="text-5xl font-black text-pink wing-textglow leading-none tabular-nums">
                  <AnimatedScore target={analysis.overall} />
                  <span className="text-2xl">%</span>
                </div>
                <div className="text-xs text-muted2 mt-0.5 uppercase tracking-widest">Match</div>
              </div>
              <div className="flex-1 space-y-2.5">
                <SubBar label="Cognitive"  value={analysis.cognitive} icon={Brain}  gradFrom="#f43f5e" gradTo="#ec4899" />
                <SubBar label="Social"     value={analysis.social}    icon={Zap}    gradFrom="#8b5cf6" gradTo="#6366f1" />
                <SubBar label="Values"     value={analysis.values}    icon={Shield} gradFrom="#10b981" gradTo="#06b6d4" />
              </div>
            </div>

            {/* AI reasoning */}
            <p className="text-sm text-muted leading-relaxed mb-4">{analysis.explanation}</p>

            {/* View full analysis button */}
            <CompatibilityModal
              match={match}
              analysis={analysis}
              trigger={
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-stroke text-muted text-xs font-semibold hover:border-pink/40 hover:text-pink hover:bg-pink/5 transition-all">
                  <BarChart2 className="w-3.5 h-3.5" />
                  View Full Analysis
                </button>
              }
            />
          </>
        )}
      </div>

      {/* Trust layer / Why AI approved */}
      {analysis && (
        <div className="bg-bg px-s4 py-s3 border-t border-stroke">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-muted2 uppercase tracking-widest">trust layer validation</span>
          </div>
          <p className="text-xs text-emerald-300/80 mt-2 leading-relaxed">{analysis.trustLayer}</p>
        </div>
      )}

      {/* Friend note */}
      <div className="px-s4 py-s3 border-t border-stroke">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <img src={match.matchedBy.photo} alt={match.matchedBy.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-semibold text-muted">{match.matchedBy.name} says:</span>
        </div>
        <p className="text-sm text-text italic leading-relaxed">&ldquo;{match.friendNote}&rdquo;</p>
      </div>

      {/* Expandable prompts */}
      <button
        onClick={() => setPromptsOpen((v) => !v)}
        className="w-full px-s4 py-3 flex items-center justify-between text-xs font-semibold text-muted hover:text-text transition-colors border-t border-stroke"
      >
        <span>See {match.name}&apos;s prompts</span>
        {promptsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {promptsOpen && (
        <div className="px-s4 pb-4 space-y-3 border-t border-stroke pt-3">
          {match.prompts.map((p, i) => (
            <div key={i} className="rounded-xl bg-panel2 px-4 py-3">
              <p className="text-pink text-xs font-semibold uppercase tracking-wide mb-1">{p.q}</p>
              <p className="text-muted text-sm leading-snug">{p.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="px-s4 py-4 border-t border-stroke">
        <button
          type="button"
          className="w-full py-3 rounded-2xl bg-accent text-bg text-sm font-semibold flex items-center justify-center gap-2 shadow-glow hover:shadow-glowStrong transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Say hey to {match.name}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyMatchesPage() {
  return (
    <div className="min-h-screen wing-bg">
      <div className="border-b border-stroke px-s4 py-s4 sticky top-0 bg-bg/80 backdrop-blur-sm z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/feed">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-text">Validated Connections</h1>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-pink" />
                <p className="text-xs text-muted2">AI-curated by WingRU</p>
              </div>
            </div>
          </div>
          <Link href="/analytics">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BarChart2 className="w-3.5 h-3.5" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6 animate-fade-in">
        <p className="text-sm text-muted2">
          {MY_MATCHES.length} validated connection{MY_MATCHES.length !== 1 ? 's' : ''} · Gemini AI scoring active
        </p>
        {MY_MATCHES.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
