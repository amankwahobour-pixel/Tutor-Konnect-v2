export interface ColorPalette {
  // Brand
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySofter: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Semantic
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  error: string;

  // Surfaces
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceElevated: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textPrimary: string;
  placeholder: string;

  // Borders and states
  border: string;
  borderStrong: string;
  disabled: string;
  primarySoft: string;
  shadow: string;

  // Overlays
  overlay: string;
  overlayStrong: string;
  black: string;
  white: string;
  transparent: string;
}

export const lightColors: ColorPalette = {
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
};

export const darkColors: ColorPalette = {
  // Brand — slightly brighter for dark contrast
  primary: '#3DD9FB',
  primaryDark: '#22C7F0',
  primaryLight: '#0D3B47',
  primarySofter: '#0A2D38',
  secondary: '#818CF8',
  secondaryDark: '#6366F1',
  secondaryLight: '#1E1B4B',

  // Semantic
  success: '#34D399',
  successLight: '#022C22',
  warning: '#FBBF24',
  warningLight: '#451A03',
  danger: '#F87171',
  dangerLight: '#450A0A',
  error: '#F87171',

  // Surfaces
  background: '#0B1120',
  surface: '#161E2E',
  surfaceVariant: '#1E293B',
  surfaceElevated: '#1E293B',

  // Text
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textPrimary: '#F1F5F9',
  placeholder: '#475569',

  // Borders and states
  border: '#334155',
  borderStrong: '#475569',
  disabled: '#1E293B',
  primarySoft: '#0D3B47',
  shadow: '#000000',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayStrong: 'rgba(0, 0, 0, 0.6)',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
};
