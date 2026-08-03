import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, Alert } from 'react-native';
import { getPayment } from '@/features/payments/api/payments.api';
import { StateRenderer, Button } from '@/components';
import styles from '../styles/payments.styles';
import { useApi } from '@/hooks/use-api';

export default function PaymentDetailsScreen() {
  const params = useLocalSearchParams();
  const paymentId = Array.isArray(params.paymentId) ? params.paymentId[0] : (params.paymentId || '');

  const { data: paymentResponse, loading, error, refetch } = useApi(
    async () => {
      if (!paymentId) return Promise.resolve({ data: null });
      const res = await getPayment(paymentId);
      if (res?.data && res.data.length > 0) return { data: res.data[0] };
      return { data: null };
    },
    [paymentId]
  );

  const payment = paymentResponse?.data ?? null;
  const handleRefresh = async () => void refetch();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      <StateRenderer status={loading ? 'loading' : error ? 'error' : payment ? 'success' : 'empty'} error={error} onRetry={refetch} loadingMessage="Loading payment..." errorTitle="Failed to load payment" emptyTitle="Payment not found">
        {() => (
          payment && (
            <View>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>{`Payment ${payment.id}`}</Text>
              <Text style={{ marginTop: 8 }}>Amount: ₵{payment.amount}</Text>
              <Text>Provider: {payment.provider}</Text>
              <Text>Status: {payment.payment_status}</Text>
              <Text>Transaction ref: {payment.transaction_reference ?? '—'}</Text>
              <Text>Paid at: {payment.paid_at ?? '—'}</Text>

              <View style={{ height: 12 }} />

              {payment.payment_status === 'failed' && (
                <Button title="Retry Payment" onPress={() => Alert.alert('Retry', 'Retry flow not implemented here.')} />
              )}

              {payment.payment_status === 'processing' && (
                <Button title="Refresh" onPress={handleRefresh} />
              )}

              <View style={{ height: 40 }} />
            </View>
          )
        )}
      </StateRenderer>
    </ScrollView>
  );
}
