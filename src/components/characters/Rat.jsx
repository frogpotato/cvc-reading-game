export default function Rat({ size = 200 }) {
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
        @keyframes ratBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes ratBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }
        @keyframes ratNoseTwitch {
          0%, 80%, 100% { transform: scale(1); }
          83% { transform: scale(1.15, 0.9); }
          86% { transform: scale(0.9, 1.1); }
          89% { transform: scale(1.1, 0.95); }
        }
        @keyframes ratEarWiggle {
          0%, 85%, 100% { transform: rotate(0deg); }
          88% { transform: rotate(-5deg); }
          91% { transform: rotate(3deg); }
        }
        @keyframes ratTailSway {
          0%, 100% { transform: rotate(0deg); }
          40% { transform: rotate(8deg); }
          70% { transform: rotate(-6deg); }
        }
        .rat-body { animation: ratBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .rat-eye-l { animation: ratBlink 3.8s ease-in-out infinite; transform-origin: 82px 70px; }
        .rat-eye-r { animation: ratBlink 3.8s ease-in-out infinite; transform-origin: 118px 70px; }
        .rat-nose { animation: ratNoseTwitch 2.5s ease-in-out infinite; transform-origin: 100px 88px; }
        .rat-ear-l { animation: ratEarWiggle 4s ease-in-out infinite; transform-origin: 68px 55px; }
        .rat-ear-r { animation: ratEarWiggle 4s ease-in-out infinite 0.2s; transform-origin: 132px 55px; }
        .rat-tail { animation: ratTailSway 3s ease-in-out infinite; transform-origin: 60px 155px; }
      `}</style>

      {/* Tail - long curvy */}
      <g className="rat-tail">
        <path
          d="M 62 158 Q 38 165, 22 155 Q 8 142, 15 125 Q 20 112, 10 105"
          fill="none"
          stroke="#C4A090"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 62 158 Q 38 165, 22 155 Q 8 142, 15 125 Q 20 112, 10 105"
          fill="none"
          stroke="#D4B0A0"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Feet */}
      <g>
        <ellipse cx="80" cy="188" rx="10" ry="5" fill="#D4B0A0" stroke="#9E8070" strokeWidth="1.5" />
        <ellipse cx="120" cy="188" rx="10" ry="5" fill="#D4B0A0" stroke="#9E8070" strokeWidth="1.5" />
        <path d="M 80 168 L 78 183" fill="none" stroke="#9E8070" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 120 168 L 122 183" fill="none" stroke="#9E8070" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Body */}
      <g className="rat-body">
        <path
          d="M 62 128
             Q 58 108, 72 98
             Q 88 88, 112 88
             Q 140 90, 148 110
             Q 154 132, 145 152
             Q 135 168, 105 172
             Q 72 170, 60 155
             Q 55 145, 62 128 Z"
          fill="#A0917E"
          stroke="#7A6C5C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly light patch */}
        <path
          d="M 82 125 Q 88 115, 110 114 Q 130 116, 132 128 Q 134 142, 118 150 Q 98 153, 85 142 Z"
          fill="#C8BAA8"
          stroke="none"
          opacity="0.6"
        />
        {/* Little arm */}
        <path
          d="M 130 115 Q 142 120, 145 130 Q 146 136, 140 138"
          fill="none"
          stroke="#7A6C5C"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <ellipse cx="140" cy="139" rx="4" ry="3" fill="#D4B0A0" stroke="#9E8070" strokeWidth="1" />
      </g>

      {/* Head */}
      <g>
        {/* Left ear */}
        <g className="rat-ear-l">
          <ellipse cx="68" cy="42" rx="18" ry="22" fill="#A0917E" stroke="#7A6C5C" strokeWidth="2" transform="rotate(-15, 68, 42)" />
          <ellipse cx="68" cy="42" rx="12" ry="16" fill="#E8B8A8" stroke="none" opacity="0.6" transform="rotate(-15, 68, 42)" />
        </g>

        {/* Right ear */}
        <g className="rat-ear-r">
          <ellipse cx="132" cy="42" rx="18" ry="22" fill="#A0917E" stroke="#7A6C5C" strokeWidth="2" transform="rotate(15, 132, 42)" />
          <ellipse cx="132" cy="42" rx="12" ry="16" fill="#E8B8A8" stroke="none" opacity="0.6" transform="rotate(15, 132, 42)" />
        </g>

        {/* Head shape - pointy snout */}
        <path
          d="M 65 58
             Q 60 46, 70 40
             Q 85 32, 100 32
             Q 115 32, 130 40
             Q 140 46, 136 58
             Q 140 72, 132 82
             Q 120 95, 100 96
             Q 80 95, 68 82
             Q 60 72, 65 58 Z"
          fill="#A0917E"
          stroke="#7A6C5C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* White face patch */}
        <path
          d="M 85 72 Q 90 65, 100 64 Q 110 65, 115 72 Q 118 82, 108 90 Q 100 93, 92 90 Q 82 82, 85 72 Z"
          fill="#C8BAA8"
          stroke="none"
          opacity="0.5"
        />

        {/* Eyes - beady and bright */}
        <g className="rat-eye-l">
          <ellipse cx="82" cy="60" rx="7" ry="7.5" fill="white" stroke="#7A6C5C" strokeWidth="1.5" />
          <ellipse cx="84" cy="59.5" rx="3.5" ry="4" fill="#2D1B00" />
          <ellipse cx="85.5" cy="57.5" rx="1.5" ry="1.5" fill="white" />
        </g>
        <g className="rat-eye-r">
          <ellipse cx="118" cy="60" rx="7" ry="7.5" fill="white" stroke="#7A6C5C" strokeWidth="1.5" />
          <ellipse cx="120" cy="59.5" rx="3.5" ry="4" fill="#2D1B00" />
          <ellipse cx="121.5" cy="57.5" rx="1.5" ry="1.5" fill="white" />
        </g>

        {/* Nose */}
        <g className="rat-nose">
          <ellipse cx="100" cy="80" rx="5" ry="4" fill="#F07088" stroke="#D05868" strokeWidth="1.2" />
          <ellipse cx="101" cy="79" rx="1.5" ry="1" fill="white" opacity="0.5" />
        </g>

        {/* Mouth */}
        <path d="M 100 84 Q 95 89, 90 87" fill="none" stroke="#7A6C5C" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 100 84 Q 105 89, 110 87" fill="none" stroke="#7A6C5C" strokeWidth="1.3" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="90" y1="80" x2="55" y2="72" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />
        <line x1="90" y1="82" x2="52" y2="82" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />
        <line x1="90" y1="84" x2="55" y2="92" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />
        <line x1="110" y1="80" x2="145" y2="72" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />
        <line x1="110" y1="82" x2="148" y2="82" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />
        <line x1="110" y1="84" x2="145" y2="92" stroke="#7A6C5C" strokeWidth="1" strokeLinecap="round" />

        {/* Front teeth */}
        <path d="M 96 87 L 96 93 L 100 93 L 100 87" fill="white" stroke="#7A6C5C" strokeWidth="1" />
        <path d="M 100 87 L 100 93 L 104 93 L 104 87" fill="white" stroke="#7A6C5C" strokeWidth="1" />

        {/* Cheek blush */}
        <ellipse cx="72" cy="75" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.35" />
        <ellipse cx="128" cy="75" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.35" />
      </g>
    </svg>
  );
}
