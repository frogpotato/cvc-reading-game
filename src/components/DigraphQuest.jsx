import { useCallback, useEffect, useRef, useState } from 'react';

const ROUNDS = [
  {
    name: 'qu words',
    digraph: 'qu',
    position: 'start',
    words: ['quiz', 'queen', 'quack', 'quit', 'quick', 'quilt'],
  },
  {
    name: 'squ words',
    digraph: 'squ',
    position: 'start',
    words: ['square', 'squirrel', 'squeak', 'squeeze', 'squid', 'squash'],
  },
  {
    name: 'sh words',
    digraph: 'sh',
    position: 'start',
    words: ['shell', 'sheep', 'ship', 'sheet', 'shin', 'shut', 'shark', 'shop'],
  },
  {
    name: 'ng words',
    digraph: 'ng',
    position: 'end',
    words: ['king', 'sing', 'wing', 'fling', 'bing', 'bling'],
  },
];

const REWARD_GIFS = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk3bXFwOWJleTVnaWVscGZwazEyb2Q0bzFnamRrNXM1NHUzN3U0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zsbYm28afpsPJxrzHS/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnN6NGJ1cmtzaXV1YXhsbXZxNG9jbm52ZTNtMjI5Y3EzOWg0OW95MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fnmsu2lTw3r1e/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXJkZjB0bmhqdDY4emVrOXZqeWhsd3Zwbjg2a2RiaDFjZ3UwcTAzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lFHtqqh6orvAhbiGmy/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3hnY2wydWpsNjFrYmNnc3dvaG9ydDViem8yenJjdHhjd2YzZzE0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kBZBlLVlfECvOQAVno/giphy.gif',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRoZW5kMGYxcGcwN2M2NmswOTFoeTBnbjEyaGR2c2J1bXN6OGpubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TVNmNzfL8ibYUyeQo8/giphy.gif',
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

function RewardScreen({ onDone }) {
  const [phase, setPhase] = useState('chest');
  const [gif] = useState(() => REWARD_GIFS[Math.floor(Math.random() * REWARD_GIFS.length)]);
  const [countdown, setCountdown] = useState(15);

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
          onClick={() => setPhase('gif')}
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
      <p className="text-lg text-indigo-400 mt-4 font-bold">
        Back to the game in {countdown}s...
      </p>
      <button
        onClick={onDone}
        className="mt-3 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95"
      >
        Skip
      </button>
    </div>
  );
}

function Tile({ letter, locked, fixed }) {
  const bg = fixed
    ? 'from-amber-200 to-yellow-300 border-amber-500'
    : locked
      ? 'from-emerald-200 to-green-300 border-emerald-500'
      : 'from-slate-100 to-slate-200 border-slate-400';
  // Wider tile for multi-letter digraphs; smaller font when 3+ letters
  const wide = letter && letter.length >= 2;
  const widthClass = wide
    ? 'w-28 h-20 sm:w-40 sm:h-28'
    : 'w-20 h-20 sm:w-28 sm:h-28';
  const fontClass = letter && letter.length >= 3
    ? 'text-4xl sm:text-6xl'
    : 'text-5xl sm:text-7xl';
  return (
    <div
      className={`${widthClass} rounded-2xl bg-gradient-to-br ${bg} border-4 shadow-lg flex items-center justify-center ${fontClass} font-extrabold text-indigo-800 select-none`}
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
  const [showReward, setShowReward] = useState(false);
  const tickRef = useRef(null);
  const timeoutsRef = useRef([]);

  const word = shuffledWords[wordIdx];

  const initTilesForWord = useCallback((w) => {
    const digraph = round.digraph;
    const atEnd = round.position === 'end';
    const rest = atEnd
      ? w.slice(0, w.length - digraph.length).split('')
      : w.slice(digraph.length).split('');
    const fixed = { letter: digraph, locked: true, fixed: true };
    const variable = rest.map(() => ({ letter: '', locked: false, fixed: false }));
    return atEnd ? [...variable, fixed] : [fixed, ...variable];
  }, [round.digraph, round.position]);

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
    const atEnd = round.position === 'end';
    const variableCount = target.length - digraphLen;
    // Indices in the tile array that hold variable letters
    const variableTileIdx = atEnd
      ? Array.from({ length: variableCount }, (_, k) => k)
      : Array.from({ length: variableCount }, (_, k) => 1 + k);
    // Word-letter indices for those variable tiles
    const variableWordIdx = atEnd
      ? Array.from({ length: variableCount }, (_, k) => k)
      : Array.from({ length: variableCount }, (_, k) => digraphLen + k);
    const isVariable = (i) => variableTileIdx.includes(i);

    // Start spinning all variable tiles
    setTiles(prev => prev.map((t, i) =>
      isVariable(i) ? { ...t, letter: randomLetter(), locked: false } : t
    ));

    tickRef.current = setInterval(() => {
      setTiles(prev => prev.map((t, i) => {
        if (!isVariable(i)) return t;
        if (t.locked) return t;
        return { ...t, letter: randomLetter() };
      }));
    }, SPIN_TICK_MS);

    // Lock each variable tile in sequence to its target letter
    for (let k = 0; k < variableCount; k++) {
      const tileIdx = variableTileIdx[k];
      const targetLetter = target[variableWordIdx[k]];
      const lockAt = SPIN_DURATION_MS + k * STAGGER_MS;
      const t = setTimeout(() => {
        setTiles(prev => prev.map((tile, j) =>
          j === tileIdx ? { letter: targetLetter, locked: true, fixed: false } : tile
        ));
      }, lockAt);
      timeoutsRef.current.push(t);
    }

    // Stop ticking + finish
    const totalTime = SPIN_DURATION_MS + variableCount * STAGGER_MS + 100;
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
  }, [spinning, word, round.digraph, round.position]);

  const handleNext = useCallback(() => {
    if (wordIdx + 1 < shuffledWords.length) {
      setWordIdx(wordIdx + 1);
    } else {
      setShowReward(true);
    }
  }, [wordIdx, shuffledWords.length]);

  const handleRewardDone = useCallback(() => {
    setShowReward(false);
    setShuffledWords(shuffle(round.words));
    setWordIdx(0);
  }, [round.words]);

  const isLast = wordIdx === shuffledWords.length - 1;

  if (showReward) {
    return <RewardScreen onDone={handleRewardDone} />;
  }

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
        <button
          onClick={revealed ? () => speak(word) : undefined}
          disabled={!revealed}
          className="px-10 py-8 rounded-3xl bg-white/80 border-4 border-fuchsia-400 shadow-xl min-w-[18rem] sm:min-w-[28rem] flex items-center justify-center disabled:cursor-default"
        >
          <span className="text-7xl sm:text-9xl font-extrabold tracking-wider select-none">
            {tiles.map((t, i) => (
              <span
                key={i}
                className={
                  t.fixed
                    ? 'text-amber-600'
                    : t.locked
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                }
              >
                {t.letter || '_'}
              </span>
            ))}
          </span>
        </button>

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
              {isLast ? '🎁 Get Reward!' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
