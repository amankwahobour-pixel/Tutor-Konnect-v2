import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, useThemedStyles } from '@/theme';
import { createPageHeaderStyles } from './page-header.styles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  actionIconName?: keyof typeof Ionicons['glyphMap'];
  style?: ViewStyle;
}

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  actionIconName,
  style,
}: PageHeaderProps) {
  const styles = useThemedStyles(createPageHeaderStyles);
  const colors = useColors();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {onActionPress ? (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress} accessibilityRole="button" accessibilityLabel={actionLabel ?? 'Action'}>
          {actionIconName ? (
            <Ionicons name={actionIconName} size={20} color={colors.primary} />
          ) : null}
          {actionLabel ? <Text style={styles.actionLabel}>{actionLabel}</Text> : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
