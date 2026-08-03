export const typography = {
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

  // Legacy aliases for existing screen usage
  heading1: 34,
  heading2: 28,
  heading3: 22,
  heading4: 18,
} as const;

export type Typography = typeof typography;
