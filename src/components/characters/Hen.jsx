export default function Hen({ size = 200 }) {
  const s = size / 200; // scale factor based on 200px base
  return (
    <svg
      width={200 * s}
      height={200 * s}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <style>{`
        @keyframes henBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-1.5px); }
        }
        @keyframes henBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes henPeck {
          0%, 85%, 100% { transform: rotate(0deg); }
          90% { transform: rotate(8deg); }
          93% { transform: rotate(-3deg); }
        }
        @keyframes henTailWag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-4deg); }
        }
        @keyframes henFootTap {
          0%, 90%, 100% { transform: translateY(0); }
          93% { transform: translateY(-3px); }
          96% { transform: translateY(0); }
        }
        .hen-body { animation: henBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .hen-head { animation: henPeck 6s ease-in-out infinite; transform-origin: 110px 80px; }
        .hen-eye { animation: henBlink 4s ease-in-out infinite; transform-origin: 118px 68px; }
        .hen-tail { animation: henTailWag 2.5s ease-in-out infinite; transform-origin: 55px 110px; }
        .hen-foot-r { animation: henFootTap 5s ease-in-out infinite; }
      `}</style>

      {/* Tail feathers */}
      <g className="hen-tail">
        <path
          d="M 58 108 Q 30 95, 22 72 Q 28 88, 42 96"
          fill="none"
          stroke="#8B6914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 55 112 Q 24 102, 18 82 Q 22 100, 40 108"
          fill="#D4A030"
          stroke="#8B6914"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 52 116 Q 20 112, 14 94 Q 20 108, 38 116"
          fill="#C4922A"
          stroke="#8B6914"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 55 106 Q 28 90, 26 68 Q 32 84, 48 98"
          fill="#DEB040"
          stroke="#8B6914"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Feet / legs */}
      <g>
        {/* Left foot */}
        <g>
          <path
            d="M 88 168 L 85 185 L 75 192"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 85 185 L 82 194"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 85 185 L 90 193"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        {/* Right foot */}
        <g className="hen-foot-r">
          <path
            d="M 112 168 L 115 185 L 105 193"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 115 185 L 112 194"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 115 185 L 121 192"
            fill="none"
            stroke="#D4860A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Body */}
      <g className="hen-body">
        {/* Main body - plump rounded shape, slightly wobbly path */}
        <path
          d="M 60 130
             Q 58 108, 75 98
             Q 95 88, 120 90
             Q 148 93, 152 115
             Q 155 140, 140 158
             Q 125 172, 100 174
             Q 72 173, 62 155
             Q 57 145, 60 130 Z"
          fill="#F5D680"
          stroke="#8B6914"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly highlight */}
        <path
          d="M 80 135 Q 85 125, 105 123 Q 125 122, 130 135 Q 132 148, 115 155 Q 95 158, 82 148 Z"
          fill="#FBE8A8"
          stroke="none"
          opacity="0.6"
        />
        {/* Wing */}
        <path
          d="M 68 118 Q 72 108, 85 112 Q 95 116, 92 130 Q 88 142, 75 140 Q 65 135, 68 118 Z"
          fill="#E8C45A"
          stroke="#8B6914"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Wing feather lines */}
        <path d="M 74 116 Q 80 122, 78 132" fill="none" stroke="#C4922A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 78 114 Q 85 120, 83 130" fill="none" stroke="#C4922A" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Head group */}
      <g className="hen-head">
        {/* Neck */}
        <path
          d="M 110 98 Q 108 88, 112 78 Q 115 90, 118 96"
          fill="#F5D680"
          stroke="#8B6914"
          strokeWidth="2"
        />

        {/* Head shape */}
        <path
          d="M 102 58
             Q 100 48, 110 42
             Q 122 38, 132 44
             Q 140 50, 138 62
             Q 136 74, 125 78
             Q 112 82, 104 74
             Q 100 68, 102 58 Z"
          fill="#F5D680"
          stroke="#8B6914"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Comb (on top of head) - wobbly red bumps */}
        <path
          d="M 112 46 Q 110 32, 115 28 Q 120 25, 121 34
             Q 122 28, 126 26 Q 131 25, 130 34
             Q 132 30, 135 32 Q 137 36, 133 42"
          fill="#E23030"
          stroke="#A01818"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Eye */}
        <g className="hen-eye">
          {/* Eye white */}
          <ellipse cx="118" cy="56" rx="7" ry="7.5" fill="white" stroke="#8B6914" strokeWidth="1.5" />
          {/* Pupil - offset for personality */}
          <ellipse cx="120" cy="55.5" rx="3.5" ry="4" fill="#2D1B00" />
          {/* Eye shine */}
          <ellipse cx="121.5" cy="53.5" rx="1.5" ry="1.5" fill="white" />
        </g>

        {/* Beak */}
        <path
          d="M 134 60 L 150 64 L 134 68 Z"
          fill="#E8960A"
          stroke="#B87008"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Beak line */}
        <line x1="134" y1="64" x2="148" y2="64" stroke="#B87008" strokeWidth="1.2" />

        {/* Wattle (under beak) */}
        <path
          d="M 132 68 Q 134 76, 130 78 Q 126 76, 128 70"
          fill="#E23030"
          stroke="#A01818"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        <ellipse cx="124" cy="65" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.4" />
      </g>
    </svg>
  );
}
