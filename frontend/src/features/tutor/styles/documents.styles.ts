import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  headerWaves: {
    width: '100%',
    height: 120,
  },
  card: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    marginBottom: 6,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6EEF8',
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  docPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
