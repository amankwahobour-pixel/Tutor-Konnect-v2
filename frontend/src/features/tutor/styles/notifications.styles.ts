import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  scrollContent: {
    paddingBottom: 40,
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

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C7F0',
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F0FBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 24,
  },

  textContainer: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C7F0',
  },

  description: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },

  time: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
});
