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
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
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
      <div className="flex-shrink-0 pt-14 pb-2 px-6 flex items-center justify-center">
        <ReadingTracker key={`${selectedLevel}-${sentenceIdx}`} sentence={current.sentence} />
      </div>

      {/* Scene area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {confirmed && <SceneRenderer sceneKey={current.scene} />}
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
   LEVEL 5 SCENES — hit and hid
   ------------------------------------------------------- */

function HitScene({ attacker: Attacker, victim: Victim }) {
  return (
    <div style={{ position: 'relative', width: 250, height: 180 }}>
      <style>{`
        @keyframes hit-smack {
          0%,100% { transform: translateX(0); }
          30% { transform: translateX(40px); }
          50% { transform: translateX(35px); }
        }
        @keyframes hit-recoil {
          0%,100% { transform: translateX(0) rotate(0deg); }
          30% { transform: translateX(0); }
          50% { transform: translateX(15px) rotate(8deg); }
        }
        @keyframes hit-stars {
          0% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5) translateY(-20px); }
        }
      `}</style>
      <div style={{ position: 'absolute', bottom: 20, left: 10, animation: 'hit-smack 1.5s ease-in-out infinite' }}>
        <Attacker style={{}} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, right: 10, animation: 'hit-recoil 1.5s ease-in-out infinite' }}>
        <Victim style={{}} />
      </div>
      <div style={{ position: 'absolute', top: 30, left: '50%', marginLeft: -10, fontSize: 28, animation: 'hit-stars 1.5s ease-in-out infinite' }}>💥</div>
    </div>
  );
}

function RatHitCatScene() { return <HitScene attacker={SmallRat} victim={SmallCat} />; }
function CatHitRatScene() { return <HitScene attacker={SmallCat} victim={SmallRat} />; }
function BatHitCatScene() { return <HitScene attacker={SmallBat} victim={SmallCat} />; }
function CatHitBatScene() { return <HitScene attacker={SmallCat} victim={SmallBat} />; }

function HidInBoxScene({ Animal }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 180 }}>
      <style>{`
        @keyframes hid-peek {
          0%,70% { transform: translateY(0); }
          80% { transform: translateY(-20px); }
          90% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        @keyframes box-lid {
          0%,70% { transform: rotate(0deg); }
          80% { transform: rotate(-15deg); }
          90% { transform: rotate(-12deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div style={{ position: 'absolute', bottom: 55, left: '50%', marginLeft: -40, animation: 'hid-peek 3s ease-in-out infinite', zIndex: 1 }}>
        <Animal style={{}} />
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: '50%', marginLeft: -55, width: 110, height: 70, background: '#92400e', borderRadius: 8, border: '3px solid #78350f', zIndex: 2 }}>
        <div style={{ position: 'absolute', top: 25, left: 15, right: 15, height: 3, background: '#78350f', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: 40, left: 15, right: 15, height: 3, background: '#78350f', borderRadius: 2 }} />
      </div>
      <div style={{ position: 'absolute', bottom: 73, left: '50%', marginLeft: -60, width: 120, height: 16, background: '#b45309', borderRadius: 4, border: '2px solid #78350f', zIndex: 3, transformOrigin: 'left bottom', animation: 'box-lid 3s ease-in-out infinite' }} />
    </div>
  );
}

function CatHidBoxScene() { return <HidInBoxScene Animal={SmallCat} />; }
function RatHidBoxScene() { return <HidInBoxScene Animal={SmallRat} />; }
function BatHidBoxScene() { return <HidInBoxScene Animal={SmallBat} />; }
