/**
 * Theme tokens for light and dark mode.
 * Each key maps to a semantic color name used across all stylesheets.
 */

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceHigh: string;
  border: string;
  text: string;
  textSub: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  income: string;
  incomeLight: string;
  expense: string;
  expenseLight: string;
  balanceCard: string;
  statusBar: 'light-content' | 'dark-content';
};

export const darkTheme: ThemeColors = {
  bg: '#0F172A',
  surface: '#1E293B',
  surfaceHigh: '#273548',
  border: '#334155',
  text: '#F1F5F9',
  textSub: '#94A3B8',
  textMuted: '#475569',
  accent: '#3B82F6',
  accentBg: 'rgba(59, 130, 246, 0.12)',
  income: '#10B981',
  incomeLight: 'rgba(16, 185, 129, 0.12)',
  expense: '#EF4444',
  expenseLight: 'rgba(239, 68, 68, 0.12)',
  balanceCard: '#1E3A5F',
  statusBar: 'light-content',
};

export const lightTheme: ThemeColors = {
  bg: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceHigh: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textSub: '#64748B',
  textMuted: '#94A3B8',
  accent: '#2563EB',
  accentBg: 'rgba(37, 99, 235, 0.08)',
  income: '#059669',
  incomeLight: 'rgba(5, 150, 105, 0.10)',
  expense: '#DC2626',
  expenseLight: 'rgba(220, 38, 38, 0.10)',
  balanceCard: '#1E293B',
  statusBar: 'dark-content',
};
