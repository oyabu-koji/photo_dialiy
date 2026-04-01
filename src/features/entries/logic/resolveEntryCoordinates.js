function roundCoordinate(value) {
  return Math.round(value * 1000000) / 1000000;
}

export function resolveEntryCoordinates(photos) {
  const locatedPhotos = photos.filter(
    (photo) => typeof photo.lat === 'number' && typeof photo.lng === 'number'
  );

  if (locatedPhotos.length === 0) {
    return {
      lat: null,
      lng: null,
    };
  }

  const totals = locatedPhotos.reduce(
    (result, photo) => ({
      lat: result.lat + photo.lat,
      lng: result.lng + photo.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: roundCoordinate(totals.lat / locatedPhotos.length),
    lng: roundCoordinate(totals.lng / locatedPhotos.length),
  };
}
