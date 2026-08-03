export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  pill: 999,
  full: 9999,
} as const;

export type Radius = typeof radius;
