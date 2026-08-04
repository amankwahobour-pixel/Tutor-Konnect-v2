import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useResponsive } from '@/theme';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
  centered?: boolean;
  padding?: boolean;
}

export function ResponsiveContainer({
  children,
  style,
  maxWidth,
  centered = true,
  padding = true,
}: ResponsiveContainerProps) {
  const { contentMaxWidth, isMobile } = useResponsive();
  const maxW = maxWidth ?? contentMaxWidth;

  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          maxWidth: isMobile ? undefined : maxW,
          alignSelf: centered ? 'center' : 'flex-start',
          paddingHorizontal: padding ? (isMobile ? 16 : 24) : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
