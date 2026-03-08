import { useCallback, useState } from 'react';
import Character from './Character';
import BubbleField from './BubbleField';
import FightAnimation from './FightAnimation';
import ProgressIndicator from './ProgressIndicator';
import useGameState from '../hooks/useGameState';
import useSounds from '../hooks/useSounds';
import wordSets from '../data/wordSets';

export default function GameScreen({ selectedSetIndex, onSetComplete, onBack }) {
  const game = useGameState(selectedSetIndex);
  const sounds = useSounds();
  const [showFight, setShowFight] = useState(false);
  const theme = wordSets[selectedSetIndex].theme;

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
    const setComplete = game.advanceRound();
    if (setComplete) {
      onSetComplete(selectedSetIndex);
    }
  }, [game, selectedSetIndex, onSetComplete]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 bg-white/80 hover:bg-white text-indigo-700 font-extrabold rounded-full px-5 py-2 text-xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        \u2190 Map
      </button>

      <ProgressIndicator
        currentSetIndex={game.currentSetIndex}
        currentPairIndex={game.currentPairIndex}
        totalSets={game.totalSets}
        totalPairsInCurrentSet={game.totalPairsInCurrentSet}
        setName={game.currentSetName}
        totalAttempts={game.totalAttempts}
        totalCorrect={game.totalCorrect}
      />

      <div className="flex w-full h-full">
        <div
          ref={setDragonEl}
          className="w-1/4 h-full flex items-center justify-center bg-amber-50/40 relative"
        >
          <Character
            type="dragon"
            word={game.wordA}
            collected={game.dragonCollected}
            theme={theme}
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
            theme={theme}
          />
        </div>
      </div>

      {showFight && (
        <FightAnimation onComplete={handleFightComplete} theme={theme} />
      )}
    </div>
  );
}
