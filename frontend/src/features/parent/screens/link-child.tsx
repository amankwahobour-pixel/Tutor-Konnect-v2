import React, { useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { searchStudentByPhone, searchStudentById, requestWardLink } from '../api/parent.api';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Input } from '@/components/forms';
import { Screen } from '@/components/layout';
import { colors, radius, spacing } from '@/theme';
import type { UserProfile } from '@/types';

type SearchMode = 'code' | 'phone' | 'id';

export default function LinkChildScreen() {
  const { user } = useAuthContext();
  const [mode, setMode] = useState<SearchMode>('code');
  const [query, setQuery] = useState('');
  const [relation, setRelation] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundStudent, setFoundStudent] = useState<UserProfile | null>(null);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    setFoundStudent(null);
    try {
      let result: UserProfile | null = null;
      if (mode === 'code' || mode === 'phone') {
        result = await searchStudentByPhone(query.trim());
      } else {
        result = await searchStudentById(query.trim());
      }
      if (!result) {
        setError('No student found. Check the code, phone number, or ID and try again.');
      } else {
        setFoundStudent(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleLink = async () => {
    if (!foundStudent || !user?.id) return;
    setLinking(true);
    try {
      await requestWardLink(user.id, foundStudent.id, relation || undefined, query || undefined);
      Alert.alert(
        'Request sent',
        `A linking request has been sent to ${foundStudent.full_name || 'the student'}. You will be notified when they approve.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      Alert.alert('Failed to send request', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setLinking(false);
    }
  };

  const modeTabs: { key: SearchMode; label: string; icon: string }[] = [
    { key: 'code', label: 'Parent Code', icon: 'qr-code-outline' },
    { key: 'phone', label: 'Phone', icon: 'call-outline' },
    { key: 'id', label: 'Student ID', icon: 'card-outline' },
  ];

  return (
    <Screen style={styles.screen} contentStyle={styles.content} keyboardAvoiding>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Link a Child</AppText>
      </View>

      <View style={styles.body}>
        <AppText variant="body" color="textSecondary" style={styles.description}>
          Search for your child's account using their Parent Code, phone number, or Student ID.
          The student must approve your request before you can access their data.
        </AppText>

        {/* Mode Tabs */}
        <View style={styles.modeTabs}>
          {modeTabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.modeTab, mode === tab.key && styles.modeTabActive]}
              onPress={() => {
                setMode(tab.key);
                setQuery('');
                setFoundStudent(null);
                setError(null);
              }}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={mode === tab.key ? colors.primary : colors.textTertiary}
              />
              <AppText
                variant="caption"
                style={[styles.modeTabText, mode === tab.key && styles.modeTabTextActive]}
              >
                {tab.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Input
            placeholder={
              mode === 'code'
                ? 'Enter Parent Code'
                : mode === 'phone'
                  ? 'Enter phone number'
                  : 'Enter Student ID'
            }
            value={query}
            onChangeText={setQuery}
            containerStyle={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <PrimaryButton
            title="Search"
            onPress={handleSearch}
            loading={searching}
            containerStyle={styles.searchBtn}
          />
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
            <AppText variant="bodySmall" color="danger" style={styles.errorText}>
              {error}
            </AppText>
          </View>
        )}

        {/* Found Student */}
        {foundStudent && (
          <BaseCard style={styles.studentCard} elevation="md">
            <View style={styles.studentRow}>
              <Avatar
                source={foundStudent.profile_photo ? { uri: foundStudent.profile_photo } : undefined}
                initials={(foundStudent.full_name || '?').slice(0, 2).toUpperCase()}
                size={52}
              />
              <View style={styles.studentInfo}>
                <AppText variant="title">{foundStudent.full_name || 'Student'}</AppText>
                <AppText variant="caption" color="textSecondary">
                  {foundStudent.phone_number}
                </AppText>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>

            <Input
              placeholder="Relationship (e.g. Mother, Father, Guardian)"
              value={relation}
              onChangeText={setRelation}
              containerStyle={styles.relationInput}
            />

            <View style={styles.linkActions}>
              <SecondaryButton
                title="Cancel"
                onPress={() => {
                  setFoundStudent(null);
                  setQuery('');
                }}
                containerStyle={styles.linkBtn}
              />
              <PrimaryButton
                title="Send Request"
                onPress={handleLink}
                loading={linking}
                containerStyle={styles.linkBtn}
              />
            </View>
          </BaseCard>
        )}

        {/* QR Code Info */}
        {mode === 'code' && !foundStudent && (
          <BaseCard style={styles.qrCard} elevation="sm">
            <View style={styles.qrIcon}>
              <Ionicons name="qr-code-outline" size={40} color={colors.primary} />
            </View>
            <AppText variant="body" style={styles.qrTitle}>
              What is a Parent Code?
            </AppText>
            <AppText variant="bodySmall" color="textSecondary" style={styles.qrDesc}>
              The Parent Code is your child's registered phone number on TutorKonnect.
              Ask your child to share their code or QR code from their app settings.
            </AppText>
          </BaseCard>
        )}
      </View>
    </Screen>
  );
}

import { Pressable } from 'react-native';

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
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  description: {
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  modeTabText: {
    color: colors.textTertiary,
  },
  modeTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  searchInput: {
    flex: 1,
  },
  searchBtn: {
    minWidth: 100,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  errorText: {
    flex: 1,
  },
  studentCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  studentInfo: {
    flex: 1,
  },
  relationInput: {
    marginBottom: spacing.md,
  },
  linkActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  linkBtn: {
    flex: 1,
  },
  qrCard: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: radius.xl,
    marginTop: spacing.lg,
  },
  qrIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  qrTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  qrDesc: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
