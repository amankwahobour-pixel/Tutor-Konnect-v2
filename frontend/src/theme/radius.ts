export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  pill: 999,
  full: 9999,
} as const;

export type Radius = typeof radius;
