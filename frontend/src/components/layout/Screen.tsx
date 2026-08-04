import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors, spacing, type ColorPalette } from '@/theme';

export interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: keyof ColorPalette;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const paddingMap: Record<NonNullable<ScreenProps['padding']>, number> = {
  none: 0,
  small: spacing.sm,
  medium: spacing.lg,
  large: spacing.xl,
};

function ScreenComponent({
  children,
  style,
  contentStyle,
  scrollable = false,
  safeArea = true,
  keyboardAvoiding = false,
  backgroundColor = 'background',
  padding = 'medium',
}: ScreenProps) {
  const colors = useColors();

  const containerStyle: StyleProp<ViewStyle> = [
    {
      flex: 1,
      backgroundColor: colors[backgroundColor],
    },
    style,
  ];

  const innerStyle: StyleProp<ViewStyle> = [
    {
      flex: 1,
      padding: paddingMap[padding],
    },
    contentStyle,
  ];

  const content = scrollable ? (
    <ScrollView contentContainerStyle={innerStyle} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={innerStyle}>{children}</View>
  );

  if (keyboardAvoiding) {
    return (
      <SafeAreaView style={containerStyle}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return safeArea ? <SafeAreaView style={containerStyle}>{content}</SafeAreaView> : <View style={containerStyle}>{content}</View>;
}

export const Screen = React.memo(ScreenComponent);
