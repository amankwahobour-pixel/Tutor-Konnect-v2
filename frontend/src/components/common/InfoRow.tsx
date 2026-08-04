import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useColors, spacing, type ColorPalette } from '@/theme';

interface InfoRowProps {
  icon: string;
  label: string;
  value?: string;
  children?: React.ReactNode;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function InfoRow({ icon, label, value, children, iconColor, style }: InfoRowProps) {
  const colors = useColors();
  const styles = getStyles(colors);
  const accent = iconColor ?? colors.primary;
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.iconBox, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon as any} size={16} color={accent} />
      </View>
      <AppText variant="bodySmall" color="textSecondary" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.valueContainer}>
        {children ? children : <AppText variant="body" style={styles.value}>{value}</AppText>}
      </View>
    </View>
  );
}

function getStyles(colors: ColorPalette) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    iconBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      flex: 1,
    },
    valueContainer: {
      flexShrink: 1,
    },
    value: {
      fontWeight: '600',
      textAlign: 'right',
      color: colors.text,
    },
  });
}
