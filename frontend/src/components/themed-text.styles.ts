import { StyleSheet, Platform, TextStyle } from 'react-native';
import { Fonts } from '@/constants/theme';

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  title: {
    fontSize: 48,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: (Platform.select({ android: '700' }) ?? '500') as TextStyle['fontWeight'],
    fontSize: 12,
  },
});

export default styles;
