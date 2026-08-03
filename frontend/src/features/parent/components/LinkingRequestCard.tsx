import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { colors, radius, spacing } from '@/theme';
import type { LinkingRequest } from '../types';

interface LinkingRequestCardProps {
  request: LinkingRequest;
  onApprove: (request: LinkingRequest) => void;
  onReject: (request: LinkingRequest) => void;
}

export function LinkingRequestCard({ request, onApprove, onReject }: LinkingRequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar
          source={request.parent_avatar ? { uri: request.parent_avatar } : undefined}
          initials={(request.parent_name || '?').slice(0, 2).toUpperCase()}
          size={44}
        />
        <View style={styles.info}>
          <AppText variant="body" style={styles.name}>{request.parent_name}</AppText>
          <AppText variant="caption" color="textSecondary">
            {request.relation ? `${request.relation} • ` : ''}Requested to link
          </AppText>
        </View>
        <Ionicons name="link-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.actions}>
        <SecondaryButton title="Decline" onPress={() => onReject(request)} containerStyle={styles.actionBtn} />
        <PrimaryButton title="Approve" onPress={() => onApprove(request)} containerStyle={styles.actionBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
