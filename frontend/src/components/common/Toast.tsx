import React, { createContext, useCallback, useContext, useState } from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '@/theme';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantConfig: Record<ToastVariant, { icon: string; color: string; bg: string }> = {
  success: { icon: 'checkmark-circle', color: colors.success, bg: colors.successLight },
  error: { icon: 'alert-circle', color: colors.danger, bg: colors.dangerLight },
  warning: { icon: 'warning', color: colors.warning, bg: colors.warningLight },
  info: { icon: 'information-circle', color: colors.primary, bg: colors.primaryLight },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null);
  const opacity = React.useRef(new Animated.Value(0)).current;

  const dismiss = React.useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [opacity]);

  const show = React.useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToast({ ...options, id });
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    const duration = options.duration ?? 3000;
    setTimeout(() => dismiss(), duration);
  }, [opacity, dismiss]);

  const value: ToastContextValue = {
    show,
    success: (message) => show({ message, variant: 'success' }),
    error: (message) => show({ message, variant: 'error' }),
    warning: (message) => show({ message, variant: 'warning' }),
    info: (message) => show({ message, variant: 'info' }),
  };

  const config = toast ? variantConfig[toast.variant ?? 'info'] : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && config && (
        <Animated.View
          pointerEvents="none"
          style={[styles.container, { opacity }]}
        >
          <View style={[styles.toast, { backgroundColor: config.bg }, shadows.md]}>
            <Ionicons name={config.icon as any} size={20} color={config.color} />
            <Text style={styles.message}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    maxWidth: 480,
  },
  message: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '500',
  },
});
