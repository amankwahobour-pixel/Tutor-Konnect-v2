import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, Stack } from 'expo-router';
import { useColors, spacing, useResponsive } from '@/theme';
import { SidebarNavigation, type NavItem } from '@/components/layout';

const navItems: NavItem[] = [
  { label: 'Home', icon: 'home-outline', href: '/(student)/dashboard' },
  { label: 'My Lessons', icon: 'calendar-outline', href: '/(student)/my-lessons' },
  { label: 'Messages', icon: 'chatbubble-ellipses-outline', href: '/(student)/student-conversations' },
  { label: 'Profile', icon: 'person-circle-outline', href: '/(student)/profile' },
];

const hiddenItems: NavItem[] = [
  { label: 'Book Lesson', icon: 'add-circle-outline', href: '/(student)/book-lesson' },
  { label: 'Booking Review', icon: 'document-text-outline', href: '/(student)/booking-review' },
  { label: 'Booking', icon: 'receipt-outline', href: '/(student)/booking' },
  { label: 'Payment Details', icon: 'card-outline', href: '/(student)/payment-details' },
  { label: 'Payment History', icon: 'wallet-outline', href: '/(student)/payment-history' },
  { label: 'Payment Initiate', icon: 'cash-outline', href: '/(student)/payment-initiate' },
  { label: 'Review History', icon: 'star-outline', href: '/(student)/review-history' },
  { label: 'Chat', icon: 'chatbubble-outline', href: '/(student)/student-chat' },
  { label: 'Notifications', icon: 'notifications-outline', href: '/(student)/student-notifications' },
  { label: 'Tutor Detail', icon: 'school-outline', href: '/(student)/tutor-detail' },
];

function StudentTabs() {
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
      <Tabs.Screen name="my-lessons" options={{ title: 'Lessons', tabBarIcon: ({ color, size }) => (<Ionicons name="calendar-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="student-conversations" options={{ title: 'Messages', tabBarIcon: ({ color, size }) => (<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" size={size} color={color} />) }} />
      <Tabs.Screen name="book-lesson" options={{ href: null }} />
      <Tabs.Screen name="booking-review" options={{ href: null }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="payment-details" options={{ href: null }} />
      <Tabs.Screen name="payment-history" options={{ href: null }} />
      <Tabs.Screen name="payment-initiate" options={{ href: null }} />
      <Tabs.Screen name="review-history" options={{ href: null }} />
      <Tabs.Screen name="student-chat" options={{ href: null }} />
      <Tabs.Screen name="student-notifications" options={{ href: null }} />
      <Tabs.Screen name="tutor-detail" options={{ href: null }} />
    </Tabs>
  );
}

export default function StudentLayout() {
  const { isMobile } = useResponsive();
  const colors = useColors();

  if (isMobile) {
    return <StudentTabs />;
  }

  return (
    <View style={styles.desktopContainer}>
      <SidebarNavigation items={navItems} hiddenItems={hiddenItems} role="student" />
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
