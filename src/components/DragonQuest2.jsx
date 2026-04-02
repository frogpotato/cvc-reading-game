import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import useSounds from '../hooks/useSounds';

/* ============================================================
   LEVEL DATA — 6 levels, each with 5 words
   ============================================================ */
const LEVELS = [
  { name: 'p vowels', words: ['pat', 'pit', 'pot', 'put', 'pet'] },
  { name: 'p blends', words: ['pig', 'pit', 'peg', 'pet', 'pug'] },
  { name: 'h words', words: ['hit', 'hid', 'hat', 'hut', 'hug'] },
  { name: 'b words', words: ['bit', 'but', 'bot', 'bet', 'bat'] },
  { name: 'f words', words: ['fit', 'fed', 'fog', 'fin', 'fun'] },
  { name: 'h words 2', words: ['had', 'hen', 'his', 'hot', 'hug'] },
];

const ZONE_EMOJIS = ['🐉', '🧝', '🦕', '🦸', '👻'];
const ZONE_COLORS = [
  { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', dot: 'bg-amber-400', glow: 'rgba(245,158,11,0.3)' },
  { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-700', dot: 'bg-teal-400', glow: 'rgba(20,184,166,0.3)' },
  { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-400', glow: 'rgba(34,197,94,0.3)' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-400', glow: 'rgba(168,85,247,0.3)' },
  { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-700', dot: 'bg-sky-400', glow: 'rgba(14,165,233,0.3)' },
];

const BUBBLES_PER_WORD = 4;
const TOTAL_BUBBLES = 20;

// 20 positions in a 5x4 snaking grid
const GRID_POSITIONS = [];
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 5; col++) {
    const actualCol = row % 2 === 0 ? col : 4 - col; // snake
    GRID_POSITIONS.push({
      x: 12 + actualCol * 19,
      y: 8 + row * 24,
    });
  }
}

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
  const shuffled = shuffle(allWords);
  return shuffled.map((word, i) => ({
    id: `b-${i}-${Date.now()}-${Math.random()}`,
    word,
    placed: false,
  }));
}

/* ============================================================
   DRAGGABLE BUBBLE
   ============================================================ */
