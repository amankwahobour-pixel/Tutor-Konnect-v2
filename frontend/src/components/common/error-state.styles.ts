import { StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.text,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
});

export default styles;
