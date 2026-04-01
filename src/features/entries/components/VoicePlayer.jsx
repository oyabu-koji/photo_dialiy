import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function VoicePlayer({ voicePath }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        void soundRef.current.unloadAsync();
      }
    };
  }, []);

  async function togglePlayback() {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: voicePath });

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) {
            return;
          }

          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
        soundRef.current = sound;
      }

      const status = await soundRef.current.getStatusAsync();

      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }

      setErrorMessage(null);
    } catch (_error) {
      setErrorMessage('音声を再生できませんでした');
      setIsPlaying(false);
    }
  }

  if (!voicePath) {
    return (
      <View style={styles.panel}>
        <Text style={styles.title}>音声メモ</Text>
        <Text style={styles.body}>音声は保存されていません。</Text>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>音声メモ</Text>
      <Text style={styles.body}>音声メモを保存済みです。</Text>
      <Pressable
        onPress={togglePlayback}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{isPlaying ? '停止' : '再生'}</Text>
      </Pressable>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#25313f',
  },
  body: {
    marginTop: 8,
    color: '#516072',
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#2f6f91',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    marginTop: 10,
    color: '#7f3326',
  },
});
