import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatEntryDateLabel } from '../logic/createEntryTitle';

export function EntryCard({ entry, onPress }) {
  const metaLine = `${formatEntryDateLabel(entry.eventDate)} / ${entry.placeName || '位置なし'}`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(entry.id)}
      style={styles.card}
      testID={`entry-card-${entry.id}`}
    >
      {entry.coverPhotoUri ? (
        <Image
          accessibilityLabel={`${entry.title} のカバー写真`}
          source={{ uri: entry.coverPhotoUri }}
          style={styles.coverImage}
          testID={`entry-cover-${entry.id}`}
        />
      ) : (
        <View style={styles.coverFallback}>
          <Text style={styles.coverFallbackText}>カバー写真なし</Text>
        </View>
      )}
      <View style={styles.overlay}>
        <Text numberOfLines={2} style={styles.title}>
          {entry.title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {metaLine}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#e9e0d2',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#fff9ef',
  },
  meta: {
    marginTop: 6,
    color: '#f0e2d2',
  },
  coverImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#efe5d8',
  },
  coverFallback: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d8cab4',
  },
  coverFallbackText: {
    color: '#6f5a46',
    fontSize: 13,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: 'rgba(28, 20, 17, 0.42)',
  },
});
