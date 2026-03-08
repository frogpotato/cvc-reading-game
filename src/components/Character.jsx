import { motion } from 'framer-motion';

const colorMap = {
  amber:  { bg: 'bg-amber-100',  border: 'border-amber-300',  dot: 'bg-amber-400'  },
  teal:   { bg: 'bg-teal-100',   border: 'border-teal-300',   dot: 'bg-teal-400'   },
  green:  { bg: 'bg-green-100',  border: 'border-green-300',  dot: 'bg-green-400'  },
  blue:   { bg: 'bg-blue-100',   border: 'border-blue-300',   dot: 'bg-blue-400'   },
  purple: { bg: 'bg-purple-100', border: 'border-purple-300', dot: 'bg-purple-400' },
  sky:    { bg: 'bg-sky-100',    border: 'border-sky-300',    dot: 'bg-sky-400'    },
  red:    { bg: 'bg-red-100',    border: 'border-red-300',    dot: 'bg-red-400'    },
  indigo: { bg: 'bg-indigo-100', border: 'border-indigo-300', dot: 'bg-indigo-400' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-300', dot: 'bg-orange-400' },
  cyan:   { bg: 'bg-cyan-100',   border: 'border-cyan-300',   dot: 'bg-cyan-400'   },
  pink:   { bg: 'bg-pink-100',   border: 'border-pink-300',   dot: 'bg-pink-400'   },
  violet: { bg: 'bg-violet-100', border: 'border-violet-300', dot: 'bg-violet-400' },
  lime:   { bg: 'bg-lime-100',   border: 'border-lime-300',   dot: 'bg-lime-400'   },
  slate:  { bg: 'bg-slate-100',  border: 'border-slate-300',  dot: 'bg-slate-400'  },
};

export default function Character({ type, word, collected, theme }) {
  const isLeft = type === 'dragon';
  const emoji = isLeft ? theme.left : theme.right;
  const colorKey = isLeft ? theme.leftColor : theme.rightColor;
  const colors = colorMap[colorKey];

  const dots = [];
  for (let i = 0; i < collected; i++) {
    dots.push(
      <motion.div
        key={i}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-5 h-5 rounded-full ${colors.dot} border-2 border-white shadow-sm`}
        style={{ marginLeft: i > 0 ? -6 : 0 }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full h-full relative">
      <div className={`${colors.bg} ${colors.border} border-3 rounded-2xl px-8 py-4 shadow-md`}>
        <span className="text-7xl font-extrabold text-gray-800 tracking-wide">
          {word}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <motion.div
          className={`absolute w-40 h-40 rounded-full border-4 border-dashed ${colors.border}`}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="text-8xl z-10 select-none"
          key={collected}
          animate={collected > 0 ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {emoji}
        </motion.div>
      </div>

      <div className="flex items-center justify-center h-8 mt-1">
        {dots}
      </div>
    </div>
  );
}
