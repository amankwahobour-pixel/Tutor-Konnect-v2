import { StyleSheet } from 'react-native';
import { type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
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
  input: {
    borderWidth: 1,
    borderColor: '#E6EEF8',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  providerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6EEF8',
  },
});
