'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ArrowLeft, X, Heart, Tag, MessageCircle } from 'lucide-react';

const TAGS = ['Green flag 💚', 'Funny 😂', 'Sus 🤨', 'Cute 🥺', 'Smart 🧠', 'No reason needed ✨'];

const CANDIDATES_BY_FRIEND = {
  'fake-friend-1': [
    {
      id: 'cand-kevin',
      name: 'Kevin',
      age: 21,
      year: 'Junior',
      major: 'Finance',
      personality_answer: 'Extrovert 🎉',
      photos: ['/kevin1.jpg', '/kevin2.jpg'],
      prompts: [
        { q: "The way to my heart is...", a: "good food, bad movies, and decent company" },
        { q: "I'm secretly really good at...", a: "parallel parking on the first try" },
      ],
    },
    {
      id: 'cand-fred',
      name: 'Fred',
      age: 22,
      year: 'Senior',
      major: 'Communications',
      personality_answer: 'Ambivert ⚖️',
      photos: ['/fred1.jpg', '/fred2.jpg'],
      prompts: [
        { q: "We'll get along if...", a: "you're down for late-night Insomnia runs" },
        { q: "My go-to stress reliever...", a: "long drives with no destination" },
      ],
    },
    {
      id: 'cand-pedro',
      name: 'Pedro',
      age: 20,
      year: 'Sophomore',
      major: 'Business Administration',
      personality_answer: 'Night owl 🦉',
      photos: ['/pedro1.jpg', '/pedro2.jpg'],
      prompts: [
        { q: "My most controversial opinion...", a: "cereal before milk is actually fine" },
        { q: "The way to my heart is...", a: "surprising me with food I didn't ask for" },
      ],
    },
  ],
  'fake-friend-2': [
    {
      id: 'cand-billy',
      name: 'Billy',
      age: 21,
      year: 'Junior',
      major: 'Kinesiology',
      personality_answer: 'Early bird 🌅',
      photos: ['/billy1.jpg', '/billy2.jpg'],
      prompts: [
        { q: "We'll get along if...", a: "you enjoy doing absolutely nothing together" },
        { q: "I'm secretly really good at...", a: "remembering random facts about everything" },
      ],
    },
    {
      id: 'cand-george',
      name: 'George',
      age: 22,
      year: 'Senior',
      major: 'Political Science',
      personality_answer: 'Introvert 🏡',
      photos: ['/george1.jpg', '/george2.jpg'],
      prompts: [
        { q: "My go-to stress reliever...", a: "cooking something I've never made before" },
        { q: "My most controversial opinion...", a: "naps are criminally underrated in college" },
      ],
    },
    {
      id: 'cand-darren',
      name: 'Darren',
      age: 21,
      year: 'Junior',
      major: 'Computer Science',
      personality_answer: 'Night owl 🦉',
      photos: ['/darren1.jpg', '/darren2.jpg'],
      prompts: [
        { q: "The way to my heart is...", a: "a good playlist and zero drama" },
        { q: "We'll get along if...", a: "you don't take yourself too seriously" },
      ],
    },
  ],
};

