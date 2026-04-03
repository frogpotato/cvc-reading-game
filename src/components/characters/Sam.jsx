export default function Sam({ size = 200 }) {
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
        @keyframes samBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes samBlink {
          0%, 91%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        @keyframes samWave {
          0%, 70%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(-12deg); }
          80% { transform: rotate(8deg); }
          85% { transform: rotate(-10deg); }
          90% { transform: rotate(5deg); }
        }
        @keyframes samBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .sam-body { animation: samBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .sam-eye-l { animation: samBlink 4s ease-in-out infinite; transform-origin: 85px 68px; }
        .sam-eye-r { animation: samBlink 4s ease-in-out infinite; transform-origin: 115px 68px; }
        .sam-wave-arm { animation: samWave 4s ease-in-out infinite; transform-origin: 140px 115px; }
        .sam-whole { animation: samBounce 3.5s ease-in-out infinite; }
      `}</style>

      <g className="sam-whole">
        {/* Legs */}
        <g>
          <path d="M 85 170 L 82 190" fill="none" stroke="#5A7AA0" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 115 170 L 118 190" fill="none" stroke="#5A7AA0" strokeWidth="4.5" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="80" cy="193" rx="9" ry="5" fill="#C04040" stroke="#902828" strokeWidth="1.5" />
          <ellipse cx="120" cy="193" rx="9" ry="5" fill="#C04040" stroke="#902828" strokeWidth="1.5" />
        </g>

        {/* Body / shirt */}
        <g className="sam-body">
          <path
            d="M 68 108
               Q 62 98, 72 90
               Q 85 82, 100 82
               Q 115 82, 128 90
               Q 138 98, 132 108
               Q 138 130, 130 150
               Q 122 168, 100 172
               Q 78 168, 70 150
               Q 62 130, 68 108 Z"
            fill="#4A90D0"
            stroke="#3570A8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Shirt collar */}
          <path
            d="M 88 90 Q 95 98, 100 96 Q 105 98, 112 90"
            fill="none"
            stroke="#3570A8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Shirt buttons */}
          <circle cx="100" cy="110" r="2" fill="#3570A8" />
          <circle cx="100" cy="125" r="2" fill="#3570A8" />
          <circle cx="100" cy="140" r="2" fill="#3570A8" />

          {/* Left arm (at side) */}
          <path
            d="M 68 108 Q 55 118, 50 132 Q 48 140, 52 142"
            fill="none"
            stroke="#4A90D0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 68 108 Q 55 118, 50 132 Q 48 140, 52 142"
            fill="none"
            stroke="#3570A8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left hand */}
          <circle cx="52" cy="143" r="5" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />
        </g>

        {/* Right arm - waving */}
        <g className="sam-wave-arm">
          <path
            d="M 132 108 Q 148 100, 158 88 Q 162 82, 160 78"
            fill="none"
            stroke="#4A90D0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 132 108 Q 148 100, 158 88 Q 162 82, 160 78"
            fill="none"
            stroke="#3570A8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right hand */}
          <circle cx="160" cy="76" r="5.5" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />
          {/* Fingers spread for wave */}
          <path d="M 158 72 L 155 68" fill="none" stroke="#F5C8A0" strokeWidth="2" strokeLinecap="round" />
          <path d="M 160 71 L 159 66" fill="none" stroke="#F5C8A0" strokeWidth="2" strokeLinecap="round" />
          <path d="M 162 72 L 163 67" fill="none" stroke="#F5C8A0" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Head */}
        <g>
          {/* Hair - messy brown */}
          <path
            d="M 68 52
               Q 65 35, 78 25
               Q 88 18, 100 16
               Q 115 15, 128 22
               Q 140 30, 138 48
               Q 140 42, 135 35
               Q 142 42, 140 52"
            fill="#6B4226"
            stroke="#4A2E18"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* More hair tufts */}
          <path d="M 78 22 Q 82 14, 90 18" fill="none" stroke="#4A2E18" strokeWidth="2" strokeLinecap="round" />
          <path d="M 95 16 Q 100 10, 108 14" fill="none" stroke="#4A2E18" strokeWidth="2" strokeLinecap="round" />
          <path d="M 112 18 Q 120 12, 125 20" fill="none" stroke="#4A2E18" strokeWidth="2" strokeLinecap="round" />

          {/* Head / face shape */}
          <path
            d="M 70 55
               Q 68 42, 78 36
               Q 90 30, 100 30
               Q 110 30, 122 36
               Q 132 42, 130 55
               Q 134 70, 126 82
               Q 118 92, 100 94
               Q 82 92, 74 82
               Q 66 70, 70 55 Z"
            fill="#F5C8A0"
            stroke="#D4A878"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Hair fringe over forehead */}
          <path
            d="M 72 48 Q 78 38, 88 40 Q 92 36, 100 38 Q 108 35, 115 38 Q 122 36, 130 42 Q 134 48, 130 52"
            fill="#6B4226"
            stroke="#4A2E18"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Ears */}
          <ellipse cx="68" cy="65" rx="5" ry="7" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />
          <ellipse cx="132" cy="65" rx="5" ry="7" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />

          {/* Eyes */}
          <g className="sam-eye-l">
            <ellipse cx="85" cy="60" rx="7.5" ry="8" fill="white" stroke="#D4A878" strokeWidth="1.5" />
            <ellipse cx="87" cy="59.5" rx="3.8" ry="4.2" fill="#4A7030" />
            <ellipse cx="87" cy="59.5" rx="2" ry="2.5" fill="#2D1B00" />
            <ellipse cx="88.5" cy="57.5" rx="1.5" ry="1.5" fill="white" />
          </g>
          <g className="sam-eye-r">
            <ellipse cx="115" cy="60" rx="7.5" ry="8" fill="white" stroke="#D4A878" strokeWidth="1.5" />
            <ellipse cx="117" cy="59.5" rx="3.8" ry="4.2" fill="#4A7030" />
            <ellipse cx="117" cy="59.5" rx="2" ry="2.5" fill="#2D1B00" />
            <ellipse cx="118.5" cy="57.5" rx="1.5" ry="1.5" fill="white" />
          </g>

          {/* Eyebrows */}
          <path d="M 78 52 Q 84 48, 92 50" fill="none" stroke="#4A2E18" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 122 52 Q 116 48, 108 50" fill="none" stroke="#4A2E18" strokeWidth="1.8" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 100 70 Q 98 74, 100 76 Q 102 74, 100 70" fill="#D4A878" stroke="none" />

          {/* Mouth - friendly smile */}
          <path d="M 90 80 Q 100 88, 110 80" fill="none" stroke="#D4A878" strokeWidth="1.8" strokeLinecap="round" />

          {/* Cheek blush */}
          <ellipse cx="76" cy="76" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.45" />
          <ellipse cx="124" cy="76" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.45" />

          {/* Freckles */}
          <circle cx="78" cy="72" r="1" fill="#D4A878" opacity="0.5" />
          <circle cx="80" cy="74" r="1" fill="#D4A878" opacity="0.5" />
          <circle cx="120" cy="72" r="1" fill="#D4A878" opacity="0.5" />
          <circle cx="122" cy="74" r="1" fill="#D4A878" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}
