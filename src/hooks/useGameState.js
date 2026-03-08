import { useState, useCallback } from 'react';

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

// Now takes a single level object { wordA, wordB }
export default function useGameState(level) {
  const { wordA, wordB } = level;

  const [bubbles, setBubbles] = useState(() => generateBubbles(wordA, wordB));
  const [dragonCollected, setDragonCollected] = useState(0);
  const [knightCollected, setKnightCollected] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

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

  return {
    wordA,
    wordB,
    bubbles,
    dragonCollected,
    knightCollected,
    handleDrop,
    totalAttempts,
    totalCorrect,
  };
}
