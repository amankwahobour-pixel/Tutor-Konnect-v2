import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { HelperText } from './HelperText';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
}

function DropdownComponent({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select',
  searchable = false,
  disabled = false,
  loading = false,
  error,
  style,
  dropdownStyle,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const selectedOption = options.find((option) => option.value === selectedValue);
  const borderColor = error ? colors.danger : colors.border;

  return (
    <View style={style}>
      <Pressable
        disabled={disabled || loading}
        onPress={() => setIsOpen((prev) => !prev)}
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor,
          padding: spacing.sm,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        accessibilityRole="button"
        accessibilityLabel={selectedOption?.label ?? placeholder}
      >
        <AppText variant="body" color={selectedOption ? 'text' : 'textSecondary'}>
          {selectedOption?.label ?? placeholder}
        </AppText>
        {loading ? <ActivityIndicator color={colors.primary} /> : <Text>{isOpen ? '▲' : '▼'}</Text>}
      </Pressable>

      {isOpen ? (
        <View
          style={[
            {
              marginTop: spacing.xs,
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              ...shadows.sm,
              maxHeight: 240,
            },
            dropdownStyle,
          ]}
        >
          {searchable ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor={colors.placeholder}
              style={{
                backgroundColor: colors.background,
                margin: spacing.sm,
                borderRadius: radius.sm,
                padding: spacing.sm,
                color: colors.text,
              }}
            />
          ) : null}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onValueChange(item.value);
                  setIsOpen(false);
                  setQuery('');
                }}
                style={{ padding: spacing.sm }}
              >
                <AppText variant="body">{item.label}</AppText>
              </Pressable>
            )}
          />
        </View>
      ) : null}
      {error ? <HelperText text={error} variant="error" /> : null}
    </View>
  );
}

DropdownComponent.displayName = 'Dropdown';

export const Dropdown = React.memo(DropdownComponent);

