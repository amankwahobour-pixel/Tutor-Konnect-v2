import React from 'react';
import { ActivityIndicator, Pressable, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
  filterButton?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const SearchBar = React.memo(
  React.forwardRef<TextInput, SearchBarProps>(({ value, onChangeText, loading = false, placeholder = 'Search', filterButton, style, inputStyle, ...props }, ref) => {
    const showClear = !!value && !loading;

    return (
      <View style={[{ width: '100%', flexDirection: 'row', alignItems: 'center' }, style]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <AppText variant="body" color="textSecondary" style={{ marginRight: spacing.sm }}>
            🔍
          </AppText>
          <TextInput
            ref={ref}
            style={[
              {
                flex: 1,
                color: colors.text,
                fontSize: typography.body,
                minHeight: spacing.xxxl,
              },
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel={placeholder}
            {...props}
          />
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : showClear ? (
            <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search">
              <AppText variant="body" color="textSecondary">✕</AppText>
            </Pressable>
          ) : null}
        </View>
        {filterButton ? <View style={{ marginLeft: spacing.sm }}>{filterButton}</View> : null}
      </View>
    );
  }),
);
