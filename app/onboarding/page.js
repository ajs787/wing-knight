'use client';

export const dynamic = 'force-dynamic';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, ArrowRight, Upload, X, GripVertical, Check } from 'lucide-react';

const TOTAL_STEPS = 6;

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'];
const GENDERS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say', 'Other'];
const LOOKING_FOR = ['Men', 'Women', 'Everyone', 'Non-binary people'];

// MBTI personality dimensions — 2 questions each, 4 dimensions
const MBTI_QUESTIONS = {
  ei: [
    {
      q: "When you walk into a party where you know almost no one, you...",
      a: "See it as a chance to meet new people",  // → E
      b: "Stick close to the few people you know", // → I
    },
    {
      q: "A full weekend with zero plans feels...",
      a: "A bit boring — you'd rather make plans", // → E
      b: "Like a relief — you need the downtime",  // → I
    },
  ],
  sn: [
    {
      q: "When reading instructions, you prefer them to be...",
      a: "Step-by-step with concrete details",     // → S
      b: "An overview you can figure out from",    // → N
    },
    {
      q: "You'd rather be known for...",
      a: "Good judgment and practicality",         // → S
      b: "Creative thinking and vision",           // → N
    },
  ],
  tf: [
    {
      q: "A close friend vents to you about a tough situation. You instinctively...",
      a: "Help them think through the problem logically", // → T
      b: "Focus on how they're feeling first",            // → F
    },
    {
      q: "You respect people more for...",
      a: "Being consistent and principled",  // → T
      b: "Being empathetic and supportive",  // → F
    },
  ],
  jp: [
    {
      q: "Your notes app or calendar is...",
      a: "Carefully organized with reminders set",      // → J
      b: "Chaotic but you know where everything is",   // → P
    },
    {
      q: "When packing for a trip, you...",
      a: "Make a list and pack days in advance",        // → J
      b: "Throw things in the bag the night before",   // → P
    },
  ],
};

const MBTI_LABELS = {
  INTJ: 'The Architect',   INTP: 'The Thinker',      ENTJ: 'The Commander',   ENTP: 'The Debater',
  INFJ: 'The Advocate',    INFP: 'The Mediator',     ENFJ: 'The Protagonist', ENFP: 'The Campaigner',
  ISTJ: 'The Inspector',   ISFJ: 'The Defender',     ESTJ: 'The Executive',   ESFJ: 'The Caregiver',
  ISTP: 'The Virtuoso',    ISFP: 'The Adventurer',   ESTP: 'The Entrepreneur',ESFP: 'The Entertainer',
};

function deriveMBTI(answers) {
  // For each dimension: majority A → first letter, else second. First question breaks ties.
  function dim(q1, q2, typeA, typeB) {
    const aCount = (q1 === 'A' ? 1 : 0) + (q2 === 'A' ? 1 : 0);
    if (aCount === 2) return typeA;
    if (aCount === 0) return typeB;
    return q1 === 'A' ? typeA : typeB; // tie: first question decides
  }
  const e = dim(answers.ei1, answers.ei2, 'E', 'I');
  const s = dim(answers.sn1, answers.sn2, 'S', 'N');
  const t = dim(answers.tf1, answers.tf2, 'T', 'F');
  const j = dim(answers.jp1, answers.jp2, 'J', 'P');
  return `${e}${s}${t}${j}`;
}

const SAMPLE_PROMPTS = [
  "My go-to stress reliever...",
  "The way to my heart is...",
  "We'll get along if...",
  "My most controversial opinion...",
  "I'm secretly really good at...",
];

