import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, spacing } from '@/theme';

export default function TutorLayout() {
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
      {/* Home */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Bookings / Requests */}
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Earnings */}
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="wallet-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden Screens */}

      <Tabs.Screen
        name="students"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="availability"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="withdrawals"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="verification"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="documents"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}