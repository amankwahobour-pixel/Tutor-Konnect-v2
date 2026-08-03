import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { colors, radius, spacing } from '@/theme';
import type { LessonTrackingStatus } from '../types';

const statusConfig: Record<LessonTrackingStatus, { label: string; variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'; icon: string }> = {
  scheduled: { label: 'Scheduled', variant: 'primary', icon: 'calendar-outline' },
  in_progress: { label: 'In Progress', variant: 'warning', icon: 'time-outline' },
  completed: { label: 'Completed', variant: 'success', icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', variant: 'danger', icon: 'close-circle-outline' },
  rescheduled: { label: 'Rescheduled', variant: 'neutral', icon: 'swap-horizontal-outline' },
};

interface LessonStatusBadgeProps {
  status: LessonTrackingStatus;
  size?: 'small' | 'medium' | 'large';
}

export function LessonStatusBadge({ status, size = 'medium' }: LessonStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.scheduled;
  return <Badge label={config.label} variant={config.variant} size={size} />;
}
