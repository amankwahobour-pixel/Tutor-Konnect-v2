import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Pressable, ScrollView, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getOrCreateParentProfile, updateParentProfile, getApprovedWards, revokeWardLink } from '../api/parent.api';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { EmptyState, SectionCard, InfoRow } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { ParentProfile, Ward } from '../types';

export default function ParentProfileScreen() {
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [p, w] = await Promise.all([
        getOrCreateParentProfile(user),
        getApprovedWards(user.id),
      ]);
      setProfile(p);
      setFullName(p.full_name);
      setPhoneNumber(p.phone_number);
      setWards(w);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateParentProfile({
        id: profile!.id,
        full_name: fullName,
        phone_number: phoneNumber,
      });
      setProfile(updated);
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = (ward: Ward) => {
    Alert.alert(
      'Revoke Access',
      `Are you sure you want to revoke access to ${ward.full_name || 'this ward'}? You will need to send a new linking request to regain access.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeWardLink(ward.link_id);
              setWards((prev) => prev.filter((w) => w.id !== ward.id));
            } catch {
              Alert.alert('Error', 'Could not revoke access. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (loading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.skeletonHeader} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText variant="h2">Profile</AppText>
            <AppText variant="caption" color="textSecondary">Manage your account</AppText>
          </View>
          <Pressable onPress={() => router.push('/(parent)/settings')} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <SectionCard>
          <View style={styles.profileRow}>
            <Avatar
              source={profile?.avatar_url ? { uri: profile.avatar_url } : undefined}
              initials={(profile?.full_name || 'P').slice(0, 2).toUpperCase()}
              size={72}
            />
            <View style={styles.profileInfo}>
              {editing ? (
                <>
                  <View style={styles.editField}>
                    <AppText variant="caption" color="textSecondary">Full Name</AppText>
                    <Input
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter full name"
                      containerStyle={styles.editInput}
                    />
                  </View>
                  <View style={styles.editField}>
                    <AppText variant="caption" color="textSecondary">Phone Number</AppText>
                    <Input
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="Enter phone number"
                      containerStyle={styles.editInput}
                    />
                  </View>
                  <View style={styles.editActions}>
                    <SecondaryButton title="Cancel" onPress={() => setEditing(false)} containerStyle={styles.editBtn} />
                    <PrimaryButton title="Save" onPress={handleSave} loading={saving} containerStyle={styles.editBtn} />
                  </View>
                </>
              ) : (
                <>
                  <AppText variant="title">{profile?.full_name || user?.full_name || 'Parent'}</AppText>
                  <AppText variant="caption" color="textSecondary">
                    {profile?.phone_number || user?.phone_number}
                  </AppText>
                  {user?.email && (
                    <AppText variant="caption" color="textTertiary">
                      {user.email}
                    </AppText>
                  )}
                  <Pressable onPress={() => setEditing(true)} style={styles.editBtnSmall}>
                    <Ionicons name="create-outline" size={16} color={colors.primary} />
                    <AppText variant="caption" style={styles.editBtnText}>Edit profile</AppText>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </SectionCard>

        {/* Wards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <AppText variant="subtitle">Linked Wards</AppText>
              <AppText variant="caption" color="textSecondary">
                {wards.length} {wards.length === 1 ? 'child' : 'children'} linked
              </AppText>
            </View>
            <PrimaryButton
              title="Add"
              onPress={() => router.push('/(parent)/link-child')}
              leftIcon={<Ionicons name="add-outline" size={18} color={colors.surface} />}
            />
          </View>

          {wards.length > 0 ? (
            wards.map((ward) => (
              <BaseCard key={ward.id} style={styles.wardCard} elevation="sm">
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/(parent)/ward-detail',
                      params: { wardId: ward.id, linkId: ward.link_id },
                    })
                  }
                >
                  <View style={styles.wardRow}>
                    <Avatar
                      source={ward.profile_photo ? { uri: ward.profile_photo } : undefined}
                      initials={(ward.full_name || '?').slice(0, 2).toUpperCase()}
                      size={44}
                    />
                    <View style={styles.wardInfo}>
                      <AppText variant="body" style={styles.wardName}>{ward.full_name || 'Student'}</AppText>
                      <AppText variant="caption" color="textSecondary">
                        {ward.relation ? `${ward.relation} • ` : ''}{ward.phone_number}
                      </AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                  </View>
                </Pressable>
                <Pressable style={styles.revokeBtn} onPress={() => handleRevoke(ward)}>
                  <Ionicons name="unlink-outline" size={14} color={colors.danger} />
                  <AppText variant="label" color="danger">Revoke access</AppText>
                </Pressable>
              </BaseCard>
            ))
          ) : (
            <EmptyState
              icon={<Ionicons name="people-outline" size={40} color={colors.primary} />}
              title="No wards linked"
              message="Link your child's account to monitor their progress."
              actionLabel="Link a child"
              onAction={() => router.push('/(parent)/link-child')}
            />
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <AppText variant="subtitle" style={styles.sectionTitle}>Quick Access</AppText>
          <SectionCard noPadding>
            <Pressable style={styles.menuItem} onPress={() => router.push('/(parent)/settings')}>
              <View style={styles.menuRow}>
                <Ionicons name="settings-outline" size={20} color={colors.primary} />
                <AppText variant="body">App settings</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={() => router.push('/(parent)/messages')}>
              <View style={styles.menuRow}>
                <Ionicons name="chatbubble-outline" size={20} color={colors.secondary} />
                <AppText variant="body">Messages</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={() => router.push('/(parent)/notifications')}>
              <View style={styles.menuRow}>
                <Ionicons name="notifications-outline" size={20} color={colors.warning} />
                <AppText variant="body">Notifications</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </SectionCard>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <SecondaryButton
            title="Sign out"
            onPress={handleLogout}
            containerStyle={styles.logoutBtn}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

import { Input } from '@/components/forms';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  skeletonHeader: {
    height: 80,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  settingsBtn: {
    padding: spacing.xs,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  editField: {
    marginBottom: spacing.sm,
  },
  editInput: {
    marginTop: spacing.xs,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editBtn: {
    flex: 1,
  },
  editBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  editBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  wardCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  wardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wardInfo: {
    flex: 1,
  },
  wardName: {
    fontWeight: '600',
  },
  revokeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  logoutBtn: {
    width: '100%',
  },
});
