export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export function validateEntryDraft(draft) {
  if (!draft.photos || draft.photos.length === 0) {
    throw new ValidationError('写真を1枚以上追加してください', {
      field: 'photos',
    });
  }

  return true;
}
