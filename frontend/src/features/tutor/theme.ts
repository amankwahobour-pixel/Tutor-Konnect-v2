import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: {
    50: '#ECFBFE', 100: '#D2F4FC', 200: '#A9E8F8', 300: '#7AD9F2',
    400: '#48C9E9', 500: '#22C7F0', 600: '#0BA5D4', 700: '#0A7FA8',
    800: '#0E6286', 900: '#0F4F6B',
  },
  secondary: {
    50: '#F0FDFA', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4',
    400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E',
    800: '#115E59', 900: '#134E4A',
  },
  accent: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
    400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
    800: '#1E40AF', 900: '#1E3A8A',
  },
  success: {
    50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
    400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
    800: '#166534', 900: '#14532D',
  },
  warning: {
    50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
    400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
    800: '#92400E', 900: '#78350F',
  },
  error: {
    50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5',
    400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
    800: '#991B1B', 900: '#7F1D1D',
  },
  neutral: {
    0: '#FFFFFF', 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
    300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569',
    700: '#334155', 800: '#1E293B', 900: '#0F172A', 950: '#020617',
  },
};

export const tints = {
  primary: '#DBF4FF',
  secondary: '#CCFBF1',
  success: '#DCFCE7',
  warning: '#FEF3C7',
  orange: '#FFE9D5',
  error: '#FEE2E2',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24,
  '3xl': 32, '4xl': 40, '5xl': 48, '6xl': 64,
};

export const radii = {
  sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, pill: 999,
};

export const shadows: Record<string, ViewStyle> = {
  xs: { shadowColor: '#0F172A', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sm: { shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  md: { shadowColor: '#0F172A', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  lg: { shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  xl: { shadowColor: '#0F172A', shadowOpacity: 0.10, shadowRadius: 28, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
};

export const typography = {
  sizes: { display: 26, h1: 22, h2: 18, h3: 16, body: 14, caption: 13, micro: 12 },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  lineHeights: { display: 32, tight: 22, normal: 21 },
};

export const header = {
  expandedHeight: 230,
  collapsedHeight: 116,
  collapseDistance: 114,
  overlap: 40,
};
