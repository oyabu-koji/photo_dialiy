import { StyleSheet, Text, View } from 'react-native';

import { PhotoStrip } from './PhotoStrip';

export function PhotoCarousel({ photos }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>写真</Text>
      <PhotoStrip photos={photos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b2e2a',
  },
});
