import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorProfile } from '@/api/tutor';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { SectionCard, StateRenderer, StatCard } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { TutorProfile } from '@/features/tutor/api/tutor.api';

type VerificationStep = 'identity' | 'qualifications' | 'review';

const steps: { key: VerificationStep; label: string; icon: string }[] = [
  { key: 'identity', label: 'Identity', icon: 'card-outline' },
  { key: 'qualifications', label: 'Qualifications', icon: 'school-outline' },
  { key: 'review', label: 'Review & Submit', icon: 'checkmark-circle-outline' },
];

export default function VerificationScreen() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentStep, setCurrentStep] = useState<VerificationStep>('identity');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getTutorProfile(user.id);
      if (res?.data) setProfile(res.data);
    } catch (err) {
      console.error('Failed to load verification status', err);
      setError(err instanceof Error ? err : new Error('Failed to load verification status'));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUploadDoc = (docType: string) => {
    Alert.alert(
      'Upload Document',
      `Upload your ${docType}. This feature requires backend support for file uploads.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Uploaded',
          onPress: () => {
            setUploadedDocs((prev) => ({ ...prev, [docType]: 'pending' }));
          },
        },
      ],
    );
  };

  const handleSubmit = () => {
    Alert.alert(
      'Verification Submitted',
      'Your verification documents have been submitted for review. You will be notified once approved.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  const verificationStatus = profile?.verification_status ?? 'pending';
  const isApproved = verificationStatus === 'approved';
  const isRejected = verificationStatus === 'rejected';
  const isPending = verificationStatus === 'pending' || verificationStatus === 'more_info';

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Verification</AppText>
      </View>

      <StateRenderer
        status={error ? 'error' : loading ? 'loading' : 'success'}
        error={error}
        onRetry={load}
        loadingMessage="Loading verification status..."
        errorTitle="Failed to load verification status"
      >
        {() => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Status Banner */}
            <View
              style={[
                styles.statusBanner,
                isApproved && styles.statusBannerSuccess,
                isRejected && styles.statusBannerDanger,
                isPending && styles.statusBannerWarning,
              ]}
            >
              <Ionicons
                name={isApproved ? 'checkmark-circle' : isRejected ? 'close-circle' : 'time-outline'}
                size={32}
                color={isApproved ? colors.success : isRejected ? colors.danger : colors.warning}
              />
              <View style={styles.statusInfo}>
                <AppText variant="subtitle" style={styles.statusTitle}>
                  {isApproved ? 'Verified' : isRejected ? 'Verification Rejected' : 'Pending Verification'}
                </AppText>
                <AppText variant="caption" color="textSecondary">
                  {isApproved
                    ? 'Your tutor profile is approved and visible to students.'
                    : isRejected
                      ? profile?.verification_rejection_reason || 'Please review the feedback and resubmit.'
                      : 'Complete the steps below to get verified.'}
                </AppText>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard
                icon="document-text-outline"
                iconColor={colors.primary}
                label="Documents"
                value={Object.keys(uploadedDocs).length}
                subtitle="uploaded"
              />
              <StatCard
                icon="checkmark-circle-outline"
                iconColor={colors.success}
                label="Steps"
                value={`${currentStepIndex + 1}/${steps.length}`}
                subtitle="completed"
              />
            </View>

            {/* Step Progress */}
            {!isApproved && (
              <>
                <View style={styles.stepProgress}>
                  {steps.map((step, index) => (
                    <React.Fragment key={step.key}>
                      <View
                        style={[
                          styles.stepCircle,
                          currentStepIndex >= index && styles.stepCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={step.icon as any}
                          size={18}
                          color={currentStepIndex >= index ? colors.surface : colors.textTertiary}
                        />
                      </View>
                      {index < steps.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            currentStepIndex > index && styles.stepLineActive,
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>

                {/* Step Content */}
                {currentStep === 'identity' && (
                  <SectionCard title="Step 1: Identity Documents" subtitle="Upload your government-issued ID">
                    <View style={styles.docList}>
                      {['National ID / Ghana Card', 'Passport (if applicable)'].map((docType) => (
                        <Pressable
                          key={docType}
                          style={styles.docItem}
                          onPress={() => handleUploadDoc(docType)}
                        >
                          <View style={styles.docIcon}>
                            <Ionicons
                              name={uploadedDocs[docType] ? 'checkmark-circle' : 'cloud-upload-outline'}
                              size={20}
                              color={uploadedDocs[docType] ? colors.success : colors.primary}
                            />
                          </View>
                          <View style={styles.docInfo}>
                            <AppText variant="body">{docType}</AppText>
                            <AppText variant="caption" color="textSecondary">
                              {uploadedDocs[docType] ? 'Uploaded - pending review' : 'Tap to upload'}
                            </AppText>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </Pressable>
                      ))}
                    </View>
                    <PrimaryButton
                      title="Continue"
                      onPress={() => setCurrentStep('qualifications')}
                      containerStyle={styles.stepBtn}
                    />
                  </SectionCard>
                )}

                {currentStep === 'qualifications' && (
                  <SectionCard title="Step 2: Qualifications" subtitle="Upload your teaching credentials">
                    <View style={styles.docList}>
                      {['Degree Certificate', 'Teaching License (GTC)', 'Any other relevant certificate'].map((docType) => (
                        <Pressable
                          key={docType}
                          style={styles.docItem}
                          onPress={() => handleUploadDoc(docType)}
                        >
                          <View style={styles.docIcon}>
                            <Ionicons
                              name={uploadedDocs[docType] ? 'checkmark-circle' : 'cloud-upload-outline'}
                              size={20}
                              color={uploadedDocs[docType] ? colors.success : colors.primary}
                            />
                          </View>
                          <View style={styles.docInfo}>
                            <AppText variant="body">{docType}</AppText>
                            <AppText variant="caption" color="textSecondary">
                              {uploadedDocs[docType] ? 'Uploaded - pending review' : 'Tap to upload'}
                            </AppText>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </Pressable>
                      ))}
                    </View>
                    <View style={styles.stepActions}>
                      <SecondaryButton
                        title="Back"
                        onPress={() => setCurrentStep('identity')}
                        containerStyle={styles.stepBtn}
                      />
                      <PrimaryButton
                        title="Continue"
                        onPress={() => setCurrentStep('review')}
                        containerStyle={styles.stepBtn}
                      />
                    </View>
                  </SectionCard>
                )}

                {currentStep === 'review' && (
                  <SectionCard title="Step 3: Review & Submit" subtitle="Review your uploaded documents">
                    <View style={styles.reviewList}>
                      {Object.entries(uploadedDocs).map(([doc, status]) => (
                        <View key={doc} style={styles.reviewItem}>
                          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                          <AppText variant="bodySmall" style={styles.reviewDocName}>{doc}</AppText>
                          <Badge label={status} variant="warning" size="small" />
                        </View>
                      ))}
                      {Object.keys(uploadedDocs).length === 0 && (
                        <AppText variant="bodySmall" color="textSecondary" style={styles.reviewEmpty}>
                          No documents uploaded yet. Go back and upload your documents.
                        </AppText>
                      )}
                    </View>
                    <View style={styles.stepActions}>
                      <SecondaryButton
                        title="Back"
                        onPress={() => setCurrentStep('qualifications')}
                        containerStyle={styles.stepBtn}
                      />
                      <PrimaryButton
                        title="Submit"
                        onPress={handleSubmit}
                        containerStyle={styles.stepBtn}
                      />
                    </View>
                  </SectionCard>
                )}
              </>
            )}

            {/* Approved State */}
            {isApproved && (
              <SectionCard>
                <View style={styles.approvedInfo}>
                  <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                  <AppText variant="title" style={styles.approvedTitle}>Fully Verified</AppText>
                  <AppText variant="body" color="textSecondary" style={styles.approvedDesc}>
                    Your tutor profile has been approved. Students can find and book sessions with you.
                  </AppText>
                </View>
              </SectionCard>
            )}

            {/* Rejected State */}
            {isRejected && (
              <SectionCard title="Feedback">
                <View style={styles.rejectedInfo}>
                  <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
                  <AppText variant="body" color="textSecondary" style={styles.rejectionReason}>
                    {profile?.verification_rejection_reason || 'Your verification was rejected. Please review and resubmit your documents.'}
                  </AppText>
                </View>
                <PrimaryButton
                  title="Resubmit"
                  onPress={() => {
                    setCurrentStep('identity');
                    setUploadedDocs({});
                  }}
                  containerStyle={styles.stepBtn}
                />
              </SectionCard>
            )}
          </ScrollView>
        )}
      </StateRenderer>
    </Screen>
  );
}

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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  statusBannerSuccess: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  statusBannerDanger: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  statusBannerWarning: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  docList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
  },
  stepBtn: {
    flex: 1,
  },
  stepActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reviewList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  reviewDocName: {
    flex: 1,
  },
  reviewEmpty: {
    textAlign: 'center',
    paddingVertical: spacing.md,
    lineHeight: 20,
  },
  approvedInfo: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  approvedTitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  approvedDesc: {
    textAlign: 'center',
    lineHeight: 22,
  },
  rejectedInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rejectionReason: {
    flex: 1,
    lineHeight: 22,
  },
});
