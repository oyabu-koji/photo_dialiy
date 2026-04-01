export const ENTRY_SYNC_STATUS = Object.freeze({
  LOCAL_ONLY: 'localOnly',
  PENDING_SYNC: 'pendingSync',
  SYNCED: 'synced',
  SYNC_FAILED: 'syncFailed',
});

export const ADD_ENTRY_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING_ASSETS: 'loadingAssets',
  EDITING: 'editing',
  RECORDING: 'recording',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
});

export const LOAD_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
});
