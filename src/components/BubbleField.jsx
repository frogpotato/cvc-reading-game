import Bubble from './Bubble';

// Snaking pathway positions (percentage-based) — 10 bubbles in a snaking grid
const PATHWAY_POSITIONS = [
  { x: 20, y: 10 },
  { x: 50, y: 10 },
  { x: 80, y: 10 },
  { x: 80, y: 30 },
  { x: 50, y: 30 },
  { x: 20, y: 30 },
  { x: 20, y: 50 },
  { x: 50, y: 50 },
  { x: 80, y: 50 },
  { x: 50, y: 70 },
];

export default function BubbleField({ bubbles, onDrop, dropZoneRefs }) {
  const activeIndex = bubbles.findIndex(b => !b.placed);

  return (
    <div className="relative w-full h-full">
      {/* SVG dashed connector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {PATHWAY_POSITIONS.map((pos, i) => {
          if (i === PATHWAY_POSITIONS.length - 1) return null;
          const next = PATHWAY_POSITIONS[i + 1];
          return (
            <line
              key={i}
              x1={`${pos.x}%`}
              y1={`${pos.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="#c7c7cc"
              strokeWidth="3"
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity="0.5"
            />
          );
        })}
      </svg>

      {/* Render all 10 bubbles */}
      {bubbles.map((bubble, i) => {
        const pos = PATHWAY_POSITIONS[i];
        let state;
        if (bubble.placed) {
          state = 'completed';
        } else if (activeIndex === i) {
          state = 'active';
        } else {
          state = 'future';
        }

        const size = state === 'active' ? 100 : 70;

        return (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            state={state}
            onDrop={onDrop}
            dropZoneRefs={dropZoneRefs}
            style={{
              left: `calc(${pos.x}% - ${size / 2}px)`,
              top: `calc(${pos.y}% - ${size / 2}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
