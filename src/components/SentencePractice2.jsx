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
      // Pick a random sentence from this pattern
      const idx = Math.floor(Math.random() * pattern.sentences.length);
      return pattern.sentences[idx];
    }
    r -= patternTotal;
  }
  // Fallback
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
  // 1 random sentence from each pattern type
  for (const pattern of allPatterns) {
    const idx = Math.floor(Math.random() * pattern.sentences.length);
    result.push(pattern.sentences[idx]);
  }
  // Fill remaining slots with weighted picks across all patterns
  while (result.length < SENTENCES_PER_LEVEL) {
    let sentence;
    let attempts = 0;
    do {
      sentence = weightedPick(allPatterns);
      attempts++;
    } while (result.length > 0 && sentence === result[result.length - 1] && attempts < 20);
    result.push(sentence);
  }
  // Shuffle so the guaranteed ones aren't always first
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 rounded-full bg-gray-200"
          style={{ height: 12 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
          style={{ height: 12, width: `${progressFraction * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg border-4 border-white flex items-center justify-center"
          style={{
            width: 52,
            height: 52,
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

  const handleOpen = useCallback(() => {
    setPhase('gif');
  }, []);

  useEffect(() => {
    if (phase !== 'gif') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, onDone]);

  if (phase === 'chest') {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-200 flex flex-col items-center justify-center">
        <style>{`
          @keyframes chest-wobble { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        `}</style>
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 drop-shadow-md">Great job!</h1>
        <p className="text-2xl text-indigo-400 mb-8">You earned a treasure!</p>
        <button
          onClick={handleOpen}
          className="text-[10rem] leading-none transition-all hover:scale-110 active:scale-95"
          style={{ animation: 'chest-wobble 1s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}
        >
          🎁
        </button>
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
      <button
        onClick={onDone}
        className="mt-3 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95"
      >
        Skip
      </button>
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

  // Level select screen
  if (selectedLevel === null) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-orange-200 overflow-auto">
        <button
          onClick={onBack}
          className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          ← Home
        </button>
        <div className="flex flex-col items-center pt-16 px-4">
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-2">
            Sentence Reading 2
          </h1>
          <p className="text-2xl text-indigo-400 mb-8">Choose a level!</p>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => {
                setSelectedLevel('random');
                setSentences(generateRandom20());
                setSentenceIdx(0);
                setConfirmed(false);
                setFinished(false);
              }}
              className="w-full py-6 rounded-2xl bg-gradient-to-br from-violet-200 to-purple-300 border-4 border-violet-400 shadow-lg text-2xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-4xl">🎲</span>
              <br />
              Random 20
            </button>

            {levels.map((level, i) => (
              <button
                key={level.key}
                onClick={() => {
                  setSelectedLevel(i);
                  setSentences(generateSentences(level.patterns, SENTENCES_PER_LEVEL));
                  setSentenceIdx(0);
                  setConfirmed(false);
                  setFinished(false);
                }}
                className="w-full py-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-lg text-2xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="text-lg text-indigo-400">Level {i + 1}</span>
                <br />
                {level.name}
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
    return (
      <RewardScreen onDone={() => { setSelectedLevel(null); setFinished(false); }} />
    );
  }

  const goTo = (idx) => {
    setSentenceIdx(idx);
    setConfirmed(false);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-orange-200 flex flex-col relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => setSelectedLevel(null)}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95"
      >
        ← Levels
      </button>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {sentences.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === sentenceIdx ? 'bg-indigo-500 scale-125' : i < sentenceIdx ? 'bg-green-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Sentence counter */}
      <div className="absolute top-4 right-4 z-10 bg-white/70 rounded-full px-4 py-1 shadow">
        <span className="text-lg font-extrabold text-indigo-600">{sentenceIdx + 1} / {sentences.length}</span>
      </div>

      {/* Sentence display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <ReadingTracker key={`${selectedLevel}-${sentenceIdx}`} sentence={current} />

        {/* Confirmed feedback */}
        {confirmed && (
          <div className="text-6xl animate-bounce">
            ⭐
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 pb-8 px-6 flex items-center justify-between">
        <button
          onClick={() => sentenceIdx > 0 && goTo(sentenceIdx - 1)}
          disabled={sentenceIdx === 0}
          className={`rounded-full px-6 py-3 text-xl font-extrabold shadow-md transition-all ${
            sentenceIdx === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white/80 hover:bg-white text-indigo-700 hover:scale-105 active:scale-95'
          }`}
        >
          ← prev
        </button>

        {!confirmed ? (
          <button
            onClick={() => setConfirmed(true)}
            className="w-24 h-24 rounded-full bg-green-400 hover:bg-green-500 active:bg-green-600 text-white text-5xl font-bold shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            ✓
          </button>
        ) : (
          <button
            onClick={() => {
              if (isLast) {
                setFinished(true);
              } else {
                goTo(sentenceIdx + 1);
              }
            }}
            className="rounded-full px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-2xl font-extrabold shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {isLast ? 'Finish! 🎉' : 'next →'}
          </button>
        )}

        <button
          onClick={() => !isLast && goTo(sentenceIdx + 1)}
          disabled={isLast}
          className={`rounded-full px-6 py-3 text-xl font-extrabold shadow-md transition-all ${
            isLast
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white/80 hover:bg-white text-indigo-700 hover:scale-105 active:scale-95'
          }`}
        >
          next →
        </button>
      </div>
    </div>
  );
}
