export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export type Animations = typeof animations;
