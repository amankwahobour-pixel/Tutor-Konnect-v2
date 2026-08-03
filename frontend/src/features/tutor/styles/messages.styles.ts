import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#E2E8F0',
  },

  content: {
    marginTop: -35,
    paddingHorizontal: 20,
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C7F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  chatInfo: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  time: {
    color: '#94A3B8',
    fontSize: 12,
  },

  message: {
    flex: 1,
    color: '#64748B',
    fontSize: 14,
    marginRight: 10,
  },

  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#22C7F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
