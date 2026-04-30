import { useCallback, useEffect, useRef, useState } from 'react';

const ROUNDS = [
  {
    name: 'qu words',
    digraph: 'qu',
    words: ['quiz', 'queen', 'quack', 'quit', 'quick', 'quilt'],
  },
  {
    name: 'squ words',
    digraph: 'squ',
    words: ['square', 'squirrel', 'squeak', 'squeeze', 'squid', 'squash'],
  },
];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const SPIN_TICK_MS = 70;
const SPIN_DURATION_MS = 1400;
const STAGGER_MS = 350;

let cachedVoice = null;
let voiceSearchDone = false;

function findBritishFemaleVoice() {
  if (voiceSearchDone) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() || [];
  if (voices.length === 0) return null;
  voiceSearchDone = true;
  cachedVoice =
    voices.find(v => /en-GB/i.test(v.lang) && /female|woman|kate|serena|martha|fiona/i.test(v.name)) ||
    voices.find(v => /en-GB/i.test(v.lang)) ||
    voices.find(v => /female|woman|samantha|karen/i.test(v.name)) ||
    null;
  return cachedVoice;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voice = findBritishFemaleVoice();
  if (voice) utter.voice = voice;
  utter.rate = 0.85;
  utter.pitch = 1.15;
  window.speechSynthesis.speak(utter);
}

function randomLetter() {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Tile({ letter, locked, fixed }) {
  const bg = fixed
    ? 'from-amber-200 to-yellow-300 border-amber-500'
    : locked
      ? 'from-emerald-200 to-green-300 border-emerald-500'
      : 'from-slate-100 to-slate-200 border-slate-400';
  return (
    <div
      className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br ${bg} border-4 shadow-lg flex items-center justify-center text-5xl sm:text-7xl font-extrabold text-indigo-800 select-none`}
    >
      {letter}
    </div>
  );
}

export default function DigraphQuest({ onBack }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const round = ROUNDS[roundIdx];
  const [shuffledWords, setShuffledWords] = useState(() => shuffle(ROUNDS[0].words));
  const [wordIdx, setWordIdx] = useState(0);
  const [tiles, setTiles] = useState([]); // array of { letter, locked, fixed }
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const tickRef = useRef(null);
  const timeoutsRef = useRef([]);

  const word = shuffledWords[wordIdx];

  const initTilesForWord = useCallback((w) => {
    const digraph = round.digraph;
    const rest = w.slice(digraph.length).split('');
    const fixed = digraph.split('').map(letter => ({ letter, locked: true, fixed: true }));
    const variable = rest.map(() => ({ letter: '', locked: false, fixed: false }));
    return [...fixed, ...variable];
  }, [round.digraph]);

  // Set up initial tiles when word changes
  useEffect(() => {
    setTiles(initTilesForWord(word));
    setRevealed(false);
  }, [word, initTilesForWord]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setRevealed(false);
    setSpinning(true);

    const target = word.split('');
    const digraphLen = round.digraph.length;

    // Start spinning all variable tiles
    setTiles(prev => prev.map((t, i) =>
      i < digraphLen ? t : { ...t, letter: randomLetter(), locked: false }
    ));

    tickRef.current = setInterval(() => {
      setTiles(prev => prev.map((t, i) => {
        if (i < digraphLen) return t;
        if (t.locked) return t;
        return { ...t, letter: randomLetter() };
      }));
    }, SPIN_TICK_MS);

    // Lock each variable tile in sequence to its target letter
    for (let i = digraphLen; i < target.length; i++) {
      const lockAt = SPIN_DURATION_MS + (i - digraphLen) * STAGGER_MS;
      const idx = i;
      const t = setTimeout(() => {
        setTiles(prev => prev.map((tile, j) =>
          j === idx ? { letter: target[idx], locked: true, fixed: false } : tile
        ));
      }, lockAt);
      timeoutsRef.current.push(t);
    }

    // Stop ticking + finish
    const totalTime = SPIN_DURATION_MS + (target.length - digraphLen) * STAGGER_MS + 100;
    const done = setTimeout(() => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      setSpinning(false);
      setRevealed(true);
      speak(word);
    }, totalTime);
    timeoutsRef.current.push(done);
  }, [spinning, word, round.digraph]);

  const handleNext = useCallback(() => {
    if (wordIdx + 1 < shuffledWords.length) {
      setWordIdx(wordIdx + 1);
    } else {
      setShuffledWords(shuffle(round.words));
      setWordIdx(0);
    }
  }, [wordIdx, shuffledWords.length, round.words]);

  const isLast = wordIdx === shuffledWords.length - 1;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-fuchsia-200 via-pink-100 to-amber-100 flex flex-col items-center justify-start gap-6 px-6 py-8">
      <div className="w-full max-w-2xl flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/70 border-2 border-indigo-300 text-indigo-700 font-bold shadow hover:scale-105 active:scale-95 transition-all"
        >
          ← Back
        </button>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-fuchsia-700 drop-shadow">
          Digraph Quest: {round.digraph}
        </h1>
        <div className="text-sm sm:text-base font-bold text-indigo-700 bg-white/70 px-3 py-2 rounded-xl">
          {wordIdx + 1} / {shuffledWords.length}
        </div>
      </div>

      <div className="flex gap-2">
        {ROUNDS.map((r, i) => (
          <button
            key={i}
            onClick={() => {
              if (spinning) return;
              setRoundIdx(i);
              setShuffledWords(shuffle(ROUNDS[i].words));
              setWordIdx(0);
            }}
            disabled={spinning}
            className={`px-4 py-2 rounded-xl border-2 font-bold shadow transition-all ${
              i === roundIdx
                ? 'bg-fuchsia-500 border-fuchsia-700 text-white scale-105'
                : 'bg-white/70 border-fuchsia-300 text-fuchsia-700 hover:scale-105'
            } disabled:opacity-50`}
          >
            Level {i + 1}: {r.digraph}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 mt-8">
        <div className="flex gap-2 sm:gap-3">
          {tiles.map((t, i) => (
            <Tile key={i} letter={t.letter} locked={t.locked} fixed={t.fixed} />
          ))}
        </div>

        {revealed && (
          <button
            onClick={() => speak(word)}
            className="text-4xl sm:text-6xl font-extrabold text-fuchsia-700 hover:scale-105 active:scale-95 transition-transform"
          >
            {word}
          </button>
        )}

        <div className="flex gap-4 mt-4">
          {!revealed ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="px-10 py-5 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-400 border-4 border-amber-500 text-3xl font-extrabold text-white shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {spinning ? 'Spinning…' : '🎰 Spin'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-10 py-5 rounded-3xl bg-gradient-to-br from-emerald-300 to-teal-400 border-4 border-emerald-500 text-3xl font-extrabold text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {isLast ? '🔁 Start Over' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
