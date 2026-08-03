import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { pushPath, buildChatRoute } from '@/lib/navigation';
import styles from '../styles/students.styles';
import { getAllStudents } from '@/api/profile';
import { StateRenderer } from '@/components';
import type { UserProfile, ApiResponse } from '@/types';

interface StudentWithProgress extends UserProfile {
  subject?: string;
  nextLesson?: string;
  progress?: number;
}

export default function StudentsScreen() {
  const [students, setStudents] = React.useState<StudentWithProgress[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadStudents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllStudents() as ApiResponse<StudentWithProgress[]>;
      if (res?.data) setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students', err);
      setError(err instanceof Error ? err : new Error('Failed to load students'));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // The loader performs async state updates; calling it here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStudents();
  }, [loadStudents]);

  const renderItem = useCallback(
    ({ item }: { item: StudentWithProgress }) => (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.full_name?.charAt(0) || 'S'}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{item.full_name || 'Student'}</Text>
            <Text style={styles.subject}>{item.subject || 'No subject'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.lessonRow}>
          <Text style={styles.label}>Next Lesson</Text>
          <Text style={styles.value}>{item.nextLesson || '—'}</Text>
        </View>

        <View style={styles.lessonRow}>
          <Text style={styles.label}>Progress</Text>
          <Text style={styles.progressText}>{item.progress ?? 0}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress ?? 0}%` }]} />
        </View>

        <Pressable
          style={styles.messageButton}
          accessibilityRole="button"
          accessibilityLabel={`Message ${item.full_name || 'student'}`}
          onPress={() => {
            if (item.id) pushPath(buildChatRoute(item.id));
          }}
        >
          <Text style={styles.messageText}>Message Student</Text>
        </Pressable>
      </View>
    ),
    [],
  );

  const listHeader = (
    <>
      <Image source={require('@/assets/images/header-wave.png')} style={styles.header} resizeMode="cover" />
      <View style={styles.headerContent}>
        <Text style={styles.title}>My Students</Text>
        <Text style={styles.subtitle}>Manage your active learners</Text>
      </View>
    </>
  );

  return (
    <StateRenderer
      status={loading ? 'loading' : error ? 'error' : students.length === 0 ? 'empty' : 'success'}
      error={error}
      onRetry={loadStudents}
      loadingMessage="Loading your students..."
      errorTitle="Failed to load students"
      emptyTitle="No students yet"
      emptySubtitle="Your active learners will appear here."
    >
      {() => (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
          ListHeaderComponent={listHeader}
          ListFooterComponent={<View style={{ height: 40 }} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={12}
        />
      )}
    </StateRenderer>
  );
}
