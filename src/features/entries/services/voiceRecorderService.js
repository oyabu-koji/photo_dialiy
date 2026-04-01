import { Audio } from 'expo-av';

let recordingSession = null;

export async function startRecording() {
  const permission = await Audio.requestPermissionsAsync();

  if (!permission.granted) {
    throw new Error('マイクへのアクセスを許可してください');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();

  recordingSession = recording;

  return recordingSession;
}

export async function stopRecording() {
  if (!recordingSession) {
    throw new Error('録音を開始してから停止してください');
  }

  await recordingSession.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  const path = recordingSession.getURI();
  recordingSession = null;

  if (!path) {
    throw new Error('録音ファイルを取得できませんでした');
  }

  return {
    path,
  };
}

export async function deleteRecording() {
  return null;
}

export function __resetVoiceRecorderService() {
  recordingSession = null;
}