function DragBubble({ bubble, state, onDrop, dropZoneRefs, style }) {
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
      const pad = 30;
      if (cx >= rect.left - pad && cx <= rect.right + pad && cy >= rect.top - pad && cy <= rect.bottom + pad) {
        return parseInt(idx);
      }
    }
    return null;
  }, [dropZoneRefs]);

  const handlePointerDown = useCallback((e) => {
    if (state !== 'active') return;
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastDelta.current = { x: 0, y: 0 };
    dragging.current = true;
    setIsDragging(true);
    controls.set({ scale: 1.15 });
  }, [state, controls]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current || state !== 'active') return;
    e.preventDefault();
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    lastDelta.current = { x: dx, y: dy };
    controls.set({ x: dx, y: dy, scale: 1.15 });
  }, [state, controls]);

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current || state !== 'active') return;
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
          x: [cx, cx + 12, cx - 12, cx + 8, cx - 8, 0],
          y: [lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, 0],
          scale: 1,
          transition: { duration: 0.6, ease: 'easeOut' },
        }).then(() => { setIsWrong(false); lastDelta.current = { x: 0, y: 0 }; });
        return;
      }
    }
    controls.start({ x: 0, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    lastDelta.current = { x: 0, y: 0 };
  }, [state, bubble.id, checkDropZone, onDrop, controls]);

  if (state === 'completed') {
    return (
      <div className="absolute flex items-center justify-center rounded-full bg-green-400 border-2 border-green-500 shadow-sm"
        style={{ width: 56, height: 56, ...style }}>
        <span className="text-2xl text-white font-bold select-none">✓</span>
      </div>
    );
  }

  if (state === 'future') {
    return (
      <div className="absolute flex items-center justify-center rounded-full bg-gray-300/60 border-2 border-gray-400/40 shadow-sm"
        style={{ width: 56, height: 56, ...style }}>
        <span className="text-lg font-extrabold text-gray-400/50 select-none">{bubble.word}</span>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      animate={controls}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing z-20
        ${isWrong ? 'bg-red-400/80 border-red-500 border-3' : 'bg-indigo-200/70 border-indigo-300/80 border-2'}
        ${isDragging ? 'shadow-xl z-30' : 'shadow-md'}
      `}
      style={{
        width: 80, height: 80, ...style, touchAction: 'none',
        boxShadow: isDragging ? undefined : '0 0 16px 4px rgba(129, 140, 248, 0.5)',
        animation: !isDragging && !isWrong ? 'pulse-glow 2s ease-in-out infinite' : undefined,
      }}
    >
      <span className="text-3xl font-extrabold text-gray-800 select-none pointer-events-none">{bubble.word}</span>
    </motion.div>
  );
}

/* ============================================================
   CONFETTI CELEBRATION
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
function VictoryScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 4000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      <Confetti />
      <motion.div className="z-50 text-center"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md">Amazing!</h2>
        <p className="text-2xl text-amber-600 font-bold mt-2">All words matched!</p>
      </motion.div>
      <div className="z-50 flex gap-4 mt-6">
        {ZONE_EMOJIS.map((e, i) => (
          <motion.div key={i} className="text-6xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: [0, -20, 0], opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.15, y: { repeat: Infinity, duration: 0.6, delay: 0.3 + i * 0.15 } }}>
            {e}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ============================================================
   INTRO — show all 5 words one at a time, quick
   ============================================================ */
function IntroOverlay({ words, onDone }) {
  const [step, setStep] = useState(0);

  const advance = useCallback(() => {
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      onDone();
    }
  }, [step, onDone]);

  const word = words[step];
  const emoji = ZONE_EMOJIS[step];
  const color = ZONE_COLORS[step];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
      <AnimatePresence mode="wait">
        <motion.div key={step} className="flex flex-col items-center z-40"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.3 }}>
          <span className="text-[8rem] leading-none">{emoji}</span>
          <div className={`${color.bg} ${color.border} border-4 rounded-2xl px-10 py-5 shadow-lg mt-4`}>
            <span className="text-7xl font-extrabold text-gray-800">{word}</span>
          </div>
          <p className="text-xl text-indigo-400 font-bold mt-4">{step + 1} of 5</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={advance}
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-gray-400/50 hover:bg-gray-400/80 text-white text-lg flex items-center justify-center shadow transition-all z-50"
        title="Next">✓</button>
    </div>
  );
}

/* ============================================================
   GAME SCREEN
   ============================================================ */
function GameScreen({ level, onComplete, onBack }) {
  const { words } = level;
  const sounds = useSounds();
  const [bubbles, setBubbles] = useState(() => generateBubbles(words));
  const [collected, setCollected] = useState([0, 0, 0, 0, 0]);
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

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 relative overflow-hidden flex flex-col">
      <button onClick={onBack}
        className="absolute top-2 left-2 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-4 py-1.5 text-lg shadow-md transition-all hover:scale-105 active:scale-95">
        ← Back
      </button>

      {/* Intro overlay */}
      {phase === 'intro' && <IntroOverlay words={words} onDone={() => setPhase('playing')} />}

      {/* Drop zones — top row */}
      <div className={`flex gap-2 px-2 pt-12 pb-2 justify-center transition-opacity duration-500 ${phase === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
        {words.map((word, i) => {
          const c = ZONE_COLORS[i];
          return (
            <div key={i} ref={(el) => setDropRef(i, el)}
              className={`flex flex-col items-center ${c.bg} ${c.border} border-3 rounded-xl px-3 py-2 shadow-md min-w-[80px]`}
              style={{ boxShadow: `0 0 12px 3px ${c.glow}` }}>
              <span className="text-3xl leading-none">{ZONE_EMOJIS[i]}</span>
              <span className={`text-2xl font-extrabold ${c.text} mt-1`}>{word}</span>
              {/* Collection dots */}
              <div className="flex gap-1 mt-1 h-4">
                {Array.from({ length: collected[i] }).map((_, d) => (
                  <motion.div key={d} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className={`w-3.5 h-3.5 rounded-full ${c.dot} border border-white shadow-sm`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bubble field */}
      <div className={`flex-1 relative transition-opacity duration-500 ${phase === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
        {/* Connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {GRID_POSITIONS.map((pos, i) => {
            if (i === GRID_POSITIONS.length - 1) return null;
            const next = GRID_POSITIONS[i + 1];
            return (
              <line key={i}
                x1={`${pos.x}%`} y1={`${pos.y}%`}
                x2={`${next.x}%`} y2={`${next.y}%`}
                stroke="#c7c7cc" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" opacity="0.4" />
            );
          })}
        </svg>

        {bubbles.map((bubble, i) => {
          const pos = GRID_POSITIONS[i];
          let state;
          if (bubble.placed) state = 'completed';
          else if (activeIndex === i) state = 'active';
          else state = 'future';
          const size = state === 'active' ? 80 : 56;

          return (
            <DragBubble key={bubble.id} bubble={bubble} state={state}
              onDrop={handleDrop} dropZoneRefs={dropZoneRefs}
              style={{
                left: `calc(${pos.x}% - ${size / 2}px)`,
                top: `calc(${pos.y}% - ${size / 2}px)`,
              }} />
          );
        })}
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
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-2">Dragon Quest 2</h1>
        <p className="text-2xl text-indigo-400 mb-8">Match 20 words to 5 targets!</p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {LEVELS.map((level, i) => (
            <button key={i} onClick={() => onSelectLevel(i)}
              className="w-full py-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-lg text-2xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all">
              <div className="flex justify-center gap-2 mb-1">
                {level.words.map((w, j) => (
                  <span key={j} className="text-base bg-white/60 rounded-lg px-2 py-0.5 font-bold text-indigo-600">{w}</span>
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
export default function DragonQuest2({ onBack }) {
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
