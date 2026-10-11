import { useEffect, useState } from 'react';

/** useState persisted to localStorage (failures are ignored, e.g. private mode). */
export function usePersisted<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}

export function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx(); const o = ctx.createOscillator();
    o.connect(ctx.destination); o.frequency.value = 660; o.start();
    setTimeout(() => { o.stop(); void ctx.close(); }, 700);
    navigator.vibrate?.([200, 100, 200]);
  } catch { /* audio not available */ }
}
