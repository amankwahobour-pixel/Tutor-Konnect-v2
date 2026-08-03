import React from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { initiatePayment, getPaymentsForBooking } from '@/features/payments/api/payments.api';
import { StateRenderer, Button } from '@/components';
import styles from '../styles/payments.styles';
import { useApi } from '@/hooks/use-api';

export default function PaymentInitiateScreen() {
  const params = useLocalSearchParams();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : (params.bookingId || '');
  const amountParam = Array.isArray(params.amount) ? params.amount[0] : (params.amount || '');
  const amount = Number(amountParam) || 0;

  const [provider, setProvider] = React.useState<'mtn' | 'vodafone' | 'airteltigo' | ''>('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const { data: existingPaymentsResponse, loading: paymentsLoading, error: paymentsError, refetch } = useApi(
    () => {
      if (!bookingId) return Promise.resolve({ data: [] as import('@/types').Payment[] });
      return getPaymentsForBooking(bookingId).then((res) => ({ data: res.data ?? [] }));
    },
    [bookingId]
  );

  const existingPayments = existingPaymentsResponse?.data ?? [];


  const onPay = async () => {
    if (!bookingId) return Alert.alert('Missing booking', 'Booking ID is missing');
    if (!provider) return Alert.alert('Select provider', 'Please select a mobile money provider');
    if (!mobileNumber) return Alert.alert('Enter number', 'Please enter your mobile money number');

    setSubmitting(true);
    try {
      const res = await initiatePayment({ booking_id: bookingId, amount, provider, mobile_money_number: mobileNumber });
      if (res?.data && res.data.length > 0) {
        Alert.alert('Payment initiated', 'Your payment request was created. Please follow the provider flow to complete payment.');
        const payment = res.data[0];
        router.push(`/(student)/payment-details?paymentId=${payment.id}`);
      } else {
        Alert.alert('Payment', res?.message || 'Payment initiated');
      }
    } catch (err) {
      console.error('Payment initiation failed', err);
      Alert.alert('Payment failed', (err as Error).message || 'Failed to initiate payment');
    } finally {
      setSubmitting(false);
      void refetch();
    }
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      <StateRenderer status={paymentsLoading ? 'loading' : paymentsError ? 'error' : 'success'} error={paymentsError} onRetry={refetch} loadingMessage="Loading..." errorTitle="Failed to load">
        {() => (
          <>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Pay for Booking</Text>
            <Text style={{ marginBottom: 12 }}>Booking: {bookingId}</Text>
            <Text style={{ marginBottom: 12 }}>Amount: ₵{amount.toFixed(2)}</Text>

            <View style={styles.form}>
              <Text style={{ marginBottom: 6 }}>Provider</Text>
              <View style={styles.providerRow}>
                <TouchableOpacity onPress={() => setProvider('mtn')} style={[styles.providerButton, provider === 'mtn' ? styles.providerButtonActive : {}]} accessibilityRole="button" accessibilityLabel="Select MTN">
                  <Text style={provider === 'mtn' ? styles.providerTextActive : styles.providerText}>MTN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setProvider('vodafone')} style={[styles.providerButton, provider === 'vodafone' ? styles.providerButtonActive : {}]} accessibilityRole="button" accessibilityLabel="Select Vodafone">
                  <Text style={provider === 'vodafone' ? styles.providerTextActive : styles.providerText}>Vodafone</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setProvider('airteltigo')} style={[styles.providerButton, provider === 'airteltigo' ? styles.providerButtonActive : {}]} accessibilityRole="button" accessibilityLabel="Select AirtelTigo">
                  <Text style={provider === 'airteltigo' ? styles.providerTextActive : styles.providerText}>AirtelTigo</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ marginBottom: 6 }}>Mobile Money Number</Text>
              <TextInput value={mobileNumber} onChangeText={setMobileNumber} placeholder="e.g. 0244123456" style={styles.input} autoComplete="tel" keyboardType="phone-pad" accessibilityLabel="Mobile money number" />

              <Button title={submitting ? 'Processing...' : 'Pay Now'} onPress={onPay} disabled={submitting} />
            </View>

            <View style={{ height: 16 }} />

            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Existing Payments</Text>
            {existingPayments.length === 0 ? (
              <Text style={{ color: '#64748B' }}>No payments yet</Text>
            ) : (
              existingPayments.map((p: import('@/types').Payment) => (
                <View key={p.id} style={styles.itemCard}>
                  <Text>Amount: ₵{p.amount}</Text>
                  <Text>Status: {p.payment_status}</Text>
                  <Text>Provider: {p.provider}</Text>
                </View>
              ))
            )}

          </>
        )}
      </StateRenderer>
    </ScrollView>
  );
}
