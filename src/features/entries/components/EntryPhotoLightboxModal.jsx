import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

import { buildLightboxImages, clampLightboxIndex } from '../logic/buildLightboxImages';

function LightboxHeader({ imageIndex, total, onRequestClose }) {
  return (
    <View style={styles.header}>
      <Text style={styles.counter} testID="entry-photo-lightbox-counter">
        {`${imageIndex + 1} / ${total}`}
      </Text>
      <Pressable
        accessibilityLabel="写真ビューアを閉じる"
        accessibilityRole="button"
        onPress={onRequestClose}
        style={styles.closeButton}
        testID="entry-photo-lightbox-close"
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </View>
  );
}

export function EntryPhotoLightboxModal({ initialIndex = 0, photos, visible, onRequestClose }) {
  const images = buildLightboxImages(photos);
  const [currentIndex, setCurrentIndex] = useState(clampLightboxIndex(initialIndex, images.length));

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCurrentIndex(clampLightboxIndex(initialIndex, images.length));
  }, [images.length, initialIndex, visible]);

  if (!visible || images.length === 0) {
    return null;
  }

  return (
    <ImageViewing
      animationType="fade"
      backgroundColor="#061018"
      doubleTapToZoomEnabled
      HeaderComponent={({ imageIndex }) => (
        <LightboxHeader
          imageIndex={imageIndex}
          onRequestClose={onRequestClose}
          total={images.length}
        />
      )}
      imageIndex={currentIndex}
      images={images}
      onImageIndexChange={(nextIndex) => {
        setCurrentIndex(clampLightboxIndex(nextIndex, images.length));
      }}
      onRequestClose={onRequestClose}
      presentationStyle="overFullScreen"
      swipeToCloseEnabled
      visible={visible}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  counter: {
    color: '#f4fbff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  closeButton: {
    borderRadius: 999,
    backgroundColor: 'rgba(7, 18, 25, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: '#f4fbff',
    fontSize: 13,
    fontWeight: '800',
  },
});
