export default function Fox({ size = 200 }) {
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
        @keyframes foxBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.03) translateY(-1.5px); }
        }
        @keyframes foxBlink {
          0%, 91%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        @keyframes foxTailSwish {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(10deg); }
          50% { transform: rotate(-8deg); }
          80% { transform: rotate(5deg); }
        }
        @keyframes foxEarTwitch {
          0%, 85%, 100% { transform: rotate(0deg); }
          88% { transform: rotate(-8deg); }
          91% { transform: rotate(4deg); }
          94% { transform: rotate(-2deg); }
        }
        .fox-body { animation: foxBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .fox-eye-l { animation: foxBlink 4.2s ease-in-out infinite; transform-origin: 84px 68px; }
        .fox-eye-r { animation: foxBlink 4.2s ease-in-out infinite; transform-origin: 116px 68px; }
        .fox-tail { animation: foxTailSwish 3s ease-in-out infinite; transform-origin: 50px 140px; }
        .fox-ear-l { animation: foxEarTwitch 5s ease-in-out infinite; transform-origin: 72px 50px; }
        .fox-ear-r { animation: foxEarTwitch 5s ease-in-out infinite 0.25s; transform-origin: 128px 50px; }
      `}</style>

      {/* Bushy tail */}
      <g className="fox-tail">
        <path
          d="M 52 142 Q 25 130, 12 108 Q 5 90, 12 72 Q 18 58, 30 60 Q 22 68, 20 82 Q 18 100, 35 118 Q 45 128, 52 135 Z"
          fill="#E86830"
          stroke="#B84820"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* White tail tip */}
        <path
          d="M 12 72 Q 18 58, 30 60 Q 22 68, 20 80 Q 15 72, 12 72 Z"
          fill="#FFF8F0"
          stroke="#B84820"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Legs */}
      <g>
        <path d="M 80 165 L 75 182" fill="none" stroke="#2D1B00" strokeWidth="3" strokeLinecap="round" />
        <path d="M 120 165 L 125 182" fill="none" stroke="#2D1B00" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="75" cy="186" rx="7" ry="4.5" fill="#2D1B00" stroke="#1A1000" strokeWidth="1.2" />
        <ellipse cx="125" cy="186" rx="7" ry="4.5" fill="#2D1B00" stroke="#1A1000" strokeWidth="1.2" />
      </g>

      {/* Body */}
      <g className="fox-body">
        <path
          d="M 58 125
             Q 55 105, 70 95
             Q 88 85, 112 86
             Q 140 88, 148 108
             Q 155 130, 145 150
             Q 132 168, 100 170
             Q 68 167, 58 150
             Q 52 140, 58 125 Z"
          fill="#E86830"
          stroke="#B84820"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* White chest */}
        <path
          d="M 80 110 Q 90 100, 100 98 Q 110 100, 120 110 Q 128 125, 122 142 Q 112 158, 100 160 Q 88 158, 78 142 Q 72 125, 80 110 Z"
          fill="#FFF8F0"
          stroke="none"
          opacity="0.85"
        />
      </g>

      {/* Head */}
      <g>
        {/* Left ear */}
        <g className="fox-ear-l">
          <path
            d="M 72 55 L 58 18 L 88 45 Z"
            fill="#E86830"
            stroke="#B84820"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 74 50 L 64 26 L 84 44" fill="#2D1B00" stroke="none" opacity="0.8" />
        </g>

        {/* Right ear */}
        <g className="fox-ear-r">
          <path
            d="M 128 55 L 142 18 L 112 45 Z"
            fill="#E86830"
            stroke="#B84820"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 126 50 L 136 26 L 116 44" fill="#2D1B00" stroke="none" opacity="0.8" />
        </g>

        {/* Head shape - fox pointed */}
        <path
          d="M 65 58
             Q 60 45, 72 38
             Q 85 32, 100 32
             Q 115 32, 128 38
             Q 140 45, 135 58
             Q 140 72, 130 84
             Q 118 96, 100 98
             Q 82 96, 70 84
             Q 60 72, 65 58 Z"
          fill="#E86830"
          stroke="#B84820"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* White face markings */}
        <path
          d="M 82 68 Q 88 58, 100 55 Q 112 58, 118 68 Q 122 80, 115 90 Q 108 98, 100 98 Q 92 98, 85 90 Q 78 80, 82 68 Z"
          fill="#FFF8F0"
          stroke="none"
          opacity="0.9"
        />

        {/* Eyes - sly/clever look */}
        <g className="fox-eye-l">
          <path
            d="M 78 62 Q 84 56, 92 60 Q 92 68, 84 70 Q 78 68, 78 62 Z"
            fill="white"
            stroke="#B84820"
            strokeWidth="1.5"
          />
          <ellipse cx="85" cy="64" rx="3" ry="3.5" fill="#D48C20" />
          <ellipse cx="85" cy="64" rx="1.8" ry="2.5" fill="#2D1B00" />
          <ellipse cx="86.5" cy="62" rx="1.2" ry="1.2" fill="white" />
        </g>
        <g className="fox-eye-r">
          <path
            d="M 122 62 Q 116 56, 108 60 Q 108 68, 116 70 Q 122 68, 122 62 Z"
            fill="white"
            stroke="#B84820"
            strokeWidth="1.5"
          />
          <ellipse cx="115" cy="64" rx="3" ry="3.5" fill="#D48C20" />
          <ellipse cx="115" cy="64" rx="1.8" ry="2.5" fill="#2D1B00" />
          <ellipse cx="116.5" cy="62" rx="1.2" ry="1.2" fill="white" />
        </g>

        {/* Nose */}
        <ellipse cx="100" cy="82" rx="5" ry="3.5" fill="#2D1B00" stroke="#1A1000" strokeWidth="1" />
        <ellipse cx="101.5" cy="81" rx="1.5" ry="1" fill="white" opacity="0.4" />

        {/* Mouth - sly smirk */}
        <path d="M 100 85.5 Q 95 90, 90 88" fill="none" stroke="#B84820" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 100 85.5 Q 108 92, 114 89" fill="none" stroke="#B84820" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="75" cy="76" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.4" />
        <ellipse cx="125" cy="76" rx="5" ry="3.5" fill="#F0A0A0" opacity="0.4" />
      </g>
    </svg>
  );
}
