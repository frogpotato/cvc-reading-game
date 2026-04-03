export default function Bat({ size = 200 }) {
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
        @keyframes batBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes batBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }
        @keyframes batWingFlap {
          0%, 100% { transform: rotate(0deg) scaleX(1); }
          25% { transform: rotate(-8deg) scaleX(0.92); }
          50% { transform: rotate(0deg) scaleX(1); }
          75% { transform: rotate(5deg) scaleX(1.03); }
        }
        @keyframes batWingFlapR {
          0%, 100% { transform: rotate(0deg) scaleX(1); }
          25% { transform: rotate(8deg) scaleX(0.92); }
          50% { transform: rotate(0deg) scaleX(1); }
          75% { transform: rotate(-5deg) scaleX(1.03); }
        }
        @keyframes batEarTwitch {
          0%, 88%, 100% { transform: rotate(0deg); }
          90% { transform: rotate(-5deg); }
          93% { transform: rotate(3deg); }
        }
        .bat-body { animation: batBreathe 3.5s ease-in-out infinite; transform-origin: 100px 120px; }
        .bat-eye-l { animation: batBlink 5s ease-in-out infinite; transform-origin: 86px 95px; }
        .bat-eye-r { animation: batBlink 5s ease-in-out infinite; transform-origin: 114px 95px; }
        .bat-wing-l { animation: batWingFlap 3s ease-in-out infinite; transform-origin: 72px 110px; }
        .bat-wing-r { animation: batWingFlapR 3s ease-in-out infinite; transform-origin: 128px 110px; }
        .bat-ear-l { animation: batEarTwitch 4.5s ease-in-out infinite; transform-origin: 78px 68px; }
        .bat-ear-r { animation: batEarTwitch 4.5s ease-in-out infinite 0.3s; transform-origin: 122px 68px; }
      `}</style>

      {/* Feet (little claws for standing) */}
      <g>
        <path d="M 85 172 L 80 185 M 85 172 L 85 186 M 85 172 L 90 185" fill="none" stroke="#4A3060" strokeWidth="2" strokeLinecap="round" />
        <path d="M 115 172 L 110 185 M 115 172 L 115 186 M 115 172 L 120 185" fill="none" stroke="#4A3060" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Wings */}
      <g className="bat-wing-l">
        <path
          d="M 72 108 Q 45 95, 18 100 Q 10 102, 15 112
             Q 8 108, 5 118 Q 3 125, 12 125
             Q 5 122, 8 132 Q 12 140, 22 135
             Q 35 145, 55 148 Q 65 148, 72 140 Z"
          fill="#7B5EA7"
          stroke="#4A3060"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Wing membrane lines */}
        <path d="M 72 112 Q 48 108, 18 115" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 72 120 Q 42 118, 12 125" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 72 130 Q 48 132, 22 135" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      <g className="bat-wing-r">
        <path
          d="M 128 108 Q 155 95, 182 100 Q 190 102, 185 112
             Q 192 108, 195 118 Q 197 125, 188 125
             Q 195 122, 192 132 Q 188 140, 178 135
             Q 165 145, 145 148 Q 135 148, 128 140 Z"
          fill="#7B5EA7"
          stroke="#4A3060"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M 128 112 Q 152 108, 182 115" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 128 120 Q 158 118, 188 125" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 128 130 Q 152 132, 178 135" fill="none" stroke="#5C4580" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Body */}
      <g className="bat-body">
        <path
          d="M 72 105
             Q 68 90, 80 82
             Q 92 76, 108 76
             Q 125 76, 132 85
             Q 140 95, 135 112
             Q 132 135, 122 152
             Q 112 168, 100 170
             Q 88 168, 78 152
             Q 68 135, 72 105 Z"
          fill="#8B6CB0"
          stroke="#4A3060"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Belly lighter */}
        <path
          d="M 84 115 Q 88 105, 100 104 Q 112 105, 116 115 Q 118 130, 110 145 Q 100 152, 90 145 Q 82 130, 84 115 Z"
          fill="#A888C8"
          stroke="none"
          opacity="0.5"
        />
      </g>

      {/* Head */}
      <g>
        {/* Left ear - big and pointy */}
        <g className="bat-ear-l">
          <path
            d="M 78 72 L 65 35 L 90 62 Z"
            fill="#8B6CB0"
            stroke="#4A3060"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 80 68 L 70 42 L 86 60" fill="#C8A8D8" stroke="none" opacity="0.4" />
        </g>

        {/* Right ear */}
        <g className="bat-ear-r">
          <path
            d="M 122 72 L 135 35 L 110 62 Z"
            fill="#8B6CB0"
            stroke="#4A3060"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 120 68 L 130 42 L 114 60" fill="#C8A8D8" stroke="none" opacity="0.4" />
        </g>

        {/* Head shape */}
        <path
          d="M 72 80
             Q 68 68, 78 62
             Q 90 55, 100 55
             Q 110 55, 122 62
             Q 132 68, 128 80
             Q 132 92, 125 100
             Q 115 108, 100 110
             Q 85 108, 75 100
             Q 68 92, 72 80 Z"
          fill="#8B6CB0"
          stroke="#4A3060"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Eyes - big and cute */}
        <g className="bat-eye-l">
          <ellipse cx="86" cy="82" rx="9" ry="10" fill="white" stroke="#4A3060" strokeWidth="1.5" />
          <ellipse cx="88" cy="81" rx="5" ry="5.5" fill="#2D1B00" />
          <ellipse cx="89.5" cy="79" rx="2" ry="2" fill="white" />
          <ellipse cx="86" cy="83" rx="1" ry="1" fill="white" opacity="0.5" />
        </g>
        <g className="bat-eye-r">
          <ellipse cx="114" cy="82" rx="9" ry="10" fill="white" stroke="#4A3060" strokeWidth="1.5" />
          <ellipse cx="116" cy="81" rx="5" ry="5.5" fill="#2D1B00" />
          <ellipse cx="117.5" cy="79" rx="2" ry="2" fill="white" />
          <ellipse cx="114" cy="83" rx="1" ry="1" fill="white" opacity="0.5" />
        </g>

        {/* Nose - little upturned */}
        <ellipse cx="100" cy="94" rx="3.5" ry="2.5" fill="#6A4880" stroke="#4A3060" strokeWidth="1" />
        <circle cx="98" cy="93.5" r="1" fill="#4A3060" />
        <circle cx="102" cy="93.5" r="1" fill="#4A3060" />

        {/* Mouth - cute fangs */}
        <path d="M 93 98 Q 100 103, 107 98" fill="none" stroke="#4A3060" strokeWidth="1.5" strokeLinecap="round" />
        {/* Little fangs */}
        <path d="M 95 98 L 94 102" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 105 98 L 106 102" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="74" cy="92" rx="5" ry="3.5" fill="#D088B0" opacity="0.4" />
        <ellipse cx="126" cy="92" rx="5" ry="3.5" fill="#D088B0" opacity="0.4" />
      </g>
    </svg>
  );
}
