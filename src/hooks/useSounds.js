import { useRef, useCallback } from 'react';

export default function useSounds() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Soft chime — C major triad (C5, E5, G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
    });
  }, [getCtx]);

  const playWrong = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Gentle low thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }, [getCtx]);

  const playFanfare = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Short celebratory fanfare — ascending arpeggio with harmonics
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.15 },   // E5
      { freq: 783.99, time: 0.3 },    // G5
      { freq: 1046.5, time: 0.45 },   // C6
      { freq: 1318.5, time: 0.7 },    // E6
      { freq: 1046.5, time: 0.95 },   // C6
      { freq: 1318.5, time: 1.1 },    // E6
      { freq: 1568.0, time: 1.3 },    // G6
    ];

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + 0.4);
    });
  }, [getCtx]);

  return { playCorrect, playWrong, playFanfare };
}
