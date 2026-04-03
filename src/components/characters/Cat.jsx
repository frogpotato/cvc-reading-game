export default function Cat({ size = 200 }) {
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
        @keyframes catBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-1.5px); }
        }
        @keyframes catBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.08); }
        }
        @keyframes catTailSwish {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(15deg); }
          60% { transform: rotate(-12deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes catWhiskerTwitch {
          0%, 88%, 100% { transform: rotate(0deg); }
          91% { transform: rotate(3deg); }
          94% { transform: rotate(-2deg); }
        }
        .cat-body { animation: catBreathe 3.2s ease-in-out infinite; transform-origin: 100px 130px; }
        .cat-eye-l { animation: catBlink 4.5s ease-in-out infinite; transform-origin: 82px 72px; }
        .cat-eye-r { animation: catBlink 4.5s ease-in-out infinite; transform-origin: 118px 72px; }
        .cat-tail { animation: catTailSwish 2.8s ease-in-out infinite; transform-origin: 55px 145px; }
        .cat-whiskers-l { animation: catWhiskerTwitch 5s ease-in-out infinite; transform-origin: 90px 88px; }
        .cat-whiskers-r { animation: catWhiskerTwitch 5s ease-in-out infinite 0.15s; transform-origin: 110px 88px; }
      `}</style>

      {/* Tail */}
      <g className="cat-tail">
        <path
          d="M 58 148 Q 30 140, 18 115 Q 12 95, 22 78 Q 30 68, 38 72"
          fill="none"
          stroke="#D4782A"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 58 148 Q 30 140, 18 115 Q 12 95, 22 78 Q 30 68, 38 72"
          fill="none"
          stroke="#E8943A"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Tabby stripes on tail */}
        <path d="M 38 100 Q 32 95, 28 100" fill="none" stroke="#B86218" strokeWidth="2" strokeLinecap="round" />
        <path d="M 30 115 Q 24 110, 22 116" fill="none" stroke="#B86218" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Back legs */}
      <g>
        <path
          d="M 78 158 L 72 180 L 65 188"
          fill="none" stroke="#D4782A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        />
        <ellipse cx="67" cy="190" rx="8" ry="4" fill="#E8943A" stroke="#D4782A" strokeWidth="1.5" />
        <path
          d="M 122 158 L 128 180 L 135 188"
          fill="none" stroke="#D4782A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        />
        <ellipse cx="133" cy="190" rx="8" ry="4" fill="#E8943A" stroke="#D4782A" strokeWidth="1.5" />
      </g>

      {/* Body */}
      <g className="cat-body">
        <path
          d="M 60 130
             Q 55 110, 68 100
             Q 85 90, 115 90
             Q 145 92, 150 112
             Q 155 135, 145 155
             Q 132 168, 100 170
             Q 68 168, 58 152
             Q 54 142, 60 130 Z"
          fill="#E8943A"
          stroke="#D4782A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly white patch */}
        <path
          d="M 82 128 Q 88 118, 108 117 Q 128 118, 130 130 Q 132 145, 115 152 Q 95 155, 84 144 Z"
          fill="#FBE8CC"
          stroke="none"
          opacity="0.7"
        />
        {/* Tabby stripes on body */}
        <path d="M 80 105 Q 90 100, 95 108" fill="none" stroke="#C06A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 90 100 Q 100 95, 108 102" fill="none" stroke="#C06A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M 105 98 Q 115 93, 122 100" fill="none" stroke="#C06A1A" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Head */}
      <g>
        {/* Left ear */}
        <path
          d="M 72 52 L 62 22 L 88 42 Z"
          fill="#E8943A"
          stroke="#D4782A"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M 72 48 L 66 30 L 82 43" fill="#F0A8A8" stroke="none" opacity="0.5" />

        {/* Right ear */}
        <path
          d="M 128 52 L 138 22 L 112 42 Z"
          fill="#E8943A"
          stroke="#D4782A"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M 128 48 L 134 30 L 118 43" fill="#F0A8A8" stroke="none" opacity="0.5" />

        {/* Head shape */}
        <path
          d="M 65 60
             Q 62 48, 72 42
             Q 85 36, 100 36
             Q 115 36, 128 42
             Q 138 48, 136 60
             Q 138 78, 128 88
             Q 115 98, 100 98
             Q 85 98, 72 88
             Q 62 78, 65 60 Z"
          fill="#E8943A"
          stroke="#D4782A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Forehead M marking */}
        <path d="M 80 50 Q 85 44, 92 50 Q 97 44, 100 50 Q 103 44, 108 50 Q 113 44, 120 50" fill="none" stroke="#C06A1A" strokeWidth="1.8" strokeLinecap="round" />

        {/* White muzzle area */}
        <path
          d="M 85 76 Q 88 70, 100 68 Q 112 70, 115 76 Q 118 86, 108 92 Q 100 95, 92 92 Q 82 86, 85 76 Z"
          fill="#FBE8CC"
          stroke="none"
          opacity="0.8"
        />

        {/* Eyes */}
        <g className="cat-eye-l">
          <ellipse cx="82" cy="62" rx="8" ry="8.5" fill="white" stroke="#D4782A" strokeWidth="1.5" />
          <ellipse cx="84" cy="61.5" rx="4" ry="5" fill="#4A8C3A" />
          <ellipse cx="84" cy="61.5" rx="2" ry="3.5" fill="#2D1B00" />
          <ellipse cx="85.5" cy="59" rx="1.5" ry="1.5" fill="white" />
        </g>
        <g className="cat-eye-r">
          <ellipse cx="118" cy="62" rx="8" ry="8.5" fill="white" stroke="#D4782A" strokeWidth="1.5" />
          <ellipse cx="120" cy="61.5" rx="4" ry="5" fill="#4A8C3A" />
          <ellipse cx="120" cy="61.5" rx="2" ry="3.5" fill="#2D1B00" />
          <ellipse cx="121.5" cy="59" rx="1.5" ry="1.5" fill="white" />
        </g>

        {/* Nose */}
        <path
          d="M 97 80 L 100 84 L 103 80 Z"
          fill="#F07088"
          stroke="#D05868"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Mouth */}
        <path d="M 100 84 Q 96 90, 92 88" fill="none" stroke="#D4782A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 100 84 Q 104 90, 108 88" fill="none" stroke="#D4782A" strokeWidth="1.5" strokeLinecap="round" />

        {/* Whiskers */}
        <g className="cat-whiskers-l">
          <line x1="88" y1="82" x2="55" y2="76" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="88" y1="85" x2="52" y2="84" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="88" y1="88" x2="55" y2="92" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <g className="cat-whiskers-r">
          <line x1="112" y1="82" x2="145" y2="76" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="112" y1="85" x2="148" y2="84" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="112" y1="88" x2="145" y2="92" stroke="#D4782A" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Cheek blush */}
        <ellipse cx="72" cy="78" rx="6" ry="4" fill="#F0A0A0" opacity="0.4" />
        <ellipse cx="128" cy="78" rx="6" ry="4" fill="#F0A0A0" opacity="0.4" />
      </g>
    </svg>
  );
}
