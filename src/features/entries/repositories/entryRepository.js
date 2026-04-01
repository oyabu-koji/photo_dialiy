import {
  buildEntryDetailAggregate,
  buildEntrySummary,
  mapDraftPhotos,
  mapDraftToEntry,
  sortEntriesByEventDate,
} from './entryMappers';
import {
  loadRepositoryState,
  persistRepositoryState,
  resetPersistedRepositoryState,
} from '../services/entryStorageService';
import { ENTRY_SYNC_STATUS } from '../types/entryStatus';

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSeedState() {
  return {
    sequence: 3,
    entries: [
      {
        id: 'entry-1',
        title: '神田川の散歩 2026/03/28',
        eventDate: '2026-03-28T09:15:00.000Z',
        createdAt: '2026-03-28T09:15:00.000Z',
        updatedAt: '2026-03-28T09:15:00.000Z',
        lat: 35.702124,
        lng: 139.759421,
        placeName: '神田川の散歩',
        voicePath: 'file:///voices/entry-1.m4a',
        coverPhotoUri: 'file:///photos/entry-1-cover.jpg',
        photoCount: 2,
        syncStatus: ENTRY_SYNC_STATUS.LOCAL_ONLY,
      },
      {
        id: 'entry-2',
        title: '日本橋の午後 2026/03/25',
        eventDate: '2026-03-25T06:40:00.000Z',
        createdAt: '2026-03-25T06:40:00.000Z',
        updatedAt: '2026-03-25T06:40:00.000Z',
        lat: 35.683212,
        lng: 139.774098,
        placeName: '日本橋の午後',
        voicePath: null,
        coverPhotoUri: 'file:///photos/entry-2-cover.jpg',
        photoCount: 1,
        syncStatus: ENTRY_SYNC_STATUS.LOCAL_ONLY,
      },
    ],
    photos: [
      {
        id: 'photo-entry-1-1',
        entryId: 'entry-1',
        localUri: 'file:///photos/entry-1-cover.jpg',
        originalFilename: 'river-morning.jpg',
        width: 1200,
        height: 900,
        lat: 35.702124,
        lng: 139.759421,
        takenAt: '2026-03-28T09:14:00.000Z',
        sortOrder: 0,
      },
      {
        id: 'photo-entry-1-2',
        entryId: 'entry-1',
        localUri: 'file:///photos/entry-1-2.jpg',
        originalFilename: 'river-note.jpg',
        width: 1200,
        height: 900,
        lat: 35.701882,
        lng: 139.759003,
        takenAt: '2026-03-28T09:16:00.000Z',
        sortOrder: 1,
      },
      {
        id: 'photo-entry-2-1',
        entryId: 'entry-2',
        localUri: 'file:///photos/entry-2-cover.jpg',
        originalFilename: 'nihonbashi.jpg',
        width: 1080,
        height: 1080,
        lat: 35.683212,
        lng: 139.774098,
        takenAt: '2026-03-25T06:40:00.000Z',
        sortOrder: 0,
      },
    ],
  };
}

let repositoryState = createSeedState();
let hasHydratedState = false;

function getPhotosByEntryId(entryId) {
  return repositoryState.photos.filter((photo) => photo.entryId === entryId);
}

function buildEntryId() {
  repositoryState.sequence += 1;

  return `entry-${repositoryState.sequence}`;
}

async function ensureRepositoryState() {
  if (!hasHydratedState) {
    repositoryState = await loadRepositoryState(createSeedState());
    hasHydratedState = true;
  }

  return repositoryState;
}

export async function listEntries() {
  await ensureRepositoryState();
  const entries = repositoryState.entries.map((entry) =>
    buildEntrySummary(entry, getPhotosByEntryId(entry.id))
  );

  return sortEntriesByEventDate(entries).map((entry) => ({ ...entry }));
}

export async function listEntriesForMap() {
  const items = await listEntries();

  return items
    .filter((entry) => entry.lat !== null && entry.lng !== null)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      eventDate: entry.eventDate,
      placeName: entry.placeName,
      coverPhotoUri: entry.coverPhotoUri,
      lat: entry.lat,
      lng: entry.lng,
    }));
}

export async function getEntryDetailAggregate(entryId) {
  await ensureRepositoryState();
  const entry = repositoryState.entries.find((item) => item.id === entryId);

  if (!entry) {
    throw new Error('対象のイベントが見つかりません');
  }

  return buildEntryDetailAggregate(entry, getPhotosByEntryId(entryId));
}

export async function saveEntryDraft(draft) {
  await ensureRepositoryState();
  const now = new Date().toISOString();
  const isEditMode = draft.mode === 'edit';
  const existingEntry = isEditMode
    ? repositoryState.entries.find((entry) => entry.id === draft.entryId)
    : null;

  if (isEditMode && !existingEntry) {
    throw new Error('更新対象のイベントが見つかりません');
  }

  const entryId = existingEntry?.id ?? buildEntryId();
  const nextEntry = mapDraftToEntry({
    draft: {
      ...draft,
      entryId,
    },
    existingEntry,
    now,
  });
  const nextPhotos = mapDraftPhotos({
    entryId,
    photos: draft.photos,
  });

  repositoryState.entries = repositoryState.entries.filter((entry) => entry.id !== entryId);
  repositoryState.entries.push(nextEntry);
  repositoryState.photos = repositoryState.photos.filter((photo) => photo.entryId !== entryId);
  repositoryState.photos.push(...nextPhotos);
  await persistRepositoryState(repositoryState);

  return buildEntrySummary(nextEntry, nextPhotos);
}

export function createEntryRepositorySeed() {
  return cloneValue(createSeedState());
}

export function __resetEntryRepository(nextState = createSeedState()) {
  repositoryState = cloneValue(nextState);
  hasHydratedState = true;
  void resetPersistedRepositoryState(repositoryState);
}

export function __getEntryRepositorySnapshot() {
  return cloneValue(repositoryState);
}
