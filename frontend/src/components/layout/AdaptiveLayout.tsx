import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsive, useColors } from '@/theme';
import { SidebarNavigation, type NavItem } from './SidebarNavigation';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  sidebarItems: NavItem[];
  sidebarHiddenItems?: NavItem[];
  role: string;
  tabBar?: React.ReactNode;
}

export function AdaptiveLayout({
  children,
  sidebarItems,
  sidebarHiddenItems,
  role,
  tabBar,
}: AdaptiveLayoutProps) {
  const { isMobile, sidebarWidth } = useResponsive();
  const colors = useColors();

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <View style={styles.mobileContent}>{children}</View>
        {tabBar}
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      <View style={{ width: sidebarWidth }}>
        <SidebarNavigation items={sidebarItems} hiddenItems={sidebarHiddenItems} role={role} />
      </View>
      <View style={[styles.desktopContent, { backgroundColor: colors.background }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
  },
});
