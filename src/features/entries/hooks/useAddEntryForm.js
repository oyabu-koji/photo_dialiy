import { useEffect, useRef, useState } from 'react';

import { createEntryTitle } from '../logic/createEntryTitle';
import { ValidationError, validateEntryDraft } from '../logic/validateEntryDraft';
import {
  getEntryDetailAggregate,
  saveEntryDraft,
} from '../repositories/entryRepository';
import { resolveLocationFromPhotos } from '../services/locationResolverService';
import { pickPhotos } from '../services/photoPickerService';
import {
  deleteRecording,
  startRecording as startRecordingSession,
  stopRecording as stopRecordingSession,
} from '../services/voiceRecorderService';
import { ADD_ENTRY_STATUS } from '../types/entryStatus';

function buildCreateState(eventDate) {
  return {
    mode: 'create',
    entryId: null,
    eventDate,
    photos: [],
    draftVoicePath: null,
    lat: null,
    lng: null,
    placeName: null,
    title: createEntryTitle({
      placeName: null,
      eventDate,
    }),
    status: ADD_ENTRY_STATUS.EDITING,
    canSave: false,
    errorMessage: null,
  };
}

function createLoadState(routeParams) {
  const eventDate = new Date().toISOString();
  const baseState = buildCreateState(eventDate);

  if (routeParams.mode === 'edit') {
    return {
      ...baseState,
      mode: 'edit',
      entryId: routeParams.entryId,
      status: ADD_ENTRY_STATUS.LOADING_ASSETS,
    };
  }

  return baseState;
}

function buildEditState(detail) {
  return {
    mode: 'edit',
    entryId: detail.entry.id,
    eventDate: detail.entry.eventDate,
    photos: detail.photos,
    draftVoicePath: detail.entry.voicePath,
    lat: detail.entry.lat,
    lng: detail.entry.lng,
    placeName: detail.entry.placeName,
    title: detail.entry.title,
    status: ADD_ENTRY_STATUS.EDITING,
    canSave: detail.photos.length > 0,
    errorMessage: null,
  };
}

export function useAddEntryForm(routeParams) {
  const mode = routeParams.mode;
  const editEntryId = mode === 'edit' ? routeParams.entryId : null;
  const [initializationToken, setInitializationToken] = useState(0);
  const [formState, setFormState] = useState(() => createLoadState(routeParams));
  const eventDateRef = useRef(formState.eventDate);
  const entryIdRef = useRef(formState.entryId);
  const titleManuallyEditedRef = useRef(routeParams.mode === 'edit');
  const recordingRef = useRef(null);
  const formStateRef = useRef(formState);

  useEffect(() => {
    formStateRef.current = formState;
  }, [formState]);

  useEffect(() => {
    let isActive = true;

    async function initialize() {
      if (mode === 'create') {
        const eventDate = new Date().toISOString();

        titleManuallyEditedRef.current = false;
        eventDateRef.current = eventDate;
        entryIdRef.current = null;

        if (!isActive) {
          return;
        }

        setFormState(buildCreateState(eventDate));

        return;
      }

      setFormState(createLoadState({
        mode,
        entryId: editEntryId,
      }));

      try {
        const detail = await getEntryDetailAggregate(editEntryId);

        if (!isActive) {
          return;
        }

        titleManuallyEditedRef.current = true;
        eventDateRef.current = detail.entry.eventDate;
        entryIdRef.current = detail.entry.id;
        setFormState(buildEditState(detail));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '編集対象の読み込みに失敗しました',
        }));
      }
    }

    initialize();

    return () => {
      isActive = false;
    };
  }, [
    initializationToken,
    mode,
    editEntryId,
  ]);

  async function syncPhotos(nextPhotos) {
    const nextLocation = await resolveLocationFromPhotos(nextPhotos);

    setFormState((current) => ({
      ...current,
      photos: nextPhotos.map((photo, index) => ({
        ...photo,
        sortOrder: index,
      })),
      lat: nextLocation.lat,
      lng: nextLocation.lng,
      placeName: nextLocation.placeName,
      title: titleManuallyEditedRef.current
        ? current.title
        : createEntryTitle({
            placeName: nextLocation.placeName,
            eventDate: eventDateRef.current,
          }),
      canSave: nextPhotos.length > 0,
      status: ADD_ENTRY_STATUS.EDITING,
      errorMessage: null,
    }));
  }

  return {
    formState,
    isEditMode: routeParams.mode === 'edit',
    async addPhoto() {
      setFormState((current) => ({
        ...current,
        status: ADD_ENTRY_STATUS.LOADING_ASSETS,
        errorMessage: null,
      }));

      try {
        const pickedPhotos = await pickPhotos();
        const nextPhotos = [
          ...formStateRef.current.photos,
          ...pickedPhotos,
        ];

        await syncPhotos(nextPhotos);
      } catch (error) {
        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '写真の追加に失敗しました',
        }));
      }
    },
    async removePhoto(photoId) {
      const nextPhotos = formStateRef.current.photos.filter((photo) => photo.id !== photoId);

      try {
        await syncPhotos(nextPhotos);
      } catch (error) {
        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '写真の削除に失敗しました',
        }));
      }
    },
    updateTitle(nextTitle) {
      titleManuallyEditedRef.current = true;
      setFormState((current) => ({
        ...current,
        title: nextTitle,
        errorMessage: null,
      }));
    },
    async startRecording() {
      try {
        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.RECORDING,
          errorMessage: null,
        }));
        recordingRef.current = await startRecordingSession();
      } catch (error) {
        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '録音の開始に失敗しました',
        }));
      }
    },
    async stopRecording() {
      try {
        const result = await stopRecordingSession(recordingRef.current);

        recordingRef.current = null;
        setFormState((current) => ({
          ...current,
          draftVoicePath: result.path,
          status: ADD_ENTRY_STATUS.EDITING,
          errorMessage: null,
        }));
      } catch (error) {
        setFormState((current) => ({
          ...current,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '録音の停止に失敗しました',
        }));
      }
    },
    async deleteVoice() {
      await deleteRecording();
      setFormState((current) => ({
        ...current,
        draftVoicePath: null,
        status: ADD_ENTRY_STATUS.EDITING,
        errorMessage: null,
      }));
    },
    async save() {
      const current = formStateRef.current;
      const normalizedTitle = current.title.trim() || createEntryTitle({
        placeName: current.placeName,
        eventDate: eventDateRef.current,
      });

      try {
        validateEntryDraft(current);
      } catch (error) {
        if (error instanceof ValidationError) {
          setFormState((latest) => ({
            ...latest,
            status: ADD_ENTRY_STATUS.ERROR,
            errorMessage: error.message,
          }));
        }

        throw error;
      }

      setFormState((latest) => ({
        ...latest,
        title: normalizedTitle,
        status: ADD_ENTRY_STATUS.SAVING,
        errorMessage: null,
      }));

      try {
        const savedEntry = await saveEntryDraft({
          ...current,
          entryId: entryIdRef.current,
          eventDate: eventDateRef.current,
          title: normalizedTitle,
        });

        entryIdRef.current = savedEntry.id;
        setFormState((latest) => ({
          ...latest,
          entryId: savedEntry.id,
          title: savedEntry.title,
          status: ADD_ENTRY_STATUS.SAVED,
          errorMessage: null,
        }));

        return savedEntry;
      } catch (error) {
        setFormState((latest) => ({
          ...latest,
          status: ADD_ENTRY_STATUS.ERROR,
          errorMessage: error.message || '保存に失敗しました',
        }));

        throw error;
      }
    },
    reload() {
      setInitializationToken((current) => current + 1);
    },
  };
}
