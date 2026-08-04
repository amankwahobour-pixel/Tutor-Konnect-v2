import React, { createContext, useCallback, useContext, useState } from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, type ColorPalette, radius, spacing, typography } from '@/theme';

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

function getVariantConfig(colors: ColorPalette, variant: ToastVariant) {
  switch (variant) {
    case 'success': return { icon: 'checkmark-circle', color: colors.success, bg: colors.successLight };
    case 'error': return { icon: 'alert-circle', color: colors.danger, bg: colors.dangerLight };
    case 'warning': return { icon: 'warning', color: colors.warning, bg: colors.warningLight };
    case 'info': return { icon: 'information-circle', color: colors.primary, bg: colors.primaryLight };
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colors = useColors();
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

  const config = toast ? getVariantConfig(colors, toast.variant ?? 'info') : null;

  const dynamicStyles = getToastStyles(colors);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && config && (
        <Animated.View
          pointerEvents="none"
          style={[dynamicStyles.container, { opacity }]}
        >
          <View style={[dynamicStyles.toast, { backgroundColor: config.bg, shadowColor: colors.shadow }]}>
            <Ionicons name={config.icon as any} size={20} color={config.color} />
            <Text style={dynamicStyles.message}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

function getToastStyles(colors: ColorPalette) {
  return StyleSheet.create({
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
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    message: {
      color: colors.text,
      fontSize: typography.bodySmall,
      fontWeight: '500',
    },
  });
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
