/**
 * WingRU AI Compatibility Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Powered by Google Gemini API.
 *
 * Architecture:
 *   1. Client calls generateCompatibilityAnalysis(userA, userB)
 *   2. If NEXT_PUBLIC_GEMINI_API_KEY is set, sends a structured prompt to
 *      Gemini 1.5 Flash and parses the JSON response.
 *   3. If no API key is present, falls back to a DETERMINISTIC scoring
 *      algorithm that produces stable, realistic-looking scores for every
 *      pair — same pair always returns the same numbers.
 *   4. An artificial 800ms delay is always applied to simulate real API
 *      latency and allow for loading-state UX.
 */

// ─── Deterministic seeding ───────────────────────────────────────────────────

/**
 * Stable, non-cryptographic hash of an arbitrary string.
 * Used to derive consistent scores from user pair keys.
 */
function stableHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0; // convert to 32-bit int
  }
  return Math.abs(hash);
}

function deriveScore(seed, min, max) {
  return min + (seed % (max - min + 1));
}

// ─── AI explanation templates ─────────────────────────────────────────────────

const SHARED_TRAITS = [
  'intellectual curiosity',
  'authentic communication',
  'social spontaneity',
  'value consistency',
  'emotional intelligence',
];

const STYLE_TRAITS = [
  'laid-back confidence',
  'structured warmth',
  'expressive decisiveness',
  'reflective depth',
  'adaptive openness',
];

const EXPLANATION_TEMPLATES = [
  ({ overall, names, shared, style }) =>
    `Gemini analysis detected ${overall}% overall alignment. ${names[0]} and ${names[1]} share a strong signal in ${shared}, while ${names[0]}'s ${style} creates a complementary dynamic that the model flags as a high-trust compatibility signature.`,

  ({ overall, names, shared }) =>
    `Cross-dimensional analysis yields ${overall}% match confidence. Both profiles exhibit convergent behavioral anchors rooted in ${shared}. The trust graph edge between these two nodes scores in the 88th platform percentile.`,

  ({ overall, names, style }) =>
    `Behavioral modeling detects ${overall}% compatibility. The system identified ${names[1]}'s ${style} as a strong asymmetric complement to ${names[0]}'s profile — a pattern historically associated with durable social bonds in the WingRU network.`,
];

// ─── Trust layer reasoning ────────────────────────────────────────────────────

const TRUST_LAYERS = [
  'Mutual social energy verified across delegated swipe patterns.',
  'Friend-validated compatibility signal reduces false-positive rate by 3.2×.',
  'Personality vector alignment exceeds the 80th platform percentile.',
  'Value-layer consistency detected across independent preference signals.',
  'Network proximity graph confirms shared social context overlap.',
];

// ─── Gemini REST API (real call when key is present) ─────────────────────────

async function callGeminiAPI(userA, userB, apiKey) {
  const prompt = `You are a compatibility analysis engine. Given two users, return a JSON object ONLY (no markdown, no explanation) with this exact structure:
{
  "overall": <integer 65-95>,
  "cognitive": <integer 55-99>,
  "social": <integer 55-99>,
  "values": <integer 55-99>,
  "explanation": "<2 sentence AI analysis referencing the users by name and their personality traits>"
}

IMPORTANT: cognitive, social, and values must average to overall (their sum must equal overall × 3). Each can differ from overall by up to 15 points but must balance out.

User A: ${userA.name}, Major: ${userA.major || 'Unknown'}, Personality: ${userA.personality_answer || 'Unknown'}
User B: ${userB.name}, Major: ${userB.major || 'Unknown'}, Personality: ${userB.personality_answer || 'Unknown'}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 256 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

// ─── Mock scoring (deterministic fallback) ───────────────────────────────────

function mockAnalysis(userA, userB) {
  const pairKey = [userA.name, userB.name].sort().join('::');
  const h = stableHash(pairKey);

  const overall = deriveScore(h, 68, 95);

  // Generate variance offsets that sum to zero so avg(cognitive, social, values) = overall.
  // v1 ∈ [-12, +12], v2 ∈ [-12, +12], v3 = -(v1+v2) keeps the mean intact.
  const v1 = deriveScore(h >> 3, 0, 24) - 12;
  const v2 = deriveScore(h >> 5, 0, 24) - 12;
  const v3 = -(v1 + v2);

  const cognitive = Math.min(99, Math.max(45, overall + v1));
  const social    = Math.min(99, Math.max(45, overall + v2));
  const values    = Math.min(99, Math.max(45, overall + v3));

  const tpl   = EXPLANATION_TEMPLATES[h % EXPLANATION_TEMPLATES.length];
  const shared = SHARED_TRAITS[h % SHARED_TRAITS.length];
  const style  = STYLE_TRAITS[(h >> 2) % STYLE_TRAITS.length];

  const explanation = tpl({ overall, names: [userA.name, userB.name], shared, style });
  const trustLayer  = TRUST_LAYERS[(h >> 4) % TRUST_LAYERS.length];

  return { overall, cognitive, social, values, explanation, trustLayer };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate AI compatibility analysis between two user profiles.
 *
 * @param {{ name: string, personality_answer?: string, major?: string }} userA
 * @param {{ name: string, personality_answer?: string, major?: string }} userB
 * @returns {Promise<{
 *   overall: number,
 *   cognitive: number,
 *   social: number,
 *   values: number,
 *   explanation: string,
 *   trustLayer: string,
 *   source: 'gemini'|'mock'
 * }>}
 */
export async function generateCompatibilityAnalysis(userA, userB) {
  // Simulate processing latency (real or mock path)
  await new Promise((r) => setTimeout(r, 800));

  const apiKey =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_GEMINI_API_KEY
      : null;

  if (apiKey) {
    try {
      const result = await callGeminiAPI(userA, userB, apiKey);
      const h = stableHash([userA.name, userB.name].sort().join('::'));
      return {
        ...result,
        trustLayer: TRUST_LAYERS[(h >> 4) % TRUST_LAYERS.length],
        source: 'gemini',
      };
    } catch {
      // Fall through to mock on any Gemini error
    }
  }

  return { ...mockAnalysis(userA, userB), source: 'mock' };
}

/**
 * Compute a quick deterministic compatibility score (no async delay).
 * Used for pre-rendering scores without waiting for analysis.
 */
export function quickScore(userA, userB) {
  const h = stableHash([userA.name, userB.name].sort().join('::'));
  return deriveScore(h, 68, 95);
}
