export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Resolves the active theme given the user preference ('light' | 'dark' | 'auto')
 * and whether the system/browser prefers dark mode.
 */
export function resolveTheme(preference: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return systemPrefersDark ? 'dark' : 'light';
}

/**
 * Reads the current system dark mode preference from window.matchMedia if available.
 */
export function getSystemPrefersDark(): boolean {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}
