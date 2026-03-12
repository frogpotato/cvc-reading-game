import { useState, useEffect, useCallback } from 'react';
import { SENTENCE_LEVELS } from '../data/sentences';

const REWARD_GIFS = [
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzk3bXFwOWJleTVnaWVscGZwazEyb2Q0bzFnamRrNXM1NHUzN3U0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zsbYm28afpsPJxrzHS/giphy.gif',
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnN6NGJ1cmtzaXV1YXhsbXZxNG9jbm52ZTNtMjI5Y3EzOWg0OW95MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fnmsu2lTw3r1e/giphy.gif',
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXJkZjB0bmhqdDY4emVrOXZqeWhsd3Zwbjg2a2RiaDFjZ3UwcTAzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lFHtqqh6orvAhbiGmy/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3hnY2wydWpsNjFrYmNnc3dvaG9ydDViem8yenJjdHhjd2YzZzE0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kBZBlLVlfECvOQAVno/giphy.gif',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajRoZW5kMGYxcGcwN2M2NmswOTFoeTBnbjEyaGR2c2J1bXN6OGpubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TVNmNzfL8ibYUyeQo8/giphy.gif',
];

export default function SentencePractice({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
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
                  setSelectedLevel(i);
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
  const current = level.sentences[sentenceIdx];
  const isLast = sentenceIdx === level.sentences.length - 1;

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
        {level.sentences.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === sentenceIdx ? 'bg-indigo-500 scale-125' : i < sentenceIdx ? 'bg-green-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Sentence display */}
      <div className="flex-shrink-0 pt-14 pb-4 px-6 flex items-center justify-center">
        <div className="bg-white/80 rounded-2xl px-8 py-4 shadow-lg">
          <span className="text-5xl font-extrabold text-gray-800">
            {current.sentence}
          </span>
        </div>
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
