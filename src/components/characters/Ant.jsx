export default function Ant({ size = 200 }) {
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
        @keyframes antBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes antBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }
        @keyframes antAntennaeBob {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-6deg); }
          75% { transform: rotate(6deg); }
        }
        @keyframes antAntennaeBobR {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          75% { transform: rotate(-6deg); }
        }
        @keyframes antLegWiggle {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(3deg); }
          70% { transform: rotate(-3deg); }
        }
        @keyframes antLegWiggleAlt {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-3deg); }
          70% { transform: rotate(3deg); }
        }
        .ant-body { animation: antBreathe 3s ease-in-out infinite; transform-origin: 100px 130px; }
        .ant-eye-l { animation: antBlink 4s ease-in-out infinite; transform-origin: 86px 58px; }
        .ant-eye-r { animation: antBlink 4s ease-in-out infinite; transform-origin: 114px 58px; }
        .ant-antenna-l { animation: antAntennaeBob 2s ease-in-out infinite; transform-origin: 85px 38px; }
        .ant-antenna-r { animation: antAntennaeBobR 2s ease-in-out infinite; transform-origin: 115px 38px; }
        .ant-legs-l { animation: antLegWiggle 1.5s ease-in-out infinite; transform-origin: 78px 130px; }
        .ant-legs-r { animation: antLegWiggleAlt 1.5s ease-in-out infinite; transform-origin: 122px 130px; }
      `}</style>

      {/* Antennae */}
      <g className="ant-antenna-l">
        <path
          d="M 88 42 Q 78 22, 65 12"
          fill="none"
          stroke="#3D2818"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="65" cy="12" r="4" fill="#5C4030" stroke="#3D2818" strokeWidth="1.5" />
      </g>
      <g className="ant-antenna-r">
        <path
          d="M 112 42 Q 122 22, 135 12"
          fill="none"
          stroke="#3D2818"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="135" cy="12" r="4" fill="#5C4030" stroke="#3D2818" strokeWidth="1.5" />
      </g>

      {/* Legs - 6 total */}
      <g className="ant-legs-l">
        {/* Front left */}
        <path d="M 80 112 Q 58 105, 42 112 Q 35 116, 30 125" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Middle left */}
        <path d="M 78 128 Q 55 128, 38 135 Q 30 140, 25 148" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Back left */}
        <path d="M 80 145 Q 60 150, 45 160 Q 38 168, 35 175" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="ant-legs-r">
        {/* Front right */}
        <path d="M 120 112 Q 142 105, 158 112 Q 165 116, 170 125" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Middle right */}
        <path d="M 122 128 Q 145 128, 162 135 Q 170 140, 175 148" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Back right */}
        <path d="M 120 145 Q 140 150, 155 160 Q 162 168, 165 175" fill="none" stroke="#3D2818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Body segments */}
      <g className="ant-body">
        {/* Abdomen (back segment) - largest */}
        <ellipse cx="100" cy="158" rx="28" ry="22" fill="#5C4030" stroke="#3D2818" strokeWidth="2.5" />
        <ellipse cx="100" cy="155" rx="18" ry="12" fill="#6E5040" stroke="none" opacity="0.4" />

        {/* Thorax (middle segment) */}
        <ellipse cx="100" cy="125" rx="22" ry="18" fill="#5C4030" stroke="#3D2818" strokeWidth="2.5" />
        <ellipse cx="100" cy="123" rx="14" ry="10" fill="#6E5040" stroke="none" opacity="0.4" />

        {/* Narrow connection */}
        <ellipse cx="100" cy="140" rx="8" ry="5" fill="#5C4030" stroke="#3D2818" strokeWidth="1.5" />
      </g>

      {/* Head */}
      <g>
        {/* Neck */}
        <ellipse cx="100" cy="100" rx="8" ry="5" fill="#5C4030" stroke="#3D2818" strokeWidth="1.5" />

        {/* Head shape */}
        <path
          d="M 75 58
             Q 72 42, 82 35
             Q 92 28, 100 28
             Q 108 28, 118 35
             Q 128 42, 125 58
             Q 128 72, 118 82
             Q 110 90, 100 92
             Q 90 90, 82 82
             Q 72 72, 75 58 Z"
          fill="#5C4030"
          stroke="#3D2818"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Head highlight */}
        <ellipse cx="100" cy="55" rx="16" ry="14" fill="#6E5040" stroke="none" opacity="0.35" />

        {/* Eyes - big friendly */}
        <g className="ant-eye-l">
          <ellipse cx="86" cy="55" rx="9" ry="10" fill="white" stroke="#3D2818" strokeWidth="1.5" />
          <ellipse cx="88" cy="54" rx="5" ry="5.5" fill="#2D1B00" />
          <ellipse cx="89.5" cy="52" rx="2" ry="2" fill="white" />
        </g>
        <g className="ant-eye-r">
          <ellipse cx="114" cy="55" rx="9" ry="10" fill="white" stroke="#3D2818" strokeWidth="1.5" />
          <ellipse cx="116" cy="54" rx="5" ry="5.5" fill="#2D1B00" />
          <ellipse cx="117.5" cy="52" rx="2" ry="2" fill="white" />
        </g>

        {/* Mouth - friendly smile */}
        <path d="M 92 76 Q 100 82, 108 76" fill="none" stroke="#3D2818" strokeWidth="1.8" strokeLinecap="round" />

        {/* Mandibles (small, cute) */}
        <path d="M 94 82 Q 90 88, 86 86" fill="none" stroke="#3D2818" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 106 82 Q 110 88, 114 86" fill="none" stroke="#3D2818" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="76" cy="68" rx="5" ry="3.5" fill="#D08060" opacity="0.4" />
        <ellipse cx="124" cy="68" rx="5" ry="3.5" fill="#D08060" opacity="0.4" />
      </g>
    </svg>
  );
}
