import { useCallback, useState } from 'react';
import MainMenu from './components/MainMenu';
import HomePage from './components/HomePage';
import GameScreen from './components/GameScreen';
import SentencePractice from './components/SentencePractice';
import LetterPractice from './components/LetterPractice';
import SentencePractice2 from './components/SentencePractice2';
import DragonQuest2 from './components/DragonQuest2';
import DragonQuest3 from './components/DragonQuest3';
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
  // pages: 'home' | 'dragon' | 'dragon2' | 'dragon3' | 'game' | 'sentences' | 'sentences2' | 'letters'
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
      return next;
    });
    setPage('dragon');
  }, []);

  const handleAdvanceWorld = useCallback(() => {
    const next = Math.min(activeWorldIdx + 1, allWorlds.length - 1);
    setActiveWorldIdx(next);
    saveSelectedWorld(next);
  }, [activeWorldIdx]);

  const handleRestart = useCallback(() => {
    setCompletedLevels(prev => {
      const next = new Set(prev);
      const world = allWorlds[activeWorldIdx];
      world.levels.forEach((_, i) => next.delete(levelKey(activeWorldIdx, i)));
      saveCompleted(next);
      return next;
    });
  }, [activeWorldIdx]);

  if (page === 'home') {
    return (
      <MainMenu
        onDragonQuest={() => setPage('dragon')}
        onDragonQuest2={() => setPage('dragon2')}
        onDragonQuest3={() => setPage('dragon3')}
        onSentencePractice={() => setPage('sentences')}
        onSentencePractice2={() => setPage('sentences2')}
        onLetterPractice={() => setPage('letters')}
      />
    );
  }

  if (page === 'dragon2') {
    return <DragonQuest2 onBack={() => setPage('home')} />;
  }

  if (page === 'dragon3') {
    return <DragonQuest3 onBack={() => setPage('home')} />;
  }

  if (page === 'sentences') {
    return <SentencePractice onBack={() => setPage('home')} />;
  }

  if (page === 'sentences2') {
    return <SentencePractice2 onBack={() => setPage('home')} />;
  }

  if (page === 'letters') {
    return <LetterPractice onBack={() => setPage('home')} />;
  }

  if (page === 'dragon' || (page === 'game' && !selectedLevel)) {
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
        onBack={() => setPage('home')}
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
      onBack={() => setPage('dragon')}
      testMode={testMode}
    />
  );
}
