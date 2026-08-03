import React from 'react';
import { View, Image, Text, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorEarnings } from '@/api/tutor';
import { StateRenderer } from '@/components/common';
import styles from '../styles/withdrawals.styles';
import { colors } from '@/theme';
import { createWithdrawal, getTutorWithdrawals } from '../api/withdrawals.api';

const PROVIDERS = [
  { key: 'mtn', label: 'MTN' },
  { key: 'vodafone', label: 'Vodafone' },
  { key: 'airteltigo', label: 'AirtelTigo' },
];

export default function WithdrawalsScreen() {
  const { user } = useAuthContext();
  const [earnings, setEarnings] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [amount, setAmount] = React.useState('');
  const [provider, setProvider] = React.useState<string>(PROVIDERS[0].key);
  const [mobileNumber, setMobileNumber] = React.useState('');

  const [withdrawals, setWithdrawals] = React.useState<any[] | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;
      const res = await getTutorEarnings(user.id);
      if (res?.data) setEarnings(res.data);

      try {
        const wres = await getTutorWithdrawals(user.id);
        if (wres?.data) setWithdrawals(wres.data);
      } catch (werr) {
        // Backend may not expose withdrawals endpoint yet - leave withdrawals null/empty
        console.debug('Withdrawals endpoint unavailable or failed', werr);
        setWithdrawals([]);
      }
    } catch (err) {
      console.error('Failed to load earnings', err);
      setError(err instanceof Error ? err : new Error('Failed to load earnings'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);


  const validateAndSubmit = async () => {
    if (!earnings) {
      Alert.alert('Unavailable', 'Earnings not loaded. Try again.');
      return;
    }

    const available = Number(earnings.available ?? 0);
    const val = Number(amount);

    if (Number.isNaN(val) || val <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than zero.');
      return;
    }

    if (val > available) {
      Alert.alert('Insufficient balance', 'Requested amount exceeds available balance.');
      return;
    }

    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 9) {
      Alert.alert('Invalid number', 'Please enter a valid mobile money number.');
      return;
    }

    // Submit withdrawal request - backend endpoint may not exist yet
    try {
      const payload = {
        tutorId: user?.id ?? '',
        amount: val,
        provider,
        mobileMoneyNumber: mobileNumber,
      };

      await createWithdrawal(payload);
      Alert.alert('Requested', 'Your withdrawal request has been submitted.');
      setAmount('');
      setMobileNumber('');
      // Refresh list
      await load();
    } catch (err) {
      console.error('Failed to submit withdrawal', err);
      // Backend unsupported: surface a TODO-like message and leave a helpful alert
      Alert.alert('Not available', 'Withdrawals are not yet supported by the backend. TODO: Implement POST /withdrawals endpoint.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/header-wave.png')} style={styles.header} resizeMode="cover" />

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={load}
        loadingMessage="Loading earnings..."
        errorTitle="Failed to load earnings"
      >
        {() => (
          <View style={styles.content}>
            <Text style={styles.title}>Withdraw Funds</Text>

              <View style={styles.card}>
                <Text style={{ marginBottom: 8 }}>Available balance</Text>
                <Text style={{ fontWeight: '700', fontSize: 18 }}>{earnings?.available != null ? `₵${earnings.available}` : '₵0'}</Text>
              </View>

            <View style={styles.card}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Request Withdrawal</Text>

              <Text style={{ marginBottom: 6 }}>Amount (GHS)</Text>
              <TextInput value={amount} onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))} keyboardType="numeric" style={styles.input} />

              <Text style={{ marginBottom: 6 }}>Provider</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {PROVIDERS.map((p) => (
                  <TouchableOpacity key={p.key} onPress={() => setProvider(p.key)} style={[styles.providerButton, { backgroundColor: provider === p.key ? '#E6F8FF' : colors.surface }]}> 
                    <Text style={{ color: provider === p.key ? colors.text : colors.textSecondary, fontWeight: provider === p.key ? '700' : '400' }}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ marginBottom: 6 }}>Mobile money number</Text>
              <TextInput value={mobileNumber} onChangeText={(v) => setMobileNumber(v.replace(/\s/g, ''))} placeholder="e.g., 0244123456" keyboardType="phone-pad" style={styles.input} />

              <TouchableOpacity onPress={validateAndSubmit} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' }}>
                <Text style={{ color: colors.surface, fontWeight: '700' }}>Request Withdrawal</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontWeight: '700', fontSize: 18, marginVertical: 12 }}>Withdrawal History</Text>

            {withdrawals === null ? (
              <View style={styles.card}>
                <Text style={{ color: colors.textTertiary }}>Withdrawals not available (backend endpoint may be missing).</Text>
              </View>
            ) : withdrawals.length === 0 ? (
              <View style={styles.card}>
                <Text style={{ color: colors.textTertiary }}>No withdrawals yet.</Text>
              </View>
            ) : (
              <FlatList
                data={withdrawals}
                keyExtractor={(w) => w.id}
                renderItem={({ item: w }) => (
                  <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: '700' }}>₵{w.amount}</Text>
                      <Text style={{ color: colors.textTertiary }}>{w.status}</Text>
                    </View>
                    <Text style={{ color: colors.placeholder, marginTop: 6 }}>{w.provider} • {w.mobile_money_number}</Text>
                    {w.failure_reason ? <Text style={{ color: '#DC2626', marginTop: 6 }}>Failure: {w.failure_reason}</Text> : null}
                    <Text style={{ color: colors.placeholder, marginTop: 6 }}>{new Date(w.created_at).toLocaleDateString()}</Text>
                  </View>
                )}
              />
            )}

            <View style={{ height: 40 }} />
          </View>
        )}
      </StateRenderer>
    </View>
  );
}
