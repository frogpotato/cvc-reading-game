import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import useSounds from '../hooks/useSounds';

/* ============================================================
   LEVEL DATA — 8 words per level, 2 bubbles each = 16 total
   ============================================================ */
const LEVELS = [
  { name: 'a / i vowels', words: ['pat', 'pit', 'bat', 'bit', 'hat', 'hit', 'sat', 'sit'] },
  { name: 'a / u vowels', words: ['pat', 'put', 'bat', 'but', 'hat', 'hut', 'cat', 'cut'] },
  { name: 'i / u vowels', words: ['bit', 'but', 'hit', 'hut', 'pit', 'put', 'fit', 'fun'] },
  { name: 'e / o vowels', words: ['pet', 'pot', 'bet', 'bot', 'hen', 'hon', 'net', 'not'] },
  { name: 'all vowels 1', words: ['pat', 'pet', 'pit', 'pot', 'bat', 'bet', 'bit', 'but'] },
  { name: 'all vowels 2', words: ['hat', 'hit', 'hot', 'hut', 'fan', 'fin', 'fon', 'fun'] },
  { name: 'h / p words', words: ['hat', 'pat', 'hen', 'pen', 'hit', 'pit', 'hot', 'pot'] },
  { name: 'b / f words', words: ['bat', 'fat', 'bit', 'fit', 'but', 'fun', 'bed', 'fed'] },
];

const ZONE_EMOJIS = ['🐉', '🧝', '🦕', '🦸', '🦊', '🐸', '🦄', '🐙'];
const ZONE_COLORS = [
  { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', dot: 'bg-amber-400', glow: 'rgba(245,158,11,0.25)' },
  { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-700', dot: 'bg-teal-400', glow: 'rgba(20,184,166,0.25)' },
  { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-400', glow: 'rgba(34,197,94,0.25)' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-400', glow: 'rgba(168,85,247,0.25)' },
  { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-700', dot: 'bg-rose-400', glow: 'rgba(244,63,94,0.25)' },
  { bg: 'bg-lime-100', border: 'border-lime-400', text: 'text-lime-700', dot: 'bg-lime-400', glow: 'rgba(132,204,22,0.25)' },
  { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', dot: 'bg-orange-400', glow: 'rgba(249,115,22,0.25)' },
  { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-700', dot: 'bg-indigo-400', glow: 'rgba(99,102,241,0.25)' },
];

const BUBBLES_PER_WORD = 2;
const TOTAL_BUBBLES = 16;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateBubbles(words) {
  const allWords = [];
  for (const word of words) {
    for (let i = 0; i < BUBBLES_PER_WORD; i++) {
      allWords.push(word);
    }
  }
  return shuffle(allWords).map((word, i) => ({
    id: `b-${i}-${Date.now()}-${Math.random()}`,
    word,
    placed: false,
  }));
}

/* ============================================================
   FLOATING DRAGGABLE BUBBLE — shows in center of the grid
   ============================================================ */
function FloatingBubble({ bubble, onDrop, dropZoneRefs }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastDelta = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsWrong(false);
    setIsDragging(false);
    dragging.current = false;
    controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
  }, [bubble.id, controls]);

  const checkDropZone = useCallback((cx, cy) => {
    for (const [idx, el] of Object.entries(dropZoneRefs.current || {})) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom) {
        return parseInt(idx);
      }
    }
    return null;
  }, [dropZoneRefs]);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastDelta.current = { x: 0, y: 0 };
    dragging.current = true;
    setIsDragging(true);
    controls.set({ scale: 1.1 });
  }, [controls]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    lastDelta.current = { x: dx, y: dy };
    controls.set({ x: dx, y: dy, scale: 1.1 });
  }, [controls]);

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current) return;
    e.preventDefault();
    dragging.current = false;
    setIsDragging(false);

    const zoneIdx = checkDropZone(e.clientX, e.clientY);
    if (zoneIdx !== null) {
      const result = onDrop(bubble.id, zoneIdx);
      if (result === 'correct') {
        controls.start({ scale: 0, opacity: 0, transition: { duration: 0.3 } });
        return;
      }
      if (result === 'wrong') {
        setIsWrong(true);
        const cx = lastDelta.current.x;
        controls.start({
          x: [cx, cx + 14, cx - 14, cx + 10, cx - 10, 0],
          y: [lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, 0],
          scale: 1,
          transition: { duration: 0.5, ease: 'easeOut' },
        }).then(() => { setIsWrong(false); lastDelta.current = { x: 0, y: 0 }; });
        return;
      }
    }
    controls.start({ x: 0, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    lastDelta.current = { x: 0, y: 0 };
  }, [bubble.id, checkDropZone, onDrop, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`flex items-center justify-center rounded-3xl cursor-grab active:cursor-grabbing z-30
        ${isWrong ? 'bg-red-400/90 border-red-500 border-4' : 'bg-white border-indigo-400 border-4'}
        ${isDragging ? 'shadow-2xl z-40' : 'shadow-xl'}
      `}
      style={{
        width: 150, height: 90, touchAction: 'none',
        boxShadow: isDragging ? undefined : '0 0 24px 8px rgba(129, 140, 248, 0.4)',
        animation: !isDragging && !isWrong ? 'pulse-glow 2s ease-in-out infinite' : undefined,
      }}
    >
      <span className="text-4xl font-extrabold text-gray-800 select-none pointer-events-none">{bubble.word}</span>
    </motion.div>
  );
}

