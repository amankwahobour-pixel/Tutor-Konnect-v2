import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolate,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedView = Animated.createAnimatedComponent(View);

const EXPANDED_HEIGHT = 280;
const COLLAPSED_HEIGHT = 120;
const COLLAPSE_DISTANCE = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

export interface HeaderAction {
  onPress: () => void;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}

export interface WaveHeaderProps {
  title?: string;
  subtitle?: string;
  backAction?: HeaderAction;
  notificationAction?: HeaderAction & { count?: number };
  profileAction?: HeaderAction;
  rightActions?: React.ReactNode;
  children?: React.ReactNode;
  floatingContent?: React.ReactNode;
  scrollY?: SharedValue<number>;
  statusBarStyle?: 'auto' | 'dark' | 'light' | 'inverted';
  gradientOverlay?: boolean;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const WaveHeader = React.memo(
  React.forwardRef<View, WaveHeaderProps>(
    (
      {
        title,
        subtitle,
        backAction,
        notificationAction,
        profileAction,
        rightActions,
        children,
        floatingContent,
        scrollY,
        statusBarStyle = 'light',
        gradientOverlay = true,
        safeArea = true,
        style,
        contentStyle,
      },
      ref,
    ) => {
      const insets = useSafeAreaInsets();
      const surfaceColor = colors.surface;
      const overlayColor = colors.overlay;
      const topPadding = safeArea ? insets.top : 0;
      const internalScrollValue = useSharedValue(0);
      const scrollValue = scrollY ?? internalScrollValue;

      const clamped = useDerivedValue(() => Math.max(0, Math.min(scrollValue.value, COLLAPSE_DISTANCE)));
      const progress = useDerivedValue(() => withSpring(clamped.value / COLLAPSE_DISTANCE, { damping: 16, stiffness: 120 }));

      const containerStyle = useAnimatedStyle(() => ({
        height: EXPANDED_HEIGHT - (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) * progress.value,
      }));

      const backgroundStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -24], Extrapolate.CLAMP) }],
      }));

      const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.86], Extrapolate.CLAMP) }],
      }));

      const titleStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -10], Extrapolate.CLAMP) }],
        opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolate.CLAMP),
      }));

      return (
        <View style={[{ width: '100%', backgroundColor: surfaceColor }, style]} ref={ref as any}>
          <StatusBar style={statusBarStyle} />
          <AnimatedView style={[{ overflow: 'hidden' }, containerStyle]}>
            <AnimatedImageBackground
              source={require('@/assets/images/header-wave.png')}
              resizeMode="cover"
              style={[{ width: '100%', height: '100%' }, backgroundStyle]}
              imageStyle={{ width: '100%', height: '100%' }}
            >
              {gradientOverlay ? (
                <LinearGradient
                  colors={[overlayColor, 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <View style={{ flex: 1, paddingTop: topPadding + spacing.lg, paddingHorizontal: spacing.lg, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {backAction ? (
                      <Pressable
                        onPress={backAction.onPress}
                        accessibilityRole="button"
                        accessibilityLabel={backAction.accessibilityLabel ?? 'Back'}
                        style={{ marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' }}
                      >
                        {backAction.icon ?? <Ionicons name="arrow-back" size={24} color={surfaceColor} />}
                      </Pressable>
                    ) : (
                      <AnimatedView style={[logoStyle, { justifyContent: 'center', alignItems: 'center' }]}> 
                        <Image source={require('@/assets/images/logo.png')} style={{ width: 40, height: 40 }} />
                      </AnimatedView>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {notificationAction ? (
                      <Pressable
                        onPress={notificationAction.onPress}
                        accessibilityRole="button"
                        accessibilityLabel={notificationAction.accessibilityLabel ?? 'Notifications'}
                        style={{ marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' }}
                      >
                        {notificationAction.icon ?? <AppText variant="body" color="surface">🔔</AppText>}
                        {notificationAction.count ? (
                          <View
                            style={{
                              position: 'absolute',
                              right: -6,
                              top: -6,
                              backgroundColor: colors.danger,
                              borderRadius: radius.full,
                              paddingHorizontal: spacing.xs,
                              minWidth: 20,
                              height: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <AppText variant="caption" color="surface">
                              {notificationAction.count > 99 ? '99+' : notificationAction.count}
                            </AppText>
                          </View>
                        ) : null}
                      </Pressable>
                    ) : null}
                    {profileAction ? (
                      <Pressable
                        onPress={profileAction.onPress}
                        accessibilityRole="button"
                        accessibilityLabel={profileAction.accessibilityLabel ?? 'Profile'}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                      >
                        {profileAction.icon ?? <AppText variant="body" color="surface">👤</AppText>}
                      </Pressable>
                    ) : null}
                    {rightActions ? <View style={{ marginLeft: spacing.sm }}>{rightActions}</View> : null}
                  </View>
                </View>
                <AnimatedView style={[titleStyle, { marginTop: spacing.xxl }]}> 
                  {title ? <AppText variant="h2" color="surface">{title}</AppText> : null}
                  {subtitle ? <AppText variant="body" color="surface" style={{ marginTop: spacing.xs }}>{subtitle}</AppText> : null}
                </AnimatedView>
              </View>
            </AnimatedImageBackground>
          </AnimatedView>
          {children ? <View style={[{ paddingHorizontal: spacing.lg, marginTop: spacing.md }, contentStyle]}>{children}</View> : null}
          {floatingContent ? (
            <View style={{ position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: -spacing.xxl }}>{floatingContent}</View>
          ) : null}
        </View>
      );
    },
  ),
);
