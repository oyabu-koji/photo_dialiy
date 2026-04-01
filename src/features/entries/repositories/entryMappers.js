import { ENTRY_SYNC_STATUS } from '../types/entryStatus';

export function sortPhotosByOrder(photos) {
  return [...photos].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function sortEntriesByEventDate(entries) {
  return [...entries].sort((left, right) => {
    const eventDelta = new Date(right.eventDate).getTime() - new Date(left.eventDate).getTime();

    if (eventDelta !== 0) {
      return eventDelta;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function buildEntrySummary(entry, photos) {
  const sortedPhotos = sortPhotosByOrder(photos);
  const coverPhoto = sortedPhotos[0] ?? null;

  return {
    ...entry,
    coverPhotoUri: coverPhoto ? coverPhoto.localUri : null,
    photoCount: sortedPhotos.length,
  };
}

export function buildEntryDetailAggregate(entry, photos) {
  const summary = buildEntrySummary(entry, photos);

  return {
    entry: summary,
    photos: sortPhotosByOrder(photos).map((photo) => ({ ...photo })),
  };
}

export function mapDraftPhotos({ entryId, photos }) {
  return sortPhotosByOrder(photos).map((photo, index) => ({
    ...photo,
    id: photo.id || `photo-${entryId}-${index + 1}`,
    entryId,
    sortOrder: index,
  }));
}

export function mapDraftToEntry({ draft, existingEntry, now }) {
  const mappedPhotos = mapDraftPhotos({
    entryId: existingEntry?.id ?? draft.entryId,
    photos: draft.photos,
  });

  return {
    id: existingEntry?.id ?? draft.entryId,
    title: draft.title.trim(),
    eventDate: existingEntry?.eventDate ?? draft.eventDate ?? now,
    createdAt: existingEntry?.createdAt ?? now,
    updatedAt: now,
    lat: draft.lat ?? null,
    lng: draft.lng ?? null,
    placeName: draft.placeName ?? null,
    voicePath: draft.draftVoicePath ?? null,
    coverPhotoUri: mappedPhotos[0]?.localUri ?? null,
    photoCount: mappedPhotos.length,
    syncStatus: existingEntry?.syncStatus ?? ENTRY_SYNC_STATUS.LOCAL_ONLY,
  };
}
