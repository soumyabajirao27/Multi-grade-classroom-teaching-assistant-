import { useEffect, useState } from 'react';

/** useState persisted to localStorage (failures are ignored, e.g. private mode). */
export function usePersisted<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}

export function beep(): boolean {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return false;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    o.start();
    setTimeout(() => { o.stop(); void ctx.close(); }, 700);
    navigator.vibrate?.([200, 100, 200]);
    return true;
  } catch {
    return false;
  }
}

