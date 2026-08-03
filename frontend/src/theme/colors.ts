export const colors = {
  // Brand
  primary: '#22C7F0',
  primaryDark: '#1A9EC5',
  primaryLight: '#D9F9FF',
  secondary: '#6366F1',
  secondaryDark: '#4F46E5',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  error: '#EF4444',

  // Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#EFF6FF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textPrimary: '#0F172A',
  placeholder: '#94A3B8',

  // Borders and states
  border: '#CBD5E1',
  disabled: '#E2E8F0',
  primarySoft: '#D9F9FF',
  shadow: '#0F172A',

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.12)',
  overlayStrong: 'rgba(15, 23, 42, 0.18)',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
