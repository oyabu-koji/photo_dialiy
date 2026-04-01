function createMockDatabase() {
  const state = {
    entries: [],
    photos: [],
  };

  return {
    state,
    async execAsync() {},
    async withTransactionAsync(task) {
      await task();
    },
    async runAsync(sql, ...params) {
      if (sql.includes('DELETE FROM photos')) {
        state.photos = [];
        state.entries = [];
        return;
      }

      if (sql.includes('INSERT INTO entries')) {
        const [
          id,
          title,
          eventDate,
          createdAt,
          updatedAt,
          lat,
          lng,
          placeName,
          voicePath,
          coverPhotoUri,
          photoCount,
          syncStatus,
        ] = params;

        state.entries.push({
          id,
          title,
          eventDate,
          createdAt,
          updatedAt,
          lat,
          lng,
          placeName,
          voicePath,
          coverPhotoUri,
          photoCount,
          syncStatus,
        });
        return;
      }

      if (sql.includes('INSERT INTO photos')) {
        const [
          id,
          entryId,
          localUri,
          originalFilename,
          width,
          height,
          lat,
          lng,
          takenAt,
          sortOrder,
        ] = params;

        state.photos.push({
          id,
          entryId,
          localUri,
          originalFilename,
          width,
          height,
          lat,
          lng,
          takenAt,
          sortOrder,
        });
      }
    },
    async getFirstAsync(sql) {
      if (sql.includes('COUNT(*)')) {
        return {
          count: state.entries.length,
        };
      }

      return null;
    },
    async getAllAsync(sql) {
      if (sql.includes('FROM entries')) {
        return state.entries;
      }

      return state.photos;
    },
  };
}

describe('entryStorageService', () => {
  const originalJestWorkerId = process.env.JEST_WORKER_ID;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.JEST_WORKER_ID;
  });

  afterEach(() => {
    process.env.JEST_WORKER_ID = originalJestWorkerId;
    jest.resetModules();
    jest.unmock('expo-sqlite');
  });

  it('persists entries and photos through SQLite tables and can load them after reload', async () => {
    const mockDatabase = createMockDatabase();

    jest.doMock('expo-sqlite', () => ({
      openDatabaseAsync: jest.fn(async () => mockDatabase),
    }));

    const repositoryModule = require('../repositories/entryRepository');
    const storageModule = require('../services/entryStorageService');
    const seed = repositoryModule.createEntryRepositorySeed();

    await storageModule.persistRepositoryState(seed);

    expect(mockDatabase.state.entries).toHaveLength(seed.entries.length);
    expect(mockDatabase.state.photos).toHaveLength(seed.photos.length);

    jest.resetModules();
    jest.doMock('expo-sqlite', () => ({
      openDatabaseAsync: jest.fn(async () => mockDatabase),
    }));

    const reloadedStorageModule = require('../services/entryStorageService');
    const loaded = await reloadedStorageModule.loadRepositoryState({
      sequence: 0,
      entries: [],
      photos: [],
    });

    expect(loaded.entries).toHaveLength(seed.entries.length);
    expect(loaded.photos).toHaveLength(seed.photos.length);
    expect(loaded.entries[0].id).toBe(seed.entries[0].id);
  });
});
