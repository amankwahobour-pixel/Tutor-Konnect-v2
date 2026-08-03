import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getPaymentsForUser } from '@/features/payments/api/payments.api';
import { StateRenderer } from '@/components';
import styles from '../styles/payments.styles';
import { colors } from '@/theme';

export default function PaymentHistoryScreen() {
  const { user } = useAuthContext();
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;
      const res = await getPaymentsForUser(user.id);
      if (res?.data) setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments', err);
      setError(err instanceof Error ? err : new Error('Failed to load payments'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <View style={styles.container}>
      <StateRenderer status={loading ? 'loading' : error ? 'error' : payments.length === 0 ? 'empty' : 'success'} error={error} onRetry={load} loadingMessage="Loading payments..." errorTitle="Failed to load payments" emptyTitle="No payments yet" emptySubtitle="Your completed payments will appear here.">
        {() => (
          <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={payments}
            keyExtractor={(item) => item.id}
            renderItem={({ item: p }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(student)/payment-details?paymentId=${p.id}`)}
                style={styles.itemCard}
                accessibilityRole="button"
                accessibilityLabel={`Open payment ${p.id}`}
              >
                <Text style={{ fontWeight: '700' }}>₵{p.amount}</Text>
                <Text style={{ color: colors.textTertiary }}>{p.provider} • {p.payment_status}</Text>
                <Text style={{ color: colors.placeholder, marginTop: 6 }}>{p.created_at}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<View style={{ height: 120 }} />}
          />
        )}
      </StateRenderer>
    </View>
  );
}
