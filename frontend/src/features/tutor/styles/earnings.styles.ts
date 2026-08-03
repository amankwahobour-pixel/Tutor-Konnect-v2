import { StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    width: '100%',
    height: 220,
  },

  headerContent: {
    position: 'absolute',
    top: 90,
    left: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.surface,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.disabled,
  },

  balanceCard: {
    marginTop: -35,
    marginHorizontal: 20,

    backgroundColor: colors.surface,
    borderRadius: 28,

    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  balanceLabel: {
    color: colors.textTertiary,
    fontSize: 15,
  },

  balanceAmount: {
    marginTop: 8,
    fontSize: 40,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.text,
  },

  withdrawButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  withdrawText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700' as TextStyle['fontWeight'],
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.primary,
  },

  statLabel: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#0F172A',
    marginBottom: 16,
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },

  studentName: {
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#0F172A',
  },

  subject: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textTertiary,
  },

  amount: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.primary,
  },

  date: {
    marginTop: 4,
    fontSize: 12,
    color: colors.placeholder,
  },
});

export default styles;
