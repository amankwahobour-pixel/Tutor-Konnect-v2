import { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemedStyles } from '@/theme';
import { createCardStyles } from './card.styles';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const styles = useThemedStyles(createCardStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}
