import wordSets from '../data/wordSets';

const TREASURE_URL = 'https://www.youtube.com/watch?v=1qN72LEQnaU';
const COLS = 3; // nodes per row before snaking

export default function HomePage({ completedSets, currentSetIndex, onSelectSet, onRestart }) {
  const allComplete = completedSets.size === wordSets.length;

  // Build rows of COLS items, alternating direction for snake effect
  const items = [...wordSets.map((set, i) => ({ type: 'set', set, index: i })), { type: 'treasure' }];
  const rows = [];
  for (let i = 0; i < items.length; i += COLS) {
    rows.push(items.slice(i, i + COLS));
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 overflow-auto">
      <h1 className="text-center pt-6 pb-2 text-5xl font-extrabold text-indigo-700 drop-shadow-md">
        Dragon Reading Quest
      </h1>
      <div className="flex items-center justify-center gap-4 mb-6">
        <p className="text-2xl text-indigo-500">
          Choose your battle!
        </p>
        {completedSets.size > 0 && (
          <button
            onClick={onRestart}
            className="bg-white/80 hover:bg-white text-red-500 font-extrabold rounded-full px-5 py-2 text-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Restart
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-0 pb-16 px-4">
        {rows.map((row, rowIdx) => {
          const reversed = rowIdx % 2 === 1;
          const displayRow = reversed ? [...row].reverse() : row;

          return (
            <div key={rowIdx}>
              {/* Vertical connector from previous row */}
              {rowIdx > 0 && (
                <div className="flex justify-center">
                  <div
                    className={`w-1.5 h-10 rounded-full ${
                      isConnectorLit(rows, rowIdx, completedSets) ? 'bg-amber-400' : 'bg-gray-300'
                    }`}
                    style={{
                      marginLeft: reversed ? `-${(COLS - 1) * 160}px` : `${(COLS - 1) * 160}px`,
                    }}
                  />
                </div>
              )}

              {/* Row of nodes */}
              <div className="flex items-center justify-center">
                {displayRow.map((item, colIdx) => {
                  const actualCol = reversed ? row.length - 1 - colIdx : colIdx;
                  const showConnector = colIdx > 0;

                  return (
                    <div key={`${rowIdx}-${actualCol}`} className="flex items-center">
                      {/* Horizontal connector */}
                      {showConnector && (
                        <div
                          className={`h-1.5 w-16 sm:w-24 rounded-full ${
                            isHorizontalConnectorLit(rowIdx, colIdx, reversed, rows, completedSets)
                              ? 'bg-amber-400'
                              : 'bg-gray-300'
                          }`}
                        />
                      )}

                      {item.type === 'set' ? (
                        <SetNode
                          set={item.set}
                          index={item.index}
                          done={completedSets.has(item.index)}
                          isCurrent={item.index === currentSetIndex}
                          onSelect={onSelectSet}
                        />
                      ) : (
                        <TreasureNode allComplete={allComplete} />
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

function SetNode({ set, index, done, isCurrent, onSelect }) {
  const available = done || isCurrent;

  return (
    <button
      disabled={!available}
      onClick={() => available && onSelect(index)}
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
      <span className="text-5xl">{done ? '\u2B50' : set.icon}</span>
      <span className={`text-base font-extrabold mt-1 ${available ? 'text-indigo-800' : 'text-gray-500'}`}>
        {set.name}
      </span>
      {done && (
        <span className="absolute -top-1 -right-1 text-green-500 text-2xl">\u2714</span>
      )}
    </button>
  );
}

function TreasureNode({ allComplete }) {
  return (
    <button
      disabled={!allComplete}
      onClick={() => allComplete && window.open(TREASURE_URL, '_blank')}
      className={`
        w-32 h-32 sm:w-36 sm:h-36 rounded-2xl flex flex-col items-center justify-center
        transition-all duration-300 border-4 shrink-0
        ${allComplete
          ? 'border-yellow-500 bg-gradient-to-br from-yellow-200 to-amber-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 animate-bounce'
          : 'border-gray-300 bg-gray-200 opacity-40 cursor-not-allowed grayscale'
        }
      `}
    >
      <span className="text-6xl">{allComplete ? '\uD83C\uDF1F' : '\uD83D\uDD12'}</span>
      <span className={`text-lg font-extrabold mt-1 ${allComplete ? 'text-amber-800' : 'text-gray-500'}`}>
        Treasure!
      </span>
    </button>
  );
}

// Check if the vertical connector leading into this row should be lit
function isConnectorLit(rows, rowIdx, completedSets) {
  // Lit if the last item of the previous row is completed
  const prevRow = rows[rowIdx - 1];
  const lastItem = prevRow[prevRow.length - 1];
  if (lastItem.type === 'treasure') return completedSets.size === wordSets.length;
  return completedSets.has(lastItem.index);
}

// Check if a horizontal connector should be lit
function isHorizontalConnectorLit(rowIdx, colIdx, reversed, rows, completedSets) {
  const row = rows[rowIdx];
  // In display order, the connector is between displayRow[colIdx-1] and displayRow[colIdx]
  // We need the actual items
  const displayRow = reversed ? [...row].reverse() : row;
  const prevItem = displayRow[colIdx - 1];
  if (prevItem.type === 'treasure') return completedSets.size === wordSets.length;
  return completedSets.has(prevItem.index);
}
