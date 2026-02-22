'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

// Pre-saved profiles — loaded automatically on first login for these accounts
const PRESET_PROFILES = {
  'ajs787': {
    name: 'Audrey Shin',
    age: 21,
    year: 'Junior',
    major: 'Computer Science',
    gender: 'Woman',
    looking_for: 'Men',
    personality_answer: 'Night owl 🦉',
    prompts: [
      { prompt: "My go-to stress reliever...", answer: "matcha and sad playlists" },
      { prompt: "We'll get along if...", answer: "you have strong opinions on where to eat" },
    ],
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg || 'Login failed');
        return;
      }

      const netid = trimmed.split('@')[0];

      // Store current user so other pages can namespace their localStorage
      localStorage.setItem('wingru_current_user', JSON.stringify({ email: trimmed, netid }));

      const profileKey = `wingru_profile_${netid}`;
      const existing = localStorage.getItem(profileKey);

      if (!existing && PRESET_PROFILES[netid]) {
        // First login for a preset account — populate the profile silently
        localStorage.setItem(profileKey, JSON.stringify(PRESET_PROFILES[netid]));
        router.push('/feed');
      } else if (existing) {
        const p = JSON.parse(existing);
        // If they have a name, profile is complete — go to feed; else finish onboarding
        router.push(p.name ? '/feed' : '/onboarding');
      } else {
        // Brand new user — clean slate onboarding
        router.push('/onboarding');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen wing-bg flex flex-col items-center justify-center px-s4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-s5">
          <div className="w-14 h-14 rounded-2xl bg-accent shadow-glow flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-text text-center mb-s2">
          Sign in to WingRu
        </h1>
        <p className="text-base text-muted text-center mb-s5">
          Enter any email to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted2 mb-s1 block">
              Email
            </Label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full rounded-2xl bg-panel border border-stroke px-s4 py-s3 text-text placeholder:text-muted2 shadow-ring focus:outline-none focus:wing-focus h-12"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-s3 py-s2">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading || !email}>
            {loading ? 'Signing in...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
