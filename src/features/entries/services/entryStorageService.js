let SQLite = null;

try {
  SQLite = require('expo-sqlite');
} catch (_error) {
  SQLite = null;
}

const DATABASE_NAME = 'photo-diary.db';
const ENTRIES_TABLE = 'entries';
const PHOTOS_TABLE = 'photos';

let databasePromise = null;
let memoryState = null;

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function shouldUseMemoryStore() {
  return Boolean(process.env.JEST_WORKER_ID) || !SQLite?.openDatabaseAsync;
}

async function getDatabase() {
  if (shouldUseMemoryStore()) {
    return null;
  }

  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

async function ensureStateTable(database) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS ${ENTRIES_TABLE} (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lat REAL,
      lng REAL,
      placeName TEXT,
      voicePath TEXT,
      coverPhotoUri TEXT,
      photoCount INTEGER NOT NULL,
      syncStatus TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${PHOTOS_TABLE} (
      id TEXT PRIMARY KEY NOT NULL,
      entryId TEXT NOT NULL,
      localUri TEXT NOT NULL,
      originalFilename TEXT,
      width INTEGER,
      height INTEGER,
      lat REAL,
      lng REAL,
      takenAt TEXT,
      sortOrder INTEGER NOT NULL
    );
  `);
}

function inferSequence(entries, fallbackSequence) {
  const maxEntryId = entries.reduce((highest, entry) => {
    const match = String(entry.id).match(/^entry-(\d+)$/);

    if (!match) {
      return highest;
    }

    return Math.max(highest, Number(match[1]));
  }, 0);

  return Math.max(maxEntryId, fallbackSequence);
}

async function replaceTables(database, nextState) {
  await database.withTransactionAsync(async () => {
    await database.execAsync(`
      DELETE FROM ${PHOTOS_TABLE};
      DELETE FROM ${ENTRIES_TABLE};
    `);

    for (const entry of nextState.entries) {
      await database.runAsync(
        `
          INSERT INTO ${ENTRIES_TABLE} (
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
            syncStatus
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        entry.id,
        entry.title,
        entry.eventDate,
        entry.createdAt,
        entry.updatedAt,
        entry.lat,
        entry.lng,
        entry.placeName,
        entry.voicePath,
        entry.coverPhotoUri,
        entry.photoCount,
        entry.syncStatus
      );
    }

    for (const photo of nextState.photos) {
      await database.runAsync(
        `
          INSERT INTO ${PHOTOS_TABLE} (
            id,
            entryId,
            localUri,
            originalFilename,
            width,
            height,
            lat,
            lng,
            takenAt,
            sortOrder
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        photo.id,
        photo.entryId,
        photo.localUri,
        photo.originalFilename,
        photo.width,
        photo.height,
        photo.lat,
        photo.lng,
        photo.takenAt,
        photo.sortOrder
      );
    }
  });
}

export async function loadRepositoryState(seedState) {
  if (shouldUseMemoryStore()) {
    if (!memoryState) {
      memoryState = cloneValue(seedState);
    }

    return cloneValue(memoryState);
  }

  const database = await getDatabase();
  await ensureStateTable(database);

  const countRow = await database.getFirstAsync(
    `SELECT COUNT(*) AS count FROM ${ENTRIES_TABLE}`
  );

  if (!countRow?.count) {
    await persistRepositoryState(seedState);
    return cloneValue(seedState);
  }

  const entries = await database.getAllAsync(
    `SELECT * FROM ${ENTRIES_TABLE}`
  );
  const photos = await database.getAllAsync(
    `SELECT * FROM ${PHOTOS_TABLE} ORDER BY entryId ASC, sortOrder ASC`
  );

  return {
    sequence: inferSequence(entries, seedState.sequence),
    entries,
    photos,
  };
}

export async function persistRepositoryState(nextState) {
  if (shouldUseMemoryStore()) {
    memoryState = cloneValue(nextState);
    return;
  }

  const database = await getDatabase();
  await ensureStateTable(database);
  await replaceTables(database, nextState);
}

export async function resetPersistedRepositoryState(seedState) {
  memoryState = cloneValue(seedState);

  if (shouldUseMemoryStore()) {
    return;
  }

  const database = await getDatabase();
  await ensureStateTable(database);
  await replaceTables(database, seedState);
}
