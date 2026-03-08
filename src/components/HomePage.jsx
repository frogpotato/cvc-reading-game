import allWorlds from '../data/wordSets';

const TREASURE_URL = 'https://www.youtube.com/watch?v=1qN72LEQnaU';
const COLS = 3;

export default function HomePage({ completedLevels, currentWorldIdx, onSelectLevel, onRestart, levelKey }) {
  // Show the current world (or last world if all done)
  const worldIdx = Math.min(currentWorldIdx, allWorlds.length - 1);
  const world = allWorlds[worldIdx];
  const allWorldsDone = currentWorldIdx >= allWorlds.length;

  // Check if current world is fully complete
  const worldComplete = world.levels.every((_, i) => completedLevels.has(levelKey(worldIdx, i)));

  // Find first incomplete level in this world
  const currentLevelIdx = world.levels.findIndex((_, i) => !completedLevels.has(levelKey(worldIdx, i)));

  // Build snaking rows
  const items = [
    ...world.levels.map((level, i) => ({ type: 'level', level, index: i })),
    { type: 'treasure' },
  ];
  const rows = [];
  for (let i = 0; i < items.length; i += COLS) {
    rows.push(items.slice(i, i + COLS));
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 overflow-auto">
      <h1 className="text-center pt-6 pb-2 text-5xl font-extrabold text-indigo-700 drop-shadow-md">
        Dragon Reading Quest
      </h1>
      <div className="flex items-center justify-center gap-4 mb-2">
        <p className="text-3xl font-bold text-indigo-400">
          {world.name}
        </p>
        {completedLevels.size > 0 && (
          <button
            onClick={onRestart}
            className="bg-white/80 hover:bg-white text-red-500 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Restart
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-0 pb-16 px-4 pt-4">
        {rows.map((row, rowIdx) => {
          const reversed = rowIdx % 2 === 1;
          const displayRow = reversed ? [...row].reverse() : row;

          return (
            <div key={rowIdx}>
              {rowIdx > 0 && (
                <div className="flex justify-center">
                  <div
                    className={`w-1.5 h-10 rounded-full ${
                      isConnectorLit(rows, rowIdx, reversed, worldIdx, completedLevels, levelKey, worldComplete)
                        ? 'bg-amber-400'
                        : 'bg-gray-300'
                    }`}
                    style={{
                      marginLeft: reversed
                        ? `-${(Math.min(row.length, COLS) - 1) * 160}px`
                        : `${(Math.min(rows[rowIdx - 1].length, COLS) - 1) * 160}px`,
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-center">
                {displayRow.map((item, colIdx) => {
                  const showConnector = colIdx > 0;

                  return (
                    <div key={`${rowIdx}-${colIdx}`} className="flex items-center">
                      {showConnector && (
                        <div
                          className={`h-1.5 w-16 sm:w-24 rounded-full ${
                            isHConnectorLit(rowIdx, colIdx, reversed, rows, worldIdx, completedLevels, levelKey, worldComplete)
                              ? 'bg-amber-400'
                              : 'bg-gray-300'
                          }`}
                        />
                      )}

                      {item.type === 'level' ? (
                        <LevelNode
                          level={item.level}
                          index={item.index}
                          done={completedLevels.has(levelKey(worldIdx, item.index))}
                          isCurrent={item.index === currentLevelIdx}
                          onSelect={() => onSelectLevel(worldIdx, item.index)}
                        />
                      ) : (
                        <TreasureNode complete={worldComplete} allDone={allWorldsDone} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LevelNode({ level, index, done, isCurrent, onSelect }) {
  const available = done || isCurrent;

  return (
    <button
      disabled={!available}
      onClick={() => available && onSelect()}
      className={`
        relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center
        transition-all duration-300 border-4 shrink-0
        ${available
          ? 'border-amber-400 bg-gradient-to-br from-amber-100 to-orange-200 shadow-lg cursor-pointer hover:scale-110 active:scale-95'
          : 'border-gray-300 bg-gray-200 opacity-40 cursor-not-allowed grayscale'
        }
        ${isCurrent && !done ? 'animate-[pulse-glow_2s_ease-in-out_infinite] ring-3 ring-indigo-400' : ''}
        ${done ? 'ring-3 ring-green-400' : ''}
      `}
    >
      <span className="text-4xl">{done ? '⭐' : level.icon}</span>
      <span className={`text-lg font-extrabold mt-1 leading-tight text-center ${available ? 'text-indigo-800' : 'text-gray-500'}`}>
        {level.wordA} / {level.wordB}
      </span>
      {done && (
        <span className="absolute -top-1 -right-1 text-green-500 text-2xl">✔</span>
      )}
    </button>
  );
}

function TreasureNode({ complete, allDone }) {
  return (
    <button
      disabled={!complete}
      onClick={() => complete && window.open(TREASURE_URL, '_blank')}
      className={`
        w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex flex-col items-center justify-center
        transition-all duration-300 border-4 shrink-0
        ${complete
          ? 'border-yellow-500 bg-gradient-to-br from-yellow-200 to-amber-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 animate-bounce'
          : 'border-gray-300 bg-gray-200 opacity-40 cursor-not-allowed grayscale'
        }
      `}
    >
      <span className="text-6xl">{complete ? '🌟' : '🔒'}</span>
      <span className={`text-lg font-extrabold mt-1 ${complete ? 'text-amber-800' : 'text-gray-500'}`}>
        Treasure!
      </span>
    </button>
  );
}

function itemDone(item, worldIdx, completedLevels, levelKey, worldComplete) {
  if (item.type === 'treasure') return worldComplete;
  return completedLevels.has(levelKey(worldIdx, item.index));
}

function isConnectorLit(rows, rowIdx, reversed, worldIdx, completedLevels, levelKey, worldComplete) {
  const prevRow = rows[rowIdx - 1];
  const lastItem = prevRow[prevRow.length - 1];
  return itemDone(lastItem, worldIdx, completedLevels, levelKey, worldComplete);
}

function isHConnectorLit(rowIdx, colIdx, reversed, rows, worldIdx, completedLevels, levelKey, worldComplete) {
  const row = rows[rowIdx];
  const displayRow = reversed ? [...row].reverse() : row;
  const prevItem = displayRow[colIdx - 1];
  return itemDone(prevItem, worldIdx, completedLevels, levelKey, worldComplete);
}
