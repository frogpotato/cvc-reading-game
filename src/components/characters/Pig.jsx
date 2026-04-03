export default function Pig({ size = 200 }) {
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
        @keyframes pigBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-1.5px); }
        }
        @keyframes pigBlink {
          0%, 91%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        @keyframes pigEarWiggle {
          0%, 80%, 100% { transform: rotate(0deg); }
          84% { transform: rotate(-8deg); }
          88% { transform: rotate(5deg); }
          92% { transform: rotate(-3deg); }
        }
        @keyframes pigTailCurl {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes pigSnoutWiggle {
          0%, 85%, 100% { transform: scaleX(1); }
          88% { transform: scaleX(1.08); }
          91% { transform: scaleX(0.95); }
          94% { transform: scaleX(1.05); }
        }
        .pig-body { animation: pigBreathe 3.2s ease-in-out infinite; transform-origin: 100px 128px; }
        .pig-eye-l { animation: pigBlink 4s ease-in-out infinite; transform-origin: 82px 68px; }
        .pig-eye-r { animation: pigBlink 4s ease-in-out infinite; transform-origin: 118px 68px; }
        .pig-ear-l { animation: pigEarWiggle 4.5s ease-in-out infinite; transform-origin: 70px 48px; }
        .pig-ear-r { animation: pigEarWiggle 4.5s ease-in-out infinite 0.2s; transform-origin: 130px 48px; }
        .pig-tail { animation: pigTailCurl 2.5s ease-in-out infinite; transform-origin: 148px 125px; }
        .pig-snout { animation: pigSnoutWiggle 3.5s ease-in-out infinite; transform-origin: 100px 82px; }
      `}</style>

      {/* Curly tail */}
      <g className="pig-tail">
        <path
          d="M 148 125 Q 162 118, 168 125 Q 174 135, 166 140 Q 158 144, 158 135 Q 160 128, 168 128"
          fill="none"
          stroke="#E0789A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Legs */}
      <g>
        <path d="M 78 162 L 75 180" fill="none" stroke="#D06888" strokeWidth="4" strokeLinecap="round" />
        <path d="M 122 162 L 125 180" fill="none" stroke="#D06888" strokeWidth="4" strokeLinecap="round" />
        <path d="M 88 165 L 86 182" fill="none" stroke="#D06888" strokeWidth="4" strokeLinecap="round" />
        <path d="M 112 165 L 114 182" fill="none" stroke="#D06888" strokeWidth="4" strokeLinecap="round" />
        {/* Hooves */}
        <ellipse cx="75" cy="184" rx="6" ry="4" fill="#D06888" stroke="#A85070" strokeWidth="1.5" />
        <ellipse cx="125" cy="184" rx="6" ry="4" fill="#D06888" stroke="#A85070" strokeWidth="1.5" />
        <ellipse cx="86" cy="186" rx="6" ry="4" fill="#D06888" stroke="#A85070" strokeWidth="1.5" />
        <ellipse cx="114" cy="186" rx="6" ry="4" fill="#D06888" stroke="#A85070" strokeWidth="1.5" />
      </g>

      {/* Body */}
      <g className="pig-body">
        <path
          d="M 58 125
             Q 52 100, 70 92
             Q 90 82, 110 82
             Q 135 84, 148 100
             Q 158 118, 152 140
             Q 145 162, 120 170
             Q 100 174, 80 170
             Q 58 162, 52 145
             Q 50 135, 58 125 Z"
          fill="#F5A0B8"
          stroke="#D06888"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly highlight */}
        <path
          d="M 78 120 Q 85 108, 105 106 Q 125 108, 130 120 Q 134 138, 118 150 Q 100 156, 82 148 Q 74 135, 78 120 Z"
          fill="#F8C0D0"
          stroke="none"
          opacity="0.5"
        />
      </g>

      {/* Head */}
      <g>
        {/* Left ear - floppy */}
        <g className="pig-ear-l">
          <path
            d="M 72 52 Q 58 35, 52 28 Q 48 22, 55 30 Q 50 25, 60 38 Q 65 45, 78 50"
            fill="#F5A0B8"
            stroke="#D06888"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 70 50 L 55 30 L 62 26 L 78 46 Z"
            fill="#F5A0B8"
            stroke="#D06888"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 72 48 L 60 32 L 65 30 L 76 45" fill="#E890A8" stroke="none" opacity="0.5" />
        </g>

        {/* Right ear - floppy */}
        <g className="pig-ear-r">
          <path
            d="M 128 50 L 145 30 L 138 26 L 122 46 Z"
            fill="#F5A0B8"
            stroke="#D06888"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 126 48 L 140 32 L 135 30 L 124 45" fill="#E890A8" stroke="none" opacity="0.5" />
        </g>

        {/* Head shape - round */}
        <path
          d="M 65 60
             Q 60 45, 72 38
             Q 88 30, 100 30
             Q 112 30, 128 38
             Q 140 45, 135 60
             Q 140 78, 130 90
             Q 118 102, 100 104
             Q 82 102, 70 90
             Q 60 78, 65 60 Z"
          fill="#F5A0B8"
          stroke="#D06888"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Eyes - happy */}
        <g className="pig-eye-l">
          <ellipse cx="82" cy="60" rx="8" ry="8.5" fill="white" stroke="#D06888" strokeWidth="1.5" />
          <ellipse cx="84" cy="59.5" rx="4" ry="4.5" fill="#2D1B00" />
          <ellipse cx="85.5" cy="57.5" rx="1.8" ry="1.8" fill="white" />
        </g>
        <g className="pig-eye-r">
          <ellipse cx="118" cy="60" rx="8" ry="8.5" fill="white" stroke="#D06888" strokeWidth="1.5" />
          <ellipse cx="120" cy="59.5" rx="4" ry="4.5" fill="#2D1B00" />
          <ellipse cx="121.5" cy="57.5" rx="1.8" ry="1.8" fill="white" />
        </g>

        {/* Snout */}
        <g className="pig-snout">
          <ellipse cx="100" cy="80" rx="16" ry="11" fill="#E890A8" stroke="#D06888" strokeWidth="2" />
          {/* Nostrils */}
          <ellipse cx="94" cy="80" rx="3" ry="3.5" fill="#D06888" />
          <ellipse cx="106" cy="80" rx="3" ry="3.5" fill="#D06888" />
        </g>

        {/* Mouth - happy smile */}
        <path d="M 90 92 Q 100 100, 110 92" fill="none" stroke="#D06888" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="68" cy="78" rx="6" ry="4" fill="#F0A0A0" opacity="0.5" />
        <ellipse cx="132" cy="78" rx="6" ry="4" fill="#F0A0A0" opacity="0.5" />
      </g>
    </svg>
  );
}
