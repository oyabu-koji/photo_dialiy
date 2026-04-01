import { useEffect, useState } from 'react';

import { listEntriesForMap } from '../../entries/repositories/entryRepository';
import { LOAD_STATUS } from '../../entries/types/entryStatus';
import { buildMapPins } from '../logic/buildMapPins';

export function useEntryMap(refreshKey = 0) {
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [state, setState] = useState({
    pins: [],
    initialRegion: null,
    status: LOAD_STATUS.LOADING,
    errorMessage: null,
  });

  useEffect(() => {
    let isActive = true;

    async function load() {
      setState((current) => ({
        ...current,
        status: LOAD_STATUS.LOADING,
        errorMessage: null,
      }));

      try {
        const items = await listEntriesForMap();

        if (!isActive) {
          return;
        }

        const { pins, initialRegion } = buildMapPins(items);

        setState({
          pins,
          initialRegion,
          status: LOAD_STATUS.READY,
          errorMessage: null,
        });
        setSelectedEntryId((current) => (pins.some((pin) => pin.id === current) ? current : null));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          status: LOAD_STATUS.ERROR,
          errorMessage: error.message || '地図イベントの読み込みに失敗しました',
        }));
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [refreshKey, reloadToken]);

  return {
    ...state,
    selectedEntryId,
    selectedPin: state.pins.find((pin) => pin.id === selectedEntryId) ?? null,
    selectPin(entryId) {
      setSelectedEntryId(entryId);
    },
    reload() {
      setReloadToken((current) => current + 1);
    },
  };
}
