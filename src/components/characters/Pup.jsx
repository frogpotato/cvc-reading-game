export default function Pup({ size = 200 }) {
  const s = size / 200;
  return (
    <svg
      width={200 * s}
      height={200 * s}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        @keyframes pupBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-1.5px); }
        }
        @keyframes pupBlink {
          0%, 91%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        @keyframes pupTailWag {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(18deg); }
          35% { transform: rotate(-15deg); }
          55% { transform: rotate(12deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes pupTongue {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.08); }
        }
        @keyframes pupEarFlop {
          0%, 85%, 100% { transform: rotate(0deg); }
          88% { transform: rotate(5deg); }
          92% { transform: rotate(-3deg); }
        }
        .pup-body { animation: pupBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .pup-eye-l { animation: pupBlink 4.5s ease-in-out infinite; transform-origin: 84px 62px; }
        .pup-eye-r { animation: pupBlink 4.5s ease-in-out infinite; transform-origin: 116px 62px; }
        .pup-tail { animation: pupTailWag 1.2s ease-in-out infinite; transform-origin: 148px 120px; }
        .pup-tongue { animation: pupTongue 2s ease-in-out infinite; transform-origin: 100px 88px; }
        .pup-ear-l { animation: pupEarFlop 5s ease-in-out infinite; transform-origin: 68px 52px; }
        .pup-ear-r { animation: pupEarFlop 5s ease-in-out infinite 0.3s; transform-origin: 132px 52px; }
      `}</style>

      {/* Tail - wagging fast */}
      <g className="pup-tail">
        <path
          d="M 148 118 Q 165 105, 172 88 Q 175 78, 170 75"
          fill="none"
          stroke="#C89450"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 148 118 Q 165 105, 172 88 Q 175 78, 170 75"
          fill="none"
          stroke="#D4A460"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* Legs */}
      <g>
        {/* Front legs */}
        <path d="M 82 162 L 78 180" fill="none" stroke="#B88440" strokeWidth="4" strokeLinecap="round" />
        <path d="M 118 162 L 122 180" fill="none" stroke="#B88440" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="78" cy="184" rx="7" ry="5" fill="#D4A460" stroke="#B88440" strokeWidth="1.5" />
        <ellipse cx="122" cy="184" rx="7" ry="5" fill="#D4A460" stroke="#B88440" strokeWidth="1.5" />
      </g>

      {/* Body */}
      <g className="pup-body">
        <path
          d="M 58 125
             Q 54 105, 68 95
             Q 85 85, 112 86
             Q 142 88, 150 108
             Q 156 130, 148 152
             Q 138 168, 108 172
             Q 75 170, 60 152
             Q 52 140, 58 125 Z"
          fill="#D4A460"
          stroke="#B88440"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly white */}
        <path
          d="M 80 120 Q 88 108, 108 106 Q 128 108, 132 120 Q 136 138, 120 150 Q 100 156, 82 148 Q 74 135, 80 120 Z"
          fill="#F5E8D0"
          stroke="none"
          opacity="0.7"
        />
        {/* Spot on back */}
        <ellipse cx="120" cy="110" rx="15" ry="10" fill="#C08830" stroke="none" opacity="0.5" transform="rotate(-15, 120, 110)" />
      </g>

      {/* Head */}
      <g>
        {/* Left ear - floppy */}
        <g className="pup-ear-l">
          <path
            d="M 72 52 Q 55 48, 45 58 Q 38 68, 45 78 Q 50 82, 62 72 Q 68 62, 72 56"
            fill="#C08830"
            stroke="#B88440"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* Right ear - floppy */}
        <g className="pup-ear-r">
          <path
            d="M 128 52 Q 145 48, 155 58 Q 162 68, 155 78 Q 150 82, 138 72 Q 132 62, 128 56"
            fill="#C08830"
            stroke="#B88440"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* Head shape */}
        <path
          d="M 65 55
             Q 62 42, 74 35
             Q 88 28, 100 28
             Q 112 28, 126 35
             Q 138 42, 135 55
             Q 140 70, 130 82
             Q 118 94, 100 96
             Q 82 94, 70 82
             Q 60 70, 65 55 Z"
          fill="#D4A460"
          stroke="#B88440"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* White muzzle */}
        <path
          d="M 82 72 Q 88 62, 100 60 Q 112 62, 118 72 Q 122 82, 112 92 Q 100 96, 88 92 Q 78 82, 82 72 Z"
          fill="#F5E8D0"
          stroke="none"
          opacity="0.85"
        />

        {/* Brown patch over one eye */}
        <path
          d="M 105 42 Q 118 38, 128 45 Q 132 52, 126 60 Q 118 62, 112 58 Q 105 50, 105 42 Z"
          fill="#C08830"
          stroke="none"
          opacity="0.6"
        />

        {/* Eyes - big puppy eyes */}
        <g className="pup-eye-l">
          <ellipse cx="84" cy="58" rx="9" ry="10" fill="white" stroke="#B88440" strokeWidth="1.5" />
          <ellipse cx="86" cy="57" rx="5" ry="5.5" fill="#4A3018" />
          <ellipse cx="87.5" cy="55" rx="2.2" ry="2.2" fill="white" />
          <ellipse cx="84" cy="59" rx="1" ry="1" fill="white" opacity="0.5" />
        </g>
        <g className="pup-eye-r">
          <ellipse cx="116" cy="58" rx="9" ry="10" fill="white" stroke="#B88440" strokeWidth="1.5" />
          <ellipse cx="118" cy="57" rx="5" ry="5.5" fill="#4A3018" />
          <ellipse cx="119.5" cy="55" rx="2.2" ry="2.2" fill="white" />
          <ellipse cx="116" cy="59" rx="1" ry="1" fill="white" opacity="0.5" />
        </g>

        {/* Eyebrows - expressive */}
        <path d="M 76 48 Q 82 44, 90 47" fill="none" stroke="#B88440" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 124 48 Q 118 44, 110 47" fill="none" stroke="#B88440" strokeWidth="1.8" strokeLinecap="round" />

        {/* Nose */}
        <ellipse cx="100" cy="76" rx="6" ry="4.5" fill="#2D1B00" stroke="#1A1000" strokeWidth="1" />
        <ellipse cx="101.5" cy="75" rx="2" ry="1" fill="white" opacity="0.35" />

        {/* Mouth */}
        <path d="M 100 80 Q 95 85, 90 83" fill="none" stroke="#B88440" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 100 80 Q 105 85, 110 83" fill="none" stroke="#B88440" strokeWidth="1.5" strokeLinecap="round" />

        {/* Tongue hanging out */}
        <g className="pup-tongue">
          <path
            d="M 98 84 Q 95 92, 98 98 Q 100 100, 102 98 Q 105 92, 102 84"
            fill="#F07088"
            stroke="#D05868"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* Cheek blush */}
        <ellipse cx="72" cy="74" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.4" />
        <ellipse cx="128" cy="74" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.4" />
      </g>
    </svg>
  );
}
