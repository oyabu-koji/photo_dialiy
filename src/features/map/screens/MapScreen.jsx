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

  if (status === LOAD_STATUS.LOADING && pins.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.centeredTitle}>地図を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === LOAD_STATUS.ERROR && pins.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.centeredTitle}>地図を表示できません</Text>
          <Text style={styles.centeredBody}>
            {errorMessage || '位置付きイベントの読み込みに失敗しました'}
          </Text>
          <Pressable onPress={reload} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>再読み込み</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (status === LOAD_STATUS.READY && pins.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredCard}>
          <Text style={styles.centeredTitle}>位置情報付きイベントがまだありません</Text>
          <Text style={styles.centeredBody}>
            写真に位置情報があるイベントを保存すると、ここで地図から振り返れます。
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.overline}>Map</Text>
          <Text style={styles.title}>地図で振り返る</Text>
          <Text style={styles.subtitle}>
            {selectedPin
              ? `${selectedPin.title} のピンを選択中`
              : 'ピンを選ぶと、写真付きの callout から詳細へ移動できます。'}
          </Text>
        </View>

        {status === LOAD_STATUS.ERROR && errorMessage ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>一部のイベントを再読込できませんでした</Text>
            <Text style={styles.warningBody}>{errorMessage}</Text>
            <Pressable onPress={reload} style={styles.warningButton}>
              <Text style={styles.warningButtonText}>再読み込み</Text>
            </Pressable>
          </View>
        ) : null}

        <EntryMapView
          initialRegion={initialRegion}
          onOpenEntry={onOpenEntry}
          onSelectPin={selectPin}
          pins={pins}
          selectedEntryId={selectedEntryId}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef3f5',
  },
  content: {
    flex: 1,
    gap: 16,
    padding: 20,
    paddingBottom: 24,
  },
  hero: {
    borderRadius: 24,
    backgroundColor: '#20495d',
    padding: 20,
  },
  overline: {
    color: '#95d2e8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    color: '#f4fbff',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: '#c8dce7',
    lineHeight: 20,
  },
  centeredCard: {
    margin: 20,
    borderRadius: 22,
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#d3dfe6',
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
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 18,
    borderRadius: 999,
    backgroundColor: '#2f6f91',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  warningCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e1c7a8',
    backgroundColor: '#fff8ed',
    padding: 16,
  },
  warningTitle: {
    color: '#6c4822',
    fontSize: 15,
    fontWeight: '700',
  },
  warningBody: {
    marginTop: 6,
    color: '#7b5b38',
  },
  warningButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: '#6c4822',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  warningButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
