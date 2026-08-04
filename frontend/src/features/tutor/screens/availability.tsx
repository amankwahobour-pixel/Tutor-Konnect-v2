import React, { useState } from 'react';
import { ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@/components/buttons';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorProfile, updateTutorProfileField } from '@/api/tutor';
import { colors, useThemedStyles } from '@/theme';
import { styles as createStyles } from '../styles/availability.styles';
import { StateRenderer } from '@/components/common';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityScreen() {
  const styles = useThemedStyles(createStyles);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'online' | 'physical' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuthContext();

  const loadAvailability = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const res = await getTutorProfile(user.id);
        if (res?.data) {
          const notes = res.data.availability_notes;
          if (notes) {
            try {
              const parsed = typeof notes === 'string' ? JSON.parse(notes) : notes;
              if (parsed?.mode) setSelectedMode(parsed.mode);
              if (parsed?.isAvailable != null) setIsAvailable(parsed.isAvailable);
            } catch {
              // notes may be plain text
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load availability', err);
      setError(err instanceof Error ? err : new Error('Failed to load availability'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    const init = async () => {
      await loadAvailability();
    };

    void init();
  }, [loadAvailability]);

  const onSave = async () => {
    try {
      if (!user) return;
      const payload = { mode: selectedMode, isAvailable };
      await updateTutorProfileField(user.id, 'availability_notes', JSON.stringify(payload));
      alert('Availability saved');
    } catch (err) {
      console.error('Failed to save availability', err);
      alert('Failed to save availability');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
      <LinearGradient colors={['#E8F9FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={styles.eyebrow}>Tutor schedule</AppText>
            <AppText variant="h3">Availability</AppText>
            <AppText variant="body" style={styles.subtitle}>Set your preferred booking mode and opening hours.</AppText>
          </View>
          <Badge label={isAvailable ? 'Open for bookings' : 'Paused'} variant={isAvailable ? 'success' : 'secondary'} size="small" />
        </View>
      </LinearGradient>

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={loadAvailability}
        loadingMessage="Loading your availability..."
        errorTitle="Failed to load availability"
      >
        {() => (
          <View style={styles.body}>
            <BaseCard style={styles.cardSection} elevation="md">
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">Accepting bookings</AppText>
                  <AppText variant="bodySmall" style={styles.cardSubtext}>Let students request lessons when you are available.</AppText>
                </View>
                <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: '#CBD5E1', true: colors.primary }} thumbColor={colors.surface} />
              </View>
            </BaseCard>

            <BaseCard style={styles.cardSection} elevation="sm">
              <AppText variant="subtitle">Weekly schedule</AppText>
              {DAYS.map((day) => (
                <View key={day} style={styles.dayRow}>
                  <AppText variant="body" style={styles.dayText}>{day}</AppText>
                  <AppText variant="bodySmall" style={styles.timeText}>8:00 AM - 5:00 PM</AppText>
                </View>
              ))}
            </BaseCard>

            <BaseCard style={styles.cardSection} elevation="sm">
              <AppText variant="subtitle">Teaching mode</AppText>
              {[
                { key: 'online' as const, label: 'Online only', icon: 'globe-outline' as const },
                { key: 'physical' as const, label: 'In-person only', icon: 'location-outline' as const },
                { key: 'both' as const, label: 'Both online & in-person', icon: 'albums-outline' as const },
              ].map((option) => {
                const active = selectedMode === option.key;
                return (
                  <TouchableOpacity key={option.key} style={[styles.option, active && styles.selectedOption]} onPress={() => setSelectedMode(option.key)}>
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionIcon, active && styles.optionIconActive]}>
                        <Ionicons name={option.icon} size={16} color={active ? colors.primary : colors.textSecondary} />
                      </View>
                      <AppText variant="body" style={[styles.optionText, active && styles.selectedText]}>{option.label}</AppText>
                    </View>
                    {active ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
                  </TouchableOpacity>
                );
              })}
            </BaseCard>

            <PrimaryButton title="Save availability" onPress={onSave} containerStyle={styles.saveButton} />
            <View style={styles.spacer} />
          </View>
        )}
      </StateRenderer>
    </ScrollView>
  );
}
