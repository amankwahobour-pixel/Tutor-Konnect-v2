import React from 'react';
import { type ImageSourcePropType, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { WaveHeader, type HeaderAction } from './WaveHeader';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing } from '@/theme';


export interface ChatHeaderProps {
  participantName: string;
  avatarSource?: ImageSourcePropType;
  avatarInitials?: string;
  online?: boolean;
  typingIndicator?: string;
  backAction: HeaderAction;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  scrollY?: SharedValue<number>;
}

export const ChatHeader = React.memo(
  React.forwardRef<View, ChatHeaderProps>(
    ({
      participantName,
      avatarSource,
      avatarInitials,
      online = false,
      typingIndicator,
      backAction,
      onVoiceCall,
      onVideoCall,
      scrollY,
    }, ref) => (
      <WaveHeader
        ref={ref}
        title={participantName}
        subtitle={typingIndicator ?? (online ? 'Online' : 'Offline')}
        backAction={backAction}
        profileAction={{
          onPress: () => undefined,
          accessibilityLabel: 'Open participant profile',
          icon: <Avatar source={avatarSource} initials={avatarInitials} size={spacing.xxxl} />,
        }}
        scrollY={scrollY as any}
        rightActions={
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {onVoiceCall ? (
              <Ionicons name="call-outline" size={22} color={colors.surface} onPress={onVoiceCall} accessibilityRole="button" />
            ) : null}
            {onVideoCall ? (
              <Ionicons name="videocam-outline" size={22} color={colors.surface} onPress={onVideoCall} accessibilityRole="button" />
            ) : null}
          </View>
        }
      />
    ),
  ),
);
