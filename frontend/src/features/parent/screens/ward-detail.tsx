import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getWardSummary,
  getWardTutors,
  getWardAttendance,
  getWardHomework,
  getWardLearningGoals,
  getWardProgressReports,
  getWardPayments,
} from '../api/parent.api';
import { ProgressCard, LessonStatusBadge } from '../components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { StateRenderer, EmptyState } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type {
  WardSummary,
  WardTutor,
  WardAttendance,
  WardHomework,
  WardLearningGoal,
  WardProgressReport,
  WardPayment,
} from '../types';

type Tab = 'overview' | 'subjects' | 'lessons' | 'attendance' | 'homework' | 'progress' | 'goals' | 'payments';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline' },
  { key: 'subjects', label: 'Subjects', icon: 'book-outline' },
  { key: 'lessons', label: 'Lessons', icon: 'calendar-outline' },
  { key: 'attendance', label: 'Attendance', icon: 'checkmark-done-outline' },
  { key: 'homework', label: 'Homework', icon: 'document-text-outline' },
  { key: 'progress', label: 'Progress', icon: 'stats-chart-outline' },
  { key: 'goals', label: 'Goals', icon: 'trophy-outline' },
  { key: 'payments', label: 'Payments', icon: 'wallet-outline' },
];

export default function WardDetailScreen() {
  const { wardId, linkId } = useLocalSearchParams<{ wardId: string; linkId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [summary, setSummary] = useState<WardSummary | null>(null);
  const [tutors, setTutors] = useState<WardTutor[]>([]);
  const [attendance, setAttendance] = useState<WardAttendance[]>([]);
  const [homework, setHomework] = useState<WardHomework[]>([]);
  const [goals, setGoals] = useState<WardLearningGoal[]>([]);
  const [progressReports, setProgressReports] = useState<WardProgressReport[]>([]);
  const [payments, setPayments] = useState<WardPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!wardId || !linkId) return;
    setLoading(true);
    setError(null);
    try {
      const [sum, tutorList, attList, hwList, goalList, reportList, payList] = await Promise.all([
        getWardSummary(wardId, linkId),
        getWardTutors(wardId),
        getWardAttendance(wardId),
        getWardHomework(wardId),
        getWardLearningGoals(wardId),
        getWardProgressReports(wardId),
        getWardPayments(wardId),
      ]);
      setSummary(sum);
      setTutors(tutorList);
      setAttendance(attList);
      setHomework(hwList);
      setGoals(goalList);
      setProgressReports(reportList);
      setPayments(payList);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [wardId, linkId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const ward = summary?.ward;

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Ward Details</AppText>
      </View>

      <StateRenderer
        status={error ? 'error' : loading ? 'loading' : 'success'}
        error={error}
        onRetry={loadData}
        errorTitle="Failed to load ward data"
        loadingMessage="Loading ward details..."
      >
        {() =>
          ward ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
            >
              {/* Ward Hero */}
              <BaseCard style={styles.heroCard} elevation="lg">
                <LinearGradient
                  colors={[colors.surfaceVariant, colors.surface]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroGradient}
                >
                  <View style={styles.heroRow}>
                    <Avatar
                      source={ward.profile_photo ? { uri: ward.profile_photo } : undefined}
                      initials={(ward.full_name || '?').slice(0, 2).toUpperCase()}
                      size={64}
                    />
                    <View style={styles.heroInfo}>
                      <AppText variant="title">{ward.full_name || 'Student'}</AppText>
                      <AppText variant="caption" color="textSecondary">
                        {ward.phone_number}
                      </AppText>
                      {ward.verification_status && (
                        <Badge
                          label={ward.verification_status === 'approved' ? 'Verified' : 'Pending Verification'}
                          variant={ward.verification_status === 'approved' ? 'success' : 'neutral'}
                          size="small"
                          style={styles.verificationBadge}
                        />
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </BaseCard>

              {/* Tab Bar */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
                {tabs.map((tab) => (
                  <Pressable
                    key={tab.key}
                    style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    <Ionicons
                      name={tab.icon as any}
                      size={16}
                      color={activeTab === tab.key ? colors.primary : colors.textTertiary}
                    />
                    <AppText
                      variant="caption"
                      style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
                    >
                      {tab.label}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === 'overview' && summary && (
                  <View style={styles.overviewGrid}>
                    <ProgressCard
                      label="Attendance"
                      value={`${summary.attendance_rate}%`}
                      icon="checkmark-circle-outline"
                      iconColor={colors.success}
                      progressPercent={summary.attendance_rate}
                    />
                    <ProgressCard
                      label="Upcoming"
                      value={summary.upcoming_lessons.length}
                      icon="calendar-outline"
                      iconColor={colors.primary}
                    />
                    <ProgressCard
                      label="Homework"
                      value={summary.pending_homework}
                      subtitle="pending"
                      icon="document-text-outline"
                      iconColor={colors.warning}
                    />
                    <ProgressCard
                      label="Goals"
                      value={summary.active_goals}
                      subtitle="active"
                      icon="trophy-outline"
                      iconColor={colors.secondary}
                    />
                    <ProgressCard
                      label="Subjects"
                      value={summary.active_subjects.length}
                      icon="book-outline"
                      iconColor={colors.primary}
                    />
                    <ProgressCard
                      label="Alerts"
                      value={summary.unread_notifications}
                      subtitle="unread"
                      icon="notifications-outline"
                      iconColor={colors.danger}
                    />
                  </View>
                )}

                {activeTab === 'subjects' && (
                  <View>
                    {summary?.active_subjects.length ? (
                      summary.active_subjects.map((subject) => (
                        <BaseCard
                          key={subject.id}
                          style={styles.listCard}
                          elevation="sm"
                          pressable
                          onPress={() =>
                            router.push({
                              pathname: '/(parent)/tutor-detail',
                              params: { tutorId: subject.tutor_id, wardId: ward.id },
                            })
                          }
                        >
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons name="book-outline" size={18} color={colors.secondary} />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{subject.name}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {subject.tutor_name} • {subject.lessons_completed}/{subject.lessons_total} lessons
                              </AppText>
                            </View>
                            <View style={styles.listProgress}>
                              <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${subject.progress_percent}%` }]} />
                              </View>
                              <AppText variant="label" color="textSecondary">{subject.progress_percent}%</AppText>
                            </View>
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="book-outline" title="No subjects" message="This student has not enrolled in any subjects yet." />
                    )}
                  </View>
                )}

                {activeTab === 'lessons' && (
                  <View>
                    {summary?.upcoming_lessons.length ? (
                      summary.upcoming_lessons.map((lesson) => (
                        <BaseCard key={lesson.id} style={styles.listCard} elevation="sm">
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{lesson.subject}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {lesson.tutor_name} • {new Date(lesson.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </AppText>
                            </View>
                            <LessonStatusBadge status={lesson.status} size="small" />
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="calendar-outline" title="No lessons" message="No lessons have been scheduled yet." />
                    )}
                  </View>
                )}

                {activeTab === 'attendance' && (
                  <View>
                    {attendance.length ? (
                      attendance.map((record) => (
                        <BaseCard key={record.id} style={styles.listCard} elevation="sm">
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons
                                name={record.status === 'present' ? 'checkmark-circle' : 'close-circle'}
                                size={18}
                                color={record.status === 'present' ? colors.success : colors.danger}
                              />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{record.subject}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {record.tutor_name} • {new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </AppText>
                            </View>
                            <Badge label={record.status} variant={record.status === 'present' ? 'success' : 'danger'} size="small" />
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="checkmark-done-outline" title="No attendance records" message="Attendance will appear here once lessons are completed." />
                    )}
                  </View>
                )}

                {activeTab === 'homework' && (
                  <View>
                    {homework.length ? (
                      homework.map((hw) => (
                        <BaseCard key={hw.id} style={styles.listCard} elevation="sm">
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons name="document-text-outline" size={18} color={colors.warning} />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{hw.title}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {hw.subject} • Due {new Date(hw.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </AppText>
                            </View>
                            <Badge label={hw.status} variant={hw.status === 'overdue' ? 'danger' : hw.status === 'graded' ? 'success' : 'warning'} size="small" />
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="document-text-outline" title="No homework" message="Homework assignments will appear here when assigned by tutors." />
                    )}
                  </View>
                )}

                {activeTab === 'progress' && (
                  <View>
                    {progressReports.length ? (
                      progressReports.map((report) => (
                        <BaseCard key={report.id} style={styles.listCard} elevation="sm">
                          <AppText variant="body" style={styles.listTitle}>{report.subject}</AppText>
                          <AppText variant="caption" color="textSecondary">{report.period}</AppText>
                          <View style={styles.progressStats}>
                            <View style={styles.progressStat}>
                              <AppText variant="caption" color="textSecondary">Attendance</AppText>
                              <AppText variant="body" style={styles.progressValue}>{report.attendance_rate}%</AppText>
                            </View>
                            <View style={styles.progressStat}>
                              <AppText variant="caption" color="textSecondary">Assignments</AppText>
                              <AppText variant="body" style={styles.progressValue}>{report.assignments_completed}/{report.assignments_total}</AppText>
                            </View>
                            {report.overall_grade && (
                              <View style={styles.progressStat}>
                                <AppText variant="caption" color="textSecondary">Grade</AppText>
                                <AppText variant="body" style={styles.progressValue}>{report.overall_grade}</AppText>
                              </View>
                            )}
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="stats-chart-outline" title="No progress reports" message="Progress reports will be generated by tutors after completed lessons." />
                    )}
                  </View>
                )}

                {activeTab === 'goals' && (
                  <View>
                    {goals.length ? (
                      goals.map((goal) => (
                        <BaseCard key={goal.id} style={styles.listCard} elevation="sm">
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons name="trophy-outline" size={18} color={colors.secondary} />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{goal.title}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {goal.subject ? `${goal.subject} • ` : ''}Due {new Date(goal.target_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </AppText>
                            </View>
                            <Badge label={goal.status.replace('_', ' ')} variant={goal.status === 'achieved' ? 'success' : goal.status === 'at_risk' ? 'warning' : 'primary'} size="small" />
                          </View>
                          {goal.progress_percent > 0 && (
                            <View style={styles.goalProgress}>
                              <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${goal.progress_percent}%` }]} />
                              </View>
                              <AppText variant="label" color="textSecondary">{goal.progress_percent}%</AppText>
                            </View>
                          )}
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="trophy-outline" title="No learning goals" message="Learning goals will appear here once they are set for your child." />
                    )}
                  </View>
                )}

                {activeTab === 'payments' && (
                  <View>
                    {payments.length ? (
                      payments.map(({ payment, tutor_name, subject }) => (
                        <BaseCard key={payment.id} style={styles.listCard} elevation="sm">
                          <View style={styles.listRow}>
                            <View style={styles.listIcon}>
                              <Ionicons name="wallet-outline" size={18} color={colors.success} />
                            </View>
                            <View style={styles.listInfo}>
                              <AppText variant="body" style={styles.listTitle}>{subject}</AppText>
                              <AppText variant="caption" color="textSecondary">
                                {tutor_name} • {new Date(payment.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </AppText>
                            </View>
                            <View style={styles.paymentRight}>
                              <AppText variant="body" style={styles.paymentAmount}>
                                GHS {payment.amount.toFixed(2)}
                              </AppText>
                              <Badge label={payment.payment_status} variant={payment.payment_status === 'successful' ? 'success' : 'warning'} size="small" />
                            </View>
                          </View>
                        </BaseCard>
                      ))
                    ) : (
                      <EmptyState icon="wallet-outline" title="No payments" message="Payment history will appear here once payments are made." />
                    )}
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            <EmptyState icon="person-outline" title="Ward not found" message="This student could not be found." />
          )
        }
      </StateRenderer>
    </Screen>
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  heroCard: {
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  heroGradient: {
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroInfo: {
    flex: 1,
  },
  verificationBadge: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  tabBar: {
    maxHeight: 50,
    marginBottom: spacing.sm,
  },
  tabBarContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  listCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontWeight: '600',
  },
  listProgress: {
    width: 60,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  progressStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  progressStat: {
    flex: 1,
  },
  progressValue: {
    fontWeight: '600',
    marginTop: 2,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontWeight: '700',
    marginBottom: 2,
  },
});