/* ============================================================
   CONFETTI
   ============================================================ */
function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      color: ['#f59e0b', '#14b8a6', '#8b5cf6', '#f43f5e', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 6)],
      size: 6 + Math.random() * 8, rotation: Math.random() * 360,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <motion.div key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: p.rotation + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   VICTORY SCREEN
   ============================================================ */
const REWARD_GIFS = [
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTBjczlhbTR0MDl6OXJza3UyMzE2NzBreG0zcXRuZDY1b2cyZm5sMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iviU5Hwac8f04/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzg1cHNvcmxvYjFhMmVsaDk2OTl6cmlpOW52d2JtNmJwcHQyMTU5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MOWPkhRAUbR7i/giphy.gif',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2wzZTU2eWc3a3I2aXJxYmczZ3pja2s1cjRqM2U3bmZtOG9xMmlzMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wCykTNtEJonzlUZAra/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExczR3YmtrazZldWo5ZTk1NDhiNXUxN3B6dXdvZWs0YnQ4MWN0eGJwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/x7ne0scFlQMGTjYgvf/giphy.gif',
];

function VictoryScreen({ onComplete }) {
  const [phase, setPhase] = useState('present');
  const [gif] = useState(() => REWARD_GIFS[Math.floor(Math.random() * REWARD_GIFS.length)]);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (phase !== 'gif') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); onComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, onComplete]);

  if (phase === 'present') {
    return (
      <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
        <Confetti />
        <motion.div className="z-50 text-center"
          initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
          <h2 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-4">Amazing!</h2>
          <p className="text-2xl text-amber-600 font-bold mb-6">You earned a present!</p>
        </motion.div>
        <motion.button onClick={() => setPhase('gif')}
          className="z-50 text-[10rem] leading-none transition-all hover:scale-110 active:scale-95"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: [0, 1.2, 1], rotate: [-10, 5, -3, 3, 0] }}
          transition={{ duration: 0.8 }}
          style={{ filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}>
          🎁
        </motion.button>
        <p className="z-50 text-xl text-amber-600 mt-4 font-bold animate-pulse">Tap to open!</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-indigo-200 to-sky-300" />
      <Confetti />
      <h1 className="z-50 text-4xl font-extrabold text-indigo-700 mb-4 drop-shadow-md">🎉 Your Reward! 🎉</h1>
      <div className="z-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400 max-w-lg w-full">
        <img src={gif} alt="Reward!" className="w-full" style={{ display: 'block' }} />
      </div>
      <p className="z-50 text-lg text-indigo-400 mt-4 font-bold">Back to levels in {countdown}s...</p>
      <button onClick={onComplete}
        className="z-50 mt-3 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95">
        Skip
      </button>
    </motion.div>
  );
}

