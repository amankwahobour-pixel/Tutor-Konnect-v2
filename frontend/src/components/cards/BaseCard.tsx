import React, { useCallback, useMemo } from 'react';
import { Animated, Pressable, View, Platform, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type CardElevation = 'sm' | 'md' | 'lg' | 'xl';

export interface BaseCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: CardElevation;
  outlined?: boolean;
  pressable?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}

const elevationMap: Record<CardElevation, ViewStyle> = {
  sm: shadows.sm,
  md: shadows.md,
  lg: shadows.lg,
  xl: shadows.xl,
};

function BaseCardComponent({
  children,
  style,
  elevation = 'sm',
  outlined = false,
  pressable = false,
  onPress,
  accessibilityLabel,
}: BaseCardProps) {
  const scale = useMemo(() => new Animated.Value(1), []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const cardStyle = useMemo(
    () => [
      {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        borderWidth: outlined ? 1.5 : 0,
        borderColor: outlined ? colors.border : 'transparent',
        ...elevationMap[elevation],
      },
      style,
    ] as StyleProp<ViewStyle>,
    [elevation, outlined, style],
  );

  const content = (
    <AnimatedView style={[{ transform: [{ scale }] }, cardStyle]}>{children}</AnimatedView>
  );

  if (pressable || onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={Platform.OS === 'web' ? ({ hovered }: any) => hovered ? [{ opacity: 0.92 }] : undefined : undefined}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export const BaseCard = React.memo(BaseCardComponent);
