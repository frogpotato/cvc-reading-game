import { useState, useEffect, useCallback, useRef } from 'react';
import sentenceSets from '../data/sentenceSets';
import Cat from './characters/Cat';
import Rat from './characters/Rat';
import Bat from './characters/Bat';
import Hen from './characters/Hen';
import Fox from './characters/Fox';
import Pig from './characters/Pig';
import Ant from './characters/Ant';
import Pup from './characters/Pup';
import Sam from './characters/Sam';
import Nan from './characters/Nan';

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

// Hard patterns only (level6+) for Random 20
const hardPatterns = levels.filter(l => ['level6', 'level7', 'level8'].includes(l.key)).flatMap(l => l.patterns);

// Generate a "Random 20" — only from hard levels (6+), at least 1 from each pattern type
function generateRandom20() {
  const result = [];
  for (const pattern of hardPatterns) {
    const idx = Math.floor(Math.random() * pattern.sentences.length);
    result.push(pattern.sentences[idx]);
  }
  while (result.length < SENTENCES_PER_LEVEL) {
    let sentence;
    let attempts = 0;
    do {
      sentence = weightedPick(hardPatterns);
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
   CHARACTER & EMOJI MAPS
   ============================================================ */
const SVG_CHARS = {
  cat: Cat, rat: Rat, bat: Bat, hen: Hen, fox: Fox, pig: Pig, ant: Ant, pup: Pup,
  sam: Sam, nan: Nan,
};

function Char({ name, size = 140, style, className }) {
  const Comp = SVG_CHARS[name];
  if (Comp) return <div style={style} className={className}><Comp size={size} /></div>;
  const fallback = E[name] || '❓';
  return <div style={{ fontSize: size * 0.55, lineHeight: 1, ...style }} className={className}>{fallback}</div>;
}

const E = {
  cat: '🐱', bat: '🦇', rat: '🐀', hen: '🐔', fox: '🦊', pig: '🐷', ant: '🐜', pup: '🐶',
  sam: '👦', nan: '👵',
  pen: '🖊️', net: '🥅', pan: '🍳', bin: '🗑️', box: '📦', hat: '🎩',
  mud: '🟤', bed: '🛏️', leg: '🦵', hip: '💃', lip: '👄',
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

  // "X ran and ran and ran and fell in the Y"
  if (s.includes('ran and ran') && s.includes('fell')) {
    const a = findNoun(words);
    const container = words[words.length - 1];
    return { type: 'ran-fell', a: a?.noun || 'pup', container };
  }
  // "sam pat the X and pet the Y"
  if (s.includes('pat') && s.includes('pet')) {
    const patIdx = words.indexOf('pat');
    const a = findNoun(words, patIdx + 1);
    const petIdx = words.indexOf('pet');
    const b = findNoun(words, petIdx + 1);
    return { type: 'pat-and-pet', a: a?.noun || 'hen', b: b?.noun || 'pup' };
  }
  // "X got mud on his Y"
  if (s.includes('got mud on')) {
    const a = findNoun(words);
    const lastWord = words[words.length - 1];
    return { type: 'got-mud', a: a?.noun || 'hen', bodyPart: lastWord };
  }
  // "X did a big hop in the mud"
  if (s.includes('big hop')) {
    const a = findNoun(words);
    return { type: 'big-hop', a: a?.noun || 'pup' };
  }
  // "X ran and hid in the Y"
  if (s.includes('ran and hid')) {
    const a = findNoun(words);
    const container = words[words.length - 1];
    return { type: 'ran-hid', a: a?.noun || 'pup', container };
  }
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
   ANIMATED SCENES — narrative physical animation
   Characters physically perform actions with comic timing.
   Action/mishap = slapstick. Gentle scenes = warm & tender.
   ============================================================ */

// -- Fat animal: waddles in, belly so big it jiggles, tries to walk but stumbles --
function FatScene({ noun, red }) {
  return (
    <div className="relative w-80 h-56 flex items-end justify-center">
      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200 rounded-full" />
      {/* The fat character waddling */}
      <div className="absolute bottom-2" style={{ animation: 'fatWaddle 3s ease-in-out infinite' }}>
        <div style={{
          animation: 'fatBellyJiggle 0.4s ease-in-out infinite',
          transform: 'scaleX(1.35) scaleY(1.1)',
          filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}>
          <Char name={noun} size={170} />
        </div>
      </div>
      {/* Sweat drops flying off from effort */}
      <div className="absolute top-4 right-12 text-2xl" style={{ animation: 'fatSweatFly 3s ease-out 0.5s infinite' }}>💧</div>
      <div className="absolute top-8 right-4 text-xl" style={{ animation: 'fatSweatFly 3s ease-out 1s infinite' }}>💧</div>
      {/* Belly rumble lines */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <div className="flex gap-1" style={{ animation: 'fatRumbleLines 1s ease-in-out infinite' }}>
          <div className="w-6 h-0.5 bg-amber-400 rounded" />
          <div className="w-4 h-0.5 bg-amber-400 rounded" />
          <div className="w-5 h-0.5 bg-amber-400 rounded" />
        </div>
      </div>
    </div>
  );
}

// -- Sam had a X: Sam reaches down, picks creature up, holds it up proudly, creature looks bewildered --
function SamHadScene({ noun }) {
  return (
    <div className="relative w-72 h-56 flex items-end justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-200 rounded-full" />
      {/* Sam lifting with effort */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ animation: 'samLift 3s ease-in-out infinite' }}>
        <Char name="sam" size={150} />
      </div>
      {/* The creature being held up — goes from ground to above Sam's head */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ animation: 'samHeldUp 3s ease-in-out infinite' }}>
        <div style={{ animation: 'heldDangle 1.5s ease-in-out 1.2s infinite' }}>
          <Char name={noun} size={90} />
        </div>
      </div>
      {/* Sam's pride sparkle — only appears when held up */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl" style={{ animation: 'samPrideSparkle 3s ease-out infinite' }}>✨</div>
    </div>
  );
}

// -- Bit it: animal opens mouth WIDE, lunges forward, CHOMP with teeth snapping, crumbs explode --
function BitScene({ noun, red }) {
  return (
    <div className="relative w-80 h-48 flex items-center justify-center">
      {/* Animal lunging to bite */}
      <div className="absolute left-4" style={{
        animation: 'bitLunge 1.8s ease-in-out infinite',
        filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
      }}>
        <div style={{ animation: 'bitMouthOpen 1.8s ease-in-out infinite' }}>
          <Char name={noun} size={140} />
        </div>
      </div>
      {/* Cookie that gets chomped — shrinks on impact */}
      <div className="absolute right-12" style={{ animation: 'bitCookieReact 1.8s ease-in-out infinite' }}>
        <span className="text-6xl">🍪</span>
      </div>
      {/* Crumb explosion — fast burst then slow float */}
      <div className="absolute right-4 top-4" style={{ animation: 'crumbBurst1 1.8s ease-out infinite' }}>
        <span className="text-lg">🍞</span>
      </div>
      <div className="absolute right-16 top-0" style={{ animation: 'crumbBurst2 1.8s ease-out infinite' }}>
        <span className="text-sm">🍞</span>
      </div>
      <div className="absolute right-0 top-12" style={{ animation: 'crumbBurst3 1.8s ease-out infinite' }}>
        <span className="text-xs">🍞</span>
      </div>
      {/* CHOMP text — appears with impact */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 font-black text-3xl text-red-500" style={{ animation: 'chompText 1.8s ease-out infinite' }}>
        CHOMP!
      </div>
    </div>
  );
}

// -- Sat: animal drops from above, MASSIVE squash on landing, cushion flattens, slow bounce recovery --
function SatScene({ noun }) {
  return (
    <div className="relative w-72 h-56 flex items-end justify-center">
      {/* Cushion that gets squashed */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ animation: 'satCushionSquash 2.5s ease-in-out infinite' }}>
        <span className="text-6xl">🛋️</span>
      </div>
      {/* Animal falling then bouncing */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ animation: 'satDrop 2.5s ease-in-out infinite' }}>
        <div style={{ animation: 'satSquashStretch 2.5s ease-in-out infinite' }}>
          <Char name={noun} size={150} />
        </div>
      </div>
      {/* Impact dust clouds — burst outward on landing */}
      <div className="absolute bottom-4 left-4" style={{ animation: 'satDustL 2.5s ease-out infinite' }}>
        <span className="text-2xl">💨</span>
      </div>
      <div className="absolute bottom-4 right-4" style={{ animation: 'satDustR 2.5s ease-out infinite' }}>
        <span className="text-2xl">💨</span>
      </div>
      {/* Screen shake effect via parent wobble */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-black text-xl text-amber-600" style={{ animation: 'satThud 2.5s ease-out infinite' }}>
        THUD!
      </div>
    </div>
  );
}

// -- Is fat: animal tries to stand on scale, scale CRASHES down, animal looks at own belly confused --
function IsFatScene({ noun, red }) {
  return (
    <div className="relative w-72 h-56 flex items-end justify-center">
      {/* Scale base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ animation: 'scaleCrash 2.5s ease-in-out infinite' }}>
        <span className="text-5xl">⚖️</span>
      </div>
      {/* Animal stepping onto scale, then looking down at belly */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ animation: 'fatStepOn 2.5s ease-in-out infinite' }}>
        <div style={{
          animation: 'fatLookDown 2.5s ease-in-out infinite',
          transform: 'scaleX(1.3) scaleY(1.1)',
          filter: red ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        }}>
          <Char name={noun} size={150} />
        </div>
      </div>
      {/* Scale number flying up comically */}
      <div className="absolute top-2 right-8 font-black text-2xl text-red-500" style={{ animation: 'scaleNumberFly 2.5s ease-out infinite' }}>
        {red ? '🔴' : '999'}
      </div>
      {/* Scale breaking particles */}
      <div className="absolute bottom-6 left-8 text-lg" style={{ animation: 'scaleSpark 2.5s ease-out infinite' }}>⚡</div>
      <div className="absolute bottom-8 right-8 text-lg" style={{ animation: 'scaleSpark 2.5s ease-out 0.1s infinite' }}>⚡</div>
    </div>
  );
}

// -- Question: animal scratches head, tilts, looks around confused, shrugs --
function QuestionScene({ noun, red, fatAndRed }) {
  return (
    <div className="relative w-72 h-52 flex items-center justify-center">
      {/* Animal looking around confused */}
      <div style={{
        animation: 'qLookAround 3.5s ease-in-out infinite',
        filter: (red || fatAndRed) ? 'hue-rotate(-30deg) saturate(2)' : undefined,
        transform: fatAndRed ? 'scaleX(1.3) scaleY(1.1)' : undefined,
      }}>
        <Char name={noun} size={150} />
      </div>
      {/* Question mark grows from small thought to big, pops */}
      <div className="absolute top-0 right-8 font-black text-indigo-600" style={{ animation: 'qMarkGrow 3.5s ease-in-out infinite' }}>
        ?
      </div>
      {/* Head scratch lines */}
      <div className="absolute top-8 left-1/2" style={{ animation: 'qScratchLines 3.5s ease-in-out infinite' }}>
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-gray-400 rounded" style={{ transform: 'rotate(-20deg)' }} />
          <div className="w-4 h-0.5 bg-gray-400 rounded" style={{ transform: 'rotate(10deg)' }} />
          <div className="w-3 h-0.5 bg-gray-400 rounded" style={{ transform: 'rotate(-15deg)' }} />
        </div>
      </div>
    </div>
  );
}

// -- Hit and ran: attacker charges in fast, WHAM!, victim spins, attacker bolts with legs-a-blur --
function HitAndRanScene({ a, b }) {
  return (
    <div className="relative w-[28rem] h-56 flex items-end justify-center overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200 rounded-full" />
      {/* Attacker: charges from left, hits, then ZOOMS off left with legs blurred */}
      <div className="absolute bottom-2" style={{ animation: 'hitCharge 3.5s ease-in-out infinite' }}>
        <div style={{ animation: 'hitLean 3.5s ease-in-out infinite' }}>
          <Char name={a} size={120} />
        </div>
      </div>
      {/* Victim: standing, gets WALLOPED, spins in place, sees stars */}
      <div className="absolute bottom-2 right-16" style={{ animation: 'hitVictimReact 3.5s ease-in-out infinite' }}>
        <Char name={b} size={120} />
      </div>
      {/* POW! impact — appears right at collision moment */}
      <div className="absolute top-4 right-24 font-black text-4xl" style={{ animation: 'hitPow 3.5s ease-out infinite' }}>
        <span className="text-red-500">POW!</span>
      </div>
      {/* Stars circling victim's head after hit */}
      <div className="absolute top-4 right-12 text-xl" style={{ animation: 'hitStarsCircle 3.5s ease-in-out infinite' }}>⭐</div>
      <div className="absolute top-2 right-20 text-lg" style={{ animation: 'hitStarsCircle2 3.5s ease-in-out infinite' }}>💫</div>
      {/* Speed lines behind fleeing attacker */}
      <div className="absolute bottom-10 left-4" style={{ animation: 'hitSpeedLines 3.5s ease-out infinite' }}>
        <div className="flex flex-col gap-1">
          <div className="w-12 h-0.5 bg-gray-400 rounded" />
          <div className="w-16 h-0.5 bg-gray-300 rounded" />
          <div className="w-10 h-0.5 bg-gray-400 rounded" />
        </div>
      </div>
      {/* Dust cloud where attacker fled */}
      <div className="absolute bottom-4 left-0 text-3xl" style={{ animation: 'hitDust 3.5s ease-out infinite' }}>💨</div>
    </div>
  );
}

// -- Hid: animal tiptoes to container, dives in headfirst (legs sticking up), slowly sinks in, lid rattles --
function HidScene({ noun, container }) {
  const containerEmoji = E[container] || '📦';
  return (
    <div className="relative w-64 h-56 flex items-end justify-center">
      {/* Container sitting on ground */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20" style={{ animation: 'hidContainerRattle 4s ease-in-out infinite' }}>
        <span className="text-8xl">{containerEmoji}</span>
      </div>
      {/* Animal tiptoeing then diving in */}
      <div className="absolute z-10" style={{ animation: 'hidTiptoeDive 4s ease-in-out infinite' }}>
        <div style={{ animation: 'hidFlipIn 4s ease-in-out infinite' }}>
          <Char name={noun} size={100} />
        </div>
      </div>
      {/* Legs sticking up from container — visible mid-dive */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-2xl" style={{ animation: 'hidLegsUp 4s ease-in-out infinite' }}>
        🦵🦵
      </div>
      {/* Eyes peeking from inside after settling */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 text-2xl" style={{ animation: 'hidPeekOut 4s ease-in-out infinite' }}>
        👀
      </div>
    </div>
  );
}

// -- Pet: tender scene. Petter slowly reaches toward the other, gentle strokes, other leans in, eyes close, purrs --
function PetScene({ a, b }) {
  return (
    <div className="relative w-80 h-48 flex items-end justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-100 rounded-full" />
      {/* Petter — leans in gently */}
      <div className="absolute bottom-2 left-8" style={{ animation: 'petLeanIn 3s ease-in-out infinite' }}>
        <Char name={a} size={130} />
      </div>
      {/* The one being pet — leans into the touch, body softens */}
      <div className="absolute bottom-2 right-8" style={{ animation: 'petReceive 3s ease-in-out infinite' }}>
        <div style={{ animation: 'petEyesClose 3s ease-in-out infinite' }}>
          <Char name={b} size={130} />
        </div>
      </div>
      {/* Gentle hearts — slow, floaty, not frantic */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl" style={{ animation: 'petHeartSlow 3s ease-in-out infinite' }}>❤️</div>
      <div className="absolute top-0 left-1/3 text-lg" style={{ animation: 'petHeartSlow 3s ease-in-out 1s infinite' }}>💕</div>
      {/* Purr/contentment lines near the pet-ee */}
      <div className="absolute bottom-16 right-8" style={{ animation: 'petPurrLines 3s ease-in-out 0.5s infinite' }}>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-4 h-0.5 bg-pink-300 rounded" style={{ animation: 'petPurrWave 1s ease-in-out infinite' }} />
          <div className="w-3 h-0.5 bg-pink-300 rounded" style={{ animation: 'petPurrWave 1s ease-in-out 0.2s infinite' }} />
          <div className="w-5 h-0.5 bg-pink-300 rounded" style={{ animation: 'petPurrWave 1s ease-in-out 0.4s infinite' }} />
        </div>
      </div>
    </div>
  );
}

// -- Fed: feeder leans forward, extends arm with food, food travels across, receiver opens mouth, gulps, happy belly pat --
function FedScene({ a, b }) {
  return (
    <div className="relative w-80 h-52 flex items-end justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-100 rounded-full" />
      {/* Feeder — leans forward to offer food */}
      <div className="absolute bottom-2 left-4" style={{ animation: 'fedOffer 3s ease-in-out infinite' }}>
        <Char name={a} size={130} />
      </div>
      {/* Food item — travels from feeder to eater */}
      <div className="absolute text-4xl" style={{ animation: 'fedFoodTravel 3s ease-in-out infinite' }}>
        🍖
      </div>
      {/* Eater — opens mouth wide, receives food, happy belly pat */}
      <div className="absolute bottom-2 right-4" style={{ animation: 'fedReceive 3s ease-in-out infinite' }}>
        <div style={{ animation: 'fedMouthOpen 3s ease-in-out infinite' }}>
          <Char name={b} size={130} />
        </div>
      </div>
      {/* Happy munch particles after eating */}
      <div className="absolute top-8 right-8 text-lg" style={{ animation: 'fedMunchBits 3s ease-out infinite' }}>✨</div>
      <div className="absolute top-4 right-16 text-sm" style={{ animation: 'fedMunchBits 3s ease-out 0.2s infinite' }}>✨</div>
    </div>
  );
}

// -- Got mud on: walking along happily, SPLAT mud hits body part, freeze, slow look down, disgusted shake --
function GotMudScene({ noun, bodyPart }) {
  const partEmoji = E[bodyPart] || '🤷';
  return (
    <div className="relative w-80 h-56 flex items-end justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200 rounded-full" />
      {/* Mud puddle on ground */}
      <div className="absolute bottom-0 left-8 w-20 h-4 bg-amber-700 rounded-full opacity-70" />
      {/* Animal walking then getting splatted */}
      <div className="absolute bottom-2" style={{ animation: 'mudWalkSplat 4s ease-in-out infinite' }}>
        <div style={{ animation: 'mudDisgustShake 4s ease-in-out infinite' }}>
          <Char name={noun} size={140} />
        </div>
      </div>
      {/* Mud splat hitting the body part — fast arc then stick */}
      <div className="absolute text-3xl" style={{ animation: 'mudBlobFly 4s ease-in-out infinite' }}>🟤</div>
      <div className="absolute text-2xl" style={{ animation: 'mudBlobFly2 4s ease-in-out infinite' }}>🟤</div>
      {/* The specific body part shown with mud dripping off it */}
      <div className="absolute bottom-4 right-8" style={{ animation: 'mudPartReveal 4s ease-in-out infinite' }}>
        <span className="text-4xl">{partEmoji}</span>
        <span className="absolute -top-1 -right-1 text-lg" style={{ animation: 'mudDripSlow 1.5s ease-in 2.5s infinite' }}>🟤</span>
      </div>
    </div>
  );
}

// -- Big hop in mud: crouches low (squash), LAUNCHES up (stretch), hangs at peak, comes DOWN with enormous SPLAT --
function BigHopScene({ noun }) {
  return (
    <div className="relative w-72 h-64 flex items-end justify-center overflow-hidden">
      {/* Mud puddle — ripples on impact */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-amber-700 rounded-full" style={{ animation: 'hopMudRipple 3s ease-in-out infinite' }} />
      {/* Animal: crouch, launch, hang, SPLAT */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ animation: 'hopLaunch 3s ease-in-out infinite' }}>
        <div style={{ animation: 'hopSquashStretch 3s ease-in-out infinite' }}>
          <Char name={noun} size={140} />
        </div>
      </div>
      {/* Mud explosion on landing — big globs flying outward */}
      <div className="absolute bottom-4 left-2 text-3xl" style={{ animation: 'hopMudExplodeL 3s ease-out infinite' }}>🟤</div>
      <div className="absolute bottom-4 right-2 text-3xl" style={{ animation: 'hopMudExplodeR 3s ease-out infinite' }}>🟤</div>
      <div className="absolute bottom-8 left-8 text-2xl" style={{ animation: 'hopMudExplodeL 3s ease-out 0.05s infinite' }}>🟤</div>
      <div className="absolute bottom-8 right-8 text-2xl" style={{ animation: 'hopMudExplodeR 3s ease-out 0.05s infinite' }}>🟤</div>
      {/* SPLAT text */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-black text-4xl text-amber-700" style={{ animation: 'hopSplatText 3s ease-out infinite' }}>
        SPLAT!
      </div>
      {/* Mud drops raining down after */}
      <div className="absolute top-16 left-6 text-lg" style={{ animation: 'hopMudRain 3s ease-in infinite' }}>🟤</div>
      <div className="absolute top-12 right-6 text-lg" style={{ animation: 'hopMudRain 3s ease-in 0.1s infinite' }}>🟤</div>
    </div>
  );
}

// -- Ran and fell: FAST run (legs a blur), hits obstacle, MASSIVE splat, bounce, slow slide in, one paw up --
function RanAndFellScene({ noun, container }) {
  const containerEmoji = container === 'mud' ? '🟤' : (E[container] || '📦');
  const isMud = container === 'mud';
  return (
    <div className="relative w-[28rem] h-56 flex items-end justify-center overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200 rounded-full" />
      {/* Container/mud at right side */}
      <div className="absolute bottom-0 right-8" style={{ animation: 'fellContainerShake 4s ease-in-out infinite' }}>
        <span className="text-6xl">{containerEmoji}</span>
        {isMud && <div className="w-24 h-5 bg-amber-700 rounded-full -mt-2" />}
      </div>
      {/* Animal running fast then faceplanting */}
      <div className="absolute bottom-2" style={{ animation: 'fellRun 4s ease-in-out infinite' }}>
        <div style={{ animation: 'fellBodyFlip 4s ease-in-out infinite' }}>
          <Char name={noun} size={110} />
        </div>
      </div>
      {/* Speed lines during run — fast horizontal streaks */}
      <div className="absolute bottom-10 left-0" style={{ animation: 'fellSpeedLines 4s ease-out infinite' }}>
        <div className="flex flex-col gap-1">
          <div className="w-20 h-1 bg-gray-300 rounded" />
          <div className="w-16 h-1 bg-gray-200 rounded" />
          <div className="w-24 h-1 bg-gray-300 rounded" />
        </div>
      </div>
      {/* Impact splash/stars */}
      <div className="absolute right-16 top-8 font-black text-3xl text-amber-700" style={{ animation: 'fellSplat 4s ease-out infinite' }}>
        {isMud ? 'SPLAT!' : 'CRASH!'}
      </div>
      {/* Stars circling after faceplant */}
      <div className="absolute right-12 top-4 text-xl" style={{ animation: 'fellDizzyStars 4s ease-in-out infinite' }}>⭐</div>
      <div className="absolute right-20 top-2 text-lg" style={{ animation: 'fellDizzyStars2 4s ease-in-out infinite' }}>💫</div>
      {/* Mud drip beat — the comic pause moment */}
      {isMud && <div className="absolute right-16 top-20 text-lg" style={{ animation: 'fellMudDrip 4s ease-in infinite' }}>🟤</div>}
    </div>
  );
}

// -- Pat and pet: Sam between two animals, gently pats one then the other, both lean in happily --
function PatAndPetScene({ a, b }) {
  return (
    <div className="relative w-96 h-48 flex items-end justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-100 rounded-full" />
      {/* First animal — leans into Sam's left hand */}
      <div className="absolute bottom-2 left-6" style={{ animation: 'patLeanIn 2.5s ease-in-out infinite' }}>
        <div style={{ animation: 'patHappySquint 2.5s ease-in-out infinite' }}>
          <Char name={a} size={105} />
        </div>
      </div>
      {/* Sam in the middle — alternates patting left then right */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ animation: 'patSamTurn 2.5s ease-in-out infinite' }}>
        <Char name="sam" size={130} />
      </div>
      {/* Second animal — leans into Sam's right hand */}
      <div className="absolute bottom-2 right-6" style={{ animation: 'patLeanIn 2.5s ease-in-out 1.25s infinite' }}>
        <div style={{ animation: 'patHappySquint 2.5s ease-in-out 1.25s infinite' }}>
          <Char name={b} size={105} />
        </div>
      </div>
      {/* Gentle hearts — slow, one at a time */}
      <div className="absolute top-2 left-12 text-xl" style={{ animation: 'petHeartSlow 2.5s ease-in-out infinite' }}>❤️</div>
      <div className="absolute top-0 right-12 text-xl" style={{ animation: 'petHeartSlow 2.5s ease-in-out 1.25s infinite' }}>❤️</div>
    </div>
  );
}

// -- Ran and hid: looks around nervously, bolts with speed lines, dives into container, container lid bounces --
function RanAndHidScene({ noun, container }) {
  const containerEmoji = container === 'mud' ? '🟤' : (E[container] || '📦');
  return (
    <div className="relative w-80 h-56 flex items-end justify-center overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-200 rounded-full" />
      {/* Container on the right */}
      <div className="absolute bottom-0 right-8 z-20" style={{ animation: 'ranHidContainerBounce 4s ease-in-out infinite' }}>
        <span className="text-7xl">{containerEmoji}</span>
      </div>
      {/* Animal — looks around nervously, then bolts, then dives in */}
      <div className="absolute bottom-2 z-10" style={{ animation: 'ranHidBolt 4s ease-in-out infinite' }}>
        <div style={{ animation: 'ranHidNervousLook 4s ease-in-out infinite' }}>
          <Char name={noun} size={100} />
        </div>
      </div>
      {/* Speed lines during bolt */}
      <div className="absolute bottom-10 left-4" style={{ animation: 'ranHidSpeedLines 4s ease-out infinite' }}>
        <div className="flex flex-col gap-1">
          <div className="w-12 h-0.5 bg-gray-400 rounded" />
          <div className="w-16 h-0.5 bg-gray-300 rounded" />
          <div className="w-10 h-0.5 bg-gray-400 rounded" />
        </div>
      </div>
      {/* Eyes peeking out after diving in */}
      <div className="absolute bottom-16 right-12 z-30 text-xl" style={{ animation: 'ranHidPeekEyes 4s ease-in-out infinite' }}>
        👀
      </div>
      {/* Dust cloud from sudden stop */}
      <div className="absolute bottom-4 right-24 text-2xl" style={{ animation: 'ranHidDust 4s ease-out infinite' }}>💨</div>
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
    case 'got-mud': return <GotMudScene noun={parsed.a} bodyPart={parsed.bodyPart} />;
    case 'big-hop': return <BigHopScene noun={parsed.a} />;
    case 'ran-fell': return <RanAndFellScene noun={parsed.a} container={parsed.container} />;
    case 'pat-and-pet': return <PatAndPetScene a={parsed.a} b={parsed.b} />;
    case 'ran-hid': return <RanAndHidScene noun={parsed.a} container={parsed.container} />;
    default: return <FatScene noun={parsed.a} />;
  }
}

/* ============================================================
   ALL THE KEYFRAME ANIMATIONS — narrative physical comedy
   ============================================================ */
const SCENE_STYLES = `
  /* === FAT SCENE === */
  @keyframes fatWaddle {
    0%, 100% { transform: translateX(-40px) rotate(-3deg); }
    15% { transform: translateX(-20px) rotate(3deg); }
    30% { transform: translateX(0px) rotate(-3deg); }
    45% { transform: translateX(15px) rotate(3deg); }
    55% { transform: translateX(20px) rotate(0deg); }
    60%, 90% { transform: translateX(20px) rotate(0deg); }
    95% { transform: translateX(20px) rotate(-5deg); }
  }
  @keyframes fatBellyJiggle {
    0%, 100% { transform: scaleX(1.35) scaleY(1.1); }
    50% { transform: scaleX(1.4) scaleY(1.05); }
  }
  @keyframes fatSweatFly {
    0%, 40% { transform: translate(0, 0); opacity: 0; }
    45% { opacity: 1; }
    100% { transform: translate(30px, -40px); opacity: 0; }
  }
  @keyframes fatRumbleLines {
    0%, 100% { opacity: 0; }
    50%, 80% { opacity: 0.6; }
  }

  /* === SAM HAD SCENE === */
  @keyframes samLift {
    0%, 30% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(5px); }
    55%, 100% { transform: translateX(-50%) translateY(0); }
  }
  @keyframes samHeldUp {
    0%, 30% { bottom: 10px; opacity: 1; }
    35% { bottom: 10px; }
    55% { bottom: 160px; }
    60%, 100% { bottom: 150px; }
  }
  @keyframes heldDangle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-12deg); }
    75% { transform: rotate(12deg); }
  }
  @keyframes samPrideSparkle {
    0%, 50% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.4); opacity: 1; }
    80% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.5); opacity: 0; }
  }

  /* === BIT SCENE === */
  @keyframes bitLunge {
    0%, 30% { transform: translateX(0); }
    40% { transform: translateX(-10px) scaleX(0.9); }
    50% { transform: translateX(50px) scaleX(1.15); }
    55% { transform: translateX(45px) scaleX(1); }
    60%, 100% { transform: translateX(40px); }
  }
  @keyframes bitMouthOpen {
    0%, 30% { transform: scaleY(1); }
    38% { transform: scaleY(1.15); }
    50% { transform: scaleY(0.85) scaleX(1.2); }
    55% { transform: scaleY(1.05); }
    60%, 100% { transform: scaleY(1); }
  }
  @keyframes bitCookieReact {
    0%, 48% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(0.7) rotate(15deg); }
    55% { transform: scale(0.8) rotate(-5deg); }
    60%, 100% { transform: scale(0.6) rotate(0deg); opacity: 1; }
  }
  @keyframes crumbBurst1 {
    0%, 48% { transform: translate(0,0) scale(0); opacity: 0; }
    52% { transform: translate(20px, -30px) scale(1.2); opacity: 1; }
    100% { transform: translate(50px, -60px) scale(0.3); opacity: 0; }
  }
  @keyframes crumbBurst2 {
    0%, 50% { transform: translate(0,0) scale(0); opacity: 0; }
    55% { transform: translate(-10px, -40px) scale(1); opacity: 1; }
    100% { transform: translate(-30px, -70px) scale(0.2); opacity: 0; }
  }
  @keyframes crumbBurst3 {
    0%, 50% { transform: translate(0,0) scale(0); opacity: 0; }
    58% { transform: translate(30px, 10px) scale(0.8); opacity: 1; }
    100% { transform: translate(50px, 20px) scale(0.2); opacity: 0; }
  }
  @keyframes chompText {
    0%, 46% { transform: translateX(-50%) scale(0); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.6); opacity: 1; }
    60% { transform: translateX(-50%) scale(1); opacity: 1; }
    80%, 100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
  }

  /* === SAT SCENE === */
  @keyframes satDrop {
    0%, 20% { bottom: 200px; }
    50% { bottom: 30px; }
    55% { bottom: 50px; }
    62% { bottom: 30px; }
    66% { bottom: 38px; }
    70%, 100% { bottom: 30px; }
  }
  @keyframes satSquashStretch {
    0%, 20% { transform: scaleX(0.85) scaleY(1.2); }
    48% { transform: scaleX(0.9) scaleY(1.1); }
    50% { transform: scaleX(1.5) scaleY(0.6); }
    55% { transform: scaleX(0.9) scaleY(1.15); }
    62% { transform: scaleX(1.2) scaleY(0.85); }
    70%, 100% { transform: scaleX(1.05) scaleY(0.98); }
  }
  @keyframes satCushionSquash {
    0%, 48% { transform: scaleX(1) scaleY(1); }
    50% { transform: scaleX(1.4) scaleY(0.5); }
    55% { transform: scaleX(1.1) scaleY(0.9); }
    62% { transform: scaleX(1.2) scaleY(0.7); }
    70%, 100% { transform: scaleX(1.15) scaleY(0.75); }
  }
  @keyframes satDustL {
    0%, 48% { transform: translate(0, 0) scale(0); opacity: 0; }
    52% { transform: translate(-30px, -10px) scale(1.3); opacity: 0.8; }
    70%, 100% { transform: translate(-50px, -20px) scale(0.5); opacity: 0; }
  }
  @keyframes satDustR {
    0%, 48% { transform: translate(0, 0) scale(0); opacity: 0; }
    52% { transform: translate(30px, -10px) scale(1.3); opacity: 0.8; }
    70%, 100% { transform: translate(50px, -20px) scale(0.5); opacity: 0; }
  }
  @keyframes satThud {
    0%, 48% { transform: translateX(-50%) scale(0); opacity: 0; }
    52% { transform: translateX(-50%) scale(1.5); opacity: 1; }
    60% { transform: translateX(-50%) scale(1); opacity: 1; }
    80%, 100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
  }

  /* === IS FAT SCENE === */
  @keyframes fatStepOn {
    0%, 20% { bottom: 60px; left: 20%; }
    35% { bottom: 30px; left: 40%; }
    40%, 100% { bottom: 30px; left: 50%; transform: translateX(-50%); }
  }
  @keyframes fatLookDown {
    0%, 50% { transform: scaleX(1.3) scaleY(1.1) rotate(0deg); }
    60%, 80% { transform: scaleX(1.3) scaleY(1.1) rotate(10deg); }
    90%, 100% { transform: scaleX(1.3) scaleY(1.1) rotate(0deg); }
  }
  @keyframes scaleCrash {
    0%, 35% { transform: translateX(-50%) rotate(0deg); }
    40% { transform: translateX(-50%) rotate(-20deg); }
    50% { transform: translateX(-50%) rotate(5deg); }
    60%, 100% { transform: translateX(-50%) rotate(-15deg); }
  }
  @keyframes scaleNumberFly {
    0%, 38% { transform: translate(0,0) scale(0); opacity: 0; }
    45% { transform: translate(0, -20px) scale(1.3); opacity: 1; }
    70% { transform: translate(10px, -50px) scale(1); opacity: 1; }
    100% { transform: translate(20px, -70px) scale(0.5); opacity: 0; }
  }
  @keyframes scaleSpark {
    0%, 38% { transform: scale(0); opacity: 0; }
    42% { transform: scale(1.5); opacity: 1; }
    60%, 100% { transform: scale(0); opacity: 0; }
  }

  /* === QUESTION SCENE === */
  @keyframes qLookAround {
    0%, 10% { transform: rotate(0deg); }
    20% { transform: rotate(12deg); }
    35% { transform: rotate(-8deg); }
    50% { transform: rotate(0deg) translateY(-3px); }
    65% { transform: rotate(15deg); }
    80% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes qMarkGrow {
    0%, 15% { font-size: 0px; opacity: 0; }
    25% { font-size: 80px; opacity: 1; }
    40% { font-size: 70px; }
    55% { font-size: 90px; }
    70%, 85% { font-size: 75px; opacity: 1; }
    100% { font-size: 0px; opacity: 0; }
  }
  @keyframes qScratchLines {
    0%, 15% { opacity: 0; }
    25%, 70% { opacity: 0.5; }
    100% { opacity: 0; }
  }

  /* === HIT AND RAN SCENE === */
  @keyframes hitCharge {
    0% { left: -15%; bottom: 8px; transform: scaleX(1); }
    25% { left: 40%; bottom: 8px; transform: scaleX(1); }
    30% { left: 48%; bottom: 8px; transform: scaleX(1); }
    35%, 40% { left: 48%; bottom: 8px; transform: scaleX(1); }
    50% { left: 30%; bottom: 8px; transform: scaleX(-1); }
    100% { left: -25%; bottom: 8px; transform: scaleX(-1); }
  }
  @keyframes hitLean {
    0%, 20% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    30% { transform: rotate(0deg); }
    35%, 100% { transform: rotate(0deg); }
  }
  @keyframes hitVictimReact {
    0%, 28% { transform: rotate(0deg) translateX(0); }
    30% { transform: rotate(0deg) translateX(0); }
    32% { transform: rotate(20deg) translateX(15px); }
    38% { transform: rotate(-15deg) translateX(-5px); }
    44% { transform: rotate(360deg) translateX(0); }
    55%, 100% { transform: rotate(0deg) translateX(5px); }
  }
  @keyframes hitPow {
    0%, 28% { transform: scale(0); opacity: 0; }
    30% { transform: scale(2); opacity: 1; }
    40% { transform: scale(1.2); opacity: 1; }
    55%, 100% { transform: scale(0); opacity: 0; }
  }
  @keyframes hitStarsCircle {
    0%, 35% { transform: translate(0,0) rotate(0deg); opacity: 0; }
    40%, 95% { opacity: 1; }
    40% { transform: translate(0, -10px) rotate(0deg); }
    55% { transform: translate(15px, 0) rotate(120deg); }
    70% { transform: translate(0, 10px) rotate(240deg); }
    85% { transform: translate(-15px, 0) rotate(360deg); }
    95% { transform: translate(0, -10px) rotate(440deg); }
    100% { opacity: 0; }
  }
  @keyframes hitStarsCircle2 {
    0%, 35% { transform: translate(0,0) rotate(0deg); opacity: 0; }
    40%, 95% { opacity: 1; }
    40% { transform: translate(0, 10px) rotate(0deg); }
    55% { transform: translate(-12px, 0) rotate(-90deg); }
    70% { transform: translate(0, -10px) rotate(-180deg); }
    85% { transform: translate(12px, 0) rotate(-270deg); }
    95% { transform: translate(0, 10px) rotate(-360deg); }
    100% { opacity: 0; }
  }
  @keyframes hitSpeedLines {
    0%, 45% { opacity: 0; }
    50%, 85% { opacity: 0.6; }
    100% { opacity: 0; transform: translateX(-30px); }
  }
  @keyframes hitDust {
    0%, 45% { transform: scale(0); opacity: 0; }
    55% { transform: scale(1.5); opacity: 0.7; }
    100% { transform: scale(2.5) translateX(-20px); opacity: 0; }
  }

  /* === HID SCENE === */
  @keyframes hidTiptoeDive {
    0% { left: -20%; bottom: 8px; }
    25% { left: 25%; bottom: 8px; }
    35% { left: 35%; bottom: 8px; }
    50% { left: 40%; bottom: 60px; }
    60% { left: 42%; bottom: 20px; }
    65%, 100% { left: 42%; bottom: 30px; opacity: 0; }
  }
  @keyframes hidFlipIn {
    0%, 35% { transform: rotate(0deg); }
    50% { transform: rotate(-45deg); }
    60% { transform: rotate(-120deg); }
    65%, 100% { transform: rotate(-180deg); }
  }
  @keyframes hidLegsUp {
    0%, 55% { opacity: 0; transform: translateY(0); }
    60% { opacity: 1; transform: translateY(-10px); }
    70% { opacity: 1; transform: translateY(-5px); }
    78% { opacity: 1; transform: translateY(0px); }
    82%, 100% { opacity: 0; transform: translateY(10px); }
  }
  @keyframes hidContainerRattle {
    0%, 55% { transform: translateX(-50%) rotate(0deg); }
    58% { transform: translateX(-50%) rotate(-5deg); }
    61% { transform: translateX(-50%) rotate(5deg); }
    64% { transform: translateX(-50%) rotate(-3deg); }
    67% { transform: translateX(-50%) rotate(2deg); }
    70%, 100% { transform: translateX(-50%) rotate(0deg); }
  }
  @keyframes hidPeekOut {
    0%, 78% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    85%, 92% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(5px); }
  }

  /* === PET SCENE (gentle, warm) === */
  @keyframes petLeanIn {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    30%, 70% { transform: translateX(15px) rotate(5deg); }
  }
  @keyframes petReceive {
    0%, 20% { transform: translateX(0) rotate(0deg); }
    30%, 80% { transform: translateX(-10px) rotate(-5deg) scaleY(0.95); }
    100% { transform: translateX(0) rotate(0deg); }
  }
  @keyframes petEyesClose {
    0%, 20% { transform: scaleY(1); }
    30%, 80% { transform: scaleY(0.97); }
    100% { transform: scaleY(1); }
  }
  @keyframes petHeartSlow {
    0% { transform: translateY(0) scale(0); opacity: 0; }
    20% { transform: translateY(-5px) scale(1); opacity: 0.8; }
    60% { transform: translateY(-25px) scale(0.9); opacity: 0.6; }
    100% { transform: translateY(-45px) scale(0.4); opacity: 0; }
  }
  @keyframes petPurrLines {
    0%, 25% { opacity: 0; }
    35%, 75% { opacity: 0.5; }
    100% { opacity: 0; }
  }
  @keyframes petPurrWave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
  }

  /* === FED SCENE === */
  @keyframes fedOffer {
    0%, 20% { transform: rotate(0deg) translateX(0); }
    30%, 50% { transform: rotate(8deg) translateX(15px); }
    60%, 100% { transform: rotate(0deg) translateX(0); }
  }
  @keyframes fedFoodTravel {
    0%, 25% { left: 100px; bottom: 80px; transform: scale(1); opacity: 1; }
    35% { left: 130px; bottom: 100px; transform: scale(1.1); opacity: 1; }
    50% { left: 200px; bottom: 85px; transform: scale(1); opacity: 1; }
    55% { left: 210px; bottom: 80px; transform: scale(0.5); opacity: 0; }
    56%, 100% { opacity: 0; }
  }
  @keyframes fedReceive {
    0%, 45% { transform: translateX(0); }
    50% { transform: translateX(-10px); }
    55%, 70% { transform: translateX(-5px) scaleY(1.05); }
    80%, 100% { transform: translateX(0); }
  }
  @keyframes fedMouthOpen {
    0%, 40% { transform: scaleY(1); }
    45% { transform: scaleY(1.12); }
    55% { transform: scaleY(0.92) scaleX(1.1); }
    65%, 100% { transform: scaleY(1); }
  }
  @keyframes fedMunchBits {
    0%, 55% { transform: translate(0,0) scale(0); opacity: 0; }
    60% { transform: translate(-5px, -10px) scale(1); opacity: 1; }
    100% { transform: translate(-15px, -30px) scale(0.3); opacity: 0; }
  }

  /* === GOT MUD ON SCENE === */
  @keyframes mudWalkSplat {
    0% { left: -10%; bottom: 8px; }
    25% { left: 20%; bottom: 8px; }
    30% { left: 25%; bottom: 8px; }
    35%, 100% { left: 35%; bottom: 8px; }
  }
  @keyframes mudDisgustShake {
    0%, 32% { transform: rotate(0deg); }
    35% { transform: rotate(-3deg); }
    50%, 60% { transform: rotate(0deg); }
    65% { transform: rotate(5deg); }
    70% { transform: rotate(-8deg); }
    75% { transform: rotate(6deg); }
    80% { transform: rotate(-4deg); }
    85%, 100% { transform: rotate(0deg); }
  }
  @keyframes mudBlobFly {
    0%, 28% { left: 15%; bottom: 20px; transform: scale(0); opacity: 0; }
    30% { left: 15%; bottom: 20px; transform: scale(0.5); opacity: 1; }
    35% { left: 40%; bottom: 80px; transform: scale(1.2); opacity: 1; }
    40%, 100% { left: 45%; bottom: 60px; transform: scale(0.8); opacity: 0.9; }
  }
  @keyframes mudBlobFly2 {
    0%, 30% { left: 10%; bottom: 15px; transform: scale(0); opacity: 0; }
    33% { left: 10%; bottom: 15px; transform: scale(0.3); opacity: 1; }
    38% { left: 35%; bottom: 100px; transform: scale(1); opacity: 1; }
    43%, 100% { left: 38%; bottom: 85px; transform: scale(0.6); opacity: 0.8; }
  }
  @keyframes mudPartReveal {
    0%, 50% { opacity: 0; transform: scale(0.5); }
    60% { opacity: 1; transform: scale(1.2); }
    70%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes mudDripSlow {
    0% { transform: translateY(0); opacity: 0.8; }
    100% { transform: translateY(15px); opacity: 0; }
  }

  /* === BIG HOP SCENE === */
  @keyframes hopLaunch {
    0%, 15% { bottom: 24px; }
    18% { bottom: 15px; }
    40% { bottom: 200px; }
    45% { bottom: 195px; }
    70% { bottom: 24px; }
    73% { bottom: 40px; }
    78% { bottom: 24px; }
    80%, 100% { bottom: 24px; }
  }
  @keyframes hopSquashStretch {
    0%, 12% { transform: scaleX(1) scaleY(1); }
    15% { transform: scaleX(1.35) scaleY(0.65); }
    25% { transform: scaleX(0.8) scaleY(1.25); }
    40%, 45% { transform: scaleX(0.85) scaleY(1.15); }
    68% { transform: scaleX(0.9) scaleY(1.1); }
    70% { transform: scaleX(1.6) scaleY(0.5); }
    73% { transform: scaleX(1.1) scaleY(0.9); }
    78% { transform: scaleX(1.3) scaleY(0.7); }
    85%, 100% { transform: scaleX(1.1) scaleY(0.95); }
  }
  @keyframes hopMudRipple {
    0%, 68% { transform: translateX(-50%) scaleX(1); }
    72% { transform: translateX(-50%) scaleX(1.4); }
    80% { transform: translateX(-50%) scaleX(1.15); }
    90%, 100% { transform: translateX(-50%) scaleX(1.05); }
  }
  @keyframes hopMudExplodeL {
    0%, 68% { transform: translate(0, 0) scale(0); opacity: 0; }
    72% { transform: translate(-40px, -50px) scale(1.3); opacity: 1; }
    100% { transform: translate(-60px, -20px) scale(0.4); opacity: 0; }
  }
  @keyframes hopMudExplodeR {
    0%, 68% { transform: translate(0, 0) scale(0); opacity: 0; }
    72% { transform: translate(40px, -50px) scale(1.3); opacity: 1; }
    100% { transform: translate(60px, -20px) scale(0.4); opacity: 0; }
  }
  @keyframes hopSplatText {
    0%, 68% { transform: translateX(-50%) scale(0); opacity: 0; }
    72% { transform: translateX(-50%) scale(2); opacity: 1; }
    80% { transform: translateX(-50%) scale(1.2); opacity: 1; }
    95%, 100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
  }
  @keyframes hopMudRain {
    0%, 72% { transform: translateY(-80px); opacity: 0; }
    78% { opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; }
  }

  /* === RAN AND FELL SCENE === */
  @keyframes fellRun {
    0% { left: -15%; bottom: 8px; }
    35% { left: 45%; bottom: 8px; }
    40% { left: 52%; bottom: 8px; }
    50% { left: 58%; bottom: 40px; }
    60% { left: 60%; bottom: 8px; }
    65% { left: 60%; bottom: 20px; }
    70% { left: 60%; bottom: 8px; }
    75%, 100% { left: 58%; bottom: 8px; }
  }
  @keyframes fellBodyFlip {
    0%, 38% { transform: scaleX(1) rotate(0deg); }
    42% { transform: scaleX(1) rotate(-15deg); }
    50% { transform: scaleX(1) rotate(-60deg); }
    55% { transform: scaleX(1) rotate(-90deg); }
    60% { transform: scaleX(1) rotate(-85deg) scaleY(1.1); }
    65% { transform: scaleX(1) rotate(-90deg); }
    70%, 100% { transform: scaleX(1) rotate(-90deg); }
  }
  @keyframes fellSpeedLines {
    0% { opacity: 0.7; transform: translateX(0); }
    35% { opacity: 0.7; transform: translateX(0); }
    40%, 100% { opacity: 0; transform: translateX(-40px); }
  }
  @keyframes fellSplat {
    0%, 48% { transform: scale(0); opacity: 0; }
    52% { transform: scale(1.8); opacity: 1; }
    60% { transform: scale(1.2); opacity: 1; }
    80%, 100% { transform: scale(0.8); opacity: 0; }
  }
  @keyframes fellContainerShake {
    0%, 48% { transform: rotate(0deg); }
    50% { transform: rotate(-6deg); }
    52% { transform: rotate(4deg); }
    54% { transform: rotate(-2deg); }
    56%, 100% { transform: rotate(0deg); }
  }
  @keyframes fellDizzyStars {
    0%, 55% { opacity: 0; transform: translate(0,0) rotate(0deg); }
    60%, 95% { opacity: 1; }
    60% { transform: translate(0, -8px) rotate(0deg); }
    70% { transform: translate(12px, 0) rotate(120deg); }
    80% { transform: translate(0, 8px) rotate(240deg); }
    90% { transform: translate(-12px, 0) rotate(360deg); }
    100% { opacity: 0; }
  }
  @keyframes fellDizzyStars2 {
    0%, 58% { opacity: 0; transform: translate(0,0) rotate(0deg); }
    63%, 95% { opacity: 1; }
    63% { transform: translate(0, 8px) rotate(0deg); }
    73% { transform: translate(-10px, 0) rotate(-120deg); }
    83% { transform: translate(0, -8px) rotate(-240deg); }
    93% { transform: translate(10px, 0) rotate(-360deg); }
    100% { opacity: 0; }
  }
  @keyframes fellMudDrip {
    0%, 70% { opacity: 0; transform: translateY(0); }
    75% { opacity: 0.8; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }

  /* === PAT AND PET SCENE (gentle) === */
  @keyframes patLeanIn {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    30%, 60% { transform: translateX(8px) rotate(-3deg) scaleY(0.97); }
  }
  @keyframes patHappySquint {
    0%, 20% { transform: scaleY(1); }
    30%, 60% { transform: scaleY(0.97); }
    100% { transform: scaleY(1); }
  }
  @keyframes patSamTurn {
    0%, 20% { transform: translateX(-50%) rotate(-5deg); }
    45%, 55% { transform: translateX(-50%) rotate(0deg); }
    80%, 100% { transform: translateX(-50%) rotate(5deg); }
  }

  /* === RAN AND HID SCENE === */
  @keyframes ranHidBolt {
    0%, 10% { left: 10%; bottom: 8px; }
    12% { left: 10%; bottom: 8px; transform: rotate(5deg); }
    15% { left: 10%; bottom: 8px; transform: rotate(-5deg); }
    18% { left: 10%; bottom: 8px; transform: rotate(3deg); }
    25% { left: 15%; bottom: 8px; transform: rotate(0deg); }
    50% { left: 55%; bottom: 8px; }
    55% { left: 55%; bottom: 30px; }
    65%, 100% { left: 55%; bottom: 15px; opacity: 0; }
  }
  @keyframes ranHidNervousLook {
    0%, 5% { transform: rotate(0deg); }
    8% { transform: rotate(15deg); }
    12% { transform: rotate(-10deg); }
    16% { transform: rotate(8deg); }
    20%, 100% { transform: rotate(0deg); }
  }
  @keyframes ranHidContainerBounce {
    0%, 58% { transform: rotate(0deg); }
    60% { transform: rotate(-4deg); }
    63% { transform: rotate(3deg); }
    66% { transform: rotate(-2deg); }
    69%, 100% { transform: rotate(0deg); }
  }
  @keyframes ranHidSpeedLines {
    0%, 20% { opacity: 0; }
    30%, 48% { opacity: 0.6; }
    55%, 100% { opacity: 0; transform: translateX(-30px); }
  }
  @keyframes ranHidPeekEyes {
    0%, 72% { opacity: 0; transform: translateY(8px); }
    80%, 92% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(5px); }
  }
  @keyframes ranHidDust {
    0%, 52% { transform: scale(0); opacity: 0; }
    58% { transform: scale(1.3); opacity: 0.7; }
    80%, 100% { transform: scale(2) translateX(-15px); opacity: 0; }
  }
`;

/* ============================================================
   SENTENCE DISPLAY (simple black text)
   ============================================================ */
function SentenceDisplay({ sentence }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white/80 rounded-2xl px-8 py-4 shadow-lg">
        <span className="text-5xl font-extrabold leading-snug text-slate-900">
          {sentence}
        </span>
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
        <SentenceDisplay key={`${selectedLevel}-${sentenceIdx}`} sentence={current} />
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
