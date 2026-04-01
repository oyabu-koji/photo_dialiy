import { useEffect, useState } from 'react';

import { getEntryDetailAggregate } from '../repositories/entryRepository';
import { LOAD_STATUS } from '../types/entryStatus';

export function useEntryDetail(entryId, refreshKey = 0) {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState({
    detail: null,
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
        const detail = await getEntryDetailAggregate(entryId);

        if (!isActive) {
          return;
        }

        setState({
          detail,
          status: LOAD_STATUS.READY,
          errorMessage: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          detail: null,
          status: LOAD_STATUS.ERROR,
          errorMessage: error.message || 'イベント詳細の読み込みに失敗しました',
        });
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [entryId, refreshKey, reloadToken]);

  return {
    ...state,
    reload() {
      setReloadToken((current) => current + 1);
    },
  };
}
