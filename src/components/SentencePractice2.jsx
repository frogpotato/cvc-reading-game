import { useState, useEffect, useCallback, useRef } from 'react';
import sentenceSets from '../data/sentenceSets';

const REWARD_GIFS = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk3bXFwOWJleTVnaWVscGZwazEyb2Q0bzFnamRrNXM1NHUzN3U0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zsbYm28afpsPJxrzHS/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnN6NGJ1cmtzaXV1YXhsbXZxNG9jbm52ZTNtMjI5Y3EzOWg0OW95MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fnmsu2lTw3r1e/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXJkZjB0bmhqdDY4emVrOXZqeWhsd3Zwbjg2a2RiaDFjZ3UwcTAzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lFHtqqh6orvAhbiGmy/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3hnY2wydWpsNjFrYmNnc3dvaG9ydDViem8yenJjdHhjd2YzZzE0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kBZBlLVlfECvOQAVno/giphy.gif',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRoZW5kMGYxcGcwN2M2NmswOTFoeTBnbjEyaGR2c2J1bXN6OGpubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TVNmNzfL8ibYUyeQo8/giphy.gif',
];

const SENTENCES_PER_LEVEL = 20;

const levels = Object.entries(sentenceSets).map(([key, value]) => ({
  key,
  name: value.name,
  patterns: value.patterns,
}));

// Pick a sentence from patterns using weights
function weightedPick(patterns) {
  const totalWeight = patterns.reduce((sum, p) => sum + p.weight * p.sentences.length, 0);
  let r = Math.random() * totalWeight;
  for (const pattern of patterns) {
    const patternTotal = pattern.weight * pattern.sentences.length;
    if (r < patternTotal) {
      const idx = Math.floor(Math.random() * pattern.sentences.length);
      return pattern.sentences[idx];
    }
    r -= patternTotal;
  }
  const p = patterns[0];
  return p.sentences[Math.floor(Math.random() * p.sentences.length)];
}

// Generate N sentences with no immediate duplicates
function generateSentences(patterns, count) {
  const result = [];
  let lastSentence = null;
  for (let i = 0; i < count; i++) {
    let sentence;
    let attempts = 0;
    do {
      sentence = weightedPick(patterns);
      attempts++;
    } while (sentence === lastSentence && attempts < 20);
    result.push(sentence);
    lastSentence = sentence;
  }
  return result;
}

// Collect ALL patterns across all levels
const allPatterns = levels.flatMap(l => l.patterns);

