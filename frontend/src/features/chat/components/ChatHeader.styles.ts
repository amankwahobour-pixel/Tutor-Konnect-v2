import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 18,

    backgroundColor: colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: colors.background,

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    marginLeft: 14,

    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: '#DBF4FF',

    justifyContent: 'center',
    alignItems: 'center',

    position: 'relative',
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '700',

    color: colors.primary,
  },

  onlineDot: {
    position: 'absolute',

    right: 2,
    bottom: 2,

    width: 14,
    height: 14,

    borderRadius: 7,

    /* success tint - no direct token available in global theme */
    backgroundColor: '#22C55E',

    borderWidth: 2,
    borderColor: colors.surface,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',

    color: colors.text,
  },

  status: {
    marginTop: 3,

    fontSize: 13,

    color: '#22C55E',
  },

  iconButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: colors.background,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,
  },
});