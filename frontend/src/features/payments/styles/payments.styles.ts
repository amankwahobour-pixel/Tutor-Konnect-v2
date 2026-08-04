import { StyleSheet } from 'react-native';
import { type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  form: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderColor: colors.border,
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
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
});

export default styles;
