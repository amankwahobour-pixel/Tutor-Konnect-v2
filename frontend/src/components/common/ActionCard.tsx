import { ReactNode } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useThemedStyles } from '@/theme';
import { createActionCardStyles } from './action-card.styles';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ActionCard({ title, subtitle, icon, onPress, style }: ActionCardProps) {
  const styles = useThemedStyles(createActionCardStyles);
  const Card = onPress ? TouchableOpacity : View;

  return (
    <Card style={[styles.container, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Card>
  );
}
