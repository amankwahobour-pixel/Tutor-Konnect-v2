import type { TextStyle } from 'react-native';

export const typography = {
  // Font sizes
  display: 42,
  h1: 34,
  h2: 28,
  h3: 22,
  title: 18,
  subtitle: 16,
  body: 16,
  bodySmall: 14,
  caption: 12,
  label: 11,

  // Line heights
  lineHeight: {
    display: 50,
    h1: 41,
    h2: 34,
    h3: 28,
    title: 24,
    subtitle: 24,
    body: 24,
    bodySmall: 20,
    caption: 18,
    label: 16,
  },

  // Font weights
  weight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  // Legacy aliases for existing screen usage
  heading1: 34,
  heading2: 28,
  heading3: 22,
  heading4: 18,
} as const;

export type Typography = typeof typography;
