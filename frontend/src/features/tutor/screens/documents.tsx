import React from 'react';
import { FlatList, Image, Text, View, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { StateRenderer, Button, Card } from '@/components';
import { useApi } from '@/hooks/use-api';
import { createTutorDocument, getTutorDocuments, deleteTutorDocument } from '../api/documents.api';
import { styles as createStyles } from '../styles/documents.styles';
import { colors, useThemedStyles } from '@/theme';

const DOCUMENT_TYPES = [
  { value: 'ghana_card_front', label: 'Ghana Card Front' },
  { value: 'ghana_card_back', label: 'Ghana Card Back' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'profile_photo', label: 'Profile Photo' },
  { value: 'other', label: 'Other' },
];

export default function DocumentsScreen() {
  const styles = useThemedStyles(createStyles);
  const { user } = useAuthContext();
  const [docType, setDocType] = React.useState(DOCUMENT_TYPES[0].value);
  const [fileUrl, setFileUrl] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const {
    data: docsResponse,
    loading,
    error,
    refetch: refetchDocs,
  } = useApi(
    () => {
      if (!user?.id) return Promise.resolve({ data: [] as import('@/types').TutorDocument[] });
      return getTutorDocuments(user.id).then((res) => ({ data: res.data ?? [] }));
    },
    [user?.id]
  );

  const documents = docsResponse?.data ?? [];

  const handleAdd = async () => {
    if (!user) return;
    if (!fileUrl) {
      Alert.alert('Missing URL', 'Please enter a public URL for the document or image.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        tutorId: user.id,
        documentType: docType,
        fileUrl: fileUrl,
        fileName: fileName || undefined,
      };
      const res = await createTutorDocument(payload);
      if (res?.success) {
        // refresh list from server after successful submit
        setFileUrl('');
        setFileName('');
        Alert.alert('Uploaded', 'Document submitted for verification.');
        void refetchDocs();
      }
    } catch (err) {
      console.error('Failed to submit document', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to submit document'));
      Alert.alert('Error', 'Failed to submit document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteTutorDocument(docId);
      // refresh list after delete
      void refetchDocs();
    } catch (err) {
      console.error('Failed to delete document', err);
      Alert.alert('Error', 'Failed to delete document.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/header-wave.png')} style={styles.headerWaves} resizeMode="cover" />

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={refetchDocs}
        loadingMessage="Loading documents..."
        errorTitle="Failed to load documents"
      >
        {() => (
          <View style={styles.content}>
            <Text style={styles.title}>Verification Documents</Text>
            <Text style={{ marginBottom: 12, color: colors.textTertiary }}>
              Upload or register documents required for verification. Provide a public URL to your document or image (e.g., an image hosted on Google Drive or a CDN).
            </Text>

            <Card style={styles.card}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add Document</Text>

              <Text style={styles.label}>Document Type</Text>
              <View style={{ marginBottom: 12 }}>
                {DOCUMENT_TYPES.map((t) => (
                  <TouchableOpacity key={t.value} onPress={() => setDocType(t.value)} style={{ marginBottom: 8 }} accessibilityRole="button" accessibilityLabel={`Select document type ${t.label}`}>
                    <Text style={{ color: docType === t.value ? colors.text : colors.textTertiary, fontWeight: docType === t.value ? '700' : '400' }}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>File URL</Text>
              <TextInput placeholder="https://..." value={fileUrl} onChangeText={setFileUrl} style={styles.input} autoCapitalize="none" />

              <Text style={styles.label}>File Name (optional)</Text>
              <TextInput placeholder="document.jpg" value={fileName} onChangeText={setFileName} style={styles.input} autoCapitalize="none" />

              {fileUrl ? (
                <ImageBackground source={{ uri: fileUrl }} resizeMode="cover" style={styles.docPreview}>
                  {/* Preview area */}
                </ImageBackground>
              ) : null}

              <View style={{ height: 8 }} />

              <Button title={submitting ? 'Submitting...' : 'Submit Document'} onPress={handleAdd} disabled={submitting} />

              {submitError ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ color: '#DC2626' }}>Upload failed. Try again.</Text>
                </View>
              ) : null}
            </Card>

            <Text style={{ fontWeight: '700', fontSize: 18, marginVertical: 12 }}>Submission History</Text>

            {documents.length === 0 ? (
              <View style={styles.card}>
                <Text style={{ color: colors.textTertiary }}>No documents uploaded yet.</Text>
              </View>
            ) : (
              <FlatList
                data={documents}
                keyExtractor={(doc) => doc.id}
                renderItem={({ item: doc }) => (
                  <View key={doc.id} style={styles.card}>
                    <View style={styles.inlineRow}>
                      <Text style={{ fontWeight: '700' }}>{doc.file_name ?? doc.file_url ?? 'Document'}</Text>
                      <TouchableOpacity onPress={() => handleDelete(doc.id)} accessibilityRole="button" accessibilityLabel={`Delete document ${doc.id}`}>
                        <Text style={{ color: '#DC2626' }}>Delete</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={{ color: colors.textTertiary, marginTop: 6 }}>{doc.document_type ?? '—'}</Text>
                    <Text style={{ color: colors.placeholder, marginTop: 6 }}>{new Date(doc.uploaded_at ?? doc.created_at ?? Date.now()).toLocaleDateString()}</Text>

                    {doc.file_url ? (
                      <ImageBackground source={{ uri: doc.file_url }} resizeMode="cover" style={[styles.docPreview, { marginTop: 8 }]} />
                    ) : null}
                  </View>
                )}
              />
            )}

            <View style={{ height: 40 }} />
          </View>
        )}
      </StateRenderer>
    </View>
  );
}
