import { StyleSheet, TextStyle } from 'react-native';
import { type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
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
    color: '#000000',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#000000',
  },

  content: {
    marginTop: -35,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C7F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
  },

  info: {
    marginLeft: 14,
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#0F172A',
  },

  subject: {
    marginTop: 4,
    color: '#64748B',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },

  lessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    color: '#64748B',
  },

  value: {
    color: '#0F172A',
    fontWeight: '600' as TextStyle['fontWeight'],
  },

  progressText: {
    color: '#22C7F0',
    fontWeight: '700' as TextStyle['fontWeight'],
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#22C7F0',
    borderRadius: 20,
  },

  messageButton: {
    backgroundColor: '#22C7F0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  messageText: {
    color: '#FFFFFF',
    fontWeight: '700' as any,
    fontSize: 15,
  },
});

export default styles;
