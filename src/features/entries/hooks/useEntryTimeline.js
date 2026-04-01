import { useEffect, useState } from 'react';

import { listEntries } from '../repositories/entryRepository';
import { LOAD_STATUS } from '../types/entryStatus';

export function useEntryTimeline(refreshKey = 0) {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState({
    items: [],
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
        const items = await listEntries();

        if (!isActive) {
          return;
        }

        setState({
          items,
          status: LOAD_STATUS.READY,
          errorMessage: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          status: LOAD_STATUS.ERROR,
          errorMessage: error.message || 'イベント一覧の読み込みに失敗しました',
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
    reload() {
      setReloadToken((current) => current + 1);
    },
  };
}
