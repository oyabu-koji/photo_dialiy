import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

import { formatEntryDateLabel } from '../../entries/logic/createEntryTitle';

export function EntryMapView({
  initialRegion,
  onOpenEntry,
  onSelectPin,
  pins,
  selectedEntryId,
}) {
  if (!initialRegion) {
    return null;
  }

  return (
    <MapView initialRegion={initialRegion} style={styles.map} testID="entry-map">
      {pins.map((pin) => (
        <Marker
          coordinate={pin.coordinate}
          key={pin.id}
          onPress={() => onSelectPin(pin.id)}
          pinColor={selectedEntryId === pin.id ? '#2f6f91' : '#d17a4a'}
          testID={`map-marker-${pin.id}`}
        >
          <Callout onPress={() => onOpenEntry(pin.id)} testID={`map-callout-${pin.id}`}>
            <View style={styles.callout}>
              {pin.coverPhotoUri ? (
                <Image
                  accessibilityLabel={`${pin.title} の地図プレビュー`}
                  source={{ uri: pin.coverPhotoUri }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={[styles.previewImage, styles.previewFallback]}>
                  <Text style={styles.previewFallbackText}>写真なし</Text>
                </View>
              )}
              <Text style={styles.title}>{pin.title}</Text>
              <Text style={styles.meta}>{formatEntryDateLabel(pin.eventDate)}</Text>
              <Text style={styles.meta}>{pin.placeName || '位置名なし'}</Text>
              <Text style={styles.link}>詳細を見る</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    width: 220,
    padding: 6,
  },
  previewImage: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    backgroundColor: '#ebe5dc',
  },
  previewFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFallbackText: {
    color: '#6f655d',
    fontWeight: '700',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: '#2d231f',
  },
  meta: {
    marginTop: 4,
    color: '#5f4b43',
  },
  link: {
    marginTop: 8,
    color: '#2f6f91',
    fontWeight: '700',
  },
});
