import { useCallback, useState } from 'react';
import HomePage from './components/HomePage';
import GameScreen from './components/GameScreen';
import wordSets from './data/wordSets';

function loadCompletedSets() {
  try {
    const raw = localStorage.getItem('cvc-completed-sets');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompletedSets(completed) {
  localStorage.setItem('cvc-completed-sets', JSON.stringify([...completed]));
}

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'game'
  const [selectedSet, setSelectedSet] = useState(0);
  const [completedSets, setCompletedSets] = useState(loadCompletedSets);

  // The first incomplete set is the "current" one
  const currentSetIndex = (() => {
    for (let i = 0; i < wordSets.length; i++) {
      if (!completedSets.has(i)) return i;
    }
    return wordSets.length; // all done
  })();

  const handleSelectSet = useCallback((setIndex) => {
    setSelectedSet(setIndex);
    setPage('game');
  }, []);

  const handleSetComplete = useCallback((setIndex) => {
    setCompletedSets(prev => {
      const next = new Set(prev);
      next.add(setIndex);
      saveCompletedSets(next);
      return next;
    });
    setPage('home');
  }, []);

  const handleBackToHome = useCallback(() => {
    setPage('home');
  }, []);

  const handleRestart = useCallback(() => {
    setCompletedSets(new Set());
    saveCompletedSets(new Set());
  }, []);

  if (page === 'home') {
    return (
      <HomePage
        completedSets={completedSets}
        currentSetIndex={currentSetIndex}
        onSelectSet={handleSelectSet}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <GameScreen
      key={selectedSet}
      selectedSetIndex={selectedSet}
      onSetComplete={handleSetComplete}
      onBack={handleBackToHome}
    />
  );
}
