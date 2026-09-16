export type Theme = 'light' | 'dark';

// Matches the web app's indigo brand color (Tailwind's indigo-600) and its
// slate light/dark palettes, so the app looks consistent with the website.
export const lightColors = {
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  danger: '#e11d48',
  success: '#059669',
};

export const darkColors = {
  primary: '#6366f1',
  primaryDark: '#818cf8',
  background: '#020617',
  surface: '#0f172a',
  border: '#1e293b',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  danger: '#fb7185',
  success: '#34d399',
};

export type ThemeColors = typeof lightColors;

export const getColors = (theme: Theme): ThemeColors => (theme === 'dark' ? darkColors : lightColors);
