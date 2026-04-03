export default function Nan({ size = 200 }) {
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
        @keyframes nanBreathe {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes nanBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }
        @keyframes nanSway {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(1.5deg); }
          70% { transform: rotate(-1.5deg); }
        }
        @keyframes nanGlassesGlint {
          0%, 85%, 100% { opacity: 0; }
          90% { opacity: 0.6; }
        }
        .nan-body { animation: nanBreathe 3.5s ease-in-out infinite; transform-origin: 100px 135px; }
        .nan-eye-l { animation: nanBlink 5s ease-in-out infinite; transform-origin: 84px 62px; }
        .nan-eye-r { animation: nanBlink 5s ease-in-out infinite; transform-origin: 116px 62px; }
        .nan-whole { animation: nanSway 4s ease-in-out infinite; transform-origin: 100px 190px; }
        .nan-glasses-glint { animation: nanGlassesGlint 6s ease-in-out infinite; }
      `}</style>

      <g className="nan-whole">
        {/* Legs / shoes */}
        <g>
          <path d="M 88 172 L 85 188" fill="none" stroke="#7A6050" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 112 172 L 115 188" fill="none" stroke="#7A6050" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="83" cy="192" rx="8" ry="4.5" fill="#6A5040" stroke="#503828" strokeWidth="1.5" />
          <ellipse cx="117" cy="192" rx="8" ry="4.5" fill="#6A5040" stroke="#503828" strokeWidth="1.5" />
        </g>

        {/* Body / dress */}
        <g className="nan-body">
          <path
            d="M 65 105
               Q 58 95, 70 86
               Q 85 78, 100 78
               Q 115 78, 130 86
               Q 142 95, 135 105
               Q 142 130, 135 152
               Q 128 170, 100 175
               Q 72 170, 65 152
               Q 58 130, 65 105 Z"
            fill="#8B6090"
            stroke="#6A4870"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Cardigan / collar */}
          <path
            d="M 85 86 Q 92 95, 100 92 Q 108 95, 115 86"
            fill="none"
            stroke="#6A4870"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Cardigan line down center */}
          <path d="M 100 92 L 100 170" fill="none" stroke="#6A4870" strokeWidth="1.2" strokeLinecap="round" />
          {/* Flower brooch */}
          <circle cx="92" cy="95" r="3.5" fill="#E8A0B0" stroke="#D08090" strokeWidth="1" />
          <circle cx="92" cy="95" r="1.5" fill="#F0D060" />

          {/* Arms */}
          <path
            d="M 65 105 Q 52 115, 48 130 Q 46 140, 52 145"
            fill="none"
            stroke="#8B6090"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 65 105 Q 52 115, 48 130 Q 46 140, 52 145"
            fill="none"
            stroke="#6A4870"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="52" cy="146" r="5" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />

          <path
            d="M 135 105 Q 148 115, 152 130 Q 154 140, 148 145"
            fill="none"
            stroke="#8B6090"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 135 105 Q 148 115, 152 130 Q 154 140, 148 145"
            fill="none"
            stroke="#6A4870"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="148" cy="146" r="5" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />
        </g>

        {/* Head */}
        <g>
          {/* Hair - grey, in a bun */}
          <path
            d="M 68 48
               Q 62 30, 78 20
               Q 92 12, 100 12
               Q 108 12, 122 20
               Q 138 30, 132 48"
            fill="#B0A8A0"
            stroke="#8A8280"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Bun on top */}
          <ellipse cx="100" cy="14" rx="14" ry="10" fill="#B0A8A0" stroke="#8A8280" strokeWidth="2" />
          <path d="M 92 10 Q 100 5, 108 10" fill="none" stroke="#9A9290" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 90 14 Q 100 8, 110 14" fill="none" stroke="#9A9290" strokeWidth="1.2" strokeLinecap="round" />

          {/* Hair texture lines */}
          <path d="M 72 38 Q 78 30, 85 35" fill="none" stroke="#9A9290" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 115 35 Q 122 30, 128 38" fill="none" stroke="#9A9290" strokeWidth="1.2" strokeLinecap="round" />

          {/* Face shape - rounder, softer */}
          <path
            d="M 70 52
               Q 68 40, 78 34
               Q 90 28, 100 28
               Q 110 28, 122 34
               Q 132 40, 130 52
               Q 134 68, 126 80
               Q 118 90, 100 92
               Q 82 90, 74 80
               Q 66 68, 70 52 Z"
            fill="#F5C8A0"
            stroke="#D4A878"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Ears */}
          <ellipse cx="68" cy="62" rx="4.5" ry="6" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />
          <ellipse cx="132" cy="62" rx="4.5" ry="6" fill="#F5C8A0" stroke="#D4A878" strokeWidth="1.5" />

          {/* Glasses */}
          <g>
            {/* Left lens */}
            <ellipse cx="84" cy="58" rx="12" ry="10" fill="none" stroke="#6A5040" strokeWidth="2" />
            {/* Right lens */}
            <ellipse cx="116" cy="58" rx="12" ry="10" fill="none" stroke="#6A5040" strokeWidth="2" />
            {/* Bridge */}
            <path d="M 96 58 Q 100 54, 104 58" fill="none" stroke="#6A5040" strokeWidth="2" strokeLinecap="round" />
            {/* Arms of glasses */}
            <path d="M 72 56 L 68 58" fill="none" stroke="#6A5040" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 128 56 L 132 58" fill="none" stroke="#6A5040" strokeWidth="1.8" strokeLinecap="round" />
            {/* Glint on lens */}
            <ellipse className="nan-glasses-glint" cx="80" cy="54" rx="3" ry="2" fill="white" opacity="0" />
          </g>

          {/* Eyes behind glasses */}
          <g className="nan-eye-l">
            <ellipse cx="84" cy="58" rx="5.5" ry="6" fill="white" stroke="#D4A878" strokeWidth="1" />
            <ellipse cx="85.5" cy="57.5" rx="3" ry="3.5" fill="#5A8050" />
            <ellipse cx="85.5" cy="57.5" rx="1.5" ry="2" fill="#2D1B00" />
            <ellipse cx="86.5" cy="56" rx="1.2" ry="1.2" fill="white" />
          </g>
          <g className="nan-eye-r">
            <ellipse cx="116" cy="58" rx="5.5" ry="6" fill="white" stroke="#D4A878" strokeWidth="1" />
            <ellipse cx="117.5" cy="57.5" rx="3" ry="3.5" fill="#5A8050" />
            <ellipse cx="117.5" cy="57.5" rx="1.5" ry="2" fill="#2D1B00" />
            <ellipse cx="118.5" cy="56" rx="1.2" ry="1.2" fill="white" />
          </g>

          {/* Eyebrows - gentle, thin */}
          <path d="M 76 48 Q 82 44, 90 46" fill="none" stroke="#9A9290" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 124 48 Q 118 44, 110 46" fill="none" stroke="#9A9290" strokeWidth="1.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 100 66 Q 97 72, 100 74 Q 103 72, 100 66" fill="#D4A878" stroke="none" />

          {/* Warm smile */}
          <path d="M 88 78 Q 100 88, 112 78" fill="none" stroke="#D4A878" strokeWidth="2" strokeLinecap="round" />
          {/* Smile lines */}
          <path d="M 86 76 Q 84 80, 86 82" fill="none" stroke="#D4A878" strokeWidth="1" strokeLinecap="round" />
          <path d="M 114 76 Q 116 80, 114 82" fill="none" stroke="#D4A878" strokeWidth="1" strokeLinecap="round" />

          {/* Cheek blush - warm and rosy */}
          <ellipse cx="75" cy="72" rx="6" ry="4" fill="#F0A0A0" opacity="0.5" />
          <ellipse cx="125" cy="72" rx="6" ry="4" fill="#F0A0A0" opacity="0.5" />

          {/* Gentle wrinkle lines */}
          <path d="M 78 68 Q 76 70, 78 72" fill="none" stroke="#D4A878" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          <path d="M 122 68 Q 124 70, 122 72" fill="none" stroke="#D4A878" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}
