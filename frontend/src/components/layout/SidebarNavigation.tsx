import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { useColors, type ColorPalette, radius, spacing, typography } from '@/theme';
import { useAuthContext } from '@/features/auth/context/auth.context';

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

interface SidebarNavigationProps {
  items: NavItem[];
  hiddenItems?: NavItem[];
  role: string;
}

export function SidebarNavigation({ items, hiddenItems = [], role }: SidebarNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuthContext();
  const styles = getStyles(colors);

  const isActive = (href: string) => {
    const cleanHref = href.replace(/^\//, '');
    const cleanPath = pathname.replace(/^\//, '');
    return cleanPath === cleanHref || cleanPath.startsWith(cleanHref.split('/')[0] + '/');
  };

  const handleNavigate = (href: string) => {
    router.push(href as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Ionicons name="school" size={24} color={colors.surface} />
        </View>
        <View>
          <AppText variant="title" style={styles.brandText}>TutorKonnect</AppText>
          <AppText variant="caption" color="textTertiary" style={styles.brandRole}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </AppText>
        </View>
      </View>

      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false} contentContainerStyle={styles.navContent}>
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Pressable
              key={item.href}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => handleNavigate(item.href)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={active ? colors.primary : colors.textTertiary}
              />
              <AppText
                variant="body"
                style={[styles.navItemText, active && styles.navItemTextActive]}
              >
                {item.label}
              </AppText>
              {item.badge != null && item.badge > 0 ? (
                <View style={styles.badge}>
                  <AppText variant="label" style={styles.badgeText}>{item.badge}</AppText>
                </View>
              ) : null}
              {active && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}

        {hiddenItems.length > 0 && (
          <>
            <View style={styles.divider} />
            {hiddenItems.map((item) => (
              <Pressable
                key={item.href}
                style={[styles.navItem, isActive(item.href) && styles.navItemActive]}
                onPress={() => handleNavigate(item.href)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={isActive(item.href) ? colors.primary : colors.textTertiary}
                />
                <AppText
                  variant="body"
                  style={[styles.navItemText, isActive(item.href) && styles.navItemTextActive]}
                >
                  {item.label}
                </AppText>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.userSection}>
        <Avatar
          source={user?.profile_photo ? { uri: user.profile_photo } : undefined}
          initials={(user?.full_name || 'U').slice(0, 2).toUpperCase()}
          size={40}
        />
        <View style={styles.userInfo}>
          <AppText variant="bodySmall" style={styles.userName} numberOfLines={1}>
            {user?.full_name || 'User'}
          </AppText>
          <AppText variant="caption" color="textTertiary" numberOfLines={1}>
            {user?.email || ''}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function getStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingTop: Platform.OS === 'web' ? 16 : 40,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandText: {
      color: colors.text,
      fontSize: typography.body,
      fontWeight: '700',
    },
    brandRole: {
      textTransform: 'capitalize',
    },
    nav: {
      flex: 1,
    },
    navContent: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.lg,
      marginBottom: spacing.xs,
    },
    navItemActive: {
      backgroundColor: colors.primaryLight,
    },
    navItemText: {
      color: colors.textTertiary,
      flex: 1,
    },
    navItemTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    activeIndicator: {
      width: 3,
      height: 20,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.danger,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    badgeText: {
      color: colors.surface,
      fontSize: 10,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontWeight: '600',
      color: colors.text,
    },
  });
}
