import { useWindowDimensions, Platform } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isWeb: boolean;
  isNative: boolean;
  columns: number;
  sidebarWidth: number;
  contentMaxWidth: number;
}

function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

function getColumns(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'wide': return 4;
    case 'desktop': return 3;
    case 'tablet': return 2;
    default: return 1;
  }
}

function getSidebarWidth(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'wide': return 280;
    case 'desktop': return 240;
    case 'tablet': return 220;
    default: return 0;
  }
}

function getContentMaxWidth(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case 'wide': return 1200;
    case 'desktop': return 1000;
    case 'tablet': return 720;
    default: return 0;
  }
}

export function useResponsive(): ResponsiveState {
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  const isWeb = Platform.OS === 'web';
  const isNative = !isWeb;

  return {
    width,
    height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    isWide: breakpoint === 'wide',
    isWeb,
    isNative,
    columns: getColumns(breakpoint),
    sidebarWidth: getSidebarWidth(breakpoint),
    contentMaxWidth: getContentMaxWidth(breakpoint),
  };
}