// Generate a "Random 20" — at least 1 from every pattern type, rest weighted random
function generateRandom20() {
  const result = [];
  for (const pattern of allPatterns) {
    const idx = Math.floor(Math.random() * pattern.sentences.length);
    result.push(pattern.sentences[idx]);
  }
  while (result.length < SENTENCES_PER_LEVEL) {
    let sentence;
    let attempts = 0;
    do {
      sentence = weightedPick(allPatterns);
      attempts++;
    } while (result.length > 0 && sentence === result[result.length - 1] && attempts < 20);
    result.push(sentence);
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ============================================================
   EMOJI MAPS & SENTENCE PARSER
   ============================================================ */
const E = {
  cat: '🐱', bat: '🦇', rat: '🐀', hen: '🐔', fox: '🦊', pig: '🐷', ant: '🐜',
  sam: '👦', nan: '👵',
  pen: '🖊️', net: '🥅', pan: '🍳', bin: '🗑️', box: '📦', hat: '🎩',
};

const NOUNS = Object.keys(E);

function findNoun(words, startIdx = 0) {
  for (let i = startIdx; i < words.length; i++) {
    const w = words[i].replace(/[?.!]/g, '');
    if (NOUNS.includes(w)) return { noun: w, idx: i };
  }
  return null;
}

function parseSentence(sentence) {
  const s = sentence.toLowerCase().replace(/[?.!]/g, '').trim();
  const words = s.split(/\s+/);

  // "the X hit the Y and ran"
  if (s.includes('hit') && s.includes('and ran')) {
    const a = findNoun(words);
    const b = findNoun(words, (a?.idx || 0) + 2);
    return { type: 'hit-ran', a: a?.noun || 'cat', b: b?.noun || 'rat' };
  }
  // "the X hid in the Y"
  if (s.includes('hid in')) {
    const a = findNoun(words);
    const container = words[words.length - 1];
    return { type: 'hid', a: a?.noun || 'cat', container };
  }
  // "the X pet the Y"
  if (words.includes('pet')) {
    const a = findNoun(words);
    const b = findNoun(words, (a?.idx || 0) + 2);
    return { type: 'pet', a: a?.noun || 'cat', b: b?.noun || 'rat' };
  }
  // "the X fed the Y"
  if (words.includes('fed')) {
    const a = findNoun(words);
    const b = findNoun(words, (a?.idx || 0) + 2);
    return { type: 'fed', a: a?.noun || 'cat', b: b?.noun || 'rat' };
  }
  // "is the X fat and red"
  if (s.startsWith('is') && s.includes('fat and red')) {
    const a = findNoun(words);
    return { type: 'q-fat-red', a: a?.noun || 'cat' };
  }
  // "is the X fat"
  if (s.startsWith('is') && s.includes('fat')) {
    const a = findNoun(words);
    return { type: 'q-fat', a: a?.noun || 'cat' };
  }
  // "is the X red"
  if (s.startsWith('is') && s.includes('red')) {
    const a = findNoun(words);
    return { type: 'q-red', a: a?.noun || 'pen' };
  }
  // "the X is fat and red"
  if (s.includes('is fat and red')) {
    const a = findNoun(words);
    return { type: 'is-fat-red', a: a?.noun || 'cat' };
  }
  // "the X is fat"
  if (s.includes('is fat')) {
    const a = findNoun(words);
    return { type: 'is-fat', a: a?.noun || 'cat' };
  }
  // "sam had a/an X"
  if (s.startsWith('sam had')) {
    const a = findNoun(words, 2);
    return { type: 'sam-had', a: a?.noun || 'cat' };
  }
  // "the X bit it" / "the red X bit it"
  if (s.includes('bit it')) {
    const a = findNoun(words);
    const red = words.includes('red');
    return { type: 'bit', a: a?.noun || 'cat', red };
  }
  // "the fat X sat"
  if (words.includes('sat')) {
    const a = findNoun(words);
    return { type: 'sat', a: a?.noun || 'cat' };
  }
  // "the fat red X"
  if (words.includes('fat') && words.includes('red')) {
    const a = findNoun(words);
    return { type: 'fat-red', a: a?.noun || 'cat' };
  }
  // "the fat X"
  if (words.includes('fat')) {
    const a = findNoun(words);
    return { type: 'fat', a: a?.noun || 'cat' };
  }
  // Fallback
  const a = findNoun(words);
  return { type: 'fat', a: a?.noun || 'cat' };
}

/* ============================================================
   ANIMATED SCENES
   ============================================================ */

// -- Fat animal: comically round, wobbling, with sweat drops --
function FatScene({ noun, red }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="text-[8rem] leading-none"
        style={{
          animation: 'wobble 1s ease-in-out infinite',
          transform: 'scaleX(1.4) scaleY(1.1)',
          filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}
      >
        {emoji}
      </div>
      {/* Sweat drops */}
      <div className="absolute -top-2 right-4 text-3xl" style={{ animation: 'drip 1.5s ease-in infinite' }}>💧</div>
      <div className="absolute top-6 -left-2 text-2xl" style={{ animation: 'drip 1.5s ease-in 0.4s infinite' }}>💧</div>
      {/* Belly jiggle lines */}
      <div className="text-2xl font-bold text-amber-400 mt-1" style={{ animation: 'fadeInOut 2s ease-in-out infinite' }}>
        ~ so round ~
      </div>
    </div>
  );
}

// -- Sam had a X: Sam proudly holding the thing above his head --
function SamHadScene({ noun }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex flex-col items-center">
      {/* The thing Sam has — bouncing above */}
      <div className="text-7xl mb-2" style={{ animation: 'float 1.5s ease-in-out infinite' }}>
        {emoji}
      </div>
      {/* Sam looking proud */}
      <div className="text-[7rem] leading-none" style={{ animation: 'samDance 1.2s ease-in-out infinite' }}>
        👦
      </div>
      {/* Sparkles */}
      <div className="absolute top-0 left-8 text-3xl" style={{ animation: 'sparkle 0.8s ease-in-out infinite' }}>✨</div>
      <div className="absolute top-4 right-6 text-2xl" style={{ animation: 'sparkle 0.8s ease-in-out 0.3s infinite' }}>✨</div>
    </div>
  );
}

// -- Bit it: animal chomping on a cookie with crumbs flying --
function BitScene({ noun, red }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex items-center gap-1">
      <div
        className="text-[7rem] leading-none"
        style={{
          animation: 'chomp 0.6s ease-in-out infinite',
          filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}
      >
        {emoji}
      </div>
      {/* Cookie being bitten */}
      <div className="text-6xl" style={{ animation: 'cookieShake 0.3s ease-in-out infinite' }}>🍪</div>
      {/* Crumbs flying */}
      <div className="absolute top-4 right-0 text-2xl" style={{ animation: 'crumb1 1s ease-out infinite' }}>💥</div>
      <div className="absolute top-12 right-8 text-xl" style={{ animation: 'crumb2 1.2s ease-out 0.2s infinite' }}>🍞</div>
      <div className="absolute top-0 right-12 text-lg" style={{ animation: 'crumb3 1s ease-out 0.4s infinite' }}>✨</div>
    </div>
  );
}

// -- Sat: animal plops down onto a cushion with bounce --
function SatScene({ noun }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex flex-col items-center">
      {/* The animal dropping down */}
      <div
        className="text-[7rem] leading-none"
        style={{
          animation: 'plop 1.5s ease-in-out infinite',
          transform: 'scaleX(1.3) scaleY(1.1)',
        }}
      >
        {emoji}
      </div>
      {/* Cushion squishing */}
      <div className="text-5xl -mt-4" style={{ animation: 'squish 1.5s ease-in-out infinite' }}>🛋️</div>
      {/* Stars from impact */}
      <div className="absolute top-8 left-2 text-2xl" style={{ animation: 'popStar 1.5s ease-out infinite' }}>⭐</div>
      <div className="absolute top-12 right-0 text-xl" style={{ animation: 'popStar 1.5s ease-out 0.3s infinite' }}>💫</div>
      {/* Ground shake lines */}
      <div className="text-xl text-amber-600 font-bold mt-1" style={{ animation: 'fadeInOut 1.5s ease-in-out infinite' }}>
        ~ thud! ~
      </div>
    </div>
  );
}

