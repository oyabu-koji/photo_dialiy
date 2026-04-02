import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function PhotoStrip({
  photos,
  editable = false,
  imageHeight = 148,
  imageWidth = 180,
  onPhotoPress,
  onRemovePhoto,
  showLabels = true,
  showMeta = true,
  surface = 'card',
}) {
  if (photos.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>写真がまだありません</Text>
        <Text style={styles.emptyBody}>追加すると保存できるようになります。</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.strip, surface === 'flat' ? styles.flatStrip : null]}
    >
      {photos.map((photo, index) => (
        <View
          key={photo.id}
          style={[
            styles.photoCard,
            surface === 'flat' ? styles.flatPhotoCard : null,
            { width: imageWidth },
          ]}
        >
          <Pressable
            accessibilityLabel={
              onPhotoPress ? `写真 ${index + 1} を全画面で表示` : `写真 ${index + 1} のプレビュー`
            }
            accessibilityRole={onPhotoPress ? 'button' : 'image'}
            disabled={!onPhotoPress}
            onPress={onPhotoPress ? () => onPhotoPress(index) : undefined}
            testID={onPhotoPress ? `photo-trigger-${photo.id}` : undefined}
          >
            <Image
              accessibilityLabel={`写真 ${index + 1} のプレビュー`}
              source={{ uri: photo.localUri }}
              style={[
                styles.photoPreview,
                {
                  height: imageHeight,
                },
              ]}
              testID={`photo-preview-${photo.id}`}
            />
            {showLabels ? <Text style={styles.photoLabel}>写真 {index + 1}</Text> : null}
            {showMeta ? (
              <Text style={styles.photoMeta}>
                {photo.lat !== null && photo.lng !== null
                  ? `${photo.lat.toFixed(3)}, ${photo.lng.toFixed(3)}`
                  : '位置なし'}
              </Text>
            ) : null}
          </Pressable>
          {editable ? (
            <Pressable
              accessibilityLabel={`写真 ${index + 1} を削除`}
              onPress={() => onRemovePhoto(photo.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>削除</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  strip: {
    gap: 12,
    paddingVertical: 4,
  },
  flatStrip: {
    paddingVertical: 0,
  },
  photoCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5d7cb',
  },
  flatPhotoCard: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
  },
  photoPreview: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#e9edf1',
  },
  photoLabel: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#3b2e2a',
  },
  photoMeta: {
    marginTop: 8,
    fontSize: 12,
    color: '#8d6b4f',
  },
  removeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#7e3f3f',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5d7cb',
    backgroundColor: '#fff',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b2e2a',
  },
  emptyBody: {
    marginTop: 6,
    color: '#5f4b43',
  },
});
