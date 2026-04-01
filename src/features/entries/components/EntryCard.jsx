import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatEntryDateLabel } from '../logic/createEntryTitle';

export function EntryCard({ entry, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(entry.id)}
      style={styles.card}
      testID={`entry-card-${entry.id}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.photoCount}>{entry.photoCount}枚</Text>
      </View>
      <Text style={styles.meta}>{formatEntryDateLabel(entry.eventDate)}</Text>
      <Text style={styles.meta}>{entry.placeName || '位置なし'}</Text>
      {entry.coverPhotoUri ? (
        <Image
          accessibilityLabel={`${entry.title} のカバー写真`}
          source={{ uri: entry.coverPhotoUri }}
          style={styles.coverImage}
          testID={`entry-cover-${entry.id}`}
        />
      ) : (
        <Text style={styles.coverFallback}>カバー写真なし</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: '#fffaf2',
    padding: 16,
    borderWidth: 1,
    borderColor: '#efd9bf',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#3b2e2a',
  },
  photoCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8d6b4f',
  },
  meta: {
    marginTop: 6,
    color: '#5f4b43',
  },
  coverImage: {
    marginTop: 10,
    width: '100%',
    height: 164,
    borderRadius: 14,
    backgroundColor: '#efe5d8',
  },
  coverFallback: {
    marginTop: 10,
    color: '#927865',
    fontSize: 12,
  },
});
