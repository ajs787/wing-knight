'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Plus, Heart, ChevronRight, UserCircle, Sparkles, BarChart2 } from 'lucide-react';

function getCurrentNetid() {
  try {
    const u = JSON.parse(localStorage.getItem('wingru_current_user') || '{}');
    return u.netid || 'default';
  } catch { return 'default'; }
}

export default function FeedPage() {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAjs, setIsAjs] = useState(false);

  useEffect(() => {
    try {
      const netid = getCurrentNetid();
      setIsAjs(netid === 'ajs787');
      const delegations = JSON.parse(localStorage.getItem(`wingru_delegations_${netid}`) || '[]');
      setFriends(delegations);
      const profile = JSON.parse(localStorage.getItem(`wingru_profile_${netid}`) || 'null');
      setMyProfile(profile);
    } catch {}
    setLoading(false);
  }, []);

  function handleSignOut() {
    localStorage.removeItem('wingru_current_user');
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/');
    });
  }

  return (
    <div className="min-h-screen wing-bg">
      {/* Header */}
      <div className="border-b border-stroke px-s4 py-s4 bg-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-text">WingRu</span>
          <div className="flex items-center gap-1">
            <Link href="/analytics">
              <Button variant="ghost" size="icon" title="Analytics">
                <BarChart2 className="w-5 h-5 text-muted" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" title="Edit profile">
                <UserCircle className="w-5 h-5 text-muted" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted">
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-s4 py-s6 animate-fade-in">
        {/* Greeting */}
        {myProfile?.name && (
          <div className="mb-s6">
            <h1 className="text-2xl font-bold text-text">Hey, {myProfile.name} 👋</h1>
            <p className="text-muted mt-1">Who are you swiping for today?</p>
          </div>
        )}

        {/* Validated Connections — ajs787 only */}
        {isAjs && (
        <section className="mb-s6">
          <div className="flex items-center gap-2 mb-s3">
            <Sparkles className="w-4 h-4 text-pink" />
            <h2 className="text-xs font-semibold text-muted2 uppercase tracking-widest">Validated Connections</h2>
          </div>
          <Link href="/matches">
            <div className="rounded-2xl bg-panel shadow-card border border-stroke hover:bg-panel2 hover:shadow-lift transition-all duration-300 cursor-pointer p-s3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-panel shadow-sm">
                    <img src="/kevin1.jpg" alt="Kevin" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-panel shadow-sm">
                    <img src="/fred1.jpg" alt="Fred" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-text">2 new matches</p>
                  <p className="text-xs text-muted">Kevin and Fred liked you back</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted2 group-hover:text-pink transition-colors" />
            </div>
          </Link>
        </section>
        )}

        {/* Curate with intelligence */}
        <section className="mb-s6">
          <div className="flex items-center gap-2 mb-s3">
            <Users className="w-4 h-4 text-pink" />
            <h2 className="text-xs font-semibold text-muted2 uppercase tracking-widest">Curate with intelligence</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-panel animate-pulse" />
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-s8 rounded-2xl bg-panel border border-dashed border-stroke">
              <Heart className="w-8 h-8 text-pink/30 mx-auto mb-3" />
              <p className="text-muted font-medium">no delegated feeds yet.</p>
              <p className="text-muted2 text-sm mt-1 mb-s3">Request a delegate access code to begin curating.</p>
              <Link href="/delegate">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> enter a code
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => router.push(`/feed/${friend.id}`)}
                  className="w-full flex items-center justify-between rounded-2xl bg-panel shadow-card border border-stroke hover:bg-panel2 hover:shadow-lift transition-all duration-300 p-s3 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 flex-shrink-0">
                      {friend.photo ? (
                        <img src={friend.photo} alt={friend.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {friend.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-text">{friend.name}</p>
                      <p className="text-xs text-muted">
                        {friend.year} · {friend.major}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted2 group-hover:text-pink transition-colors" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* CTA to enter code */}
        <Link href="/delegate">
          <Button variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Enter a delegate access code
          </Button>
        </Link>
      </div>
    </div>
  );
}
