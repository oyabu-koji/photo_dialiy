import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function PhotoStrip({ photos, editable = false, onRemovePhoto }) {
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
      contentContainerStyle={styles.strip}
    >
      {photos.map((photo, index) => (
        <View key={photo.id} style={styles.photoCard}>
          <Image
            accessibilityLabel={`写真 ${index + 1} のプレビュー`}
            source={{ uri: photo.localUri }}
            style={styles.photoPreview}
            testID={`photo-preview-${photo.id}`}
          />
          <Text style={styles.photoLabel}>写真 {index + 1}</Text>
          <Text style={styles.photoMeta}>
            {photo.lat !== null && photo.lng !== null
              ? `${photo.lat.toFixed(3)}, ${photo.lng.toFixed(3)}`
              : '位置なし'}
          </Text>
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
  photoCard: {
    width: 180,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5d7cb',
  },
  photoPreview: {
    width: '100%',
    height: 148,
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
