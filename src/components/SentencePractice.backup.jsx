import { useState, useEffect, useCallback, useRef } from 'react';
import { SENTENCE_LEVELS } from '../data/sentences';

const REWARD_GIFS = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk3bXFwOWJleTVnaWVscGZwazEyb2Q0bzFnamRrNXM1NHUzN3U0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zsbYm28afpsPJxrzHS/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnN6NGJ1cmtzaXV1YXhsbXZxNG9jbm52ZTNtMjI5Y3EzOWg0OW95MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fnmsu2lTw3r1e/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXJkZjB0bmhqdDY4emVrOXZqeWhsd3Zwbjg2a2RiaDFjZ3UwcTAzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lFHtqqh6orvAhbiGmy/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3hnY2wydWpsNjFrYmNnc3dvaG9ydDViem8yenJjdHhjd2YzZzE0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kBZBlLVlfECvOQAVno/giphy.gif',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRoZW5kMGYxcGcwN2M2NmswOTFoeTBnbjEyaGR2c2J1bXN6OGpubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TVNmNzfL8ibYUyeQo8/giphy.gif',
];

function shuffleArray(arr) {
  // Fisher-Yates shuffle, then try to avoid consecutive sentences with the same scene
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Spread out sentences that share a scene — retry swaps to break clusters
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < a.length; i++) {
      if (a[i].scene === a[i - 1].scene) {
        // Find a non-adjacent item with a different scene to swap with
        const candidates = [];
        for (let k = 0; k < a.length; k++) {
          if (Math.abs(k - i) <= 1) continue;
          if (a[k].scene !== a[i - 1].scene &&
              (i + 1 >= a.length || a[k].scene !== a[i + 1]?.scene) &&
              (k === 0 || a[k - 1]?.scene !== a[i].scene) &&
              (k === a.length - 1 || a[k + 1]?.scene !== a[i].scene)) {
            candidates.push(k);
          }
        }
        if (candidates.length > 0) {
          const swap = candidates[Math.floor(Math.random() * candidates.length)];
          [a[i], a[swap]] = [a[swap], a[i]];
        }
      }
    }
  }
  return a;
}

