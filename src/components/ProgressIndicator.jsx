export default function ProgressIndicator({ currentSetIndex, currentPairIndex, totalSets, totalPairsInCurrentSet, setName, totalAttempts, totalCorrect }) {
  const pct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
      <div className="text-lg text-gray-400 opacity-60">
        set {currentSetIndex + 1}/{totalSets} · pair {currentPairIndex + 1}/{totalPairsInCurrentSet} · {setName}
      </div>
      {totalAttempts > 0 && (
        <div className="text-sm text-gray-400 opacity-50">
          {totalCorrect}/{totalAttempts} correct ({pct}%)
        </div>
      )}
    </div>
  );
}