/* ============================================================
   INTRO — show all 8 words, 1 at a time
   ============================================================ */
function IntroOverlay({ words, onDone }) {
  const [step, setStep] = useState(0);
  const total = words.length; // 8

  const advance = useCallback(() => {
    if (step < total - 1) {
      setStep(s => s + 1);
    } else {
      onDone();
    }
  }, [step, total, onDone]);

  const word = words[step];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
      <AnimatePresence mode="wait">
        <motion.div key={step} className="flex flex-col items-center gap-6 z-40"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex flex-col items-center">
            <span className="text-6xl leading-none mb-2">{ZONE_EMOJIS[step]}</span>
            <div className={`${ZONE_COLORS[step].bg} ${ZONE_COLORS[step].border} border-4 rounded-2xl px-6 py-3 shadow-lg`}>
              <span className="text-5xl font-extrabold text-gray-800">{word}</span>
            </div>
          </div>
          <p className="text-xl text-indigo-400 font-bold">{step + 1} of {total}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={advance}
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-gray-400/50 hover:bg-gray-400/80 text-white text-lg flex items-center justify-center shadow transition-all z-50"
        title="Next">✓</button>
    </div>
  );
}

/* ============================================================
   GAME SCREEN — 2 rows x 4 columns, bubble in center
   ============================================================ */
