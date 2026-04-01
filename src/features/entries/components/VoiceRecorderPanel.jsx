import { Pressable, StyleSheet, Text, View } from 'react-native';

export function VoiceRecorderPanel({
  voicePath,
  isRecording,
  onStartRecording,
  onStopRecording,
  onDeleteVoice,
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>音声メモ</Text>
      <Text style={styles.path}>
        {voicePath ? '録音済みの音声メモがあります。' : 'まだ音声はありません'}
      </Text>
      <View style={styles.actions}>
        {isRecording ? (
          <Pressable onPress={onStopRecording} style={[styles.button, styles.stopButton]}>
            <Text style={styles.buttonText}>録音を停止</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onStartRecording} style={styles.button}>
            <Text style={styles.buttonText}>{voicePath ? '再録音する' : '録音を開始'}</Text>
          </Pressable>
        )}
        {voicePath ? (
          <Pressable onPress={onDeleteVoice} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>音声を削除</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7d7df',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#25313f',
  },
  path: {
    marginTop: 8,
    color: '#516072',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    borderRadius: 999,
    backgroundColor: '#2f6f91',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  stopButton: {
    backgroundColor: '#1f5a77',
  },
  deleteButton: {
    backgroundColor: '#7a4f40',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
