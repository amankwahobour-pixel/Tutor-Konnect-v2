import React from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorProfile } from '@/api/tutor';
import { StateRenderer } from '@/components/common';
import styles from '../styles/profile.styles';

export default function VerificationScreen() {
  const { user } = useAuthContext();
  const [profile, setProfile] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;
      const res = await getTutorProfile(user.id);
      if (res?.data) setProfile(res.data);
    } catch (err) {
      console.error('Failed to load verification status', err);
      setError(err instanceof Error ? err : new Error('Failed to load verification status'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    // The loader performs async state updates; calling it here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleUpload = () => {
    // Backend does not currently expose a document upload endpoint in the frontend API.
    // TODO: Implement document upload when backend provides /tutors/:id/documents or /uploads endpoint.
    Alert.alert('Not available', 'Document upload is not yet supported by the backend. Please upload via the web dashboard.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('@/assets/images/header-wave.png')} style={styles.headerWaves} resizeMode="cover" />

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={load}
        loadingMessage="Loading verification status..."
        errorTitle="Failed to load verification status"
      >
        {() => (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Verification</Text>
            <Text style={{ marginBottom: 12 }}>Your verification status shows whether your tutor profile has been approved to receive students.</Text>

            <View style={{ padding: 12, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E6EEF8' }}>
              <Text style={{ fontWeight: '700', marginBottom: 6 }}>Status</Text>
              <Text>{profile?.verification_status ?? 'Not submitted'}</Text>
              {profile?.verification_rejection_reason ? (
                <Text style={{ marginTop: 8, color: '#DC2626' }}>Reason: {profile.verification_rejection_reason}</Text>
              ) : null}
            </View>

            <View style={{ height: 16 }} />

            <TouchableOpacity onPress={handleUpload} style={{ backgroundColor: '#22C7F0', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Upload Verification Documents (Not available)</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </View>
        )}
      </StateRenderer>
    </ScrollView>
  );
}
