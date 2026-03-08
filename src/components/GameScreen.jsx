import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Character from './Character';
import BubbleField from './BubbleField';
import FightAnimation from './FightAnimation';
import useGameState from '../hooks/useGameState';
import useSounds from '../hooks/useSounds';

// Intro phases: 'show-left' → 'slide-left' → 'show-right' → 'slide-right' → 'playing'
export default function GameScreen({ level, worldIdx, levelIdx, onLevelComplete, onBack }) {
  const game = useGameState(level);
  const sounds = useSounds();
  const [showFight, setShowFight] = useState(false);
  const [phase, setPhase] = useState('show-left');

  const [dragonEl, setDragonEl] = useState(null);
  const [knightEl, setKnightEl] = useState(null);

  const handleConfirmLeft = useCallback(() => {
    setPhase('slide-left');
    setTimeout(() => setPhase('show-right'), 800);
  }, []);

  const handleConfirmRight = useCallback(() => {
    setPhase('slide-right');
    setTimeout(() => setPhase('playing'), 800);
  }, []);

  const handleDrop = useCallback((bubbleId, target) => {
    const { result, isRoundComplete } = game.handleDrop(bubbleId, target);

    if (result === 'correct') {
      sounds.playCorrect();

      if (isRoundComplete) {
        setTimeout(() => {
          sounds.playFanfare();
          setShowFight(true);
        }, 400);
      }
    } else if (result === 'wrong') {
      sounds.playWrong();
    }

    return result;
  }, [game, sounds]);

  const handleFightComplete = useCallback(() => {
    setShowFight(false);
    onLevelComplete(worldIdx, levelIdx);
  }, [worldIdx, levelIdx, onLevelComplete]);

  const isIntro = phase !== 'playing';

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        ← Map
      </button>

      {/* Intro sequence */}
      {isIntro && (
        <IntroOverlay
          phase={phase}
          level={level}
          onConfirmLeft={handleConfirmLeft}
          onConfirmRight={handleConfirmRight}
        />
      )}

      {/* Game layout — hidden during intro */}
      <div className={`flex w-full h-full transition-opacity duration-500 ${isIntro ? 'opacity-0' : 'opacity-100'}`}>
        <div
          ref={setDragonEl}
          className="w-1/4 h-full flex items-center justify-center bg-amber-50/40 relative"
        >
          <Character
            type="dragon"
            word={game.wordA}
            collected={game.dragonCollected}
            theme={level.theme}
          />
        </div>

        <div className="flex-1 h-full relative px-4 py-16">
          {phase === 'playing' && (
            <BubbleField
              bubbles={game.bubbles}
              onDrop={handleDrop}
              dropZoneRefs={{ dragon: dragonEl, knight: knightEl }}
            />
          )}
        </div>

        <div
          ref={setKnightEl}
          className="w-1/4 h-full flex items-center justify-center bg-teal-50/40 relative"
        >
          <Character
            type="knight"
            word={game.wordB}
            collected={game.knightCollected}
            theme={level.theme}
          />
        </div>
      </div>

      {showFight && (
        <FightAnimation onComplete={handleFightComplete} theme={level.theme} />
      )}
    </div>
  );
}

function IntroOverlay({ phase, level, onConfirmLeft, onConfirmRight }) {
  const showLeft = phase === 'show-left';
  const slideLeft = phase === 'slide-left';
  const showRight = phase === 'show-right';
  const slideRight = phase === 'slide-right';

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

      <AnimatePresence mode="wait">
        {/* Left character intro */}
        {(showLeft || slideLeft) && (
          <motion.div
            key="left-intro"
            className="flex flex-col items-center z-40"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              slideLeft
                ? { x: '-38vw', scale: 0.6, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={slideLeft ? { duration: 0.7, ease: 'easeInOut' } : { duration: 0.4 }}
          >
            <span className="text-[10rem] leading-none">{level.theme.left}</span>
            <div className="bg-white/90 rounded-2xl px-10 py-5 shadow-lg mt-4">
              <span className="text-8xl font-extrabold text-gray-800">{level.wordA}</span>
            </div>
            {showLeft && (
              <ConfirmButton onClick={onConfirmLeft} />
            )}
          </motion.div>
        )}

        {/* Right character intro */}
        {(showRight || slideRight) && (
          <motion.div
            key="right-intro"
            className="flex flex-col items-center z-40"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              slideRight
                ? { x: '38vw', scale: 0.6, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={slideRight ? { duration: 0.7, ease: 'easeInOut' } : { duration: 0.4 }}
          >
            <span className="text-[10rem] leading-none">{level.theme.right}</span>
            <div className="bg-white/90 rounded-2xl px-10 py-5 shadow-lg mt-4">
              <span className="text-8xl font-extrabold text-gray-800">{level.wordB}</span>
            </div>
            {showRight && (
              <ConfirmButton onClick={onConfirmRight} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-gray-400/50 hover:bg-gray-400/80 text-white text-lg flex items-center justify-center shadow transition-all z-50"
      title="Child read the word correctly"
    >
      ✓
    </button>
  );
}
