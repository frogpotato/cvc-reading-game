import { useCallback, useState } from 'react';
import Character from './Character';
import BubbleField from './BubbleField';
import FightAnimation from './FightAnimation';
import useGameState from '../hooks/useGameState';
import useSounds from '../hooks/useSounds';

export default function GameScreen({ level, worldIdx, levelIdx, onLevelComplete, onBack }) {
  const game = useGameState(level);
  const sounds = useSounds();
  const [showFight, setShowFight] = useState(false);

  const [dragonEl, setDragonEl] = useState(null);
  const [knightEl, setKnightEl] = useState(null);

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

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 relative overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        ← Map
      </button>

      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <div className="text-2xl font-bold text-gray-500 opacity-60">
          {level.wordA} vs {level.wordB}
        </div>
      </div>

      <div className="flex w-full h-full">
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
          <BubbleField
            bubbles={game.bubbles}
            onDrop={handleDrop}
            dropZoneRefs={{ dragon: dragonEl, knight: knightEl }}
          />
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
