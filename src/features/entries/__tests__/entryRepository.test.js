import {
  __getEntryRepositorySnapshot,
  __resetEntryRepository,
  createEntryRepositorySeed,
  getEntryDetailAggregate,
  listEntries,
  listEntriesForMap,
  saveEntryDraft,
} from '../repositories/entryRepository';

describe('entryRepository', () => {
  beforeEach(() => {
    __resetEntryRepository(createEntryRepositorySeed());
  });

  it('returns timeline summaries and detail aggregates with photos', async () => {
    const items = await listEntries();
    const mapItems = await listEntriesForMap();
    const detail = await getEntryDetailAggregate('entry-1');

    expect(items[0].id).toBe('entry-1');
    expect(items[0].photoCount).toBe(2);
    expect(mapItems).toHaveLength(2);
    expect(mapItems[0].id).toBe('entry-1');
    expect(mapItems[0].lat).not.toBeNull();
    expect(mapItems[0].photoCount).toBeUndefined();
    expect(mapItems[0].syncStatus).toBeUndefined();
    expect(Object.keys(mapItems[0]).sort()).toEqual([
      'coverPhotoUri',
      'eventDate',
      'id',
      'lat',
      'lng',
      'placeName',
      'title',
    ]);
    expect(detail.entry.id).toBe('entry-1');
    expect(detail.photos).toHaveLength(2);
    expect(detail.photos[0].localUri).toBe('file:///photos/entry-1-cover.jpg');
  });

  it('persists edit updates including photo summary and voice state', async () => {
    const detail = await getEntryDetailAggregate('entry-1');

    await saveEntryDraft({
      mode: 'edit',
      entryId: 'entry-1',
      eventDate: detail.entry.eventDate,
      photos: detail.photos.slice(0, 1),
      draftVoicePath: null,
      lat: detail.entry.lat,
      lng: detail.entry.lng,
      placeName: '更新後の場所',
      title: '更新後のタイトル',
    });

    const snapshot = __getEntryRepositorySnapshot();
    const updatedEntry = snapshot.entries.find((entry) => entry.id === 'entry-1');
    const updatedPhotos = snapshot.photos.filter((photo) => photo.entryId === 'entry-1');

    expect(updatedEntry.title).toBe('更新後のタイトル');
    expect(updatedEntry.photoCount).toBe(1);
    expect(updatedEntry.voicePath).toBeNull();
    expect(updatedEntry.placeName).toBe('更新後の場所');
    expect(updatedPhotos).toHaveLength(1);
  });
});
