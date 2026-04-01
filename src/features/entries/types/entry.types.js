/**
 * @typedef {'localOnly' | 'pendingSync' | 'synced' | 'syncFailed'} EntrySyncStatus
 */

/**
 * @typedef {Object} Entry
 * @property {string} id
 * @property {string} title
 * @property {string} eventDate
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number | null} lat
 * @property {number | null} lng
 * @property {string | null} placeName
 * @property {string | null} voicePath
 * @property {string | null} coverPhotoUri
 * @property {number} photoCount
 * @property {EntrySyncStatus} syncStatus
 */

/**
 * @typedef {Object} PhotoAsset
 * @property {string} id
 * @property {string} entryId
 * @property {string} localUri
 * @property {string | null} originalFilename
 * @property {number | null} width
 * @property {number | null} height
 * @property {number | null} lat
 * @property {number | null} lng
 * @property {string | null} takenAt
 * @property {number} sortOrder
 */

/**
 * @typedef {Object} EntryDetailAggregate
 * @property {Entry} entry
 * @property {PhotoAsset[]} photos
 */

/**
 * @typedef {'idle' | 'loadingAssets' | 'editing' | 'recording' | 'saving' | 'saved' | 'error'} AddEntryStatus
 */

/**
 * @typedef {Object} AddEntryFormState
 * @property {'create' | 'edit'} mode
 * @property {string | null} entryId
 * @property {string} eventDate
 * @property {PhotoAsset[]} photos
 * @property {string | null} draftVoicePath
 * @property {number | null} lat
 * @property {number | null} lng
 * @property {string | null} placeName
 * @property {string} title
 * @property {AddEntryStatus} status
 * @property {boolean} canSave
 * @property {string | null} errorMessage
 */

export {};
