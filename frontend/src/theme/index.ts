import { lightColors, darkColors, type ColorPalette } from './colors';

export { lightColors, darkColors, type ColorPalette } from './colors';
export { ThemeProvider, useTheme, useColors, type ThemeMode, type ResolvedTheme } from './theme.context';

/**
 * Runtime theme proxy. Accessing any color property returns the value
 * from the currently active palette. This lets every existing
 * `import { colors } from '@/theme'` call react to theme switches
 * without refactoring each file into a hook consumer.
 */
function createColorProxy(getPalette: () => ColorPalette): ColorPalette {
  return new Proxy({} as ColorPalette, {
    get(_target, prop: string) {
      const palette = getPalette();
      return (palette as any)[prop];
    },
  });
}

let currentPalette: ColorPalette = lightColors;

export function _setActivePalette(palette: ColorPalette) {
  currentPalette = palette;
}

export const colors: ColorPalette = createColorProxy(() => currentPalette);

// Keep the proxy in sync whenever ThemeProvider mounts/updates.
// This is called from ThemeProvider's effect.
export { darkColors as _darkColors, lightColors as _lightColors };

export { spacing } from './spacing';
export { typography } from './typography';
export { radius } from './radius';
export { shadows } from './shadows';
export { sizes } from './sizes';
export { animations } from './animations';
export { breakpoints, useResponsive, type Breakpoint, type ResponsiveState } from './responsive';
export { useThemedStyles, type StyleFactory } from './useThemedStyles';
