import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

export const DashboardScrollContext = createContext<SharedValue<number> | null>(null);

export function useDashboardScroll() {
  return useContext(DashboardScrollContext);
}
