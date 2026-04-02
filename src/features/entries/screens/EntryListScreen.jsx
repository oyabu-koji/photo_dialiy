import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '../components/EntryCard';
import { useEntryTimeline } from '../hooks/useEntryTimeline';

export function EntryListScreen({ onCreateEntry, onOpenEntry, refreshKey = 0 }) {
  const { items, status, errorMessage, reload } = useEntryTimeline(refreshKey);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>一覧の更新に失敗しました</Text>
            <Text style={styles.errorBody}>{errorMessage}</Text>
            <Pressable onPress={reload} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>再読み込み</Text>
            </Pressable>
          </View>
        ) : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={(item) => item.id}
          onRefresh={reload}
          refreshing={status === 'loading'}
          renderItem={({ item }) => (
            <EntryCard entry={item} onPress={onOpenEntry} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>イベントがありません</Text>
              <Text style={styles.emptyBody}>最初の写真イベントを作成してください。</Text>
            </View>
          }
        />

        <Pressable
          accessibilityLabel="新規イベントを作成"
          accessibilityRole="button"
          onPress={onCreateEntry}
          style={styles.fab}
          testID="create-entry-fab"
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6efe5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 112,
  },
  errorCard: {
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: '#fff0ee',
    borderWidth: 1,
    borderColor: '#e8b3a8',
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7f3326',
  },
  errorBody: {
    marginTop: 6,
    color: '#8a4436',
  },
  retryButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#7f3326',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0d1c3',
    backgroundColor: '#fff',
    padding: 18,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 62,
    height: 62,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d231f',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  fabText: {
    marginTop: -2,
    color: '#fff9ef',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '500',
  },
});