// -- Is fat: shows the animal on a scale that tips --
function IsFatScene({ noun, red }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="text-[7rem] leading-none"
        style={{
          animation: 'bellyBounce 1s ease-in-out infinite',
          transform: 'scaleX(1.4) scaleY(1.1)',
          filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}
      >
        {emoji}
      </div>
      {/* Scale tipping */}
      <div className="text-5xl" style={{ animation: 'tipScale 1s ease-in-out infinite' }}>⚖️</div>
      <div className="text-xl font-bold text-red-500 mt-1" style={{ animation: 'fadeInOut 1.5s ease-in-out infinite' }}>
        {red ? '🔴 so red! 🔴' : '😱 so heavy!'}
      </div>
    </div>
  );
}

// -- Question scenes: big bouncing question mark with the subject --
function QuestionScene({ noun, red, fatAndRed }) {
  const emoji = E[noun] || '🐱';
  return (
    <div className="relative flex items-center gap-6">
      <div
        className="text-[7rem] leading-none"
        style={{
          animation: 'tiltHead 2s ease-in-out infinite',
          transform: fatAndRed ? 'scaleX(1.4) scaleY(1.1)' : undefined,
          filter: (red || fatAndRed) ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}
      >
        {emoji}
      </div>
      <div className="flex flex-col items-center">
        <div className="text-8xl font-extrabold text-indigo-600" style={{ animation: 'bounceQ 0.8s ease-in-out infinite' }}>?</div>
        {/* Thought bubbles */}
        <div className="absolute -top-4 right-4 text-3xl" style={{ animation: 'thoughtBubble 2s ease-in-out infinite' }}>💭</div>
      </div>
      {/* Magnifying glass searching */}
      <div className="absolute bottom-0 left-0 text-4xl" style={{ animation: 'searchSwing 2s ease-in-out infinite' }}>🔍</div>
    </div>
  );
}

// -- Hit and ran: attacker bonks victim then zooms away --
function HitAndRanScene({ a, b }) {
  const emojiA = E[a] || '🐱';
  const emojiB = E[b] || '🐀';
  return (
    <div className="relative w-80 h-48 flex items-center justify-center">
      {/* Victim standing there looking stunned */}
      <div className="absolute right-8 text-7xl" style={{ animation: 'stunned 0.5s ease-in-out infinite' }}>
        {emojiB}
      </div>
      {/* Stars around victim */}
      <div className="absolute right-4 top-2 text-3xl" style={{ animation: 'spinStar 1s linear infinite' }}>⭐</div>
      <div className="absolute right-16 top-0 text-2xl" style={{ animation: 'spinStar 1s linear 0.3s infinite' }}>💫</div>
      {/* POW effect */}
      <div className="absolute right-20 top-8 text-4xl font-extrabold text-red-500" style={{ animation: 'pow 1.5s ease-out infinite' }}>
        POW!
      </div>
      {/* Attacker running away */}
      <div className="absolute text-7xl" style={{ animation: 'hitAndRun 2s ease-in-out infinite' }}>
        {emojiA}
      </div>
      {/* Dust clouds */}
      <div className="absolute bottom-2 left-0 text-3xl" style={{ animation: 'dustPuff 2s ease-out 1s infinite' }}>💨</div>
      <div className="absolute bottom-6 left-8 text-2xl" style={{ animation: 'dustPuff 2s ease-out 1.2s infinite' }}>💨</div>
    </div>
  );
}

// -- Hid in box/bin: animal peeking out with eyes --
function HidScene({ noun, container }) {
  const emoji = E[noun] || '🐱';
  const containerEmoji = E[container] || '📦';
  return (
    <div className="relative flex flex-col items-center">
      {/* Peeking animal */}
      <div className="text-6xl -mb-8 relative z-10" style={{ animation: 'peek 2.5s ease-in-out infinite' }}>
        {emoji}
      </div>
      {/* Container */}
      <div className="text-[7rem] leading-none relative z-20" style={{ animation: 'containerShake 3s ease-in-out infinite' }}>
        {containerEmoji}
      </div>
      {/* Eyes peeking */}
      <div className="absolute top-4 text-3xl z-30" style={{ animation: 'peekEyes 2.5s ease-in-out infinite' }}>👀</div>
      {/* Shh! */}
      <div className="absolute -right-8 top-0 text-3xl" style={{ animation: 'fadeInOut 3s ease-in-out infinite' }}>🤫</div>
    </div>
  );
}

// -- Pet: one animal lovingly patting another, hearts flying --
function PetScene({ a, b }) {
  const emojiA = E[a] || '🐱';
  const emojiB = E[b] || '🐀';
  return (
    <div className="relative flex items-end gap-2">
      {/* Petter */}
      <div className="text-7xl" style={{ animation: 'petMotion 1s ease-in-out infinite' }}>
        {emojiA}
      </div>
      {/* Hand patting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl" style={{ animation: 'patHand 0.6s ease-in-out infinite' }}>🤚</div>
      {/* The one being pet — happy wobble */}
      <div className="text-7xl" style={{ animation: 'happyWobble 0.8s ease-in-out infinite' }}>
        {emojiB}
      </div>
      {/* Hearts floating up */}
      <div className="absolute -top-8 left-1/4 text-3xl" style={{ animation: 'heartFloat 1.5s ease-out infinite' }}>❤️</div>
      <div className="absolute -top-4 right-1/4 text-2xl" style={{ animation: 'heartFloat 1.5s ease-out 0.4s infinite' }}>💕</div>
      <div className="absolute -top-12 left-1/2 text-3xl" style={{ animation: 'heartFloat 1.5s ease-out 0.8s infinite' }}>💖</div>
    </div>
  );
}

// -- Fed: one animal giving food to another --
function FedScene({ a, b }) {
  const emojiA = E[a] || '🐱';
  const emojiB = E[b] || '🐀';
  return (
    <div className="relative flex items-center gap-4">
      {/* Feeder with food */}
      <div className="text-7xl" style={{ animation: 'feedLean 1.5s ease-in-out infinite' }}>
        {emojiA}
      </div>
      {/* Food traveling from A to B */}
      <div className="text-4xl" style={{ animation: 'foodTravel 1.5s ease-in-out infinite' }}>🍖</div>
      {/* Happy eater — mouth open then munching */}
      <div className="text-7xl" style={{ animation: 'munch 0.8s ease-in-out infinite' }}>
        {emojiB}
      </div>
      {/* Yum effects */}
      <div className="absolute -top-4 right-4 text-3xl" style={{ animation: 'fadeInOut 1.5s ease-in-out infinite' }}>😋</div>
      <div className="absolute top-0 right-12 text-2xl" style={{ animation: 'sparkle 1s ease-in-out 0.5s infinite' }}>✨</div>
    </div>
  );
}

// Master scene renderer
function SceneRenderer({ sentence }) {
  const parsed = parseSentence(sentence);
  switch (parsed.type) {
    case 'fat': return <FatScene noun={parsed.a} />;
    case 'fat-red': return <FatScene noun={parsed.a} red />;
    case 'sam-had': return <SamHadScene noun={parsed.a} />;
    case 'bit': return <BitScene noun={parsed.a} red={parsed.red} />;
    case 'sat': return <SatScene noun={parsed.a} />;
    case 'is-fat': return <IsFatScene noun={parsed.a} />;
    case 'is-fat-red': return <IsFatScene noun={parsed.a} red />;
    case 'q-fat': return <QuestionScene noun={parsed.a} />;
    case 'q-fat-red': return <QuestionScene noun={parsed.a} fatAndRed />;
    case 'q-red': return <QuestionScene noun={parsed.a} red />;
    case 'hit-ran': return <HitAndRanScene a={parsed.a} b={parsed.b} />;
    case 'hid': return <HidScene noun={parsed.a} container={parsed.container} />;
    case 'pet': return <PetScene a={parsed.a} b={parsed.b} />;
    case 'fed': return <FedScene a={parsed.a} b={parsed.b} />;
    default: return <FatScene noun={parsed.a} />;
  }
}

/* ============================================================
   ALL THE KEYFRAME ANIMATIONS
   ============================================================ */
const SCENE_STYLES = `
  @keyframes wobble {
    0%, 100% { transform: scaleX(1.4) scaleY(1.1) rotate(-3deg); }
    50% { transform: scaleX(1.5) scaleY(1.0) rotate(3deg); }
  }
  @keyframes drip {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; }
  }
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes samDance {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg) translateX(-5px); }
    75% { transform: rotate(8deg) translateX(5px); }
  }
  @keyframes sparkle {
    0%, 100% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.3); opacity: 1; }
  }
  @keyframes chomp {
    0%, 100% { transform: scaleY(1); }
    30% { transform: scaleY(0.85) scaleX(1.15); }
    50% { transform: scaleY(1.1) scaleX(0.95); }
  }
  @keyframes cookieShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(10deg); }
  }
  @keyframes crumb1 {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(30px, -40px) scale(0.3); opacity: 0; }
  }
  @keyframes crumb2 {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(20px, 30px) scale(0.3); opacity: 0; }
  }
  @keyframes crumb3 {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(-15px, -50px) scale(0.3); opacity: 0; }
  }
  @keyframes plop {
    0% { transform: scaleX(1.3) scaleY(1.1) translateY(-40px); }
    40% { transform: scaleX(1.3) scaleY(1.1) translateY(-40px); }
    60% { transform: scaleX(1.6) scaleY(0.8) translateY(0); }
    75% { transform: scaleX(1.2) scaleY(1.2) translateY(-8px); }
    90% { transform: scaleX(1.35) scaleY(1.05) translateY(0); }
    100% { transform: scaleX(1.3) scaleY(1.1) translateY(0); }
  }
  @keyframes squish {
    0%, 40% { transform: scaleX(1) scaleY(1); }
    60% { transform: scaleX(1.3) scaleY(0.7); }
    75% { transform: scaleX(0.95) scaleY(1.05); }
    100% { transform: scaleX(1) scaleY(1); }
  }
  @keyframes popStar {
    0% { transform: scale(0) translateY(0); opacity: 0; }
    30% { transform: scale(1.2) translateY(-10px); opacity: 1; }
    100% { transform: scale(0) translateY(-30px); opacity: 0; }
  }
  @keyframes bellyBounce {
    0%, 100% { transform: scaleX(1.4) scaleY(1.1); }
    50% { transform: scaleX(1.5) scaleY(0.95); }
  }
  @keyframes tipScale {
    0%, 100% { transform: rotate(-15deg); }
    50% { transform: rotate(5deg); }
  }
  @keyframes tiltHead {
    0%, 100% { transform: rotate(0deg); }
    30% { transform: rotate(15deg); }
    60% { transform: rotate(-10deg); }
  }
  @keyframes bounceQ {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.2); }
  }
  @keyframes thoughtBubble {
    0%, 100% { transform: scale(0.8) translateY(0); opacity: 0.5; }
    50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
  }
  @keyframes searchSwing {
    0%, 100% { transform: rotate(-20deg) translateX(0); }
    50% { transform: rotate(20deg) translateX(30px); }
  }
  @keyframes stunned {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg); }
    75% { transform: rotate(8deg); }
  }
  @keyframes spinStar {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.3); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes pow {
    0% { transform: scale(0); opacity: 0; }
    20% { transform: scale(1.5); opacity: 1; }
    60% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0; }
  }
  @keyframes hitAndRun {
    0% { left: 20%; transform: scaleX(1); }
    30% { left: 45%; transform: scaleX(1); }
    35% { left: 45%; transform: scaleX(1); }
    100% { left: -20%; transform: scaleX(-1); }
  }
  @keyframes dustPuff {
    0% { transform: scale(0); opacity: 0; }
    30% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(2) translateX(-20px); opacity: 0; }
  }
  @keyframes peek {
    0%, 20% { transform: translateY(30px); }
    30%, 70% { transform: translateY(0); }
    80%, 100% { transform: translateY(30px); }
  }
  @keyframes peekEyes {
    0%, 20% { opacity: 0; transform: translateY(20px); }
    35%, 65% { opacity: 1; transform: translateY(0); }
    80%, 100% { opacity: 0; transform: translateY(20px); }
  }
  @keyframes containerShake {
    0%, 20%, 80%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-2deg); }
    30% { transform: rotate(2deg); }
    35% { transform: rotate(-1deg); }
    40% { transform: rotate(0deg); }
  }
  @keyframes petMotion {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
  }
  @keyframes patHand {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
    50% { transform: translateX(-50%) translateY(10px) rotate(-15deg); }
  }
  @keyframes happyWobble {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-5deg) scale(1.05); }
    75% { transform: rotate(5deg) scale(1.05); }
  }
  @keyframes heartFloat {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    30% { transform: translateY(-15px) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(0.3); opacity: 0; }
  }
  @keyframes feedLean {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(10deg) translateX(5px); }
  }
  @keyframes foodTravel {
    0% { transform: translateX(-20px) translateY(0); opacity: 1; }
    50% { transform: translateX(10px) translateY(-15px); opacity: 1; }
    100% { transform: translateX(20px) translateY(0); opacity: 0; }
  }
  @keyframes munch {
    0%, 100% { transform: scaleY(1); }
    40% { transform: scaleY(0.9) scaleX(1.1); }
    60% { transform: scaleY(1.1) scaleX(0.95); }
  }
`;

/* ============================================================
   READING TRACKER
   ============================================================ */
function ReadingTracker({ sentence }) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);
  const [progress, setProgress] = useState(0);
  const [charPositions, setCharPositions] = useState([]);
  const [trackWidth, setTrackWidth] = useState(0);
  const dragging = useRef(false);

  const chars = sentence.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cLeft = containerRect.left;
    const positions = charRefs.current.map((el) => {
      if (!el) return { mid: 0 };
      const r = el.getBoundingClientRect();
      return { mid: (r.left + r.right) / 2 - cLeft };
    });
    setCharPositions(positions);
    setTrackWidth(containerRect.width);
  }, [sentence]);

  const updateProgress = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setProgress(x);
  }, []);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateProgress(e.clientX);
  }, [updateProgress]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    updateProgress(e.clientX);
  }, [updateProgress]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const progressFraction = trackWidth > 0 ? progress / trackWidth : 0;

  return (
    <div className="w-full max-w-2xl">
      <div ref={containerRef} className="bg-white/80 rounded-2xl px-8 py-4 shadow-lg mb-3">
        <span className="text-5xl font-extrabold leading-snug">
          {chars.map((ch, i) => {
            const pos = charPositions[i];
            const isRead = pos ? progress >= pos.mid : false;
            return (
              <span
                key={i}
                ref={(el) => { charRefs.current[i] = el; }}
                className="transition-colors duration-150"
                style={{ color: isRead ? '#1e293b' : '#cbd5e1' }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mx-8 cursor-pointer"
        style={{ height: 56, touchAction: 'none' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 rounded-full bg-gray-200" style={{ height: 12 }} />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ height: 12, width: `${progressFraction * 100}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg border-4 border-white flex items-center justify-center"
          style={{
            width: 52, height: 52,
            left: `calc(${progressFraction * 100}% - 26px)`,
            transition: dragging.current ? 'none' : 'left 0.1s ease-out',
          }}
        >
          <span className="text-2xl select-none">👆</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   REWARD SCREEN
   ============================================================ */
function RewardScreen({ onDone }) {
  const [phase, setPhase] = useState('chest');
  const [gif] = useState(() => REWARD_GIFS[Math.floor(Math.random() * REWARD_GIFS.length)]);
  const [countdown, setCountdown] = useState(15);

  const handleOpen = useCallback(() => { setPhase('gif'); }, []);

  useEffect(() => {
    if (phase !== 'gif') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); onDone(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, onDone]);

  if (phase === 'chest') {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-200 flex flex-col items-center justify-center">
        <style>{`@keyframes chest-wobble { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }`}</style>
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 drop-shadow-md">Great job!</h1>
        <p className="text-2xl text-indigo-400 mb-8">You earned a treasure!</p>
        <button onClick={handleOpen} className="text-[10rem] leading-none transition-all hover:scale-110 active:scale-95"
          style={{ animation: 'chest-wobble 1s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}>🎁</button>
        <p className="text-xl text-amber-600 mt-6 font-bold animate-pulse">Tap to open!</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-300 via-indigo-200 to-sky-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 drop-shadow-md">🎉 Your Reward! 🎉</h1>
      <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400 max-w-lg w-full">
        <img src={gif} alt="Reward!" className="w-full" style={{ display: 'block' }} />
      </div>
      <p className="text-lg text-indigo-400 mt-4 font-bold">Back to levels in {countdown}s...</p>
      <button onClick={onDone} className="mt-3 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95">Skip</button>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SentencePractice2({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [finished, setFinished] = useState(false);

  if (selectedLevel === null) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-orange-200 overflow-auto">
        <button onClick={onBack} className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95">← Home</button>
        <div className="flex flex-col items-center pt-16 px-4">
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-2">Sentence Reading 2</h1>
          <p className="text-2xl text-indigo-400 mb-8">Choose a level!</p>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => { setSelectedLevel('random'); setSentences(generateRandom20()); setSentenceIdx(0); setConfirmed(false); setFinished(false); }}
              className="w-full py-6 rounded-2xl bg-gradient-to-br from-violet-200 to-purple-300 border-4 border-violet-400 shadow-lg text-2xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-4xl">🎲</span><br />Random 20
            </button>
            {levels.map((level, i) => (
              <button key={level.key}
                onClick={() => { setSelectedLevel(i); setSentences(generateSentences(level.patterns, SENTENCES_PER_LEVEL)); setSentenceIdx(0); setConfirmed(false); setFinished(false); }}
                className="w-full py-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-lg text-2xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="text-lg text-indigo-400">Level {i + 1}</span><br />{level.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const current = sentences[sentenceIdx];
  const isLast = sentenceIdx === sentences.length - 1;

  if (finished) {
    return <RewardScreen onDone={() => { setSelectedLevel(null); setFinished(false); }} />;
  }

  const goTo = (idx) => { setSentenceIdx(idx); setConfirmed(false); };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-orange-200 flex flex-col relative overflow-hidden">
      <style>{SCENE_STYLES}</style>

      <button onClick={() => setSelectedLevel(null)} className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95">← Levels</button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {sentences.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === sentenceIdx ? 'bg-indigo-500 scale-125' : i < sentenceIdx ? 'bg-green-400' : 'bg-gray-300'}`} />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10 bg-white/70 rounded-full px-4 py-1 shadow">
        <span className="text-lg font-extrabold text-indigo-600">{sentenceIdx + 1} / {sentences.length}</span>
      </div>

      {/* Sentence display */}
      <div className="flex-shrink-0 pt-14 pb-2 px-6 flex flex-col items-center justify-center">
        <ReadingTracker key={`${selectedLevel}-${sentenceIdx}`} sentence={current} />
      </div>

      {/* Scene area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {confirmed && <SceneRenderer sentence={current} />}
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 pb-8 px-6 flex items-center justify-between">
        <button onClick={() => sentenceIdx > 0 && goTo(sentenceIdx - 1)} disabled={sentenceIdx === 0}
          className={`rounded-full px-6 py-3 text-xl font-extrabold shadow-md transition-all ${sentenceIdx === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/80 hover:bg-white text-indigo-700 hover:scale-105 active:scale-95'}`}>← prev</button>

        {!confirmed ? (
          <button onClick={() => setConfirmed(true)}
            className="w-24 h-24 rounded-full bg-green-400 hover:bg-green-500 active:bg-green-600 text-white text-5xl font-bold shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center">✓</button>
        ) : (
          <button onClick={() => { if (isLast) setFinished(true); else goTo(sentenceIdx + 1); }}
            className="rounded-full px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-2xl font-extrabold shadow-xl transition-all hover:scale-105 active:scale-95">
            {isLast ? 'Finish! 🎉' : 'next →'}
          </button>
        )}

        <button onClick={() => !isLast && goTo(sentenceIdx + 1)} disabled={isLast}
          className={`rounded-full px-6 py-3 text-xl font-extrabold shadow-md transition-all ${isLast ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/80 hover:bg-white text-indigo-700 hover:scale-105 active:scale-95'}`}>next →</button>
      </div>
    </div>
  );
}
