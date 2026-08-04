import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, Stack } from 'expo-router';
import { useColors, spacing, useResponsive } from '@/theme';
import { SidebarNavigation, type NavItem } from '@/components/layout';

const navItems: NavItem[] = [
  { label: 'Home', icon: 'home-outline', href: '/(tutor)/dashboard' },
  { label: 'Bookings', icon: 'calendar-outline', href: '/(tutor)/requests' },
  { label: 'Messages', icon: 'chatbubble-ellipses-outline', href: '/(tutor)/messages' },
  { label: 'Earnings', icon: 'wallet-outline', href: '/(tutor)/earnings' },
  { label: 'Profile', icon: 'person-circle-outline', href: '/(tutor)/profile' },
];

const hiddenItems: NavItem[] = [
  { label: 'Students', icon: 'people-outline', href: '/(tutor)/students' },
  { label: 'Availability', icon: 'time-outline', href: '/(tutor)/availability' },
  { label: 'Notifications', icon: 'notifications-outline', href: '/(tutor)/notifications' },
  { label: 'Settings', icon: 'settings-outline', href: '/(tutor)/settings' },
  { label: 'Withdrawals', icon: 'cash-outline', href: '/(tutor)/withdrawals' },
  { label: 'Verification', icon: 'shield-checkmark-outline', href: '/(tutor)/verification' },
  { label: 'Documents', icon: 'document-attach-outline', href: '/(tutor)/documents' },
];

function TutorTabs() {
  const colors = useColors();
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
          backgroundColor: colors.surface,
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
      <Tabs.Screen name="requests" options={{ title: 'Bookings', tabBarIcon: ({ color, size }) => (<Ionicons name="calendar-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ color, size }) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings', tabBarIcon: ({ color, size }) => (<Ionicons name="wallet-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="students" options={{ href: null }} />
      <Tabs.Screen name="availability" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="withdrawals" options={{ href: null }} />
      <Tabs.Screen name="verification" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
    </Tabs>
  );
}

export default function TutorLayout() {
  const { isMobile } = useResponsive();
  const colors = useColors();

  if (isMobile) {
    return <TutorTabs />;
  }

  return (
    <View style={styles.desktopContainer}>
      <SidebarNavigation items={navItems} hiddenItems={hiddenItems} role="tutor" />
      <View style={[styles.desktopContent, { backgroundColor: colors.background }]}>
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
  },
});
