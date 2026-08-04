import { useMemo } from 'react';
import { StyleSheet, type ViewStyle, type TextStyle, type ImageStyle } from 'react-native';
import { useColors, type ColorPalette } from '@/theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export type StyleFactory<T> = (colors: ColorPalette) => T;

/**
 * Creates a memoized StyleSheet that re-evaluates when the theme changes.
 * Pass a factory function that receives the current color palette.
 */
export function useThemedStyles<T extends NamedStyles<T>>(
  factory: StyleFactory<T>,
): T {
  const colors = useColors();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
