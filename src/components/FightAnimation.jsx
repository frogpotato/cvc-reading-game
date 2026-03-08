import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      color: ['#f59e0b', '#14b8a6', '#8b5cf6', '#f43f5e', '#3b82f6', '#22c55e'][
        Math.floor(Math.random() * 6)
      ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: p.rotation + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

function Fire() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 20 + i * 8,
            height: 30 + i * 10,
            background: `radial-gradient(ellipse, ${i < 2 ? '#fbbf24' : i < 4 ? '#f97316' : '#ef4444'}, transparent)`,
            left: -10 - i * 4 + Math.random() * 20,
            top: -15 - i * 5,
          }}
          animate={{
            y: [0, -20 - i * 10, -40 - i * 10],
            x: [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40],
            opacity: [0.8, 1, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 0.6 + i * 0.1,
            repeat: 3,
            repeatType: 'loop',
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

export default function FightAnimation({ onComplete, theme }) {
  const leftEmoji = theme?.left || '\uD83D\uDC09';
  const rightEmoji = theme?.right || '\uD83E\uDDDD';
  const [phase, setPhase] = useState('fight'); // 'fight' | 'victory'

  useEffect(() => {
    const fightTimer = setTimeout(() => setPhase('victory'), 2000);
    const completeTimer = setTimeout(() => onComplete(), 5000);
    return () => {
      clearTimeout(fightTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

        {phase === 'fight' && (
          <>
            <motion.div
              className="text-9xl z-50"
              initial={{ x: '-50vw' }}
              animate={{ x: '-5vw' }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
              {leftEmoji}
            </motion.div>

            <Fire />

            <motion.div
              className="text-9xl z-50"
              initial={{ x: '50vw' }}
              animate={{ x: '5vw' }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
              {rightEmoji}
            </motion.div>
          </>
        )}

        {phase === 'victory' && (
          <>
            <Confetti />

            <motion.div
              className="text-9xl z-50"
              initial={{ x: '-5vw' }}
              animate={{ x: '-25vw', y: [0, -30, 0], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.8, y: { repeat: 2, duration: 0.4 } }}
            >
              {leftEmoji}
            </motion.div>

            <motion.div
              className="text-6xl z-50"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: 1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              \u2B50
            </motion.div>

            <motion.div
              className="text-9xl z-50"
              initial={{ x: '5vw' }}
              animate={{ x: '25vw', y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, y: { repeat: 2, duration: 0.4 } }}
            >
              {rightEmoji}
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
