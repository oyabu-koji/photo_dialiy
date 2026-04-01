import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PhotoCarousel } from '../components/PhotoCarousel';
import { VoicePlayer } from '../components/VoicePlayer';
import { formatEntryDateLabel } from '../logic/createEntryTitle';
import { useEntryDetail } from '../hooks/useEntryDetail';

export function EntryDetailScreen({ entryId, onEditEntry, refreshKey = 0 }) {
  const { detail, status, errorMessage, reload } = useEntryDetail(entryId, refreshKey);

  if (status === 'loading' && !detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.centeredTitle}>イベント詳細を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.centeredTitle}>イベント詳細を表示できません</Text>
          <Text style={styles.centeredBody}>
            {errorMessage || '対象のイベントが見つかりません'}
          </Text>
          <Pressable onPress={reload} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>再読み込み</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.overline}>Entry Detail</Text>
          <Text style={styles.title}>{detail.entry.title}</Text>
          <Text style={styles.meta}>{formatEntryDateLabel(detail.entry.eventDate)}</Text>
          <Text style={styles.meta}>{detail.entry.placeName || '位置なし'}</Text>
          <Text style={styles.meta}>
            {detail.entry.photoCount}枚 / sync: {detail.entry.syncStatus}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onEditEntry(detail.entry.id)}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Edit</Text>
          </Pressable>
        </View>

        <PhotoCarousel photos={detail.photos} />
        <VoicePlayer voicePath={detail.entry.voicePath} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f5f7',
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 36,
  },
  headerCard: {
    borderRadius: 24,
    backgroundColor: '#1d3d4f',
    padding: 20,
  },
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 12,
    fontWeight: '700',
    color: '#8cc6e0',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: '#eff9ff',
  },
  meta: {
    marginTop: 8,
    color: '#c4d8e5',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 18,
    borderRadius: 999,
    backgroundColor: '#f0a65a',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: '#1d3d4f',
    fontWeight: '800',
  },
  centeredCard: {
    margin: 20,
    borderRadius: 22,
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#d8e3e9',
  },
  centeredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#223745',
  },
  centeredBody: {
    marginTop: 8,
    color: '#5b7281',
  },
});
