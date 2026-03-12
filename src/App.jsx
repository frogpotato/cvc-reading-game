import { useCallback, useState } from 'react';
import HomePage from './components/HomePage';
import GameScreen from './components/GameScreen';
import SentencePractice from './components/SentencePractice';
import allWorlds from './data/wordSets';

function loadCompleted() {
  try {
    const raw = localStorage.getItem('cvc-completed-levels');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function loadSelectedWorld() {
  try {
    const raw = localStorage.getItem('cvc-selected-world');
    return raw !== null ? parseInt(raw, 10) : null;
  } catch {
    return null;
  }
}

function saveCompleted(completed) {
  localStorage.setItem('cvc-completed-levels', JSON.stringify([...completed]));
}

function saveSelectedWorld(idx) {
  localStorage.setItem('cvc-selected-world', String(idx));
}

function levelKey(worldIdx, levelIdx) {
  return `${worldIdx}-${levelIdx}`;
}

function findFirstIncompleteWorld(completedLevels) {
  for (let w = 0; w < allWorlds.length; w++) {
    for (let l = 0; l < allWorlds[w].levels.length; l++) {
      if (!completedLevels.has(levelKey(w, l))) return w;
    }
  }
  return 0;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(loadCompleted);
  const [testMode, setTestMode] = useState(false);
  const [activeWorldIdx, setActiveWorldIdx] = useState(() => {
    const saved = loadSelectedWorld();
    return saved !== null ? saved : findFirstIncompleteWorld(loadCompleted());
  });

  const handleSelectWorld = useCallback((idx) => {
    setActiveWorldIdx(idx);
    saveSelectedWorld(idx);
  }, []);

  const handleSelectLevel = useCallback((worldIdx, levelIdx) => {
    setSelectedLevel({ worldIdx, levelIdx });
    setPage('game');
  }, []);

  const handleLevelComplete = useCallback((worldIdx, levelIdx) => {
    setCompletedLevels(prev => {
      const next = new Set(prev);
      next.add(levelKey(worldIdx, levelIdx));
      saveCompleted(next);

      // If this world is now complete, auto-advance to next world
      const world = allWorlds[worldIdx];
      const worldDone = world.levels.every((_, i) => next.has(levelKey(worldIdx, i)));
      if (worldDone && worldIdx < allWorlds.length - 1) {
        // Will advance after treasure is clicked, but set up next world
      }

      return next;
    });
    setPage('home');
  }, []);

  const handleAdvanceWorld = useCallback(() => {
    const next = Math.min(activeWorldIdx + 1, allWorlds.length - 1);
    setActiveWorldIdx(next);
    saveSelectedWorld(next);
  }, [activeWorldIdx]);

  const handleBackToHome = useCallback(() => {
    setPage('home');
  }, []);

  const handleRestart = useCallback(() => {
    // Reset only the current world's levels
    setCompletedLevels(prev => {
      const next = new Set(prev);
      const world = allWorlds[activeWorldIdx];
      world.levels.forEach((_, i) => next.delete(levelKey(activeWorldIdx, i)));
      saveCompleted(next);
      return next;
    });
  }, [activeWorldIdx]);

  if (page === 'sentences') {
    return <SentencePractice onBack={() => setPage('home')} />;
  }

  if (page === 'home' || !selectedLevel) {
    return (
      <HomePage
        completedLevels={completedLevels}
        activeWorldIdx={activeWorldIdx}
        onSelectLevel={handleSelectLevel}
        onSelectWorld={handleSelectWorld}
        onRestart={handleRestart}
        onAdvanceWorld={handleAdvanceWorld}
        levelKey={levelKey}
        testMode={testMode}
        onToggleTestMode={() => setTestMode(prev => !prev)}
        onSentencePractice={() => setPage('sentences')}
      />
    );
  }

  const world = allWorlds[selectedLevel.worldIdx];
  const level = world.levels[selectedLevel.levelIdx];

  return (
    <GameScreen
      key={`${selectedLevel.worldIdx}-${selectedLevel.levelIdx}`}
      level={level}
      worldIdx={selectedLevel.worldIdx}
      levelIdx={selectedLevel.levelIdx}
      onLevelComplete={handleLevelComplete}
      onBack={handleBackToHome}
      testMode={testMode}
    />
  );
}
