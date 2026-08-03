export const spacing = {
  // 8px base system
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  // Extended
  none: 0,
  half: 2,
} as const;

export type Spacing = typeof spacing;
