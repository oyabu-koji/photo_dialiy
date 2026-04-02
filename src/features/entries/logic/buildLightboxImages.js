export function clampLightboxIndex(index, total) {
  if (total <= 0) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= total) {
    return total - 1;
  }

  return index;
}

export function buildLightboxImages(photos) {
  return photos.map((photo) => ({
    uri: photo.localUri,
  }));
}
