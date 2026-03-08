import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Bubble({ bubble, state, onDrop, dropZoneRefs, style }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const controls = useAnimation();
  const bubbleRef = useRef(null);
  const draggingRef = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const lastDelta = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsWrong(false);
    setIsDragging(false);
    draggingRef.current = false;
    controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
  }, [bubble.id, controls]);

  const checkDropZone = useCallback((clientX, clientY) => {
    for (const [target, el] of Object.entries(dropZoneRefs || {})) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const padding = 40;
      if (
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding
      ) {
        return target;
      }
    }
    return null;
  }, [dropZoneRefs]);

  const handlePointerDown = useCallback((e) => {
    if (state !== 'active') return;
    e.preventDefault();
    e.stopPropagation();

    const el = bubbleRef.current;
    if (!el) return;

    el.setPointerCapture(e.pointerId);
    startPointer.current = { x: e.clientX, y: e.clientY };
    lastDelta.current = { x: 0, y: 0 };
    draggingRef.current = true;
    setIsDragging(true);
    controls.set({ scale: 1.1 });
  }, [state, controls]);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current || state !== 'active') return;
    e.preventDefault();

    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    lastDelta.current = { x: dx, y: dy };
    controls.set({ x: dx, y: dy, scale: 1.1 });
  }, [state, controls]);

  const handlePointerUp = useCallback((e) => {
    if (!draggingRef.current || state !== 'active') return;
    e.preventDefault();

    draggingRef.current = false;
    setIsDragging(false);

    const target = checkDropZone(e.clientX, e.clientY);

    if (target) {
      const result = onDrop(bubble.id, target);
      if (result === 'correct') {
        controls.start({ scale: 0, opacity: 0, transition: { duration: 0.3 } });
        return;
      }
      if (result === 'wrong') {
        setIsWrong(true);
        const cx = lastDelta.current.x;
        controls.start({
          x: [cx, cx + 12, cx - 12, cx + 8, cx - 8, 0],
          y: [lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, lastDelta.current.y, 0],
          scale: 1,
          transition: { duration: 0.6, ease: 'easeOut' },
        }).then(() => {
          setIsWrong(false);
          lastDelta.current = { x: 0, y: 0 };
        });
        return;
      }
    }

    // No drop target — return home
    controls.start({
      x: 0,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    });
    lastDelta.current = { x: 0, y: 0 };
  }, [state, bubble.id, checkDropZone, onDrop, controls]);

  // Completed state: green circle with checkmark
  if (state === 'completed') {
    return (
      <div
        className="absolute flex items-center justify-center rounded-full bg-green-400 border-2 border-green-500 shadow-sm"
        style={{ width: 70, height: 70, ...style }}
      >
        <span className="text-3xl text-white font-bold select-none">✓</span>
      </div>
    );
  }

  // Future state: grey circle with faded word
  if (state === 'future') {
    return (
      <div
        className="absolute flex items-center justify-center rounded-full bg-gray-300/60 border-2 border-gray-400/40 shadow-sm"
        style={{ width: 70, height: 70, ...style }}
      >
        <span className="text-2xl font-extrabold text-gray-400/50 select-none">
          {bubble.word}
        </span>
      </div>
    );
  }

  // Active state: draggable with glow
  return (
    <motion.div
      ref={bubbleRef}
      animate={controls}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing z-20
        ${isWrong
          ? 'bg-red-400/80 border-red-500 border-3'
          : 'bg-indigo-200/70 border-indigo-300/80 border-2'
        }
        ${isDragging ? 'shadow-xl z-30' : 'shadow-md'}
      `}
      style={{
        width: 100,
        height: 100,
        ...style,
        touchAction: 'none',
        boxShadow: isDragging
          ? undefined
          : '0 0 20px 6px rgba(129, 140, 248, 0.5)',
        animation: !isDragging && !isWrong ? 'pulse-glow 2s ease-in-out infinite' : undefined,
      }}
    >
      <span className="text-5xl font-extrabold text-gray-800 select-none pointer-events-none">
        {bubble.word}
      </span>
    </motion.div>
  );
}
