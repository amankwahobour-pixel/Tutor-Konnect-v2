import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { TutorRequest } from '@/types';
import { styles as createStyles } from './RequestCard.styles';
import { useThemedStyles } from '@/theme';

interface RequestCardProps {
  request: TutorRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function RequestCard({ request, onAccept, onDecline }: RequestCardProps) {
  const styles = useThemedStyles(createStyles);
  const studentName = typeof request.student === 'string' ? request.student : request.student?.full_name || 'Student';
  const avatarLetter = studentName.charAt(0).toUpperCase();

  const statusLabel = request.status.charAt(0).toUpperCase() + request.status.slice(1);
  const statusVariant = request.status === 'accepted'
    ? 'success'
    : request.status === 'declined'
      ? 'danger'
      : request.status === 'completed'
        ? 'secondary'
        : 'warning';

  const scheduledLabel = request.scheduled_time
    ? new Date(request.scheduled_time).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'No scheduled date';

  const previewMessage = useMemo(() => {
    if (!request.message) return 'Waiting for your response';
    return request.message.length > 84 ? `${request.message.slice(0, 81)}...` : request.message;
  }, [request.message]);

  return (
    <View style={styles.cardWrapper}>
      <BaseCard style={styles.card} elevation="md">
        <View style={styles.topRow}>
          <Avatar initials={avatarLetter} size={54} style={styles.avatar} />

          <View style={styles.info}>
            <View style={styles.headingRow}>
              <AppText variant="title" numberOfLines={1} style={styles.studentName}>
                {studentName}
              </AppText>
              <Badge label={statusLabel} variant={statusVariant} size="small" />
            </View>

            <View style={styles.chipsRow}>
              <View style={[styles.pill, styles.subjectPill]}>
                <AppText variant="caption" style={styles.pillText}>{request.subject}</AppText>
              </View>
              {request.level ? (
                <View style={[styles.pill, styles.levelPill]}>
                  <AppText variant="caption" style={styles.levelText}>{request.level}</AppText>
                </View>
              ) : null}
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={15} color="#64748B" />
              <AppText variant="caption" color="textSecondary" style={styles.metaText} numberOfLines={1}>
                {scheduledLabel}
              </AppText>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={15} color="#64748B" />
              <AppText variant="caption" color="textSecondary" style={styles.metaText} numberOfLines={2}>
                {previewMessage}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <SecondaryButton title="Decline" onPress={() => onDecline(request.id)} style={styles.actionButton} accessibilityLabel={`Decline request from ${studentName}`} />
          <PrimaryButton title="Accept" onPress={() => onAccept(request.id)} style={styles.actionButton} accessibilityLabel={`Accept request from ${studentName}`} />
        </View>
      </BaseCard>
    </View>
  );
}

export default React.memo(RequestCard);