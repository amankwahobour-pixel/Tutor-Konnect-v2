import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, View, type TextInputProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export interface OTPInputProps extends Omit<TextInputProps, 'onChange' | 'style'> {
  length?: 4 | 6;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  disabled?: boolean;
  countdownSeconds?: number;
  onCountdownComplete?: () => void;
  style?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<ViewStyle>;
  cellTextStyle?: StyleProp<TextStyle>;
}

const OTPInputComponent = React.forwardRef<TextInput, OTPInputProps>(
  function OTPInputComponent(
    {
      length = 6,
      value,
      onChange,
      autoFocus = false,
      placeholder = '•',
      disabled = false,
      countdownSeconds,
      onCountdownComplete,
      style,
      cellStyle,
      cellTextStyle,
      ...props
    }: OTPInputProps,
    ref,
  ) {
    const [timer, setTimer] = useState(countdownSeconds ?? 0);
    const inputs = useMemo(() => Array.from({ length }, (_, index) => index), [length]);
    const hiddenInputRef = useRef<TextInput>(null);
    const display = useMemo(() => value.padEnd(length, ''), [value, length]);

    useEffect(() => {
      if (autoFocus && !disabled) {
        hiddenInputRef.current?.focus();
      }
    }, [autoFocus, disabled]);

    useEffect(() => {
      if (!countdownSeconds || timer <= 0) return;
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            onCountdownComplete?.();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [countdownSeconds, onCountdownComplete, timer]);

    const handleChange = (text: string) => {
      const sanitized = text.replace(/[^0-9]/g, '').slice(0, length);
      onChange(sanitized);
    };

    return (
      <View style={style}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
          {inputs.map((index) => (
            <View
              key={index}
              style={[
                {
                  width: spacing.xxl,
                  height: spacing.xxl,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.surface,
                },
                cellStyle,
              ]}
            >
              <AppText variant="h2" color={value[index] ? 'text' : 'textSecondary'} style={cellTextStyle}>
                {display[index] || placeholder}
              </AppText>
            </View>
          ))}
        </View>
        <TextInput
          ref={hiddenInputRef}
          value={value}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={length}
          editable={!disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
          }}
          {...props}
        />
        {typeof countdownSeconds === 'number' ? (
          <AppText variant="caption" color="textSecondary" style={{ marginTop: spacing.sm }}>
            {timer}s
          </AppText>
        ) : null}
      </View>
    );
  },
);

const MemoizedOTPInput = React.memo(OTPInputComponent);
MemoizedOTPInput.displayName = 'OTPInput';

export { MemoizedOTPInput as OTPInput };

