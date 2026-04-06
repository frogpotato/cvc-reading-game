export default function MainMenu({ onDragonQuest, onDragonQuest2, onDragonQuest3, onSentencePractice, onSentencePractice2, onLetterPractice }) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-200 via-indigo-100 to-sky-200 flex flex-col items-center justify-center gap-8 px-6">
      <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md text-center">
        Reading Quest
      </h1>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        <button
          onClick={onDragonQuest}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200 border-4 border-amber-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">🐉</span>
          Dragon Reading Quest
        </button>

        <button
          onClick={onDragonQuest2}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-violet-100 to-purple-200 border-4 border-violet-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">⚔️</span>
          Dragon Quest 2
        </button>

        <button
          onClick={onDragonQuest3}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-200 border-4 border-teal-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">🏰</span>
          Dragon Quest 3
        </button>

        <button
          onClick={onSentencePractice}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-teal-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">📖</span>
          Sentence Practice
        </button>

        <button
          onClick={onSentencePractice2}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-200 border-4 border-rose-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">📝</span>
          Sentence Reading 2
        </button>

        <button
          onClick={onLetterPractice}
          className="w-full py-8 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-200 border-4 border-sky-400 shadow-xl text-3xl font-extrabold text-indigo-800 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
        >
          <span className="text-6xl">🔤</span>
          Letter Practice
        </button>
      </div>
    </div>
  );
}
