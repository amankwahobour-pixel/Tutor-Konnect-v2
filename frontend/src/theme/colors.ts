export const colors = {
  // Brand — TutorKonnect cyan
  primary: '#22C7F0',
  primaryDark: '#1A9EC5',
  primaryLight: '#D9F9FF',
  primarySofter: '#F0FBFF',
  secondary: '#6366F1',
  secondaryDark: '#4F46E5',
  secondaryLight: '#EEF2FF',

  // Semantic
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  error: '#EF4444',

  // Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textPrimary: '#0F172A',
  placeholder: '#94A3B8',

  // Borders and states
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
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
