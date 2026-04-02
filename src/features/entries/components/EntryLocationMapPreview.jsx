import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const PREVIEW_DELTA = 0.01;

export function EntryLocationMapPreview({ lat, lng, placeName }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <View style={styles.fallback} testID="entry-location-fallback">
        <Text style={styles.fallbackLabel}>位置情報なし</Text>
        <Text style={styles.fallbackBody}>
          {placeName || 'このイベントには地図表示に使える位置情報がありません。'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: PREVIEW_DELTA,
          longitudeDelta: PREVIEW_DELTA,
        }}
        pointerEvents="none"
        scrollEnabled={false}
        style={styles.map}
        testID="entry-location-map"
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
      </MapView>
      <View style={styles.caption}>
        <Text style={styles.captionLabel}>{placeName || '位置を記録済み'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  map: {
    width: '100%',
    height: 196,
    borderRadius: 24,
    overflow: 'hidden',
  },
  caption: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#edf2f5',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  captionLabel: {
    color: '#48606f',
    fontSize: 12,
    fontWeight: '700',
  },
  fallback: {
    borderRadius: 20,
    backgroundColor: '#eef2f4',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  fallbackLabel: {
    color: '#324754',
    fontSize: 13,
    fontWeight: '800',
  },
  fallbackBody: {
    marginTop: 4,
    color: '#5e7280',
  },
});
