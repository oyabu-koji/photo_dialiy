import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoStrip } from '../components/PhotoStrip';
import { VoiceRecorderPanel } from '../components/VoiceRecorderPanel';
import { useAddEntryForm } from '../hooks/useAddEntryForm';

export function AddEntryScreen({ routeParams, onSaved, onCancel }) {
  const scrollViewRef = useRef(null);
  const {
    formState,
    isEditMode,
    addPhoto,
    removePhoto,
    updateTitle,
    startRecording,
    stopRecording,
    deleteVoice,
    save,
    reload,
  } = useAddEntryForm(routeParams);

  const isRecording = formState.status === 'recording';
  const isLoading = formState.status === 'loadingAssets';
  const isSaving = formState.status === 'saving';
  const isError = formState.status === 'error';

  async function handleSave() {
    try {
      const savedEntry = await save();
      onSaved(savedEntry);
    } catch (_error) {
      // error state is already reflected in the hook
    }
  }

  function handleTitleFocus() {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  if (isEditMode && isLoading && formState.photos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>編集内容を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isEditMode && isError && formState.photos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>編集画面を開けませんでした</Text>
          <Text style={styles.loadingBody}>{formState.errorMessage}</Text>
          <View style={styles.inlineActions}>
            <Pressable onPress={reload} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>再読み込み</Text>
            </Pressable>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>戻る</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={12}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>タイトル</Text>
            <TextInput
              accessibilityLabel="イベントタイトル"
              onChangeText={updateTitle}
              onFocus={handleTitleFocus}
              placeholder="タイトルを入力"
              returnKeyType="done"
              style={styles.titleInput}
              value={formState.title}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>写真</Text>
              <Pressable onPress={addPhoto} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>写真を追加</Text>
              </Pressable>
            </View>
            <PhotoStrip
              editable
              onRemovePhoto={removePhoto}
              photos={formState.photos}
            />
          </View>

          <VoiceRecorderPanel
            isRecording={isRecording}
            onDeleteVoice={deleteVoice}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            voicePath={formState.draftVoicePath}
          />

          {formState.errorMessage ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>保存前に確認が必要です</Text>
              <Text style={styles.errorBody}>{formState.errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </Pressable>
            <Pressable
              accessibilityState={{
                disabled: !formState.canSave || isLoading || isSaving || isRecording,
              }}
              disabled={!formState.canSave || isLoading || isSaving || isRecording}
              onPress={handleSave}
              style={[
                styles.primaryButton,
                !formState.canSave || isLoading || isSaving || isRecording
                  ? styles.primaryButtonDisabled
                  : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? '保存中...' : isEditMode ? '更新する' : '保存する'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f2ee',
  },
  content: {
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b2e2a',
  },
  titleInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d9c9ba',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2d231f',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#2f6f91',
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    backgroundColor: '#a4b6c2',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9c9ba',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#5a463b',
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4c7be',
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#5a463b',
    fontWeight: '700',
  },
  errorCard: {
    borderRadius: 18,
    backgroundColor: '#fff0ee',
    borderWidth: 1,
    borderColor: '#e8b3a8',
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7f3326',
  },
  errorBody: {
    marginTop: 6,
    color: '#8a4436',
  },
  loadingCard: {
    margin: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9c9ba',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3b2e2a',
  },
  loadingBody: {
    marginTop: 8,
    color: '#5f4b43',
  },
  inlineActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
});
