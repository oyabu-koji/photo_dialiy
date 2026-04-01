import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryCard } from '../components/EntryCard';
import { useEntryTimeline } from '../hooks/useEntryTimeline';

export function EntryListScreen({ onCreateEntry, onOpenEntry, refreshKey = 0 }) {
  const { items, status, errorMessage, reload } = useEntryTimeline(refreshKey);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Photo Diary</Text>
          <Text style={styles.title}>イベント一覧</Text>
          <Text style={styles.subtitle}>
            詳細は閲覧専用、作成と編集は AddEntry に集約します。
          </Text>
          <Pressable onPress={onCreateEntry} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>新規イベントを作成</Text>
          </Pressable>
        </View>

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
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  hero: {
    marginBottom: 20,
    borderRadius: 28,
    backgroundColor: '#332723',
    padding: 20,
  },
  eyebrow: {
    color: '#f8d6a7',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: '800',
    color: '#fff7ea',
  },
  subtitle: {
    marginTop: 10,
    color: '#dfc9b7',
    lineHeight: 21,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: '#f0a65a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#332723',
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 32,
  },
  errorCard: {
    marginBottom: 16,
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
});
