import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryLocationMapPreview } from '../components/EntryLocationMapPreview';
import { EntryPhotoLightboxModal } from '../components/EntryPhotoLightboxModal';
import { PhotoCarousel } from '../components/PhotoCarousel';
import { VoicePlayer } from '../components/VoicePlayer';
import { useEntryDetail } from '../hooks/useEntryDetail';

export function EntryDetailScreen({ entryId, onEditEntry, refreshKey = 0 }) {
  const { detail, status, errorMessage, reload } = useEntryDetail(entryId, refreshKey);
  const scrollViewRef = useRef(null);
  const scrollOffsetYRef = useRef(0);
  const [restoredScrollOffsetY, setRestoredScrollOffsetY] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  function handleOpenLightbox(photoIndex) {
    setSelectedPhotoIndex(photoIndex);
    setIsLightboxVisible(true);
  }

  function handleCloseLightbox() {
    setIsLightboxVisible(false);
    setRestoredScrollOffsetY(Math.round(scrollOffsetYRef.current));
    scrollViewRef.current?.scrollTo?.({
      x: 0,
      y: scrollOffsetYRef.current,
      animated: false,
    });
  }

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
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={(event) => {
          scrollOffsetYRef.current = event.nativeEvent.contentOffset.y;
        }}
        nativeID={`entry-detail-scroll-restored-${restoredScrollOffsetY}`}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        testID="entry-detail-scroll"
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>{detail.entry.title}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onEditEntry(detail.entry.id)}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Edit</Text>
          </Pressable>
        </View>

        <EntryLocationMapPreview
          lat={detail.entry.lat}
          lng={detail.entry.lng}
          placeName={detail.entry.placeName}
        />
        <PhotoCarousel onPhotoPress={handleOpenLightbox} photos={detail.photos} />
        <VoicePlayer voicePath={detail.entry.voicePath} />
      </ScrollView>
      <EntryPhotoLightboxModal
        initialIndex={selectedPhotoIndex}
        onRequestClose={handleCloseLightbox}
        photos={detail.photos}
        visible={isLightboxVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f5f7',
  },
  content: {
    gap: 20,
    padding: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: '800',
    color: '#203440',
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: '#264c61',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#f5fbff',
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
