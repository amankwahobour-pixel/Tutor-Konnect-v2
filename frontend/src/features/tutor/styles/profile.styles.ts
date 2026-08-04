import { StyleSheet, TextStyle } from 'react-native';
import { type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  headerWaves: {
    width: '100%',
    height: 220,
    position: 'absolute',
    top: 0,
  },

  profileContainer: {
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 30,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#22C7F0',
  },

  name: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#0F172A',
  },

  role: {
    marginTop: 4,
    fontSize: 15,
    color: '#64748B',
  },

  statusBadge: {
    marginTop: 12,
    backgroundColor: '#DDF7FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },

  statusText: {
    color: '#22C7F0',
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 13,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#0F172A',
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    color: '#64748B',
  },

  value: {
    fontSize: 15,
    fontWeight: '600' as any,
    color: '#0F172A',
    maxWidth: '55%',
    textAlign: 'right',
  },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#22C7F0',
  },

  statLabel: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#22C7F0',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 16,
  },
});

export default styles;
