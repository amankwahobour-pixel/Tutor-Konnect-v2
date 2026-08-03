import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    marginBottom: 8,
  },
  form: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  providerButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: colors.surface,
  },
  providerButtonActive: {
     backgroundColor: colors.primary,
  },
  providerText: {
     color: colors.text,
  },
  providerTextActive: {
     color: colors.surface,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6EEF8',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
});

export default styles;
