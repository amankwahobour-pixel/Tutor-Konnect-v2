import React, { useCallback, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, TextInput, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getConversationBetween, sendMessage, markMessagesRead } from '@/features/chat/api/messages.api';
import { StateRenderer } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { colors, useThemedStyles } from '@/theme';
import { styles as createStyles } from '../styles/chat.styles';
import type { Message } from '@/features/chat/types';
import { useApi } from '@/hooks/use-api';
import { WaveHeader } from '@/components/headers';

interface MessageItemProps {
  message: Message;
  isOutgoing: boolean;
  styles: ReturnType<typeof createStyles>;
}

const MessageItem = React.memo(({ message, isOutgoing, styles }: MessageItemProps) => (
  <View style={[styles.messageRow, isOutgoing ? styles.outgoingRow : styles.incomingRow]}>
    {!isOutgoing ? <View style={styles.incomingAvatar} /> : null}
    <View style={[styles.messageBubble, isOutgoing ? styles.outgoing : styles.incoming]}>
      <AppText variant="body" style={[styles.messageText, isOutgoing && styles.outgoingText]}>{message.message}</AppText>
      <View style={styles.messageMeta}>
        <AppText variant="caption" style={[styles.messageTime, isOutgoing && styles.outgoingText]}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </AppText>
        {isOutgoing ? <Ionicons name="checkmark-done-outline" size={14} color={colors.surface} /> : null}
      </View>
    </View>
  </View>
));
MessageItem.displayName = 'MessageItem';

export default function ChatScreen() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams();
  const otherId = Array.isArray(params.otherId) ? params.otherId[0] : (params.otherId || '');
  const { user } = useAuthContext();
  const [text, setText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: convResponse, loading, error, refetch } = useApi(
    async () => {
      if (!user?.id || !otherId) return Promise.resolve({ data: [] as Message[] });
      const res = await getConversationBetween(user.id, otherId);
      const msgs = (res?.data ?? []) as Message[];
      const sorted = [...msgs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      const unreadIds = sorted.filter((message) => message.receiver_id === user.id && !message.is_read).map((message) => message.id);
      if (unreadIds.length > 0) {
        try {
          await markMessagesRead(unreadIds);
        } catch {
          // ignore mark-read failures and keep the conversation visible
        }
      }

      return { data: sorted };
    },
    [otherId, user?.id],
  );

  const messages = convResponse?.data ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !user || !otherId) return;
    const payload = { sender_id: user.id, receiver_id: otherId, message: text.trim() };
    setText('');
    try {
      await sendMessage(payload);
      await refetch();
    } catch (err) {
      console.error('Failed to send message', err);
      Alert.alert('Message failed', 'Your message could not be sent. Please try again.');
    }
  };

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isOutgoing = item.sender_id === user?.id;
      return <MessageItem message={item} isOutgoing={isOutgoing} styles={styles} />;
    },
    [user?.id],
  );

  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <WaveHeader
        title={otherId || 'Tutor'}
        subtitle="Online"
        backAction={{
          onPress: () => router.back(),
          accessibilityLabel: 'Go back',
        }}
      />
      <StateRenderer status={loading ? 'loading' : error ? 'error' : messages.length === 0 ? 'empty' : 'success'} error={error} onRetry={refetch} loadingMessage="Loading messages..." emptyTitle="No messages yet" emptySubtitle="Start the conversation with a message.">
        {() => (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            inverted
            removeClippedSubviews
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </StateRenderer>

      <View style={styles.composerContainer}>
        <View style={styles.composerRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Add attachment" style={styles.iconButton}>
            <Ionicons name="add-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            style={styles.inputWrap}
            accessibilityLabel="Message input"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Voice message" style={styles.iconButton}>
            <Ionicons name="mic-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Send message" onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={18} color={colors.surface} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
