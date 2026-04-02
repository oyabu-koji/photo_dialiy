import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryMapView } from '../components/EntryMapView';
import { useEntryMap } from '../hooks/useEntryMap';
import { LOAD_STATUS } from '../../entries/types/entryStatus';

export function MapScreen({ onOpenEntry, refreshKey = 0 }) {
  const {
    errorMessage,
    initialRegion,
    pins,
    reload,
    selectedEntryId,
    selectedPin,
    selectPin,
    status,
  } = useEntryMap(refreshKey);

  const showLoadingOverlay = status === LOAD_STATUS.LOADING && pins.length === 0;
  const showEmptyCard = status === LOAD_STATUS.READY && pins.length === 0;
  const showErrorCard = status === LOAD_STATUS.ERROR;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <EntryMapView
          initialRegion={initialRegion}
          onOpenEntry={onOpenEntry}
          onSelectPin={selectPin}
          pins={pins}
          selectedEntryId={selectedEntryId}
        />

        {selectedPin ? (
          <View style={styles.selectionChip} testID="map-selection-chip">
            <Text numberOfLines={1} style={styles.selectionChipText}>
              {selectedPin.title}
            </Text>
          </View>
        ) : null}

        {showLoadingOverlay ? (
          <View style={styles.loadingChip} testID="map-loading-overlay">
            <Text style={styles.loadingChipText}>読み込み中...</Text>
          </View>
        ) : null}

        {showEmptyCard ? (
          <View style={styles.bottomCard} testID="map-empty-overlay">
            <Text style={styles.bottomCardTitle}>位置情報付きイベントがまだありません</Text>
            <Text style={styles.bottomCardBody}>
              位置つきの写真イベントを保存すると、ここにピンが並びます。
            </Text>
          </View>
        ) : null}

        {showErrorCard ? (
          <View style={styles.bottomCard} testID="map-error-overlay">
            <Text style={styles.bottomCardTitle}>
              {pins.length === 0 ? '地図を表示できません' : '一部のイベントを再読込できませんでした'}
            </Text>
            <Text style={styles.bottomCardBody}>
              {errorMessage || '位置付きイベントの読み込みに失敗しました'}
            </Text>
            <Pressable onPress={reload} style={styles.bottomCardButton}>
              <Text style={styles.bottomCardButtonText}>再読み込み</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#d9e8ee',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingChip: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(29, 50, 63, 0.84)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    transform: [
      {
        translateY: -18,
      },
    ],
  },
  loadingChipText: {
    color: '#f6fbff',
    fontWeight: '700',
  },
  selectionChip: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    alignItems: 'flex-start',
  },
  selectionChipText: {
    maxWidth: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(29, 50, 63, 0.78)',
    color: '#f6fbff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontWeight: '700',
  },
  bottomCard: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    left: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 250, 243, 0.96)',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  bottomCardTitle: {
    color: '#2a3945',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomCardBody: {
    marginTop: 6,
    color: '#5e717f',
    lineHeight: 19,
  },
  bottomCardButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: '#274b5d',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bottomCardButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
