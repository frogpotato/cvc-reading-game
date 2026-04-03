import Hen from './Hen';

export default function HenPreview({ onBack }) {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-amber-900">Hen Character Preview</h1>

      <div className="flex gap-12 items-end flex-wrap justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg text-amber-800 font-semibold">Small (100px)</span>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Hen size={100} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-lg text-amber-800 font-semibold">Medium (200px)</span>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Hen size={200} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-lg text-amber-800 font-semibold">Large (300px)</span>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Hen size={300} />
          </div>
        </div>
      </div>

      <div className="bg-green-200 rounded-2xl p-8 shadow-lg mt-4">
        <p className="text-lg text-green-900 font-semibold mb-4 text-center">In a scene context:</p>
        <div className="bg-green-300 rounded-xl p-6 flex items-end justify-center gap-4" style={{ minWidth: 400, minHeight: 200 }}>
          <div className="bg-amber-700 rounded-t-lg" style={{ width: 60, height: 30 }} />
          <Hen size={160} />
          <div className="bg-amber-600 rounded" style={{ width: 40, height: 25 }} />
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-xl text-xl font-bold shadow hover:bg-amber-700 active:scale-95 transition"
      >
        Back
      </button>
    </div>
  );
}
