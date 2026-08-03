import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import styles from './empty-state.styles';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const defaultIcon = <Text style={{ fontSize: 36 }}>📭</Text>;
  return (
    <View style={styles.container} accessibilityLabel={title} accessibilityRole="text">
      <View style={styles.icon}>{icon ?? defaultIcon}</View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

