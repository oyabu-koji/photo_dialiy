import { StyleSheet, Text, View } from 'react-native';

import { PhotoStrip } from './PhotoStrip';

export function PhotoCarousel({ onPhotoPress, photos }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos</Text>
      <PhotoStrip
        imageHeight={240}
        imageWidth={312}
        onPhotoPress={onPhotoPress}
        photos={photos}
        showLabels={false}
        showMeta={false}
        surface="flat"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#6b7b86',
  },
});
