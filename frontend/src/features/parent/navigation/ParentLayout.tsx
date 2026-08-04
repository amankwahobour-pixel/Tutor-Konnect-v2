import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, Stack } from 'expo-router';
import { colors, spacing, useResponsive } from '@/theme';
import { SidebarNavigation, type NavItem } from '@/components/layout';

const navItems: NavItem[] = [
  { label: 'Home', icon: 'home-outline', href: '/(parent)/dashboard' },
  { label: 'Lessons', icon: 'calendar-outline', href: '/(parent)/lessons' },
  { label: 'Alerts', icon: 'notifications-outline', href: '/(parent)/notifications' },
  { label: 'Profile', icon: 'person-circle-outline', href: '/(parent)/profile' },
];

const hiddenItems: NavItem[] = [
  { label: 'Link Child', icon: 'person-add-outline', href: '/(parent)/link-child' },
  { label: 'Ward Detail', icon: 'people-outline', href: '/(parent)/ward-detail' },
  { label: 'Tutor Detail', icon: 'school-outline', href: '/(parent)/tutor-detail' },
  { label: 'Messages', icon: 'chatbubble-ellipses-outline', href: '/(parent)/messages' },
  { label: 'Settings', icon: 'settings-outline', href: '/(parent)/settings' },
];

function ParentTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: spacing.xxl + 8,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="lessons" options={{ title: 'Lessons', tabBarIcon: ({ color, size }) => (<Ionicons name="calendar-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts', tabBarIcon: ({ color, size }) => (<Ionicons name="notifications-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="link-child" options={{ href: null }} />
      <Tabs.Screen name="ward-detail" options={{ href: null }} />
      <Tabs.Screen name="tutor-detail" options={{ href: null }} />
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

export default function ParentLayout() {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <ParentTabs />;
  }

  return (
    <View style={styles.desktopContainer}>
      <SidebarNavigation items={navItems} hiddenItems={hiddenItems} role="parent" />
      <View style={styles.desktopContent}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
