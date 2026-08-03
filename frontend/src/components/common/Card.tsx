import { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import styles from './card.styles';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

