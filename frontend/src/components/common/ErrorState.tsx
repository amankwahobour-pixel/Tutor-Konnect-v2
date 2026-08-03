import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './error-state.styles';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try Again' }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (
        <TouchableOpacity style={styles.button} onPress={onRetry} accessibilityRole="button" accessibilityLabel={retryLabel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

