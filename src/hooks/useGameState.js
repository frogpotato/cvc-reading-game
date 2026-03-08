import { useState, useCallback } from 'react';
import wordSets from '../data/wordSets';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateBubbles(wordA, wordB) {
  const words = [wordA, wordA, wordA, wordB, wordB, wordB];
  const shuffled = shuffle(words);

  return shuffled.map((word, i) => ({
    id: `bubble-${i}-${Date.now()}-${Math.random()}`,
    word,
    placed: false,
    placedOn: null,
  }));
}

export default function useGameState(selectedSetIndex) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  const currentSet = wordSets[selectedSetIndex];
  const currentPair = currentSet.pairs[currentPairIndex];
  const wordA = currentPair[0];
  const wordB = currentPair[1];

  const [bubbles, setBubbles] = useState(() => generateBubbles(wordA, wordB));
  const [dragonCollected, setDragonCollected] = useState(0);
  const [knightCollected, setKnightCollected] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const totalPairsInCurrentSet = currentSet.pairs.length;

  const handleDrop = useCallback((bubbleId, target) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble || bubble.placed) return { result: 'invalid', isRoundComplete: false };

    const isCorrect =
      (target === 'dragon' && bubble.word === wordA) ||
      (target === 'knight' && bubble.word === wordB);

    setTotalAttempts(prev => prev + 1);

    if (!isCorrect) return { result: 'wrong', isRoundComplete: false };

    setTotalCorrect(prev => prev + 1);
    setBubbles(prev =>
      prev.map(b =>
        b.id === bubbleId ? { ...b, placed: true, placedOn: target } : b
      )
    );

    const newDragon = dragonCollected + (target === 'dragon' ? 1 : 0);
    const newKnight = knightCollected + (target === 'knight' ? 1 : 0);
    setDragonCollected(newDragon);
    setKnightCollected(newKnight);

    const complete = newDragon + newKnight === 6;
    return { result: 'correct', isRoundComplete: complete };
  }, [bubbles, wordA, wordB, dragonCollected, knightCollected]);

  // Returns true if the set is now fully complete
  const advanceRound = useCallback(() => {
    const nextPairIndex = currentPairIndex + 1;

    if (nextPairIndex >= currentSet.pairs.length) {
      return true; // set complete
    }

    const nextPair = currentSet.pairs[nextPairIndex];
    setCurrentPairIndex(nextPairIndex);
    setBubbles(generateBubbles(nextPair[0], nextPair[1]));
    setDragonCollected(0);
    setKnightCollected(0);
    return false;
  }, [currentPairIndex, currentSet]);

  return {
    currentSetIndex: selectedSetIndex,
    currentPairIndex,
    wordA,
    wordB,
    bubbles,
    dragonCollected,
    knightCollected,
    handleDrop,
    advanceRound,
    totalSets: wordSets.length,
    totalPairsInCurrentSet,
    currentSetName: currentSet.name,
    totalAttempts,
    totalCorrect,
  };
}