function ProfileCard({ candidate, onPass, onLike }) {
  const [showTags, setShowTags] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [swipeDir, setSwipeDir] = useState(null); // 'like' | 'pass' | null
  const [showPassNote, setShowPassNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  function handlePassPress() {
    setSwipeDir('pass');
    setTimeout(() => {
      setSwipeDir(null);
      setShowPassNote(true);
    }, 500);
  }

  function handleLikePress() {
    setSwipeDir('like');
    setTimeout(() => {
      setSwipeDir(null);
      setShowTags(true);
    }, 500);
  }

  function confirmLike() {
    setShowTags(false);
    onLike(selectedTag, noteText);
    setSelectedTag('');
    setNoteText('');
  }

  function confirmPass() {
    setShowPassNote(false);
    onPass(noteText);
    setNoteText('');
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Inline keyframe — always in scope regardless of CSS load order */}
      <style>{`
        @keyframes stampPop {
          0%   { opacity: 0; transform: scale(0.35); }
          60%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Full-card stamp overlay */}
      {swipeDir && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none rounded-3xl"
          style={{ animation: 'stampPop 0.35s ease-out both' }}
        >
          <div
            style={{ transform: `rotate(${swipeDir === 'like' ? '-12deg' : '12deg'})` }}
            className={`rounded-2xl px-8 py-4 flex items-center gap-3 border-[5px] ${
              swipeDir === 'like' ? 'border-green-400' : 'border-red-400'
            }`}
          >
            {swipeDir === 'like' ? (
              <>
                <Heart className="w-10 h-10 text-green-400 fill-green-400" />
                <span className="text-green-400 text-4xl font-black italic tracking-widest">LIKE</span>
              </>
            ) : (
              <>
                <X className="w-10 h-10 text-red-400" strokeWidth={3} />
                <span className="text-red-400 text-4xl font-black italic tracking-widest">NOPE</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scrollable card content */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {/* Photo 1 + name overlay */}
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card">
          <img
            src={candidate.photos[0]}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white text-2xl font-bold">
              {candidate.name}, {candidate.age}
            </h3>
            <p className="text-white/80 text-sm mt-0.5">
              {candidate.year} · {candidate.major}
            </p>
            <Badge variant="secondary" className="mt-2 text-xs bg-white/20 text-white border-transparent">
              {candidate.personality_answer}
            </Badge>
          </div>
        </div>

        {/* Prompt 1 */}
        <div className="rounded-2xl bg-panel border border-stroke px-s4 py-s3">
          <p className="text-pink text-xs font-semibold uppercase tracking-wide mb-1">
            {candidate.prompts[0].q}
          </p>
          <p className="text-text text-base leading-snug">{candidate.prompts[0].a}</p>
        </div>

        {/* Photo 2 */}
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card">
          <img
            src={candidate.photos[1]}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Prompt 2 */}
        <div className="rounded-2xl bg-panel border border-stroke px-s4 py-s3">
          <p className="text-pink text-xs font-semibold uppercase tracking-wide mb-1">
            {candidate.prompts[1].q}
          </p>
          <p className="text-text text-base leading-snug">{candidate.prompts[1].a}</p>
        </div>
      </div>

      {/* Tag picker (shown when heart pressed) */}
      {showTags && (
        <div className="rounded-2xl bg-panel border border-stroke p-s3 shadow-card mt-s3">
          <p className="text-muted text-sm mb-3 font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" /> Add a tag (optional)
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t === selectedTag ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedTag === t
                    ? 'bg-pink/15 text-pink border-pink/30'
                    : 'border-stroke text-muted hover:border-stroke2'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note for your friend… (optional)"
            maxLength={200}
            rows={2}
            className="w-full rounded-2xl bg-panel2 border border-stroke px-s3 py-s2 text-text text-sm placeholder:text-muted2 resize-none focus:outline-none mb-3"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowTags(false)}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1 gap-2" onClick={confirmLike}>
              <Heart className="w-4 h-4" />
              Like{selectedTag ? ` — ${selectedTag}` : ''}
            </Button>
          </div>
        </div>
      )}

      {/* Pass note panel */}
      {showPassNote && (
        <div className="rounded-2xl bg-panel border border-stroke p-s3 shadow-card mt-s3">
          <p className="text-muted text-sm mb-3 font-medium flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Why pass? (optional note for {candidate.name.split(' ')[0]}&apos;s friend)
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={`What didn't feel right about ${candidate.name}?`}
            maxLength={200}
            rows={2}
            className="w-full rounded-2xl bg-panel2 border border-stroke px-s3 py-s2 text-text text-sm placeholder:text-muted2 resize-none focus:outline-none mb-3"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={confirmPass}>
              Skip
            </Button>
            <Button variant="soft" size="sm" className="flex-1 gap-2" onClick={confirmPass}>
              <X className="w-4 h-4" />
              Pass{noteText.trim() ? ' — noted' : ''}
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!showTags && !showPassNote && (
        <div className="flex items-center justify-center gap-6 mt-4 pb-2">
          <button
            onClick={handlePassPress}
            disabled={!!swipeDir}
            className="w-16 h-16 rounded-2xl border border-stroke bg-panel flex items-center justify-center hover:bg-panel2 hover:border-stroke2 transition-all group shadow-card disabled:opacity-50"
          >
            <X className="w-7 h-7 text-muted2 group-hover:text-text" />
          </button>
          <button
            onClick={handleLikePress}
            disabled={!!swipeDir}
            className="w-16 h-16 rounded-2xl border border-pink/30 bg-pink/5 flex items-center justify-center hover:bg-pink/10 hover:border-pink/50 transition-all group shadow-card disabled:opacity-50"
          >
            <Heart className="w-7 h-7 text-pink group-hover:text-pink" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function OwnerFeedPage() {
  const { ownerId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const candidates = CANDIDATES_BY_FRIEND[ownerId] ?? [];

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('wingru_current_user') || '{}');
      const netid = u.netid || 'default';
      const delegations = JSON.parse(localStorage.getItem(`wingru_delegations_${netid}`) || '[]');
      const friend = delegations.find((f) => f.id === ownerId);
      if (friend) setOwnerProfile(friend);
    } catch {}
  }, [ownerId]);

  function handlePass(note) {
    setCurrentIdx((i) => i + 1);
  }

  function handleLike(tag, note) {
    const isLast = currentIdx === candidates.length - 1;
    if (isLast) {
      toast({
        title: "It's a match! 🎉",
        description: `${ownerProfile?.name || 'Your friend'} and ${candidates[currentIdx]?.name} matched!`,
      });
    }
    setCurrentIdx((i) => i + 1);
  }

  const currentCandidate = candidates[currentIdx];
  const isExhausted = currentIdx >= candidates.length;

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen wing-bg flex flex-col items-center justify-center px-s4">
        <p className="text-muted text-lg font-semibold mb-2">no candidates in this feed.</p>
        <p className="text-muted2 text-sm mb-s4">the ai wingman is waiting for more profiles.</p>
        <Link href="/feed">
          <Button variant="outline">back to command center</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen wing-bg flex flex-col">
      {/* Header */}
      <div className="border-b border-stroke px-s4 py-s3 flex-shrink-0 bg-bg/80 backdrop-blur-sm">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <Link href="/feed">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">curating for</p>
            <div className="flex items-center gap-2">
              {ownerProfile?.photo && (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={ownerProfile.photo} alt={ownerProfile.name} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-sm font-semibold text-text">{ownerProfile?.name || '...'}</p>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-s4 pt-s3 max-w-sm mx-auto w-full">
        {isExhausted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">✦</div>
            <h3 className="text-xl font-bold text-text mb-2">feed complete.</h3>
            <p className="text-muted text-sm mb-s5">
              all candidates evaluated for {ownerProfile?.name || 'your friend'}.
            </p>
            <Link href="/feed">
              <Button className="w-full">back to command center</Button>
            </Link>
          </div>
        ) : (
          <ProfileCard
            key={currentCandidate.id}
            candidate={currentCandidate}
            onPass={handlePass}
            onLike={handleLike}
          />
        )}
      </div>
    </div>
  );
}
