import { useState, useEffect, useCallback, useRef } from 'react';

const ALL_LETTERS = ['d', 'b', 'u', 'e', 'j', 'v', 'w'];
const FOCUS_LETTERS = ['d', 'u'];

const SOUNDS = {
  d: 'duh',
  b: 'buh',
  u: 'uh',
  e: 'eh, eh, egg',
  j: 'juh',
  v: 'vvv',
  w: 'wuh',
};

const DISPLAY_SOUNDS = {
  d: 'duh',
  b: 'buh',
  u: 'uh',
  e: 'eh',
  j: 'juh',
  v: 'vvv',
  w: 'wuh',
};

const LEVEL_COUNTS = [2, 3, 4, 7];
const STREAK_TO_ADVANCE = 15;
const CONFETTI_COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];

// Pre-generate confetti particle data so it's stable across renders
function makeConfetti() {
  return Array.from({ length: 20 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: 30 + Math.random() * 40,
    tx: (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 80),
    ty: -(60 + Math.random() * 120),
    delay: i * 0.03,
  }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(target, count, pool) {
  const available = pool.filter(l => l !== target);
  const shuffled = shuffle(available);
  return shuffled.slice(0, count);
}

let cachedVoice = null;
let voiceSearchDone = false;

function findBritishFemaleVoice() {
  if (voiceSearchDone) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  voiceSearchDone = true;
  // Prefer British female
  cachedVoice =
    voices.find(v => /en.GB/i.test(v.lang) && /female|fiona|kate|serena/i.test(v.name)) ||
    voices.find(v => /en.GB/i.test(v.lang)) ||
    voices.find(v => /en/i.test(v.lang) && /female|samantha|karen|moira|tessa/i.test(v.name)) ||
    null;
  return cachedVoice;
}

function speakSound(letter) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(SOUNDS[letter]);
  const voice = findBritishFemaleVoice();
  if (voice) utter.voice = voice;
  utter.rate = 0.75;
  utter.pitch = 1.2;
  window.speechSynthesis.speak(utter);
}

function playCorrectBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [440, 554, 659].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.15);
    });
  } catch {}
}

function playWrongTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export default function LetterPractice({ onBack }) {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [target, setTarget] = useState(null);
  const [choices, setChoices] = useState([]);
  const [tappedId, setTappedId] = useState(null); // letter that was just tapped
  const [tappedResult, setTappedResult] = useState(null); // 'correct' | 'wrong'
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const [confetti, setConfetti] = useState(() => makeConfetti());
  const roundInProgress = useRef(false);

  const startRound = useCallback((currentLevel) => {
    const count = LEVEL_COUNTS[Math.min(currentLevel, LEVEL_COUNTS.length - 1)];
    // In early levels, bias toward focus letters
    let pool = ALL_LETTERS;
    let targetLetter;
    if (currentLevel <= 1) {
      targetLetter = FOCUS_LETTERS[Math.floor(Math.random() * FOCUS_LETTERS.length)];
    } else {
      targetLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    }
    const distractors = pickDistractors(targetLetter, count - 1, pool);
    const allChoices = shuffle([targetLetter, ...distractors]);
    setTarget(targetLetter);
    setChoices(allChoices);
    setTappedId(null);
    setTappedResult(null);
    setRoundKey(k => k + 1);
    setConfetti(makeConfetti());
    roundInProgress.current = false;
    // Speak after a short delay so animation settles
    setTimeout(() => speakSound(targetLetter), 400);
  }, []);

  useEffect(() => {
    // Ensure voices are loaded before first round
    const voices = window.speechSynthesis?.getVoices();
    if (voices && voices.length > 0) {
      startRound(level);
    } else {
      const handler = () => { startRound(level); };
      window.speechSynthesis?.addEventListener('voiceschanged', handler, { once: true });
      // Fallback in case event never fires
      setTimeout(() => startRound(level), 500);
    }
  }, []);

  const handleTap = useCallback((letter) => {
    if (roundInProgress.current) return;
    if (letter === target) {
      roundInProgress.current = true;
      setTappedId(letter);
      setTappedResult('correct');
      playCorrectBeep();
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Check level up
      if (newStreak >= STREAK_TO_ADVANCE && level < LEVEL_COUNTS.length - 1) {
        setTimeout(() => {
          setShowLevelUp(true);
          const newLevel = level + 1;
          setLevel(newLevel);
          setStreak(0);
          setTimeout(() => {
            setShowLevelUp(false);
            startRound(newLevel);
          }, 1500);
        }, 600);
      } else {
        setTimeout(() => startRound(level), 700);
      }
    } else {
      setTappedId(letter);
      setTappedResult('wrong');
      playWrongTone();
      setStreak(0);
      // Re-speak the sound
      setTimeout(() => speakSound(target), 400);
      // Reset shake after animation
      setTimeout(() => {
        setTappedId(null);
        setTappedResult(null);
      }, 500);
    }
  }, [target, streak, level, startRound]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 overflow-hidden relative flex flex-col items-center">
      {/* Clouds */}
      <div className="absolute top-8 left-[10%] w-32 h-16 bg-white rounded-full opacity-60" />
      <div className="absolute top-4 left-[12%] w-24 h-12 bg-white rounded-full opacity-60 translate-x-4 -translate-y-2" />
      <div className="absolute top-16 right-[15%] w-40 h-20 bg-white rounded-full opacity-50" />
      <div className="absolute top-12 right-[17%] w-28 h-14 bg-white rounded-full opacity-50 translate-x-6 -translate-y-3" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        ← Home
      </button>

      {/* Level indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/70 rounded-full px-5 py-1.5 shadow">
        <span className="text-lg font-extrabold text-indigo-700">Level {level + 1}</span>
      </div>

      {/* Score */}
      <div className="absolute top-4 right-4 bg-white/70 rounded-full px-5 py-1.5 shadow">
        <span className="text-lg font-extrabold text-amber-600">⭐ {score}</span>
      </div>

      {/* Mascot */}
      <div className="mt-24 mb-2 text-7xl transition-transform duration-300" style={{
        transform: tappedResult === 'correct' ? 'rotate(-10deg) scale(1.2)' : 'none',
      }}>
        👻
      </div>

      {/* Prompt */}
      <p className="text-2xl font-extrabold text-indigo-800 mb-2">
        Tap the letter that says <span className="text-amber-600">"{target ? DISPLAY_SOUNDS[target] : ''}"</span>
      </p>

      {/* Hear again button */}
      <button
        onClick={() => target && speakSound(target)}
        className="mb-6 bg-white/80 hover:bg-white text-indigo-600 font-bold rounded-full px-6 py-2 text-lg shadow transition-all hover:scale-105 active:scale-95"
      >
        🔊 Hear it again
      </button>

      {/* Letter bubbles */}
      <div className="flex flex-wrap justify-center gap-5 px-6 max-w-lg" key={roundKey}>
        {choices.map((letter, i) => {
          const isCorrectTap = tappedResult === 'correct' && tappedId === letter;
          const isWrongTap = tappedResult === 'wrong' && tappedId === letter;

          return (
            <button
              key={`${roundKey}-${i}`}
              onClick={() => handleTap(letter)}
              className={`
                w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full
                flex items-center justify-center
                border-[6px] shadow-xl
                text-5xl sm:text-6xl font-extrabold
                transition-all duration-200 select-none
                ${isCorrectTap
                  ? 'border-green-400 bg-green-100 scale-125 opacity-0'
                  : isWrongTap
                    ? 'border-red-400 bg-red-50 animate-[shake_0.4s_ease-in-out]'
                    : 'border-amber-400 bg-white hover:scale-110 active:scale-95 cursor-pointer'
                }
              `}
              style={{
                fontFamily: "'Fredoka', 'Nunito', sans-serif",
                animation: !isCorrectTap && !isWrongTap ? `bounceIn 0.4s ease-out ${i * 0.08}s both` : undefined,
                transition: isCorrectTap ? 'all 0.4s ease-out' : undefined,
              }}
              disabled={roundInProgress.current}
            >
              <span className={isCorrectTap ? 'animate-[pop_0.4s_ease-out_forwards]' : ''}>
                {letter}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confetti dots on correct */}
      {tappedResult === 'correct' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((dot, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: dot.color,
                left: `${dot.left}%`,
                top: '45%',
                animation: `confetti-${i} 0.8s ease-out ${dot.delay}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Level up celebration */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30">
          <div className="bg-white rounded-3xl px-12 py-8 shadow-2xl text-center animate-[bounceIn_0.5s_ease-out]">
            <p className="text-6xl mb-3">🎉</p>
            <p className="text-3xl font-extrabold text-indigo-700">Level Up!</p>
            <p className="text-xl font-bold text-amber-600 mt-2">Level {level + 1}</p>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(0); opacity: 0; }
        }
        ${confetti.map((dot, i) => `
        @keyframes confetti-${i} {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(${dot.tx}px, ${dot.ty}px) scale(0); opacity: 0; }
        }`).join('')}
      `}</style>
    </div>
  );
}