export default function SentencePractice({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [finished, setFinished] = useState(false);

  // Level select screen
  if (selectedLevel === null) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 overflow-auto">
        <button
          onClick={onBack}
          className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          ← Map
        </button>
        <div className="flex flex-col items-center pt-16 px-4">
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md mb-2">
            Sentence Practice
          </h1>
          <p className="text-2xl text-indigo-400 mb-8">Choose a level!</p>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {SENTENCE_LEVELS.map((level, i) => (
              <button
                key={i}
                onClick={() => {
                  const lvl = SENTENCE_LEVELS[i];
                  setSelectedLevel(i);
                  setSentences(lvl.shuffle ? shuffleArray(lvl.sentences) : lvl.sentences);
                  setSentenceIdx(0);
                  setConfirmed(false);
                  setFinished(false);
                }}
                className="w-full py-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-lg text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all"
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const level = SENTENCE_LEVELS[selectedLevel];
  const current = sentences[sentenceIdx];
  const isLast = sentenceIdx === sentences.length - 1;

  // Celebration screen
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
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 flex flex-col relative overflow-hidden">
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

      {/* Sentence display with reading tracker */}
      <div className="flex-shrink-0 pt-14 pb-2 px-6 flex flex-col items-center justify-center gap-2">
        {Array.isArray(current.sentence)
          ? current.sentence.map((s, i) => (
              <ReadingTracker key={`${selectedLevel}-${sentenceIdx}-${i}`} sentence={s} />
            ))
          : <ReadingTracker key={`${selectedLevel}-${sentenceIdx}`} sentence={current.sentence} />
        }
      </div>

      {/* Scene area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden gap-4">
        {confirmed && (
          Array.isArray(current.scene)
            ? current.scene.map((s, i) => <SceneRenderer key={i} sceneKey={s} />)
            : <SceneRenderer sceneKey={current.scene} />
        )}
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 pb-8 px-6 flex items-center justify-between">
        {/* Prev */}
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

        {/* Confirm / Next */}
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

        {/* Next (skip) */}
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

/* ============================================================
   READING TRACKER — draggable guide under the sentence
   ============================================================ */

function ReadingTracker({ sentence }) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);
  const [progress, setProgress] = useState(0); // pixel offset from container left
  const [charPositions, setCharPositions] = useState([]); // { mid } in px relative to container
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackLeft, setTrackLeft] = useState(0);
  const dragging = useRef(false);

  const chars = sentence.split('');

  // Measure actual character positions relative to the text container
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
    setTrackLeft(0);
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
      {/* Sentence with per-character highlighting */}
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

      {/* Slider track — large touch target, same width as sentence container */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mx-8 cursor-pointer"
        style={{ height: 56, touchAction: 'none' }}
      >
        {/* Track background */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 rounded-full bg-gray-200"
          style={{ height: 12 }}
        />
        {/* Filled portion */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
          style={{ height: 12, width: `${progressFraction * 100}%` }}
        />
        {/* Thumb — big and friendly */}
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
   REWARD SCREEN — treasure chest opens to reveal a GIF
   ============================================================ */

function RewardScreen({ onDone }) {
  const [phase, setPhase] = useState('chest'); // 'chest' | 'gif'
  const [gif] = useState(() => REWARD_GIFS[Math.floor(Math.random() * REWARD_GIFS.length)]);
  const [countdown, setCountdown] = useState(15);

  const handleOpen = useCallback(() => {
    setPhase('gif');
  }, []);

  // Auto-redirect after 15 seconds once GIF is showing
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
          @keyframes chest-glow {
            0%,100% { box-shadow: 0 0 20px 5px rgba(251,191,36,0.4); }
            50% { box-shadow: 0 0 40px 15px rgba(251,191,36,0.8); }
          }
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
        <img
          src={gif}
          alt="Reward!"
          className="w-full"
          style={{ display: 'block' }}
        />
      </div>
      <p className="text-lg text-indigo-400 mt-4 font-bold">
        Back to levels in {countdown}s...
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

/* ============================================================
   SCENE RENDERER — maps scene keys to animated illustrations
   ============================================================ */

function SceneRenderer({ sceneKey }) {
  const Scene = SCENES[sceneKey];
  if (!Scene) return <div className="text-4xl text-gray-400">?</div>;
  return <Scene />;
}

const SCENES = {
  cat: CatScene,
  rat: RatScene,
  bat: BatScene,
  lip: LipScene,
  hat: HatScene,
  hip: HipScene,
  man: ManScene,
  can: CanScene,
  tin: TinScene,
  bin: BinScene,
  pin: PinScene,
  nan: NanScene,
  fan: FanScene,
  pit: PitScene,
  mit: MitScene,
  pan: PanScene,
  pen: PenScene,
  hen: HenScene,
  net: NetScene,
  pet: PetScene,
  mat: MatScene,
  'cat-bit-cake': CatBitCakeScene,
  'rat-bit-cheese': RatBitCheeseScene,
  'bat-bit-apple': BatBitAppleScene,
  'fat-cat': FatCatScene,
  'fat-bat': FatBatScene,
  'fat-rat': FatRatScene,
  'fat-cat-sat': FatCatSatScene,
  'fat-bat-sat': FatBatSatScene,
  'fat-rat-sat': FatRatSatScene,
  'cat-on-rat': CatOnRatScene,
  'cat-on-mat': CatOnMatScene,
  'rat-on-cat': RatOnCatScene,
  'rat-on-mat': RatOnMatScene,
  'bat-on-cat': BatOnCatScene,
  'bat-on-mat': BatOnMatScene,
  'sad-cat': SadCatScene,
  'sad-rat': SadRatScene,
  'sad-mat': SadMatScene,
  'mad-cat': MadCatScene,
  'mad-rat': MadRatScene,
  'mad-mat': MadMatScene,
  dog: DogScene,
  dad: DadScene,
  mum: MumScene,
  fox: FoxScene,
  pig: PigScene,
  sun: SunScene,
  'rat-hit-cat': RatHitCatScene,
  'cat-hit-rat': CatHitRatScene,
  'bat-hit-cat': BatHitCatScene,
  'cat-hit-bat': CatHitBatScene,
  'cat-hid-box': CatHidBoxScene,
  'rat-hid-box': RatHidBoxScene,
  'bat-hid-box': BatHidBoxScene,
};

/* -------------------------------------------------------
   LEVEL 1 SCENES — simple noun phrase, show the thing
   ------------------------------------------------------- */

function CatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <style>{`
        @keyframes cat-blink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes cat-tail { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
        @keyframes cat-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
      <div style={{ animation: 'cat-bob 2s ease-in-out infinite', position: 'relative', width: 200, height: 200 }}>
        {/* Body */}
        <div style={{ position: 'absolute', bottom: 20, left: 40, width: 120, height: 90, background: '#f97316', borderRadius: '50% 50% 40% 40%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 85, left: 55, width: 90, height: 80, background: '#f97316', borderRadius: '50%' }}>
          {/* Ears */}
          <div style={{ position: 'absolute', top: -15, left: 5, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #f97316' }} />
          <div style={{ position: 'absolute', top: -15, right: 5, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #f97316' }} />
          {/* Inner ears */}
          <div style={{ position: 'absolute', top: -8, left: 10, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '14px solid #fb923c' }} />
          <div style={{ position: 'absolute', top: -8, right: 10, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '14px solid #fb923c' }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: 25, left: 18, width: 14, height: 16, background: '#1e293b', borderRadius: '50%', animation: 'cat-blink 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 25, right: 18, width: 14, height: 16, background: '#1e293b', borderRadius: '50%', animation: 'cat-blink 3s ease-in-out infinite' }} />
          {/* Eye shine */}
          <div style={{ position: 'absolute', top: 27, left: 24, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, right: 24, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          {/* Nose */}
          <div style={{ position: 'absolute', top: 42, left: '50%', marginLeft: -5, width: 10, height: 7, background: '#ec4899', borderRadius: '50%' }} />
          {/* Mouth */}
          <div style={{ position: 'absolute', top: 48, left: '50%', marginLeft: -8, width: 16, height: 8, borderBottom: '2px solid #92400e', borderRadius: '0 0 50% 50%' }} />
          {/* Whiskers */}
          <div style={{ position: 'absolute', top: 42, left: -15, width: 25, height: 2, background: '#92400e', borderRadius: 2, transform: 'rotate(-5deg)' }} />
          <div style={{ position: 'absolute', top: 48, left: -15, width: 25, height: 2, background: '#92400e', borderRadius: 2, transform: 'rotate(5deg)' }} />
          <div style={{ position: 'absolute', top: 42, right: -15, width: 25, height: 2, background: '#92400e', borderRadius: 2, transform: 'rotate(5deg)' }} />
          <div style={{ position: 'absolute', top: 48, right: -15, width: 25, height: 2, background: '#92400e', borderRadius: 2, transform: 'rotate(-5deg)' }} />
        </div>
        {/* Tail */}
        <div style={{ position: 'absolute', bottom: 50, right: 10, width: 12, height: 60, background: '#f97316', borderRadius: 10, transformOrigin: 'bottom center', animation: 'cat-tail 1.5s ease-in-out infinite' }} />
        {/* Paws */}
        <div style={{ position: 'absolute', bottom: 10, left: 50, width: 25, height: 15, background: '#f97316', borderRadius: '0 0 50% 50%' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 50, width: 25, height: 15, background: '#f97316', borderRadius: '0 0 50% 50%' }} />
      </div>
    </div>
  );
}

function RatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 180 }}>
      <style>{`
        @keyframes rat-nose { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes rat-tail { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(15deg); } }
        @keyframes rat-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ animation: 'rat-bob 2s ease-in-out infinite', position: 'relative', width: 200, height: 180 }}>
        {/* Body */}
        <div style={{ position: 'absolute', bottom: 20, left: 40, width: 110, height: 70, background: '#9ca3af', borderRadius: '55% 55% 40% 40%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 60, left: 50, width: 80, height: 70, background: '#9ca3af', borderRadius: '50% 50% 45% 45%' }}>
          {/* Ears */}
          <div style={{ position: 'absolute', top: -8, left: 2, width: 28, height: 28, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 5, left: 5, width: 16, height: 16, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: -8, right: 2, width: 28, height: 28, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 5, left: 5, width: 16, height: 16, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          {/* Eyes */}
          <div style={{ position: 'absolute', top: 25, left: 15, width: 10, height: 12, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 25, right: 15, width: 10, height: 12, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, left: 19, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, right: 19, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          {/* Nose */}
          <div style={{ position: 'absolute', top: 40, left: '50%', marginLeft: -6, width: 12, height: 9, background: '#f472b6', borderRadius: '50%', animation: 'rat-nose 0.6s ease-in-out infinite' }} />
          {/* Whiskers */}
          <div style={{ position: 'absolute', top: 40, left: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(-8deg)' }} />
          <div style={{ position: 'absolute', top: 45, left: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(8deg)' }} />
          <div style={{ position: 'absolute', top: 40, right: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(8deg)' }} />
          <div style={{ position: 'absolute', top: 45, right: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(-8deg)' }} />
        </div>
        {/* Tail */}
        <div style={{ position: 'absolute', bottom: 40, right: 5, width: 6, height: 70, background: '#d1d5db', borderRadius: 6, transformOrigin: 'bottom center', animation: 'rat-tail 1.2s ease-in-out infinite' }} />
        {/* Paws */}
        <div style={{ position: 'absolute', bottom: 10, left: 50, width: 20, height: 12, background: '#fda4af', borderRadius: '0 0 50% 50%' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 55, width: 20, height: 12, background: '#fda4af', borderRadius: '0 0 50% 50%' }} />
      </div>
    </div>
  );
}

function BatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 200 }}>
      <style>{`
        @keyframes bat-wings { 0%,100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.7) rotate(10deg); } }
        @keyframes bat-wings-r { 0%,100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.7) rotate(-10deg); } }
        @keyframes bat-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes bat-blink { 0%,92%,100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
      `}</style>
      {/* Branch */}
      <div style={{ position: 'absolute', top: 10, left: 20, width: 180, height: 10, background: '#78350f', borderRadius: 5 }} />
      <div style={{ animation: 'bat-sway 3s ease-in-out infinite', transformOrigin: 'top center', position: 'absolute', top: 18, left: '50%', marginLeft: -55, width: 110, height: 160 }}>
        {/* Legs/hang */}
        <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -3, width: 6, height: 20, background: '#581c87' }} />
        {/* Body (upside down) */}
        <div style={{ position: 'absolute', top: 18, left: '50%', marginLeft: -25, width: 50, height: 55, background: '#7c3aed', borderRadius: '40% 40% 50% 50%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', top: 65, left: '50%', marginLeft: -22, width: 44, height: 40, background: '#7c3aed', borderRadius: '50%' }}>
          {/* Ears */}
          <div style={{ position: 'absolute', bottom: -2, left: 2, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '16px solid #7c3aed' }} />
          <div style={{ position: 'absolute', bottom: -2, right: 2, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '16px solid #7c3aed' }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: 12, left: 8, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 12, right: 8, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          {/* Mouth */}
          <div style={{ position: 'absolute', top: 26, left: '50%', marginLeft: -5, width: 10, height: 5, borderTop: '2px solid #4c1d95', borderRadius: '50% 50% 0 0' }} />
        </div>
        {/* Left wing */}
        <div style={{ position: 'absolute', top: 18, right: '50%', marginRight: 20, width: 50, height: 50, background: '#8b5cf6', borderRadius: '5% 50% 50% 50%', transformOrigin: 'right center', animation: 'bat-wings 2s ease-in-out infinite', opacity: 0.9 }} />
        {/* Right wing */}
        <div style={{ position: 'absolute', top: 18, left: '50%', marginLeft: 20, width: 50, height: 50, background: '#8b5cf6', borderRadius: '50% 5% 50% 50%', transformOrigin: 'left center', animation: 'bat-wings-r 2s ease-in-out infinite', opacity: 0.9 }} />
      </div>
    </div>
  );
}

function LipScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 160 }}>
      <style>{`
        @keyframes lip-pout {
          0%,100% { transform: scaleX(1) scaleY(1); border-radius: 50%; }
          30% { transform: scaleX(0.85) scaleY(1.1); border-radius: 45%; }
          60% { transform: scaleX(1.05) scaleY(0.95); border-radius: 50%; }
        }
        @keyframes lip-shine { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
      <div style={{ animation: 'lip-pout 2.5s ease-in-out infinite', position: 'relative', width: 180, height: 160 }}>
        {/* Upper lip */}
        <div style={{ position: 'absolute', top: 30, left: 20, width: 140, height: 55, background: '#f43f5e', borderRadius: '50% 50% 30% 30%' }}>
          {/* Cupid's bow */}
          <div style={{ position: 'absolute', bottom: -1, left: '50%', marginLeft: -15, width: 30, height: 12, background: '#be123c', borderRadius: '0 0 50% 50%' }} />
        </div>
        {/* Lower lip */}
        <div style={{ position: 'absolute', top: 78, left: 25, width: 130, height: 52, background: '#fb7185', borderRadius: '30% 30% 50% 50%' }} />
        {/* Shine */}
        <div style={{ position: 'absolute', top: 45, left: 55, width: 30, height: 14, background: 'rgba(255,255,255,0.5)', borderRadius: '50%', animation: 'lip-shine 2s ease-in-out infinite' }} />
        {/* Smile line */}
        <div style={{ position: 'absolute', top: 75, left: 40, width: 100, height: 4, background: '#be123c', borderRadius: 4 }} />
      </div>
    </div>
  );
}

function HatScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200 }}>
      <style>{`
        @keyframes hat-bounce { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
        @keyframes hat-sparkle {
          0%,100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
      <div style={{ animation: 'hat-bounce 1.8s ease-in-out infinite', position: 'relative', width: 180, height: 200 }}>
        {/* Hat top */}
        <div style={{ position: 'absolute', bottom: 50, left: 45, width: 90, height: 120, background: 'linear-gradient(135deg, #1e1b4b, #4338ca)', borderRadius: '10px 10px 5px 5px' }} />
        {/* Hat band */}
        <div style={{ position: 'absolute', bottom: 50, left: 40, width: 100, height: 18, background: '#dc2626', borderRadius: 4 }} />
        {/* Hat brim */}
        <div style={{ position: 'absolute', bottom: 35, left: 15, width: 150, height: 20, background: 'linear-gradient(135deg, #1e1b4b, #4338ca)', borderRadius: '50%' }} />
        {/* Sparkles */}
        <div style={{ position: 'absolute', top: 15, right: 25, width: 16, height: 16, color: '#fbbf24', fontSize: 16, animation: 'hat-sparkle 1.5s ease-in-out infinite' }}>✦</div>
        <div style={{ position: 'absolute', top: 40, left: 30, width: 12, height: 12, color: '#fbbf24', fontSize: 12, animation: 'hat-sparkle 1.5s ease-in-out infinite 0.5s' }}>✦</div>
        <div style={{ position: 'absolute', top: 5, left: 60, width: 14, height: 14, color: '#fbbf24', fontSize: 14, animation: 'hat-sparkle 1.5s ease-in-out infinite 1s' }}>✦</div>
      </div>
    </div>
  );
}

function HipScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes hip-sway {
          0%,100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes hip-sparkle {
          0%,100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{ position: 'relative', width: 120, height: 160, animation: 'hip-sway 1.5s ease-in-out infinite' }}>
        {/* Torso */}
        <div style={{ position: 'absolute', top: 0, left: 25, width: 70, height: 80, background: '#60a5fa', borderRadius: '30px 30px 10px 10px' }} />
        {/* Hips - highlighted */}
        <div style={{ position: 'absolute', top: 70, left: 10, width: 100, height: 50, background: '#f472b6', borderRadius: '50%', border: '4px solid #ec4899' }} />
        {/* Arrow pointing at hip */}
        <div style={{ position: 'absolute', top: 80, right: -30, fontSize: 28 }}>👈</div>
        {/* Legs */}
        <div style={{ position: 'absolute', bottom: 0, left: 22, width: 25, height: 50, background: '#1e3a5f', borderRadius: '0 0 10px 10px' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 22, width: 25, height: 50, background: '#1e3a5f', borderRadius: '0 0 10px 10px' }} />
        {/* Sparkles */}
        <div style={{ position: 'absolute', top: 65, left: -10, fontSize: 14, animation: 'hip-sparkle 1.2s ease-in-out infinite' }}>✦</div>
        <div style={{ position: 'absolute', top: 85, left: -15, fontSize: 10, animation: 'hip-sparkle 1.2s ease-in-out infinite 0.4s' }}>✦</div>
      </div>
    </div>
  );
}

function ManScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes man-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg); } }
        @keyframes man-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 160, animation: 'man-bounce 2s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 15, width: 70, height: 80, background: '#22c55e', borderRadius: '20px 20px 10px 10px' }} />
        <div style={{ position: 'absolute', bottom: -20, left: 20, width: 22, height: 25, background: '#1e3a5f', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 20, width: 22, height: 25, background: '#1e3a5f', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', top: 85, left: -8, width: 18, height: 40, background: '#22c55e', borderRadius: 10 }} />
        <div style={{ position: 'absolute', top: 75, right: -12, width: 18, height: 45, background: '#22c55e', borderRadius: 10, transformOrigin: 'top center', animation: 'man-wave 1.2s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: 75, left: 18, width: 60, height: 60, background: '#fcd9b6', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 20, left: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 20, right: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 35, left: '50%', marginLeft: -10, width: 20, height: 10, borderBottom: '3px solid #1e293b', borderRadius: '0 0 50% 50%' }} />
          <div style={{ position: 'absolute', top: -3, left: 5, right: 5, height: 18, background: '#1e293b', borderRadius: '20px 20px 0 0' }} />
        </div>
      </div>
    </div>
  );
}

function CanScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes can-shine { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes can-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
      <div style={{ position: 'relative', width: 90, height: 120, animation: 'can-bounce 2s ease-in-out infinite' }}>
        {/* Can body */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 90, height: 110, background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '8px 8px 12px 12px', border: '2px solid #b91c1c' }} />
        {/* Top rim */}
        <div style={{ position: 'absolute', top: 0, left: -3, width: 96, height: 14, background: '#a8a29e', borderRadius: '4px 4px 2px 2px', border: '2px solid #78716c' }} />
        {/* Label */}
        <div style={{ position: 'absolute', top: 25, left: 8, right: 8, height: 50, background: '#fef3c7', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }}>🍅</span>
        </div>
        {/* Shine */}
        <div style={{ position: 'absolute', top: 5, left: 10, width: 12, height: 80, background: 'rgba(255,255,255,0.25)', borderRadius: 10, animation: 'can-shine 2s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function TinScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes tin-shine { 0%,100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes tin-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
      <div style={{ position: 'relative', width: 80, height: 100, animation: 'tin-bounce 2.2s ease-in-out infinite' }}>
        {/* Tin body */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 80, height: 95, background: 'linear-gradient(135deg, #d4d4d8, #a1a1aa)', borderRadius: '6px 6px 10px 10px', border: '2px solid #71717a' }} />
        {/* Top rim */}
        <div style={{ position: 'absolute', top: 0, left: -3, width: 86, height: 12, background: '#a8a29e', borderRadius: '3px 3px 1px 1px', border: '2px solid #78716c' }} />
        {/* Label */}
        <div style={{ position: 'absolute', top: 20, left: 6, right: 6, height: 45, background: '#bfdbfe', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 'bold', color: '#2563eb' }}>🐟</span>
        </div>
        {/* Shine */}
        <div style={{ position: 'absolute', top: 5, left: 8, width: 10, height: 70, background: 'rgba(255,255,255,0.3)', borderRadius: 8, animation: 'tin-shine 2s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function BinScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes bin-wobble { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 140, animation: 'bin-wobble 2s ease-in-out infinite' }}>
        {/* Bin body — tapered */}
        <div style={{ position: 'absolute', bottom: 0, left: 10, width: 80, height: 110, background: 'linear-gradient(180deg, #6b7280, #4b5563)', borderRadius: '5px 5px 12px 12px', border: '2px solid #374151' }} />
        {/* Lid */}
        <div style={{ position: 'absolute', top: 0, left: 5, width: 90, height: 18, background: '#4b5563', borderRadius: '8px 8px 2px 2px', border: '2px solid #374151' }}>
          <div style={{ position: 'absolute', top: -8, left: '50%', marginLeft: -10, width: 20, height: 10, background: '#6b7280', borderRadius: '6px 6px 0 0', border: '2px solid #374151' }} />
        </div>
        {/* Horizontal lines */}
        <div style={{ position: 'absolute', top: 40, left: 15, right: 15, height: 2, background: '#374151', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 65, left: 15, right: 15, height: 2, background: '#374151', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 90, left: 15, right: 15, height: 2, background: '#374151', borderRadius: 1 }} />
        {/* Rubbish peeking out */}
        <div style={{ position: 'absolute', top: 10, left: 20, fontSize: 16, transform: 'rotate(-15deg)' }}>🍌</div>
        <div style={{ position: 'absolute', top: 5, right: 20, fontSize: 14, transform: 'rotate(10deg)' }}>📄</div>
      </div>
    </div>
  );
}

function PinScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pin-bounce { 0%,100% { transform: translateY(0) rotate(5deg); } 50% { transform: translateY(-8px) rotate(-5deg); } }
        @keyframes pin-sparkle {
          0%,100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      <div style={{ position: 'relative', width: 50, height: 150, animation: 'pin-bounce 1.8s ease-in-out infinite' }}>
        {/* Pin head */}
        <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -18, width: 36, height: 36, background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '50%', border: '2px solid #b91c1c', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
          <div style={{ position: 'absolute', top: 6, left: 8, width: 8, height: 8, background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
        </div>
        {/* Pin shaft */}
        <div style={{ position: 'absolute', top: 34, left: '50%', marginLeft: -3, width: 6, height: 100, background: 'linear-gradient(180deg, #d4d4d8, #a1a1aa)', borderRadius: '2px 2px 0 0' }} />
        {/* Pin point */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -4, width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '12px solid #a1a1aa' }} />
        {/* Sparkles */}
        <div style={{ position: 'absolute', top: 5, right: -20, fontSize: 12, animation: 'pin-sparkle 1.5s ease-in-out infinite' }}>✨</div>
        <div style={{ position: 'absolute', top: 15, left: -18, fontSize: 10, animation: 'pin-sparkle 1.5s ease-in-out infinite 0.5s' }}>✨</div>
      </div>
    </div>
  );
}

function NanScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes nan-sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 160, animation: 'nan-sway 2.5s ease-in-out infinite' }}>
        {/* Dress */}
        <div style={{ position: 'absolute', bottom: 0, left: 8, width: 84, height: 90, background: '#c084fc', borderRadius: '15px 15px 35px 35px' }} />
        {/* Legs */}
        <div style={{ position: 'absolute', bottom: -18, left: 22, width: 18, height: 22, background: '#fcd9b6', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', bottom: -18, right: 22, width: 18, height: 22, background: '#fcd9b6', borderRadius: '0 0 8px 8px' }} />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 75, left: -5, width: 16, height: 35, background: '#fcd9b6', borderRadius: 10 }} />
        <div style={{ position: 'absolute', top: 75, right: -5, width: 16, height: 35, background: '#fcd9b6', borderRadius: 10 }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 85, left: 18, width: 60, height: 60, background: '#fcd9b6', borderRadius: '50%' }}>
          {/* Glasses */}
          <div style={{ position: 'absolute', top: 18, left: 6, width: 18, height: 16, border: '2px solid #78716c', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 18, right: 6, width: 18, height: 16, border: '2px solid #78716c', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 24, left: 24, width: 8, height: 2, background: '#78716c' }} />
          {/* Eyes behind glasses */}
          <div style={{ position: 'absolute', top: 23, left: 11, width: 6, height: 6, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 23, right: 11, width: 6, height: 6, background: '#1e293b', borderRadius: '50%' }} />
          {/* Smile */}
          <div style={{ position: 'absolute', top: 38, left: '50%', marginLeft: -8, width: 16, height: 8, borderBottom: '3px solid #e11d48', borderRadius: '0 0 50% 50%' }} />
          {/* Grey hair in a bun */}
          <div style={{ position: 'absolute', top: -5, left: 0, right: 0, height: 30, background: '#d1d5db', borderRadius: '30px 30px 0 0' }} />
          <div style={{ position: 'absolute', top: -15, left: '50%', marginLeft: -14, width: 28, height: 28, background: '#d1d5db', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  );
}

function FanScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes fan-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fan-breeze {
          0%,100% { transform: translateX(0) scaleX(1); opacity: 0.3; }
          50% { transform: translateX(30px) scaleX(1.5); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'relative', width: 140, height: 160 }}>
        {/* Stand */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -20, width: 40, height: 8, background: '#6b7280', borderRadius: 4 }} />
        <div style={{ position: 'absolute', bottom: 8, left: '50%', marginLeft: -4, width: 8, height: 70, background: '#9ca3af', borderRadius: 4 }} />
        {/* Fan cage */}
        <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -55, width: 110, height: 110, borderRadius: '50%', border: '4px solid #d1d5db', background: 'rgba(255,255,255,0.3)' }}>
          {/* Spinning blades */}
          <div style={{ position: 'absolute', inset: 8, animation: 'fan-spin 0.6s linear infinite' }}>
            {[0, 90, 180, 270].map(deg => (
              <div key={deg} style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 38, height: 14, marginTop: -7, marginLeft: -2,
                background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
                borderRadius: '0 50% 50% 0',
                transformOrigin: 'left center',
                transform: `rotate(${deg}deg)`,
              }} />
            ))}
            {/* Center hub */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -8, marginLeft: -8, width: 16, height: 16, background: '#1e3a5f', borderRadius: '50%' }} />
          </div>
        </div>
        {/* Breeze lines */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', top: 25 + i * 20, right: -10,
            width: 30, height: 3, background: '#93c5fd', borderRadius: 3,
            animation: `fan-breeze 0.8s ease-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function PitScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pit-dust {
          0%,100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.4; transform: translateY(-10px) scale(1); }
        }
      `}</style>
      <div style={{ position: 'relative', width: 160, height: 120 }}>
        {/* Ground surface */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, background: '#65a30d', borderRadius: '4px 4px 0 0' }} />
        {/* Pit hole */}
        <div style={{ position: 'absolute', top: 15, left: 20, right: 20, height: 90, background: 'linear-gradient(180deg, #78350f, #451a03)', borderRadius: '0 0 20px 20px', border: '3px solid #92400e', borderTop: 'none' }}>
          {/* Depth shading */}
          <div style={{ position: 'absolute', top: 10, left: 5, right: 5, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }} />
          <div style={{ position: 'absolute', top: 30, left: 10, right: 10, height: 10, background: 'rgba(0,0,0,0.15)', borderRadius: 4 }} />
          {/* Rocks at bottom */}
          <div style={{ position: 'absolute', bottom: 8, left: 15, width: 14, height: 10, background: '#78716c', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 5, left: 35, width: 18, height: 12, background: '#a8a29e', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 10, right: 20, width: 12, height: 8, background: '#78716c', borderRadius: '50%' }} />
        </div>
        {/* Dirt edges */}
        <div style={{ position: 'absolute', top: 12, left: 10, width: 20, height: 12, background: '#92400e', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 10, background: '#92400e', borderRadius: '50%' }} />
        {/* Dust particles */}
        <div style={{ position: 'absolute', top: 20, left: 30, width: 6, height: 6, background: '#d4a574', borderRadius: '50%', animation: 'pit-dust 3s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: 25, right: 35, width: 4, height: 4, background: '#d4a574', borderRadius: '50%', animation: 'pit-dust 3s ease-in-out 1s infinite' }} />
      </div>
    </div>
  );
}

function MitScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes mit-wave { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(10deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 130, animation: 'mit-wave 1.5s ease-in-out infinite' }}>
        {/* Mitten body */}
        <div style={{ position: 'absolute', bottom: 0, left: 10, width: 70, height: 90, background: 'linear-gradient(135deg, #f87171, #ef4444)', borderRadius: '30px 30px 35px 35px', border: '3px solid #dc2626' }} />
        {/* Thumb */}
        <div style={{ position: 'absolute', bottom: 40, left: -10, width: 35, height: 45, background: 'linear-gradient(135deg, #f87171, #ef4444)', borderRadius: '20px 10px 10px 20px', border: '3px solid #dc2626', transform: 'rotate(-20deg)' }} />
        {/* Cuff */}
        <div style={{ position: 'absolute', bottom: -5, left: 5, width: 80, height: 25, background: '#fbbf24', borderRadius: '0 0 15px 15px', border: '2px solid #f59e0b' }}>
          {/* Cuff pattern */}
          <div style={{ position: 'absolute', top: 5, left: 8, right: 8, height: 3, background: '#f59e0b', borderRadius: 2 }} />
          <div style={{ position: 'absolute', top: 12, left: 8, right: 8, height: 3, background: '#f59e0b', borderRadius: 2 }} />
        </div>
        {/* Snowflake decoration */}
        <div style={{ position: 'absolute', top: 30, left: '50%', marginLeft: -8, fontSize: 20, color: 'white', opacity: 0.7 }}>❄</div>
      </div>
    </div>
  );
}

function PanScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pan-sizzle {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-15px) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.3); }
        }
        @keyframes pan-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ position: 'relative', width: 200, height: 100, animation: 'pan-bounce 2s ease-in-out infinite' }}>
        {/* Handle */}
        <div style={{ position: 'absolute', top: 25, right: -40, width: 60, height: 16, background: 'linear-gradient(180deg, #78716c, #57534e)', borderRadius: '0 8px 8px 0', border: '2px solid #44403c' }}>
          <div style={{ position: 'absolute', top: 3, right: 5, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
        </div>
        {/* Pan body */}
        <div style={{ position: 'absolute', top: 10, left: 0, width: 140, height: 50, background: 'linear-gradient(180deg, #4b5563, #374151)', borderRadius: '10px 10px 20px 20px', border: '3px solid #1f2937' }}>
          {/* Inner surface */}
          <div style={{ position: 'absolute', top: 5, left: 8, right: 8, height: 35, background: 'linear-gradient(180deg, #6b7280, #4b5563)', borderRadius: '6px 6px 15px 15px' }} />
          {/* Shine */}
          <div style={{ position: 'absolute', top: 8, left: 15, width: 30, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }} />
        </div>
        {/* Steam/sizzle */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 25 + i * 30,
            width: 8, height: 8, background: 'rgba(200,200,200,0.5)', borderRadius: '50%',
            animation: `pan-sizzle 1.5s ease-out ${i * 0.4}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function PenScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pen-write {
          0%,100% { transform: rotate(15deg) translateX(0); }
          25% { transform: rotate(15deg) translateX(10px); }
          50% { transform: rotate(15deg) translateX(5px); }
          75% { transform: rotate(15deg) translateX(12px); }
        }
      `}</style>
      <div style={{ position: 'relative', width: 30, height: 150, animation: 'pen-write 2s ease-in-out infinite' }}>
        {/* Cap */}
        <div style={{ position: 'absolute', top: 0, left: 3, width: 24, height: 20, background: '#1e40af', borderRadius: '6px 6px 2px 2px' }}>
          <div style={{ position: 'absolute', top: -6, left: '50%', marginLeft: -3, width: 6, height: 8, background: '#1e40af', borderRadius: '3px 3px 0 0' }} />
        </div>
        {/* Body */}
        <div style={{ position: 'absolute', top: 18, left: 3, width: 24, height: 100, background: 'linear-gradient(180deg, #3b82f6, #2563eb)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', top: 5, left: 3, width: 4, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
        </div>
        {/* Tip */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -8, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '20px solid #fbbf24' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -3, width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '8px solid #1e293b' }} />
      </div>
    </div>
  );
}

function HenScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes hen-peck { 0%,100% { transform: translateY(0) rotate(0deg); } 40% { transform: translateY(8px) rotate(10deg); } 50% { transform: translateY(0) rotate(0deg); } }
        @keyframes hen-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ animation: 'hen-bob 1.5s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 120, height: 100 }}>
          {/* Body */}
          <div style={{ position: 'absolute', bottom: 0, left: 15, width: 80, height: 55, background: '#92400e', borderRadius: '50% 50% 40% 40%' }} />
          <div style={{ position: 'absolute', bottom: 3, left: 25, width: 55, height: 30, background: '#fcd9b6', borderRadius: '50%' }} />
          {/* Tail feathers */}
          <div style={{ position: 'absolute', bottom: 25, right: 5, width: 25, height: 35, background: '#78350f', borderRadius: '0 50% 10% 50%', transform: 'rotate(20deg)' }} />
          {/* Legs */}
          <div style={{ position: 'absolute', bottom: -12, left: 35, width: 4, height: 15, background: '#f59e0b' }} />
          <div style={{ position: 'absolute', bottom: -12, right: 35, width: 4, height: 15, background: '#f59e0b' }} />
          {/* Head */}
          <div style={{ position: 'absolute', bottom: 40, left: 10, width: 40, height: 35, background: '#92400e', borderRadius: '50%', animation: 'hen-peck 2s ease-in-out infinite' }}>
            {/* Comb */}
            <div style={{ position: 'absolute', top: -8, left: 10, width: 20, height: 12, background: '#ef4444', borderRadius: '50% 50% 20% 20%' }} />
            {/* Eye */}
            <div style={{ position: 'absolute', top: 10, left: 8, width: 7, height: 7, background: '#1e293b', borderRadius: '50%' }} />
            {/* Beak */}
            <div style={{ position: 'absolute', top: 16, left: -8, width: 14, height: 8, background: '#f59e0b', borderRadius: '50% 0 0 50%' }} />
            {/* Wattle */}
            <div style={{ position: 'absolute', bottom: 2, left: 8, width: 8, height: 10, background: '#ef4444', borderRadius: '0 0 50% 50%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NetScene() {
  return (
    <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes net-sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 120, height: 160, animation: 'net-sway 2s ease-in-out infinite' }}>
        {/* Handle */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -5, width: 10, height: 90, background: 'linear-gradient(180deg, #92400e, #78350f)', borderRadius: 4 }} />
        {/* Hoop */}
        <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -45, width: 90, height: 80, border: '4px solid #92400e', borderRadius: '50% 50% 0 0', borderBottom: 'none' }} />
        {/* Net mesh */}
        <svg style={{ position: 'absolute', top: 35, left: '50%', marginLeft: -40, width: 80, height: 55 }} viewBox="0 0 80 55">
          {/* Diagonal lines one way */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`a${i}`} x1={i * 16} y1="0" x2={i * 16 - 20} y2="55" stroke="#d1d5db" strokeWidth="1.5" />
          ))}
          {/* Diagonal lines other way */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`b${i}`} x1={i * 16} y1="0" x2={i * 16 + 20} y2="55" stroke="#d1d5db" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function PetScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pet-wag { 0%,100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
        @keyframes pet-hand {
          0%,100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(5px) rotate(5deg); }
          60% { transform: translateY(-2px) rotate(-3deg); }
        }
        @keyframes pet-happy { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      `}</style>
      <div style={{ position: 'relative', width: 140, height: 130 }}>
        {/* Dog body */}
        <div style={{ position: 'absolute', bottom: 0, left: 20, width: 80, height: 50, background: '#d4a574', borderRadius: '50% 50% 30% 30%', animation: 'pet-happy 1s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -12, left: 30, width: 12, height: 16, background: '#d4a574', borderRadius: '0 0 4px 4px' }} />
        <div style={{ position: 'absolute', bottom: -12, right: 30, width: 12, height: 16, background: '#d4a574', borderRadius: '0 0 4px 4px' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 38, left: 25, width: 45, height: 40, background: '#d4a574', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -2, left: -4, width: 16, height: 20, background: '#b8860b', borderRadius: '50% 50% 30% 30%', transform: 'rotate(-15deg)' }} />
          <div style={{ position: 'absolute', top: -2, right: -4, width: 16, height: 20, background: '#b8860b', borderRadius: '50% 50% 30% 30%', transform: 'rotate(15deg)' }} />
          <div style={{ position: 'absolute', top: 13, left: 8, width: 7, height: 7, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 13, right: 8, width: 7, height: 7, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 22, left: '50%', marginLeft: -5, width: 10, height: 6, background: '#1e293b', borderRadius: '50%' }} />
          {/* Happy tongue */}
          <div style={{ position: 'absolute', bottom: -4, left: '50%', marginLeft: -3, width: 6, height: 8, background: '#f472b6', borderRadius: '0 0 50% 50%' }} />
        </div>
        {/* Wagging tail */}
        <div style={{ position: 'absolute', bottom: 28, right: 10, width: 6, height: 25, background: '#d4a574', borderRadius: 8, transformOrigin: 'bottom center', animation: 'pet-wag 0.3s ease-in-out infinite' }} />
        {/* Hand petting */}
        <div style={{ position: 'absolute', top: -5, right: 10, animation: 'pet-hand 1.5s ease-in-out infinite' }}>
          <div style={{ width: 40, height: 25, background: '#fcd9b6', borderRadius: '12px 12px 8px 8px', border: '2px solid #e8c9a0' }} />
          <div style={{ position: 'absolute', bottom: -4, left: 5, width: 7, height: 10, background: '#fcd9b6', borderRadius: '0 0 4px 4px', border: '1px solid #e8c9a0' }} />
          <div style={{ position: 'absolute', bottom: -5, left: 14, width: 7, height: 12, background: '#fcd9b6', borderRadius: '0 0 4px 4px', border: '1px solid #e8c9a0' }} />
          <div style={{ position: 'absolute', bottom: -5, left: 23, width: 7, height: 11, background: '#fcd9b6', borderRadius: '0 0 4px 4px', border: '1px solid #e8c9a0' }} />
        </div>
        {/* Hearts */}
        <div style={{ position: 'absolute', top: 5, left: 5, fontSize: 16, animation: 'pet-happy 1.2s ease-in-out infinite' }}>❤️</div>
      </div>
    </div>
  );
}

function MatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 140 }}>
      <style>{`
        @keyframes mat-glow {
          0%,100% { box-shadow: 0 0 8px 2px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 20px 6px rgba(251,191,36,0.6); }
        }
        @keyframes mat-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
      <div style={{ animation: 'mat-bounce 2.5s ease-in-out infinite', position: 'relative', width: 220, height: 140 }}>
        {/* Mat body */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10, width: 200, height: 60,
          background: 'linear-gradient(135deg, #92400e, #b45309, #92400e)',
          borderRadius: 12, border: '4px solid #78350f',
          animation: 'mat-glow 2s ease-in-out infinite'
        }}>
          {/* Pattern stripes */}
          <div style={{ position: 'absolute', top: 10, left: 15, right: 15, height: 4, background: '#fbbf24', borderRadius: 2 }} />
          <div style={{ position: 'absolute', top: 22, left: 15, right: 15, height: 4, background: '#fbbf24', borderRadius: 2 }} />
          <div style={{ position: 'absolute', top: 34, left: 15, right: 15, height: 4, background: '#fbbf24', borderRadius: 2 }} />
          {/* Welcome text area */}
          <div style={{ position: 'absolute', top: 14, left: '50%', marginLeft: -35, width: 70, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', letterSpacing: 2 }}>WELCOME</span>
          </div>
        </div>
        {/* Fringe left */}
        {[0,1,2,3,4,5].map(i => (
          <div key={`l${i}`} style={{ position: 'absolute', bottom: 5, left: 15 + i * 8, width: 3, height: 10, background: '#78350f', borderRadius: '0 0 2px 2px' }} />
        ))}
        {/* Fringe right */}
        {[0,1,2,3,4,5].map(i => (
          <div key={`r${i}`} style={{ position: 'absolute', bottom: 5, right: 15 + i * 8, width: 3, height: 10, background: '#78350f', borderRadius: '0 0 2px 2px' }} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   LEVEL 2 SCENES — action sentences, creature bites thing
   ------------------------------------------------------- */

function CatBitCakeScene() {
  return (
    <div style={{ position: 'relative', width: 300, height: 200 }}>
      <style>{`
        @keyframes cat-lean { 0%,100% { transform: translateX(0) rotate(0); } 40%,60% { transform: translateX(30px) rotate(10deg); } }
        @keyframes crumb1 { 0% { opacity: 1; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-20px, -30px) rotate(180deg); } }
        @keyframes crumb2 { 0% { opacity: 1; transform: translate(0,0); } 100% { opacity: 0; transform: translate(15px, -35px) rotate(-120deg); } }
        @keyframes crumb3 { 0% { opacity: 1; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-10px, -25px) rotate(90deg); } }
        @keyframes cake-bite { 0%,30% { clip-path: none; } 40%,100% { clip-path: polygon(0 0, 75% 0, 65% 30%, 75% 50%, 100% 50%, 100% 100%, 0 100%); } }
        @keyframes cat-happy { 0%,70% { transform: scaleY(1); } 80%,90% { transform: scaleY(0.1); } }
      `}</style>
      {/* Cat */}
      <div style={{ position: 'absolute', bottom: 20, left: 10, animation: 'cat-lean 3s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 15, width: 70, height: 50, background: '#f97316', borderRadius: '50% 50% 40% 40%' }} />
          <div style={{ position: 'absolute', bottom: 35, left: 20, width: 55, height: 50, background: '#f97316', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: -10, left: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '15px solid #f97316' }} />
            <div style={{ position: 'absolute', top: -10, right: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '15px solid #f97316' }} />
            <div style={{ position: 'absolute', top: 16, left: 10, width: 8, height: 10, background: '#1e293b', borderRadius: '50%', animation: 'cat-happy 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 16, right: 10, width: 8, height: 10, background: '#1e293b', borderRadius: '50%', animation: 'cat-happy 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: -4, width: 8, height: 5, background: '#ec4899', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
      {/* Cake */}
      <div style={{ position: 'absolute', bottom: 20, right: 40, animation: 'cake-bite 3s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 80, height: 90 }}>
          {/* Bottom layer */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 80, height: 35, background: '#fbbf24', borderRadius: '5px 5px 8px 8px' }} />
          {/* Top layer */}
          <div style={{ position: 'absolute', bottom: 32, left: 8, width: 64, height: 30, background: '#fb923c', borderRadius: '5px 5px 6px 6px' }} />
          {/* Frosting */}
          <div style={{ position: 'absolute', bottom: 58, left: 5, width: 70, height: 15, background: '#fda4af', borderRadius: '50% 50% 5px 5px' }} />
          {/* Cherry */}
          <div style={{ position: 'absolute', bottom: 70, left: '50%', marginLeft: -8, width: 16, height: 16, background: '#ef4444', borderRadius: '50%' }} />
        </div>
      </div>
      {/* Crumbs */}
      <div style={{ position: 'absolute', bottom: 70, right: 70, width: 6, height: 6, background: '#fbbf24', borderRadius: 2, animation: 'crumb1 3s ease-out infinite' }} />
      <div style={{ position: 'absolute', bottom: 60, right: 60, width: 5, height: 5, background: '#fb923c', borderRadius: 2, animation: 'crumb2 3s ease-out infinite 0.2s' }} />
      <div style={{ position: 'absolute', bottom: 75, right: 80, width: 4, height: 4, background: '#fda4af', borderRadius: 2, animation: 'crumb3 3s ease-out infinite 0.4s' }} />
    </div>
  );
}

function RatBitCheeseScene() {
  return (
    <div style={{ position: 'relative', width: 300, height: 180 }}>
      <style>{`
        @keyframes rat-nibble { 0%,100% { transform: translateX(0); } 30%,70% { transform: translateX(25px); } 40%,60% { transform: translateX(22px); } 50% { transform: translateX(28px); } }
        @keyframes cheese-shrink { 0% { transform: scale(1); } 100% { transform: scale(0.85); } }
        @keyframes nibble-bit { 0% { opacity: 1; transform: translate(0,0) scale(1); } 100% { opacity: 0; transform: translate(-15px,-20px) scale(0.3); } }
      `}</style>
      {/* Rat */}
      <div style={{ position: 'absolute', bottom: 15, left: 10, animation: 'rat-nibble 2s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 90, height: 80 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 10, width: 70, height: 40, background: '#9ca3af', borderRadius: '50% 50% 40% 40%' }} />
          <div style={{ position: 'absolute', bottom: 28, left: 15, width: 55, height: 45, background: '#9ca3af', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: -5, left: 2, width: 20, height: 20, background: '#9ca3af', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 4, left: 4, width: 10, height: 10, background: '#fda4af', borderRadius: '50%' }} />
            </div>
            <div style={{ position: 'absolute', top: -5, right: 2, width: 20, height: 20, background: '#9ca3af', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 4, left: 4, width: 10, height: 10, background: '#fda4af', borderRadius: '50%' }} />
            </div>
            <div style={{ position: 'absolute', top: 18, left: 10, width: 7, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: 18, right: 10, width: 7, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: -4, width: 8, height: 6, background: '#f472b6', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
      {/* Cheese */}
      <div style={{ position: 'absolute', bottom: 15, right: 40, animation: 'cheese-shrink 2s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 90, height: 80 }}>
          {/* Cheese wedge */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderLeft: '90px solid #fbbf24', borderTop: '70px solid transparent' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 90, height: 25, background: '#f59e0b', borderRadius: '0 0 4px 4px' }} />
          {/* Holes */}
          <div style={{ position: 'absolute', bottom: 25, left: 20, width: 14, height: 12, background: '#d97706', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 50, width: 10, height: 8, background: '#d97706', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 35, left: 45, width: 8, height: 7, background: '#d97706', borderRadius: '50%' }} />
        </div>
      </div>
      {/* Nibble bits */}
      <div style={{ position: 'absolute', bottom: 60, right: 90, width: 5, height: 5, background: '#fbbf24', borderRadius: 2, animation: 'nibble-bit 2s ease-out infinite' }} />
      <div style={{ position: 'absolute', bottom: 50, right: 80, width: 4, height: 4, background: '#f59e0b', borderRadius: 2, animation: 'nibble-bit 2s ease-out infinite 0.3s' }} />
    </div>
  );
}

/* -------------------------------------------------------
   LEVEL 3/4/6 SCENES — fat versions of the animals
   ------------------------------------------------------- */

function FatCatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 210 }}>
      <style>{`
        @keyframes fat-cat-blink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes fat-cat-tail { 0%,100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
        @keyframes fat-cat-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes fat-cat-belly { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.03); } }
      `}</style>
      <div style={{ animation: 'fat-cat-bob 2.5s ease-in-out infinite', position: 'relative', width: 220, height: 210 }}>
        {/* Big round body */}
        <div style={{ position: 'absolute', bottom: 15, left: 25, width: 160, height: 120, background: '#f97316', borderRadius: '50%', animation: 'fat-cat-belly 2s ease-in-out infinite' }} />
        {/* Belly */}
        <div style={{ position: 'absolute', bottom: 20, left: 65, width: 80, height: 70, background: '#fed7aa', borderRadius: '50%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 110, left: 60, width: 90, height: 80, background: '#f97316', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -15, left: 5, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #f97316' }} />
          <div style={{ position: 'absolute', top: -15, right: 5, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '22px solid #f97316' }} />
          <div style={{ position: 'absolute', top: 25, left: 18, width: 14, height: 16, background: '#1e293b', borderRadius: '50%', animation: 'fat-cat-blink 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 25, right: 18, width: 14, height: 16, background: '#1e293b', borderRadius: '50%', animation: 'fat-cat-blink 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 27, left: 24, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, right: 24, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 42, left: '50%', marginLeft: -5, width: 10, height: 7, background: '#ec4899', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 48, left: '50%', marginLeft: -8, width: 16, height: 8, borderBottom: '2px solid #92400e', borderRadius: '0 0 50% 50%' }} />
        </div>
        {/* Tail */}
        <div style={{ position: 'absolute', bottom: 60, right: 5, width: 14, height: 55, background: '#f97316', borderRadius: 10, transformOrigin: 'bottom center', animation: 'fat-cat-tail 1.5s ease-in-out infinite' }} />
        {/* Stubby paws */}
        <div style={{ position: 'absolute', bottom: 5, left: 55, width: 30, height: 16, background: '#f97316', borderRadius: '0 0 50% 50%' }} />
        <div style={{ position: 'absolute', bottom: 5, right: 55, width: 30, height: 16, background: '#f97316', borderRadius: '0 0 50% 50%' }} />
      </div>
    </div>
  );
}

function FatBatScene() {
  return (
    <div style={{ position: 'relative', width: 240, height: 200 }}>
      <style>{`
        @keyframes fat-bat-wings { 0%,100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.7) rotate(8deg); } }
        @keyframes fat-bat-wings-r { 0%,100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.7) rotate(-8deg); } }
        @keyframes fat-bat-hover { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fat-bat-blink { 0%,92%,100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
      `}</style>
      <div style={{ animation: 'fat-bat-hover 2s ease-in-out infinite', position: 'relative', width: 240, height: 200 }}>
        {/* Big round body */}
        <div style={{ position: 'absolute', top: 50, left: '50%', marginLeft: -50, width: 100, height: 90, background: '#7c3aed', borderRadius: '50%' }} />
        {/* Belly */}
        <div style={{ position: 'absolute', top: 70, left: '50%', marginLeft: -30, width: 60, height: 50, background: '#a78bfa', borderRadius: '50%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', top: 15, left: '50%', marginLeft: -28, width: 56, height: 45, background: '#7c3aed', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -10, left: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #7c3aed' }} />
          <div style={{ position: 'absolute', top: -10, right: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #7c3aed' }} />
          <div style={{ position: 'absolute', top: 14, left: 10, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'fat-bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 14, right: 10, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'fat-bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: -5, width: 10, height: 5, borderTop: '2px solid #4c1d95', borderRadius: '50% 50% 0 0' }} />
        </div>
        {/* Wings */}
        <div style={{ position: 'absolute', top: 45, right: '50%', marginRight: 45, width: 60, height: 55, background: '#8b5cf6', borderRadius: '5% 50% 50% 50%', transformOrigin: 'right center', animation: 'fat-bat-wings 2s ease-in-out infinite', opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 45, left: '50%', marginLeft: 45, width: 60, height: 55, background: '#8b5cf6', borderRadius: '50% 5% 50% 50%', transformOrigin: 'left center', animation: 'fat-bat-wings-r 2s ease-in-out infinite', opacity: 0.9 }} />
      </div>
    </div>
  );
}

function FatRatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 200 }}>
      <style>{`
        @keyframes fat-rat-nose { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes fat-rat-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fat-rat-tail { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(12deg); } }
      `}</style>
      <div style={{ animation: 'fat-rat-bob 2s ease-in-out infinite', position: 'relative', width: 220, height: 200 }}>
        {/* Big round body */}
        <div style={{ position: 'absolute', bottom: 15, left: 25, width: 150, height: 110, background: '#9ca3af', borderRadius: '50%' }} />
        {/* Belly */}
        <div style={{ position: 'absolute', bottom: 20, left: 60, width: 80, height: 65, background: '#e5e7eb', borderRadius: '50%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 95, left: 55, width: 80, height: 70, background: '#9ca3af', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -8, left: 2, width: 28, height: 28, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 5, left: 5, width: 16, height: 16, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: -8, right: 2, width: 28, height: 28, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 5, left: 5, width: 16, height: 16, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 25, left: 15, width: 10, height: 12, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 25, right: 15, width: 10, height: 12, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, left: 19, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 27, right: 19, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 40, left: '50%', marginLeft: -6, width: 12, height: 9, background: '#f472b6', borderRadius: '50%', animation: 'fat-rat-nose 0.6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 40, left: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(-8deg)' }} />
          <div style={{ position: 'absolute', top: 45, left: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(8deg)' }} />
          <div style={{ position: 'absolute', top: 40, right: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(8deg)' }} />
          <div style={{ position: 'absolute', top: 45, right: -12, width: 22, height: 1.5, background: '#6b7280', transform: 'rotate(-8deg)' }} />
        </div>
        {/* Tail */}
        <div style={{ position: 'absolute', bottom: 50, right: 10, width: 7, height: 60, background: '#d1d5db', borderRadius: 6, transformOrigin: 'bottom center', animation: 'fat-rat-tail 1.2s ease-in-out infinite' }} />
        {/* Stubby paws */}
        <div style={{ position: 'absolute', bottom: 5, left: 55, width: 25, height: 14, background: '#fda4af', borderRadius: '0 0 50% 50%' }} />
        <div style={{ position: 'absolute', bottom: 5, right: 55, width: 25, height: 14, background: '#fda4af', borderRadius: '0 0 50% 50%' }} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   LEVEL 5 SCENES — fat animals sitting
   ------------------------------------------------------- */

function FatCatSatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 180 }}>
      <style>{`
        @keyframes sat-cat-blink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes sat-cat-tail { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
        @keyframes sat-cat-purr { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
      `}</style>
      <div style={{ position: 'relative', width: 220, height: 180 }}>
        {/* Flat bottom (sitting) */}
        <div style={{ position: 'absolute', bottom: 8, left: 30, width: 150, height: 100, background: '#f97316', borderRadius: '50% 50% 20% 20%', animation: 'sat-cat-purr 2s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 60, width: 80, height: 55, background: '#fed7aa', borderRadius: '50% 50% 30% 30%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 85, left: 55, width: 85, height: 75, background: '#f97316', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -14, left: 5, width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '20px solid #f97316' }} />
          <div style={{ position: 'absolute', top: -14, right: 5, width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '20px solid #f97316' }} />
          <div style={{ position: 'absolute', top: 22, left: 16, width: 13, height: 15, background: '#1e293b', borderRadius: '50%', animation: 'sat-cat-blink 3.5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 22, right: 16, width: 13, height: 15, background: '#1e293b', borderRadius: '50%', animation: 'sat-cat-blink 3.5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 24, left: 22, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 24, right: 22, width: 5, height: 5, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 38, left: '50%', marginLeft: -5, width: 10, height: 7, background: '#ec4899', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 44, left: '50%', marginLeft: -7, width: 14, height: 7, borderBottom: '2px solid #92400e', borderRadius: '0 0 50% 50%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 50, right: 10, width: 12, height: 50, background: '#f97316', borderRadius: 10, transformOrigin: 'bottom center', animation: 'sat-cat-tail 2s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function FatBatSatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 180 }}>
      <style>{`
        @keyframes sat-bat-blink { 0%,92%,100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        @keyframes sat-bat-fold { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.85); } }
      `}</style>
      <div style={{ position: 'relative', width: 220, height: 180 }}>
        {/* Sitting body */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', marginLeft: -50, width: 100, height: 80, background: '#7c3aed', borderRadius: '50% 50% 25% 25%' }} />
        <div style={{ position: 'absolute', bottom: 15, left: '50%', marginLeft: -28, width: 56, height: 40, background: '#a78bfa', borderRadius: '50% 50% 30% 30%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 75, left: '50%', marginLeft: -28, width: 56, height: 45, background: '#7c3aed', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -10, left: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #7c3aed' }} />
          <div style={{ position: 'absolute', top: -10, right: 3, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #7c3aed' }} />
          <div style={{ position: 'absolute', top: 14, left: 10, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'sat-bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 14, right: 10, width: 10, height: 10, background: '#fbbf24', borderRadius: '50%', animation: 'sat-bat-blink 4s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: 3, left: 3, width: 4, height: 4, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: -5, width: 10, height: 5, borderTop: '2px solid #4c1d95', borderRadius: '50% 50% 0 0' }} />
        </div>
        {/* Folded wings */}
        <div style={{ position: 'absolute', bottom: 30, right: '50%', marginRight: 40, width: 30, height: 50, background: '#8b5cf6', borderRadius: '50% 5% 50% 50%', transformOrigin: 'right center', animation: 'sat-bat-fold 3s ease-in-out infinite', opacity: 0.9 }} />
        <div style={{ position: 'absolute', bottom: 30, left: '50%', marginLeft: 40, width: 30, height: 50, background: '#8b5cf6', borderRadius: '5% 50% 50% 50%', transformOrigin: 'left center', animation: 'sat-bat-fold 3s ease-in-out infinite', opacity: 0.9 }} />
      </div>
    </div>
  );
}

function FatRatSatScene() {
  return (
    <div style={{ position: 'relative', width: 220, height: 180 }}>
      <style>{`
        @keyframes sat-rat-nose { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes sat-rat-tail { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(10deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 220, height: 180 }}>
        {/* Sitting body */}
        <div style={{ position: 'absolute', bottom: 8, left: 30, width: 140, height: 95, background: '#9ca3af', borderRadius: '50% 50% 20% 20%' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 55, width: 75, height: 50, background: '#e5e7eb', borderRadius: '50% 50% 30% 30%' }} />
        {/* Head */}
        <div style={{ position: 'absolute', bottom: 80, left: 50, width: 78, height: 65, background: '#9ca3af', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: -6, left: 2, width: 26, height: 26, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 4, left: 4, width: 14, height: 14, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: -6, right: 2, width: 26, height: 26, background: '#9ca3af', borderRadius: '50%', border: '3px solid #6b7280' }}>
            <div style={{ position: 'absolute', top: 4, left: 4, width: 14, height: 14, background: '#fda4af', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 22, left: 14, width: 10, height: 11, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 22, right: 14, width: 10, height: 11, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 24, left: 18, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 24, right: 18, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 36, left: '50%', marginLeft: -5, width: 10, height: 8, background: '#f472b6', borderRadius: '50%', animation: 'sat-rat-nose 0.6s ease-in-out infinite' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 15, width: 6, height: 55, background: '#d1d5db', borderRadius: 6, transformOrigin: 'bottom center', animation: 'sat-rat-tail 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   LEVEL 7 SCENES — one animal sitting on another / on mat
   Uses a simple stacking approach
   ------------------------------------------------------- */

function SmallCat({ style }) {
  return (
    <div style={{ position: 'absolute', width: 80, height: 70, ...style }}>
      <div style={{ position: 'absolute', bottom: 0, left: 10, width: 60, height: 45, background: '#f97316', borderRadius: '50% 50% 30% 30%' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 18, width: 40, height: 25, background: '#fed7aa', borderRadius: '50% 50% 30% 30%' }} />
      <div style={{ position: 'absolute', bottom: 35, left: 15, width: 48, height: 40, background: '#f97316', borderRadius: '50%' }}>
        <div style={{ position: 'absolute', top: -8, left: 3, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '14px solid #f97316' }} />
        <div style={{ position: 'absolute', top: -8, right: 3, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '14px solid #f97316' }} />
        <div style={{ position: 'absolute', top: 13, left: 9, width: 8, height: 9, background: '#1e293b', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 13, right: 9, width: 8, height: 9, background: '#1e293b', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 23, left: '50%', marginLeft: -4, width: 8, height: 5, background: '#ec4899', borderRadius: '50%' }} />
      </div>
    </div>
  );
}

function SmallRat({ style }) {
  return (
    <div style={{ position: 'absolute', width: 80, height: 65, ...style }}>
      <div style={{ position: 'absolute', bottom: 0, left: 10, width: 55, height: 38, background: '#9ca3af', borderRadius: '50% 50% 30% 30%' }} />
      <div style={{ position: 'absolute', bottom: 3, left: 20, width: 35, height: 20, background: '#e5e7eb', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: 30, left: 12, width: 48, height: 38, background: '#9ca3af', borderRadius: '50%' }}>
        <div style={{ position: 'absolute', top: -4, left: 2, width: 16, height: 16, background: '#9ca3af', borderRadius: '50%', border: '2px solid #6b7280' }}>
          <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 8, background: '#fda4af', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'absolute', top: -4, right: 2, width: 16, height: 16, background: '#9ca3af', borderRadius: '50%', border: '2px solid #6b7280' }}>
          <div style={{ position: 'absolute', top: 3, left: 3, width: 8, height: 8, background: '#fda4af', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'absolute', top: 15, left: 10, width: 7, height: 8, background: '#1e293b', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 15, right: 10, width: 7, height: 8, background: '#1e293b', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 24, left: '50%', marginLeft: -4, width: 8, height: 6, background: '#f472b6', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, right: 0, width: 4, height: 35, background: '#d1d5db', borderRadius: 4, transform: 'rotate(-15deg)' }} />
    </div>
  );
}

function SmallBat({ style }) {
  return (
    <div style={{ position: 'absolute', width: 90, height: 60, ...style }}>
      <style>{`
        @keyframes sm-bat-w { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.75); } }
      `}</style>
      <div style={{ position: 'absolute', bottom: 0, left: 25, width: 40, height: 35, background: '#7c3aed', borderRadius: '40% 40% 50% 50%' }} />
      <div style={{ position: 'absolute', bottom: 28, left: 28, width: 34, height: 28, background: '#7c3aed', borderRadius: '50%' }}>
        <div style={{ position: 'absolute', top: -6, left: 2, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '10px solid #7c3aed' }} />
        <div style={{ position: 'absolute', top: -6, right: 2, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '10px solid #7c3aed' }} />
        <div style={{ position: 'absolute', top: 9, left: 6, width: 7, height: 7, background: '#fbbf24', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 9, right: 6, width: 7, height: 7, background: '#fbbf24', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 15, left: 0, width: 28, height: 30, background: '#8b5cf6', borderRadius: '5% 50% 50% 50%', transformOrigin: 'right center', animation: 'sm-bat-w 2s ease-in-out infinite', opacity: 0.9 }} />
      <div style={{ position: 'absolute', bottom: 15, right: 0, width: 28, height: 30, background: '#8b5cf6', borderRadius: '50% 5% 50% 50%', transformOrigin: 'left center', animation: 'sm-bat-w 2s ease-in-out infinite', opacity: 0.9 }} />
    </div>
  );
}

function SmallMat({ style }) {
  return (
    <div style={{ position: 'absolute', width: 120, height: 35, ...style }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 120, height: 30, background: 'linear-gradient(135deg, #92400e, #b45309)', borderRadius: 8, border: '3px solid #78350f' }}>
        <div style={{ position: 'absolute', top: 6, left: 10, right: 10, height: 3, background: '#fbbf24', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: 14, left: 10, right: 10, height: 3, background: '#fbbf24', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function CatOnRatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <style>{`
        @keyframes stack-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ animation: 'stack-bob 2.5s ease-in-out infinite', position: 'relative', width: 200, height: 200 }}>
        <SmallRat style={{ bottom: 10, left: 55 }} />
        <SmallCat style={{ bottom: 75, left: 55 }} />
      </div>
    </div>
  );
}

function CatOnMatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 180 }}>
      <SmallMat style={{ bottom: 10, left: 40 }} />
      <SmallCat style={{ bottom: 40, left: 60 }} />
    </div>
  );
}

function RatOnCatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <style>{`
        @keyframes stack-bob2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ animation: 'stack-bob2 2.5s ease-in-out infinite', position: 'relative', width: 200, height: 200 }}>
        <SmallCat style={{ bottom: 10, left: 55 }} />
        <SmallRat style={{ bottom: 80, left: 55 }} />
      </div>
    </div>
  );
}

function RatOnMatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 180 }}>
      <SmallMat style={{ bottom: 10, left: 40 }} />
      <SmallRat style={{ bottom: 40, left: 60 }} />
    </div>
  );
}

function BatOnCatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <style>{`
        @keyframes stack-bob3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
      <div style={{ animation: 'stack-bob3 2.5s ease-in-out infinite', position: 'relative', width: 200, height: 200 }}>
        <SmallCat style={{ bottom: 10, left: 55 }} />
        <SmallBat style={{ bottom: 80, left: 50 }} />
      </div>
    </div>
  );
}

function BatOnMatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 180 }}>
      <SmallMat style={{ bottom: 10, left: 40 }} />
      <SmallBat style={{ bottom: 40, left: 55 }} />
    </div>
  );
}

function BatBitAppleScene() {
  return (
    <div style={{ position: 'relative', width: 280, height: 220 }}>
      <style>{`
        @keyframes bat-swoop {
          0% { transform: translate(0, -40px) rotate(-5deg); }
          40% { transform: translate(20px, 30px) rotate(10deg); }
          60% { transform: translate(20px, 30px) rotate(10deg); }
          100% { transform: translate(0, -40px) rotate(-5deg); }
        }
        @keyframes bat-chomp-wings { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.6); } }
        @keyframes apple-bite {
          0%,35% { clip-path: none; }
          45%,100% { clip-path: polygon(0 0, 60% 0, 50% 25%, 60% 45%, 100% 0, 100% 100%, 0 100%); }
        }
      `}</style>
      {/* Apple */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', marginLeft: -35, animation: 'apple-bite 3.5s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 70, height: 75 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 70, height: 65, background: '#ef4444', borderRadius: '45% 45% 50% 50%' }} />
          {/* Leaf */}
          <div style={{ position: 'absolute', top: 2, left: '50%', marginLeft: -2, width: 4, height: 14, background: '#78350f', borderRadius: 2 }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: 2, width: 18, height: 12, background: '#22c55e', borderRadius: '0 80% 0 80%', transform: 'rotate(15deg)' }} />
          {/* Shine */}
          <div style={{ position: 'absolute', top: 18, left: 14, width: 10, height: 18, background: 'rgba(255,255,255,0.3)', borderRadius: '50%', transform: 'rotate(-20deg)' }} />
        </div>
      </div>
      {/* Bat */}
      <div style={{ position: 'absolute', top: 10, left: '50%', marginLeft: -50, animation: 'bat-swoop 3.5s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 100, height: 80 }}>
          {/* Body */}
          <div style={{ position: 'absolute', top: 15, left: '50%', marginLeft: -18, width: 36, height: 40, background: '#7c3aed', borderRadius: '40% 40% 50% 50%' }} />
          {/* Head */}
          <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -15, width: 30, height: 25, background: '#7c3aed', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: 8, left: 5, width: 6, height: 6, background: '#fbbf24', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 3, height: 3, background: '#1e293b', borderRadius: '50%' }} />
            </div>
            <div style={{ position: 'absolute', top: 8, right: 5, width: 6, height: 6, background: '#fbbf24', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 3, height: 3, background: '#1e293b', borderRadius: '50%' }} />
            </div>
            {/* Ears */}
            <div style={{ position: 'absolute', top: -6, left: 2, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '10px solid #7c3aed' }} />
            <div style={{ position: 'absolute', top: -6, right: 2, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '10px solid #7c3aed' }} />
          </div>
          {/* Wings */}
          <div style={{ position: 'absolute', top: 15, right: '50%', marginRight: 15, width: 35, height: 35, background: '#8b5cf6', borderRadius: '5% 50% 50% 50%', transformOrigin: 'right center', animation: 'bat-chomp-wings 0.4s ease-in-out infinite', opacity: 0.9 }} />
          <div style={{ position: 'absolute', top: 15, left: '50%', marginLeft: 15, width: 35, height: 35, background: '#8b5cf6', borderRadius: '50% 5% 50% 50%', transformOrigin: 'left center', animation: 'bat-chomp-wings 0.4s ease-in-out infinite', opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   NEW LEVEL 1 SCENES — dog, dad, mum, fox, pig, sun
   ------------------------------------------------------- */

function DogScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes dog-tail { 0%,100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
        @keyframes dog-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
      <div style={{ animation: 'dog-bounce 1.5s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 120, height: 80 }}>
          {/* Body */}
          <div style={{ position: 'absolute', bottom: 0, left: 15, width: 90, height: 55, background: '#92400e', borderRadius: '50% 50% 30% 30%' }} />
          <div style={{ position: 'absolute', bottom: 3, left: 30, width: 55, height: 30, background: '#d4a574', borderRadius: '50%' }} />
          {/* Legs */}
          <div style={{ position: 'absolute', bottom: -15, left: 25, width: 14, height: 20, background: '#92400e', borderRadius: '0 0 5px 5px' }} />
          <div style={{ position: 'absolute', bottom: -15, right: 25, width: 14, height: 20, background: '#92400e', borderRadius: '0 0 5px 5px' }} />
          {/* Head */}
          <div style={{ position: 'absolute', bottom: 40, left: 20, width: 55, height: 48, background: '#92400e', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: -2, left: -5, width: 20, height: 25, background: '#7c2d12', borderRadius: '50% 50% 30% 30%', transform: 'rotate(-20deg)' }} />
            <div style={{ position: 'absolute', top: -2, right: -5, width: 20, height: 25, background: '#7c2d12', borderRadius: '50% 50% 30% 30%', transform: 'rotate(20deg)' }} />
            <div style={{ position: 'absolute', top: 15, left: 10, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
            </div>
            <div style={{ position: 'absolute', top: 15, right: 10, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
            </div>
            <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: -6, width: 12, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -5, left: '50%', marginLeft: -4, width: 8, height: 10, background: '#f472b6', borderRadius: '0 0 50% 50%' }} />
          </div>
          {/* Tail */}
          <div style={{ position: 'absolute', bottom: 30, right: -5, width: 8, height: 30, background: '#92400e', borderRadius: 10, transformOrigin: 'bottom center', animation: 'dog-tail 0.4s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  );
}

function DadScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes dad-wave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 160 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 15, width: 70, height: 80, background: '#3b82f6', borderRadius: '20px 20px 10px 10px' }} />
        <div style={{ position: 'absolute', bottom: -20, left: 20, width: 22, height: 25, background: '#1e3a5f', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 20, width: 22, height: 25, background: '#1e3a5f', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', top: 85, left: -8, width: 18, height: 40, background: '#3b82f6', borderRadius: 10 }} />
        <div style={{ position: 'absolute', top: 75, right: -12, width: 18, height: 45, background: '#3b82f6', borderRadius: 10, transformOrigin: 'top center', animation: 'dad-wave 1s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: 75, left: 18, width: 60, height: 60, background: '#fcd9b6', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 20, left: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 20, right: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 35, left: '50%', marginLeft: -10, width: 20, height: 10, borderBottom: '3px solid #1e293b', borderRadius: '0 0 50% 50%' }} />
          <div style={{ position: 'absolute', top: -3, left: 5, right: 5, height: 20, background: '#78350f', borderRadius: '20px 20px 0 0' }} />
        </div>
      </div>
    </div>
  );
}

function MumScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes mum-sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 160, animation: 'mum-sway 2s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 10, width: 80, height: 90, background: '#e879f9', borderRadius: '20px 20px 35px 35px' }} />
        <div style={{ position: 'absolute', bottom: -18, left: 25, width: 18, height: 22, background: '#fcd9b6', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', bottom: -18, right: 25, width: 18, height: 22, background: '#fcd9b6', borderRadius: '0 0 8px 8px' }} />
        <div style={{ position: 'absolute', top: 75, left: -5, width: 16, height: 38, background: '#fcd9b6', borderRadius: 10 }} />
        <div style={{ position: 'absolute', top: 75, right: -5, width: 16, height: 38, background: '#fcd9b6', borderRadius: 10 }} />
        <div style={{ position: 'absolute', bottom: 85, left: 18, width: 60, height: 60, background: '#fcd9b6', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 20, left: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 20, right: 12, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 35, left: '50%', marginLeft: -10, width: 20, height: 10, borderBottom: '3px solid #e11d48', borderRadius: '0 0 50% 50%' }} />
          <div style={{ position: 'absolute', top: -5, left: -5, right: -5, height: 35, background: '#7c2d12', borderRadius: '30px 30px 0 0' }} />
          <div style={{ position: 'absolute', top: 15, left: -10, width: 15, height: 35, background: '#7c2d12', borderRadius: '0 0 0 15px' }} />
          <div style={{ position: 'absolute', top: 15, right: -10, width: 15, height: 35, background: '#7c2d12', borderRadius: '0 0 15px 0' }} />
        </div>
      </div>
    </div>
  );
}

function FoxScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes fox-tail { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
        @keyframes fox-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
      <div style={{ animation: 'fox-bounce 2s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 130, height: 90 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 20, width: 80, height: 50, background: '#ea580c', borderRadius: '50% 50% 30% 30%' }} />
          <div style={{ position: 'absolute', bottom: 3, left: 35, width: 45, height: 25, background: 'white', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -12, left: 30, width: 12, height: 16, background: '#1e293b', borderRadius: '0 0 4px 4px' }} />
          <div style={{ position: 'absolute', bottom: -12, right: 30, width: 12, height: 16, background: '#1e293b', borderRadius: '0 0 4px 4px' }} />
          <div style={{ position: 'absolute', bottom: 38, left: 25, width: 50, height: 42, background: '#ea580c', borderRadius: '45%' }}>
            <div style={{ position: 'absolute', top: -10, left: 2, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #ea580c' }} />
            <div style={{ position: 'absolute', top: -10, right: 2, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #ea580c' }} />
            <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -12, width: 24, height: 20, background: 'white', borderRadius: '40% 40% 50% 50%' }} />
            <div style={{ position: 'absolute', top: 14, left: 8, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: 14, right: 8, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 8, left: '50%', marginLeft: -4, width: 8, height: 6, background: '#1e293b', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 15, right: -15, width: 35, height: 18, background: '#ea580c', borderRadius: '50% 50% 50% 20%', transformOrigin: 'left center', animation: 'fox-tail 1s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: 12, height: 18, background: 'white', borderRadius: '0 50% 50% 0' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PigScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pig-tail { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }
        @keyframes pig-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
      <div style={{ animation: 'pig-bounce 1.8s ease-in-out infinite' }}>
        <div style={{ position: 'relative', width: 120, height: 90 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 15, width: 85, height: 55, background: '#f9a8d4', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -12, left: 25, width: 14, height: 16, background: '#ec4899', borderRadius: '0 0 5px 5px' }} />
          <div style={{ position: 'absolute', bottom: -12, right: 25, width: 14, height: 16, background: '#ec4899', borderRadius: '0 0 5px 5px' }} />
          <div style={{ position: 'absolute', bottom: 35, left: 22, width: 55, height: 48, background: '#f9a8d4', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: -5, left: 5, width: 18, height: 18, background: '#ec4899', borderRadius: '50% 50% 20% 50%', transform: 'rotate(-20deg)' }} />
            <div style={{ position: 'absolute', top: -5, right: 5, width: 18, height: 18, background: '#ec4899', borderRadius: '50% 50% 50% 20%', transform: 'rotate(20deg)' }} />
            <div style={{ position: 'absolute', top: 14, left: 10, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: 14, right: 10, width: 8, height: 8, background: '#1e293b', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: 6, left: '50%', marginLeft: -12, width: 24, height: 16, background: '#ec4899', borderRadius: '50%' }}>
              <div style={{ position: 'absolute', top: 5, left: 4, width: 5, height: 5, background: '#be185d', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 5, right: 4, width: 5, height: 5, background: '#be185d', borderRadius: '50%' }} />
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 30, right: 5, width: 20, height: 20, border: '3px solid #ec4899', borderRadius: '50%', borderBottom: 'none', borderLeft: 'none', transformOrigin: 'bottom left', animation: 'pig-tail 1s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  );
}

function SunScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes sun-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sun-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      `}</style>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <div style={{ position: 'absolute', inset: 0, animation: 'sun-spin 20s linear infinite' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%', width: 6, height: 30, background: '#fbbf24',
              borderRadius: 3, transformOrigin: '50% 0%', transform: `rotate(${i * 30}deg) translateY(-55px)`,
            }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -45, marginLeft: -45, width: 90, height: 90, background: '#fbbf24', borderRadius: '50%', animation: 'sun-pulse 3s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', top: 28, left: 18, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 28, right: 18, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
            <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', top: 50, left: '50%', marginLeft: -14, width: 28, height: 14, borderBottom: '4px solid #92400e', borderRadius: '0 0 50% 50%' }} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SAD / MAD SCENES
   ------------------------------------------------------- */

function SadAnimalScene({ Animal }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes sad-droop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
      `}</style>
      <div style={{ animation: 'sad-droop 2s ease-in-out infinite' }}>
        <Animal style={{}} />
      </div>
      {/* Tear drops */}
      <div style={{ position: 'absolute', top: 25, left: '42%', fontSize: 24, animation: 'sad-droop 1.5s ease-in-out infinite' }}>😢</div>
    </div>
  );
}

function MadAnimalScene({ Animal }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes mad-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
      `}</style>
      <div style={{ animation: 'mad-shake 0.5s ease-in-out infinite' }}>
        <Animal style={{}} />
      </div>
      {/* Angry symbol */}
      <div style={{ position: 'absolute', top: 20, right: '30%', fontSize: 24, animation: 'mad-shake 0.4s ease-in-out infinite' }}>😡</div>
    </div>
  );
}

function SadMatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes sad-droop-mat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
      `}</style>
      <div style={{ animation: 'sad-droop-mat 2s ease-in-out infinite' }}>
        <SmallMat style={{ position: 'relative' }} />
      </div>
      <div style={{ position: 'absolute', top: 5, left: '50%', marginLeft: -12, fontSize: 24 }}>😢</div>
    </div>
  );
}

function MadMatScene() {
  return (
    <div style={{ position: 'relative', width: 200, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes mad-shake-mat { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
      `}</style>
      <div style={{ animation: 'mad-shake-mat 0.5s ease-in-out infinite' }}>
        <SmallMat style={{ position: 'relative' }} />
      </div>
      <div style={{ position: 'absolute', top: 5, left: '50%', marginLeft: -12, fontSize: 24 }}>😡</div>
    </div>
  );
}

function SadCatScene() { return <SadAnimalScene Animal={SmallCat} />; }
function SadRatScene() { return <SadAnimalScene Animal={SmallRat} />; }
function MadCatScene() { return <MadAnimalScene Animal={SmallCat} />; }
function MadRatScene() { return <MadAnimalScene Animal={SmallRat} />; }

/* -------------------------------------------------------
   LEVEL 5 SCENES — hit and hid
   ------------------------------------------------------- */

function HitScene({ attacker: Attacker, victim: Victim }) {
  return (
    <div style={{ position: 'relative', width: 300, height: 220 }}>
      <style>{`
        @keyframes hit-windup {
          0% { transform: translateX(0) rotate(0deg) scale(1); }
          15% { transform: translateX(-20px) rotate(-8deg) scale(1.05); }
          35% { transform: translateX(70px) rotate(5deg) scale(1.1); }
          45% { transform: translateX(60px) rotate(0deg) scale(1); }
          60% { transform: translateX(55px) rotate(-2deg) scale(1); }
          100% { transform: translateX(0) rotate(0deg) scale(1); }
        }
        @keyframes hit-victim {
          0%,35% { transform: translateX(0) rotate(0deg) scale(1); }
          40% { transform: translateX(8px) rotate(-3deg) scale(0.95); }
          45% { transform: translateX(35px) rotate(15deg) scale(0.9); }
          55% { transform: translateX(30px) rotate(12deg) scale(0.95); }
          65% { transform: translateX(15px) rotate(5deg) scale(1); }
          80% { transform: translateX(5px) rotate(0deg) scale(1); }
          100% { transform: translateX(0) rotate(0deg) scale(1); }
        }
        @keyframes hit-impact {
          0%,30% { opacity: 0; transform: scale(0) rotate(0deg); }
          38% { opacity: 1; transform: scale(1.8) rotate(-10deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(5deg); }
          65% { opacity: 0.5; transform: scale(1) rotate(0deg); }
          75%,100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes hit-spark {
          0%,30% { opacity: 0; transform: translate(0,0) scale(0); }
          40% { opacity: 1; transform: translate(var(--sx), var(--sy)) scale(1); }
          70% { opacity: 0.5; transform: translate(calc(var(--sx) * 1.8), calc(var(--sy) * 1.8)) scale(0.5); }
          100% { opacity: 0; transform: translate(calc(var(--sx) * 2.2), calc(var(--sy) * 2.2)) scale(0); }
        }
        @keyframes hit-shake {
          0%,30%,100% { transform: translateX(0); }
          38% { transform: translateX(-4px); }
          42% { transform: translateX(4px); }
          46% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          54% { transform: translateX(-1px); }
          58% { transform: translateX(0); }
        }
        @keyframes hit-dust {
          0%,35% { opacity: 0; transform: translateY(0) scale(0); }
          45% { opacity: 0.6; transform: translateY(-5px) scale(1); }
          70% { opacity: 0.2; transform: translateY(-20px) scale(1.5); }
          100% { opacity: 0; transform: translateY(-35px) scale(2); }
        }
      `}</style>
      {/* Screen shake container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', animation: 'hit-shake 2.5s ease-in-out infinite' }}>
        {/* Ground shadow */}
        <div style={{ position: 'absolute', bottom: 12, left: 30, right: 30, height: 14, background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Attacker */}
        <div style={{ position: 'absolute', bottom: 25, left: 20, animation: 'hit-windup 2.5s ease-in-out infinite', zIndex: 3 }}>
          <Attacker style={{}} />
        </div>

        {/* Victim */}
        <div style={{ position: 'absolute', bottom: 25, right: 20, animation: 'hit-victim 2.5s ease-in-out infinite', zIndex: 2 }}>
          <Victim style={{}} />
        </div>

        {/* Impact burst */}
        <div style={{ position: 'absolute', top: 50, left: '50%', marginLeft: -20, fontSize: 40, animation: 'hit-impact 2.5s ease-in-out infinite', zIndex: 5 }}>💥</div>

        {/* Flying sparks */}
        {[
          { sx: '-30px', sy: '-25px', color: '#fbbf24', delay: '0s' },
          { sx: '25px', sy: '-35px', color: '#f97316', delay: '0.05s' },
          { sx: '-20px', sy: '15px', color: '#ef4444', delay: '0.1s' },
          { sx: '35px', sy: '-10px', color: '#fbbf24', delay: '0.08s' },
          { sx: '-35px', sy: '-5px', color: '#f97316', delay: '0.12s' },
          { sx: '15px', sy: '20px', color: '#ef4444', delay: '0.06s' },
        ].map((spark, i) => (
          <div key={i} style={{
            position: 'absolute', top: 75, left: '48%',
            width: 8, height: 8, borderRadius: '50%',
            background: spark.color,
            '--sx': spark.sx, '--sy': spark.sy,
            animation: `hit-spark 2.5s ease-out ${spark.delay} infinite`,
            zIndex: 4,
          }} />
        ))}

        {/* Dust clouds */}
        <div style={{ position: 'absolute', bottom: 20, left: '45%', width: 25, height: 25, background: 'radial-gradient(circle, rgba(200,180,150,0.5), transparent)', borderRadius: '50%', animation: 'hit-dust 2.5s ease-out infinite', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: 22, left: '55%', width: 20, height: 20, background: 'radial-gradient(circle, rgba(200,180,150,0.4), transparent)', borderRadius: '50%', animation: 'hit-dust 2.5s ease-out 0.1s infinite', zIndex: 1 }} />

        {/* Comic action lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={`line-${i}`} style={{
            position: 'absolute', top: 55 + i * 12, left: '52%',
            width: 30 + i * 5, height: 2,
            background: `rgba(239,68,68,${0.4 - i * 0.06})`,
            borderRadius: 2,
            transform: `rotate(${-20 + i * 10}deg)`,
            animation: `hit-impact 2.5s ease-in-out infinite`,
            zIndex: 4,
          }} />
        ))}
      </div>
    </div>
  );
}

function RatHitCatScene() { return <HitScene attacker={SmallRat} victim={SmallCat} />; }
function CatHitRatScene() { return <HitScene attacker={SmallCat} victim={SmallRat} />; }
function BatHitCatScene() { return <HitScene attacker={SmallBat} victim={SmallCat} />; }
function CatHitBatScene() { return <HitScene attacker={SmallCat} victim={SmallBat} />; }

function HidInBoxScene({ Animal }) {
  return (
    <div style={{ position: 'relative', width: 240, height: 220 }}>
      <style>{`
        @keyframes hid-animal {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          15% { transform: translateY(-10px) scale(1.05); opacity: 1; }
          30% { transform: translateY(5px) scale(0.95); opacity: 1; }
          45% { transform: translateY(20px) scale(0.9); opacity: 0.9; }
          55% { transform: translateY(45px) scale(0.8); opacity: 0.6; }
          65%,85% { transform: translateY(55px) scale(0.75); opacity: 0; }
          88% { transform: translateY(40px) scale(0.8); opacity: 0.3; }
          92% { transform: translateY(30px) scale(0.85); opacity: 0.8; }
          95% { transform: translateY(35px) scale(0.82); opacity: 0.5; }
          100% { transform: translateY(55px) scale(0.75); opacity: 0; }
        }
        @keyframes hid-eyes {
          0%,55% { opacity: 0; }
          70%,82% { opacity: 1; }
          85% { opacity: 0; }
          90%,93% { opacity: 1; }
          96%,100% { opacity: 0; }
        }
        @keyframes hid-lid-close {
          0%,25% { transform: rotate(0deg); }
          35% { transform: rotate(-35deg); }
          50% { transform: rotate(-30deg); }
          60%,82% { transform: rotate(0deg); }
          86% { transform: rotate(-20deg); }
          92% { transform: rotate(-15deg); }
          96%,100% { transform: rotate(0deg); }
        }
        @keyframes hid-box-bounce {
          0%,40% { transform: translateY(0); }
          48% { transform: translateY(-3px); }
          55%,100% { transform: translateY(0); }
        }
        @keyframes hid-question {
          0%,60% { opacity: 0; transform: translateY(0) scale(0); }
          70% { opacity: 1; transform: translateY(-10px) scale(1.2); }
          80% { opacity: 1; transform: translateY(-15px) scale(1); }
          90% { opacity: 0.5; transform: translateY(-25px) scale(0.8); }
          100% { opacity: 0; transform: translateY(-35px) scale(0.5); }
        }
        @keyframes hid-dust-puff {
          0%,50% { opacity: 0; transform: scale(0); }
          60% { opacity: 0.4; transform: scale(1); }
          80% { opacity: 0.15; transform: scale(2); }
          100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>

      {/* Animal dropping into box */}
      <div style={{ position: 'absolute', bottom: 80, left: '50%', marginLeft: -40, animation: 'hid-animal 4s ease-in-out infinite', zIndex: 4 }}>
        <Animal style={{}} />
      </div>

      {/* Peeking eyes inside box */}
      <div style={{ position: 'absolute', bottom: 50, left: '50%', marginLeft: -15, width: 30, height: 15, zIndex: 3, animation: 'hid-eyes 4s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, width: 10, height: 10, background: '#1e293b', borderRadius: '50%' }}>
          <div style={{ position: 'absolute', top: 2, left: 3, width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Box body */}
      <div style={{ position: 'absolute', bottom: 15, left: '50%', marginLeft: -60, width: 120, height: 75, animation: 'hid-box-bounce 4s ease-in-out infinite', zIndex: 5 }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(180deg, #b45309, #92400e)',
          borderRadius: 10, border: '3px solid #78350f',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {/* Wood grain lines */}
          <div style={{ position: 'absolute', top: 18, left: 12, right: 12, height: 3, background: '#78350f', borderRadius: 2, opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 35, left: 12, right: 12, height: 3, background: '#78350f', borderRadius: 2, opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 52, left: 12, right: 12, height: 3, background: '#78350f', borderRadius: 2, opacity: 0.6 }} />
          {/* Metal corners */}
          <div style={{ position: 'absolute', top: 3, left: 3, width: 14, height: 14, border: '2px solid #a8a29e', borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 3, right: 3, width: 14, height: 14, border: '2px solid #a8a29e', borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 3, left: 3, width: 14, height: 14, border: '2px solid #a8a29e', borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: 3, right: 3, width: 14, height: 14, border: '2px solid #a8a29e', borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' }} />
        </div>
      </div>

      {/* Lid */}
      <div style={{
        position: 'absolute', bottom: 83, left: '50%', marginLeft: -65,
        width: 130, height: 18,
        background: 'linear-gradient(180deg, #d97706, #b45309)',
        borderRadius: 5, border: '2px solid #78350f',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        transformOrigin: 'left bottom',
        animation: 'hid-lid-close 4s ease-in-out infinite',
        zIndex: 6,
      }}>
        {/* Handle */}
        <div style={{ position: 'absolute', top: -6, left: '50%', marginLeft: -10, width: 20, height: 8, background: '#a8a29e', borderRadius: '4px 4px 0 0', border: '2px solid #78716c' }} />
      </div>

      {/* Dust puffs when landing in box */}
      <div style={{ position: 'absolute', bottom: 80, left: '30%', width: 20, height: 20, background: 'radial-gradient(circle, rgba(200,180,150,0.5), transparent)', borderRadius: '50%', animation: 'hid-dust-puff 4s ease-out infinite', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 82, right: '30%', width: 18, height: 18, background: 'radial-gradient(circle, rgba(200,180,150,0.4), transparent)', borderRadius: '50%', animation: 'hid-dust-puff 4s ease-out 0.15s infinite', zIndex: 3 }} />

      {/* Question marks */}
      <div style={{ position: 'absolute', top: 10, right: 30, fontSize: 22, color: '#6366f1', fontWeight: 'bold', animation: 'hid-question 4s ease-out infinite' }}>?</div>
      <div style={{ position: 'absolute', top: 20, right: 55, fontSize: 16, color: '#818cf8', fontWeight: 'bold', animation: 'hid-question 4s ease-out 0.3s infinite' }}>?</div>
    </div>
  );
}

function CatHidBoxScene() { return <HidInBoxScene Animal={SmallCat} />; }
function RatHidBoxScene() { return <HidInBoxScene Animal={SmallRat} />; }
function BatHidBoxScene() { return <HidInBoxScene Animal={SmallBat} />; }