function PhotoSlot({ index, photo, onUpload, onRemove }) {
  const onDrop = useCallback((files) => {
    if (files[0]) onUpload(index, files[0]);
  }, [index, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: !!photo,
  });

  return (
    <div
      {...(photo ? {} : getRootProps())}
      className={`relative aspect-[3/4] rounded-2xl border-2 overflow-hidden transition-all cursor-pointer
        ${photo ? 'border-transparent' : isDragActive ? 'border-pink/40 bg-pink/5' : 'border-dashed border-stroke bg-panel2 hover:border-stroke2'}`}
    >
      {!photo && <input {...getInputProps()} />}
      {photo ? (
        <>
          <img
            src={photo.dataUrl}
            alt={`Photo ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
            {index === 0 ? 'Main' : `${index + 1}`}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
          <Upload className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{index === 0 ? 'Main photo' : `Photo ${index + 1}`}</span>
        </div>
      )}
      {photo && (
        <div className="absolute top-2 left-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center cursor-grab">
          <GripVertical className="w-3 h-3 text-slate-500" />
        </div>
      )}
    </div>
  );
}

function getCurrentNetid() {
  try {
    const u = JSON.parse(localStorage.getItem('wingru_current_user') || '{}');
    return u.netid || 'default';
  } catch { return 'default'; }
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1 — Basic info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  // Steps 2–3 — MBTI personality quiz
  const [mbtiAnswers, setMbtiAnswers] = useState({ ei1: null, ei2: null, sn1: null, sn2: null, tf1: null, tf2: null, jp1: null, jp2: null });

  // Step 4 — Photos (5 slots)
  const [photos, setPhotos] = useState(Array(5).fill(null));

  // Step 5 — Prompts (at least 2)
  const [promptSelections, setPromptSelections] = useState([
    { prompt: '', answer: '' },
    { prompt: '', answer: '' },
  ]);

  // Load saved data from localStorage on mount (per-user keys)
  useEffect(() => {
    try {
      const netid = getCurrentNetid();
      const savedProfile = localStorage.getItem(`wingru_profile_${netid}`);
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.name) setName(p.name);
        if (p.age) setAge(String(p.age));
        if (p.year) setYear(p.year);
        if (p.major) setMajor(p.major);
        if (p.gender) setGender(p.gender);
        if (p.looking_for) setLookingFor(p.looking_for);
        if (p.personality_answer) {} // derived from MBTI on save
        if (p.mbti_answers) setMbtiAnswers(p.mbti_answers);
        if (p.prompts) setPromptSelections(p.prompts);
      }

      const savedPhotos = localStorage.getItem(`wingru_photos_${netid}`);
      if (savedPhotos) {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed)) {
          setPhotos(parsed.map((d) => d ? { dataUrl: d } : null));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function canProceedStep1() {
    return name.trim() && age && parseInt(age) >= 17 && year && major.trim() && gender && lookingFor;
  }
  function canProceedStep2() {
    return mbtiAnswers.ei1 && mbtiAnswers.ei2 && mbtiAnswers.sn1 && mbtiAnswers.sn2;
  }
  function canProceedStep3() {
    return mbtiAnswers.tf1 && mbtiAnswers.tf2 && mbtiAnswers.jp1 && mbtiAnswers.jp2;
  }
  function canProceedStep4() {
    return photos.filter(Boolean).length === 5;
  }
  function canProceedStep5() {
    const filled = promptSelections.filter((p) => p.prompt && p.answer.trim().length > 0);
    return filled.length >= 2;
  }

  function handlePhotoUpload(index, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPhotos((prev) => {
        const next = [...prev];
        next[index] = { dataUrl };
        try {
          const netid = getCurrentNetid();
          localStorage.setItem(`wingru_photos_${netid}`, JSON.stringify(next.map((p) => p ? p.dataUrl : null)));
        } catch {}
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  function handlePhotoRemove(index) {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      try {
        const netid = getCurrentNetid();
        localStorage.setItem(`wingru_photos_${netid}`, JSON.stringify(next.map((p) => p ? p.dataUrl : null)));
      } catch {}
      return next;
    });
  }

  function handleSaveProfile() {
    const netid = getCurrentNetid();
    const profile = {
      name: name.trim(),
      age: parseInt(age),
      year,
      major: major.trim(),
      gender,
      looking_for: lookingFor,
      personality_answer: deriveMBTI(mbtiAnswers),
      mbti_answers: mbtiAnswers,
      mbti_label: MBTI_LABELS[deriveMBTI(mbtiAnswers)] || '',
      prompts: promptSelections,
    };
    try {
      localStorage.setItem(`wingru_profile_${netid}`, JSON.stringify(profile));
    } catch {}
    return true;
  }

  function handleFinish() {
    setSaving(true);
    handleSaveProfile();
    toast({ title: 'Profile complete!', description: 'Welcome to WingRu.' });
    router.push('/feed');
  }

  const stepProgress = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen wing-bg flex flex-col">
      {/* Header */}
      <div className="px-s4 pt-s5 pb-s3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-text">WingRu</span>
          <span className="text-sm text-muted2">Step {step} of {TOTAL_STEPS}</span>
        </div>
        <Progress value={stepProgress} className="h-1.5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-s4 max-w-lg mx-auto w-full animate-fade-in">
        {step === 1 && (
          <div className="space-y-s5 py-s5">
            <div>
              <h2 className="text-2xl font-semibold text-text">Let's build your profile</h2>
              <p className="text-base text-muted leading-relaxed mt-1">Basic info your friends will use to swipe for you.</p>
            </div>
            <div className="space-y-s3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-muted2">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" className="w-full rounded-2xl bg-panel border border-stroke px-s4 py-s3 text-text placeholder:text-muted2 shadow-ring focus:outline-none focus:wing-focus mt-s2" />
              </div>
              <div>
                <Label htmlFor="age" className="text-sm font-medium text-muted2">Age</Label>
                <Input id="age" type="number" min="17" max="99" value={age} onChange={(e) => setAge(e.target.value)} placeholder="21" className="w-full rounded-2xl bg-panel border border-stroke px-s4 py-s3 text-text placeholder:text-muted2 shadow-ring focus:outline-none focus:wing-focus mt-s2 w-28" />
              </div>
              <div>
                <Label className="text-sm font-medium text-muted2">Year at Rutgers</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-panel border border-stroke text-text rounded-2xl mt-s2"><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="major" className="text-sm font-medium text-muted2">Major</Label>
                <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Computer Science" className="w-full rounded-2xl bg-panel border border-stroke px-s4 py-s3 text-text placeholder:text-muted2 shadow-ring focus:outline-none focus:wing-focus mt-s2" />
              </div>
              <div>
                <Label className="text-sm font-medium text-muted2">Gender</Label>
                <div className="flex flex-wrap gap-2 mt-s2">
                  {GENDERS.map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={gender === g
                        ? 'bg-pink/15 text-pink border border-pink/30 rounded-2xl px-s3 py-s2 text-sm font-semibold'
                        : 'bg-panel border border-stroke text-muted rounded-2xl px-s3 py-s2 text-sm font-semibold hover:bg-panel2 hover:border-stroke2 hover:text-text transition-all'}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted2">Looking for</Label>
                <div className="flex flex-wrap gap-2 mt-s2">
                  {LOOKING_FOR.map((l) => (
                    <button key={l} type="button" onClick={() => setLookingFor(l)}
                      className={lookingFor === l
                        ? 'bg-pink/15 text-pink border border-pink/30 rounded-2xl px-s3 py-s2 text-sm font-semibold'
                        : 'bg-panel border border-stroke text-muted rounded-2xl px-s3 py-s2 text-sm font-semibold hover:bg-panel2 hover:border-stroke2 hover:text-text transition-all'}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-s4 py-s5">
            <div>
              <p className="text-xs font-semibold text-pink uppercase tracking-widest mb-1">Personality · 1 of 2</p>
              <h2 className="text-2xl font-semibold text-text">How do you engage with the world?</h2>
              <p className="text-sm text-muted leading-relaxed mt-1">Your answers help Gemini AI find deeper compatibility signals.</p>
            </div>
            {/* E/I */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">Energy source</p>
              {MBTI_QUESTIONS.ei.map((q, qi) => {
                const key = qi === 0 ? 'ei1' : 'ei2';
                return (
                  <div key={key} className="rounded-2xl bg-panel border border-stroke p-s3 space-y-2">
                    <p className="text-sm font-semibold text-text leading-snug">{q.q}</p>
                    {[{ label: q.a, val: 'A' }, { label: q.b, val: 'B' }].map(({ label, val }) => (
                      <button key={val} type="button" onClick={() => setMbtiAnswers(prev => ({ ...prev, [key]: val }))}
                        className={mbtiAnswers[key] === val
                          ? 'w-full text-left bg-pink/15 text-pink border border-pink/30 rounded-xl px-s3 py-s2 text-sm font-semibold flex items-center justify-between'
                          : 'w-full text-left bg-panel2 border border-stroke text-muted rounded-xl px-s3 py-s2 text-sm font-semibold hover:border-stroke2 hover:text-text transition-all flex items-center justify-between'}>
                        {label}
                        {mbtiAnswers[key] === val && <Check className="w-4 h-4 text-pink flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
            {/* S/N */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">Information style</p>
              {MBTI_QUESTIONS.sn.map((q, qi) => {
                const key = qi === 0 ? 'sn1' : 'sn2';
                return (
                  <div key={key} className="rounded-2xl bg-panel border border-stroke p-s3 space-y-2">
                    <p className="text-sm font-semibold text-text leading-snug">{q.q}</p>
                    {[{ label: q.a, val: 'A' }, { label: q.b, val: 'B' }].map(({ label, val }) => (
                      <button key={val} type="button" onClick={() => setMbtiAnswers(prev => ({ ...prev, [key]: val }))}
                        className={mbtiAnswers[key] === val
                          ? 'w-full text-left bg-pink/15 text-pink border border-pink/30 rounded-xl px-s3 py-s2 text-sm font-semibold flex items-center justify-between'
                          : 'w-full text-left bg-panel2 border border-stroke text-muted rounded-xl px-s3 py-s2 text-sm font-semibold hover:border-stroke2 hover:text-text transition-all flex items-center justify-between'}>
                        {label}
                        {mbtiAnswers[key] === val && <Check className="w-4 h-4 text-pink flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-s4 py-s5">
            <div>
              <p className="text-xs font-semibold text-pink uppercase tracking-widest mb-1">Personality · 2 of 2</p>
              <h2 className="text-2xl font-semibold text-text">How do you think and decide?</h2>
              <p className="text-sm text-muted leading-relaxed mt-1">Almost there — 4 more quick questions.</p>
            </div>
            {/* T/F */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">Decision making</p>
              {MBTI_QUESTIONS.tf.map((q, qi) => {
                const key = qi === 0 ? 'tf1' : 'tf2';
                return (
                  <div key={key} className="rounded-2xl bg-panel border border-stroke p-s3 space-y-2">
                    <p className="text-sm font-semibold text-text leading-snug">{q.q}</p>
                    {[{ label: q.a, val: 'A' }, { label: q.b, val: 'B' }].map(({ label, val }) => (
                      <button key={val} type="button" onClick={() => setMbtiAnswers(prev => ({ ...prev, [key]: val }))}
                        className={mbtiAnswers[key] === val
                          ? 'w-full text-left bg-pink/15 text-pink border border-pink/30 rounded-xl px-s3 py-s2 text-sm font-semibold flex items-center justify-between'
                          : 'w-full text-left bg-panel2 border border-stroke text-muted rounded-xl px-s3 py-s2 text-sm font-semibold hover:border-stroke2 hover:text-text transition-all flex items-center justify-between'}>
                        {label}
                        {mbtiAnswers[key] === val && <Check className="w-4 h-4 text-pink flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
            {/* J/P */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted2 uppercase tracking-widest">Lifestyle</p>
              {MBTI_QUESTIONS.jp.map((q, qi) => {
                const key = qi === 0 ? 'jp1' : 'jp2';
                return (
                  <div key={key} className="rounded-2xl bg-panel border border-stroke p-s3 space-y-2">
                    <p className="text-sm font-semibold text-text leading-snug">{q.q}</p>
                    {[{ label: q.a, val: 'A' }, { label: q.b, val: 'B' }].map(({ label, val }) => (
                      <button key={val} type="button" onClick={() => setMbtiAnswers(prev => ({ ...prev, [key]: val }))}
                        className={mbtiAnswers[key] === val
                          ? 'w-full text-left bg-pink/15 text-pink border border-pink/30 rounded-xl px-s3 py-s2 text-sm font-semibold flex items-center justify-between'
                          : 'w-full text-left bg-panel2 border border-stroke text-muted rounded-xl px-s3 py-s2 text-sm font-semibold hover:border-stroke2 hover:text-text transition-all flex items-center justify-between'}>
                        {label}
                        {mbtiAnswers[key] === val && <Check className="w-4 h-4 text-pink flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-s5 py-s5">
            <div>
              <h2 className="text-2xl font-semibold text-text">Add your photos</h2>
              <p className="text-base text-muted leading-relaxed mt-1">Upload exactly 5 photos. First is your main photo.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <PhotoSlot key={i} index={i} photo={photo} onUpload={handlePhotoUpload} onRemove={handlePhotoRemove} />
              ))}
            </div>
            <p className="text-muted2 text-xs text-center">{photos.filter(Boolean).length}/5 photos added</p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-s5 py-s5">
            <div>
              <h2 className="text-2xl font-semibold text-text">Add your prompts</h2>
              <p className="text-base text-muted leading-relaxed mt-1">Answer at least 2 prompts so people get to know you.</p>
            </div>
            {promptSelections.map((ps, i) => (
              <div key={i} className="p-s3 rounded-2xl bg-panel border border-stroke space-y-2">
                <Label className="text-sm font-medium text-muted2">Prompt {i + 1}</Label>
                <Select value={ps.prompt} onValueChange={(v) => {
                  const next = [...promptSelections]; next[i] = { ...next[i], prompt: v }; setPromptSelections(next);
                }}>
                  <SelectTrigger className="bg-panel border border-stroke text-text rounded-2xl mt-s2"><SelectValue placeholder="Pick a prompt..." /></SelectTrigger>
                  <SelectContent>
                    {SAMPLE_PROMPTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {ps.prompt && (
                  <textarea value={ps.answer}
                    onChange={(e) => {
                      const next = [...promptSelections]; next[i] = { ...next[i], answer: e.target.value }; setPromptSelections(next);
                    }}
                    placeholder="Your answer..." maxLength={300} rows={3}
                    className="w-full rounded-2xl bg-panel2 border border-stroke px-s3 py-s2 text-text text-sm resize-none focus:outline-none" />
                )}
              </div>
            ))}
            {promptSelections.length < 3 && (
              <button type="button" onClick={() => setPromptSelections([...promptSelections, { prompt: '', answer: '' }])}
                className="text-sm text-pink hover:text-pink/80">
                + Add another prompt
              </button>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-s5 py-s5">
            <div>
              <h2 className="text-2xl font-semibold text-text">Looking good, {name}!</h2>
              <p className="text-base text-muted leading-relaxed mt-1">Review your profile and hit Done to get started.</p>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name', value: name },
                { label: 'Age', value: age },
                { label: 'Year', value: year },
                { label: 'Major', value: major },
                { label: 'Gender', value: gender },
                { label: 'Looking for', value: lookingFor },
                { label: 'Personality type', value: `${deriveMBTI(mbtiAnswers)} — ${MBTI_LABELS[deriveMBTI(mbtiAnswers)] || ''}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-s2 border-b border-stroke">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-text">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-s2 border-b border-stroke">
                <span className="text-muted">Photos</span>
                <span className="font-medium text-text">{photos.filter(Boolean).length}/5 uploaded</span>
              </div>
              <div className="flex justify-between py-s2 border-b border-stroke">
                <span className="text-muted">Prompts answered</span>
                <span className="font-medium text-text">
                  {promptSelections.filter((p) => p.prompt && p.answer.trim()).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-s4 py-s4 max-w-lg mx-auto w-full flex items-center justify-between border-t border-stroke">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 1 && !canProceedStep1()) ||
              (step === 2 && !canProceedStep2()) ||
              (step === 3 && !canProceedStep3()) ||
              (step === 4 && !canProceedStep4()) ||
              (step === 5 && !canProceedStep5())
            }
            className="gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={saving} size="lg">
            {saving ? 'Saving...' : 'Activate profile'}
          </Button>
        )}
      </div>
    </div>
  );
}
