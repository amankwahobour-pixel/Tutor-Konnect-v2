import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },

  dashboardWrap: {
    flex: 1,
  },

  scrollContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingBottom: spacing['4xl'],
  },
});
