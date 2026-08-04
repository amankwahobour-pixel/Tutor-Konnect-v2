import React from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { styles as createStyles } from '../styles/earnings.styles';
import { useThemedStyles } from '@/theme';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorEarnings } from '@/api/tutor';
import { StateRenderer } from '@/components';
import type { Earnings } from '@/types';
import { useApi } from '@/hooks/use-api';

interface Transaction {
  id: number;
  student: string;
  subject: string;
  amount: string;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    student: 'Kwame Asare',
    subject: 'Mathematics',
    amount: '₵120',
    date: 'Today',
  },
  {
    id: 2,
    student: 'Ama Mensah',
    subject: 'English',
    amount: '₵90',
    date: 'Yesterday',
  },
  {
    id: 3,
    student: 'David Owusu',
    subject: 'Science',
    amount: '₵150',
    date: '2 days ago',
  },
  {
    id: 4,
    student: 'Sarah Addo',
    subject: 'ICT',
    amount: '₵100',
    date: '3 days ago',
  },
];

export default function EarningsScreen() {
  const styles = useThemedStyles(createStyles);
  const { user } = useAuthContext();

  const {
    data: earningsResponse,
    loading,
    error,
    refetch,
  } = useApi(
    () => {
      if (!user?.id) return Promise.resolve({ data: null as Earnings | null });
      return getTutorEarnings(user.id).then((res) => ({ data: res.data }));
    },
    [user?.id]
  );

  const earnings = earningsResponse?.data ?? null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Waves */}
      <Image
        source={require('@/assets/images/header-wave.png')}
        style={styles.header}
        resizeMode="cover"
      />

      <View style={styles.headerContent}>
        <Text style={styles.title}>
          Earnings
        </Text>

        <Text style={styles.subtitle}>
          Track your tutoring income
        </Text>
      </View>

      {/* Earnings Card */}
      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={refetch}
        loadingMessage="Loading your earnings..."
        errorTitle="Failed to load earnings"
      >
        {() => (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>
                Total Earnings
              </Text>

              <Text style={styles.balanceAmount}>
                {earnings?.total_earned != null ? `₵${earnings.total_earned}` : '₵0'}
              </Text>

              <TouchableOpacity
               style={styles.withdrawButton}
               onPress={() => router.push('/(tutor)/withdrawals')}
               accessibilityRole="button"
               accessibilityLabel="Withdraw funds"
              >
               <Text style={styles.withdrawText}>
                 Withdraw Funds
               </Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                    {earnings?.available != null ? `₵${earnings.available}` : '₵0'}
                </Text>

                <Text style={styles.statLabel}>
                    Available
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                    {earnings?.pending != null ? `₵${earnings.pending}` : '₵0'}
                </Text>

                <Text style={styles.statLabel}>
                    Pending
                </Text>
              </View>
            </View>

            {/* Recent Transactions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recent Payments
              </Text>

              {transactions.map((item) => (
                <View
                  key={item.id}
                  style={styles.transactionCard}
                >
                  <View>
                    <Text style={styles.studentName}>
                      {item.student}
                    </Text>

                    <Text style={styles.subject}>
                      {item.subject}
                    </Text>
                  </View>

                  <View style={styles.transactionRight}>
                    <Text style={styles.amount}>
                      {item.amount}
                    </Text>

                    <Text style={styles.date}>
                      {item.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </>
        )}
      </StateRenderer>
    </ScrollView>
  );
}