function GameScreen({ level, onComplete, onBack }) {
  const { words } = level;
  const sounds = useSounds();
  const [bubbles, setBubbles] = useState(() => generateBubbles(words));
  const [collected, setCollected] = useState(() => Array(8).fill(0));
  const [showVictory, setShowVictory] = useState(false);
  const [phase, setPhase] = useState('intro');
  const dropZoneRefs = useRef({});

  const setDropRef = useCallback((idx, el) => {
    dropZoneRefs.current[idx] = el;
  }, []);

  const handleDrop = useCallback((bubbleId, zoneIdx) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble || bubble.placed) return 'invalid';

    const correctZone = words.indexOf(bubble.word);
    if (zoneIdx !== correctZone) {
      sounds.playWrong();
      return 'wrong';
    }

    sounds.playCorrect();
    setBubbles(prev => prev.map(b => b.id === bubbleId ? { ...b, placed: true } : b));

    const newCollected = [...collected];
    newCollected[zoneIdx]++;
    setCollected(newCollected);

    const totalPlaced = newCollected.reduce((s, c) => s + c, 0);
    if (totalPlaced === TOTAL_BUBBLES) {
      setTimeout(() => {
        sounds.playFanfare();
        setShowVictory(true);
      }, 400);
    }

    return 'correct';
  }, [bubbles, words, collected, sounds]);

  const activeIndex = bubbles.findIndex(b => !b.placed);
  const activeBubble = activeIndex >= 0 ? bubbles[activeIndex] : null;
  const placedCount = bubbles.filter(b => b.placed).length;

  // Split words into top row (0-3) and bottom row (4-7)
  const topRow = words.slice(0, 4);
  const bottomRow = words.slice(4, 8);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 pt-2 pb-1 z-20">
        <button onClick={onBack}
          className="bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-4 py-1.5 text-lg shadow-md transition-all hover:scale-105 active:scale-95">
          ← Back
        </button>
        <span className="bg-white/80 rounded-full px-4 py-1.5 shadow text-lg font-extrabold text-indigo-600">
          {placedCount}/{TOTAL_BUBBLES}
        </span>
      </div>

      {/* Intro overlay */}
      {phase === 'intro' && <IntroOverlay words={words} onDone={() => setPhase('playing')} />}

      {/* Main grid area */}
      <div className={`flex-1 flex flex-col transition-opacity duration-500 ${phase === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
        {/* Top row — 4 columns */}
        <div className="flex flex-1">
          {topRow.map((word, i) => {
            const c = ZONE_COLORS[i];
            return (
              <div key={i} ref={(el) => setDropRef(i, el)}
                className={`flex-1 flex flex-col items-center justify-center ${c.bg} border-r border-b ${c.border} last:border-r-0 transition-all`}
                style={{ boxShadow: `inset 0 0 15px 3px ${c.glow}` }}>
                <span className="text-3xl leading-none mb-1">{ZONE_EMOJIS[i]}</span>
                <div className={`${c.border} border-2 rounded-xl px-2 py-1 bg-white/70 shadow-sm`}>
                  <span className={`text-2xl font-extrabold ${c.text}`}>{word}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: collected[i] }).map((_, d) => (
                    <motion.div key={d} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`w-4 h-4 rounded-full ${c.dot} border border-white shadow-sm`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center area — the draggable bubble */}
        <div className="flex-shrink-0 h-28 flex items-center justify-center relative z-30">
          {phase === 'playing' && activeBubble && (
            <AnimatePresence mode="wait">
              <motion.div key={activeBubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}>
                <FloatingBubble bubble={activeBubble} onDrop={handleDrop} dropZoneRefs={dropZoneRefs} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Bottom row — 4 columns */}
        <div className="flex flex-1">
          {bottomRow.map((word, i) => {
            const idx = i + 4;
            const c = ZONE_COLORS[idx];
            return (
              <div key={idx} ref={(el) => setDropRef(idx, el)}
                className={`flex-1 flex flex-col items-center justify-center ${c.bg} border-r border-t ${c.border} last:border-r-0 transition-all`}
                style={{ boxShadow: `inset 0 0 15px 3px ${c.glow}` }}>
                <span className="text-3xl leading-none mb-1">{ZONE_EMOJIS[idx]}</span>
                <div className={`${c.border} border-2 rounded-xl px-2 py-1 bg-white/70 shadow-sm`}>
                  <span className={`text-2xl font-extrabold ${c.text}`}>{word}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: collected[idx] }).map((_, d) => (
                    <motion.div key={d} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`w-4 h-4 rounded-full ${c.dot} border border-white shadow-sm`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showVictory && <VictoryScreen onComplete={onComplete} />}
    </div>
  );
}

/* ============================================================
   LEVEL SELECT
   ============================================================ */
function LevelSelect({ onSelectLevel, onBack }) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 overflow-auto">
      <button onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95">
        ← Home
      </button>
      <div className="flex flex-col items-center pt-16 px-4">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-2">Dragon Quest 3</h1>
        <p className="text-2xl text-indigo-400 mb-8">Match 16 words to 8 targets!</p>
        <div className="flex flex-col gap-4 w-full max-w-md pb-8">
          {LEVELS.map((level, i) => (
            <button key={i} onClick={() => onSelectLevel(i)}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-lg text-xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all">
              <div className="flex flex-wrap justify-center gap-1.5 mb-2 px-2">
                {level.words.map((w, j) => (
                  <span key={j} className="text-sm bg-white/60 rounded-lg px-1.5 py-0.5 font-bold text-indigo-600">{w}</span>
                ))}
              </div>
              <span className="text-lg text-indigo-400">Level {i + 1} — {level.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT
   ============================================================ */
export default function DragonQuest3({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  if (selectedLevel === null) {
    return <LevelSelect onSelectLevel={setSelectedLevel} onBack={onBack} />;
  }

  const level = LEVELS[selectedLevel];
  return (
    <GameScreen
      key={selectedLevel}
      level={level}
      onComplete={() => setSelectedLevel(null)}
      onBack={() => setSelectedLevel(null)}
    />
  );
}
