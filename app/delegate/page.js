'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Key } from 'lucide-react';
import Link from 'next/link';

const FAKE_FRIENDS = {
  HACKHERS26: {
    id: 'fake-friend-1',
    name: 'Priya Patel',
    netid: 'pp123',
    age: 20,
    year: 'Sophomore',
    major: 'Computer Science',
    personality_answer: 'Night owl 🦉',
    photo: '/friend1.jpg',
  },
  RUTGERSWICS: {
    id: 'fake-friend-2',
    name: 'Maya Chen',
    netid: 'mc456',
    age: 21,
    year: 'Junior',
    major: 'Information Technology',
    personality_answer: 'Ambivert ⚖️',
    photo: '/friend2.jpg',
  },
};

export default function DelegatePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  function handleRedeem(e) {
    e.preventDefault();
    setError('');
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);

    const friend = FAKE_FRIENDS[trimmed];
    if (!friend) {
      setError('Invalid invite code. Please check and try again.');
      setLoading(false);
      return;
    }

    // Save to localStorage (per-user key)
    try {
      const u = JSON.parse(localStorage.getItem('wingru_current_user') || '{}');
      const netid = u.netid || 'default';
      const existing = JSON.parse(localStorage.getItem(`wingru_delegations_${netid}`) || '[]');
      const alreadyAdded = existing.some((f) => f.id === friend.id);
      if (!alreadyAdded) {
        existing.push(friend);
        localStorage.setItem(`wingru_delegations_${netid}`, JSON.stringify(existing));
      }
    } catch {}

    setSuccess(friend);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen wing-bg flex flex-col items-center justify-center px-s4">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="flex justify-center mb-s5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stroke">
              <img src={success.photo} alt={success.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-text text-center mb-s2">You&apos;re in!</h1>
          <p className="text-base text-muted text-center">You&apos;re now swiping for</p>
          <p className="text-2xl font-semibold text-pink mb-s4">{success.name}</p>
          <p className="text-base text-muted text-center mb-s5">
            Go to the feed and select their name to start finding them a match.
          </p>
          <Button size="lg" onClick={() => router.push('/feed')}>
            Go to feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen wing-bg flex flex-col">
      <div className="p-6">
        <Link href="/feed" className="text-sm text-muted hover:text-text flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-s4 -mt-16">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="flex justify-center mb-s5">
            <div className="w-14 h-14 rounded-2xl bg-accent shadow-glow flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-text text-center mb-s2">
            Enter delegate access code
          </h1>
          <p className="text-base text-muted text-center mb-s5">
            Got a code from a friend? Enter it here to become their wingman.
          </p>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-muted2 mb-s1 block">
                Delegate access code
              </Label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="HACKHERS26"
                maxLength={12}
                className="w-full rounded-2xl bg-panel border border-stroke px-s4 py-s3 text-text placeholder:text-muted2 shadow-ring focus:outline-none focus:wing-focus h-12 text-center text-xl font-mono tracking-widest"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-s3 py-s2">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading || code.trim().length < 6}>
              {loading ? 'Activating...' : 'Activate delegation'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
