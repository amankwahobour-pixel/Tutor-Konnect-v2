import React from 'react';
import { Image, ImageSourcePropType, Text, View, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useColors, radius } from '@/theme';

export interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
  online?: boolean;
  verified?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

function AvatarComponent({
  source,
  initials,
  size = 40,
  online = false,
  verified = false,
  style,
  imageStyle,
  textStyle,
  accessibilityLabel,
}: AvatarProps) {
  const colors = useColors();
  const containerSize = size;
  const textSize = Math.max(12, Math.round(size * 0.35));
  const badgeSize = Math.max(10, Math.round(size * 0.28));
  const initialsText = initials?.slice(0, 2).toUpperCase() ?? '';

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: containerSize,
          height: containerSize,
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            {
              width: containerSize,
              height: containerSize,
              borderRadius: radius.full,
            },
            imageStyle,
          ]}
        />
      ) : (
        <View
          style={{
            width: containerSize,
            height: containerSize,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primaryLight,
          }}
        >
          <Text
            style={[
              {
                color: colors.primaryDark,
                fontSize: textSize,
                fontWeight: '700',
              },
              textStyle,
            ]}
          >
            {initialsText}
          </Text>
        </View>
      )}

      {online ? (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            borderWidth: 2,
            borderColor: colors.surface,
            backgroundColor: colors.success,
          }}
        />
      ) : null}

      {verified ? (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.surface,
          }}
        >
          <Text style={{ color: colors.surface, fontSize: badgeSize * 0.65, fontWeight: '700' }}>✓</Text>
        </View>
      ) : null}
    </View>
  );
}

export const Avatar = React.memo(AvatarComponent);
