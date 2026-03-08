import { useCallback, useState } from 'react';
import HomePage from './components/HomePage';
import GameScreen from './components/GameScreen';
import allWorlds from './data/wordSets';

function loadCompleted() {
  try {
    const raw = localStorage.getItem('cvc-completed-levels');
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(completed) {
  localStorage.setItem('cvc-completed-levels', JSON.stringify([...completed]));
}

// Build a flat key for each level: "worldIdx-levelIdx"
function levelKey(worldIdx, levelIdx) {
  return `${worldIdx}-${levelIdx}`;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState(null); // { worldIdx, levelIdx }
  const [completedLevels, setCompletedLevels] = useState(loadCompleted);

  // Find the current world (first world with incomplete levels)
  const currentWorldIdx = (() => {
    for (let w = 0; w < allWorlds.length; w++) {
      const world = allWorlds[w];
      for (let l = 0; l < world.levels.length; l++) {
        if (!completedLevels.has(levelKey(w, l))) return w;
      }
    }
    return allWorlds.length; // all done
  })();

  const handleSelectLevel = useCallback((worldIdx, levelIdx) => {
    setSelectedLevel({ worldIdx, levelIdx });
    setPage('game');
  }, []);

  const handleLevelComplete = useCallback((worldIdx, levelIdx) => {
    setCompletedLevels(prev => {
      const next = new Set(prev);
      next.add(levelKey(worldIdx, levelIdx));
      saveCompleted(next);
      return next;
    });
    setPage('home');
  }, []);

  const handleBackToHome = useCallback(() => {
    setPage('home');
  }, []);

  const handleRestart = useCallback(() => {
    setCompletedLevels(new Set());
    saveCompleted(new Set());
  }, []);

  if (page === 'home' || !selectedLevel) {
    return (
      <HomePage
        completedLevels={completedLevels}
        currentWorldIdx={currentWorldIdx}
        onSelectLevel={handleSelectLevel}
        onRestart={handleRestart}
        levelKey={levelKey}
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
    />
  );
}
