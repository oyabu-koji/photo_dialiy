const SINGLE_PIN_DELTA = 0.04;
const MIN_REGION_DELTA = 0.02;
const REGION_PADDING_RATIO = 1.8;

function hasCoordinate(entry) {
  return Number.isFinite(entry.lat) && Number.isFinite(entry.lng);
}

export function buildInitialRegion(pins) {
  if (pins.length === 0) {
    return null;
  }

  if (pins.length === 1) {
    return {
      latitude: pins[0].coordinate.latitude,
      longitude: pins[0].coordinate.longitude,
      latitudeDelta: SINGLE_PIN_DELTA,
      longitudeDelta: SINGLE_PIN_DELTA,
    };
  }

  const latitudes = pins.map((pin) => pin.coordinate.latitude);
  const longitudes = pins.map((pin) => pin.coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max(
      (maxLatitude - minLatitude) * REGION_PADDING_RATIO,
      MIN_REGION_DELTA
    ),
    longitudeDelta: Math.max(
      (maxLongitude - minLongitude) * REGION_PADDING_RATIO,
      MIN_REGION_DELTA
    ),
  };
}

export function buildMapPins(entries) {
  const pins = entries
    .filter(hasCoordinate)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      eventDate: entry.eventDate,
      placeName: entry.placeName,
      coverPhotoUri: entry.coverPhotoUri,
      coordinate: {
        latitude: entry.lat,
        longitude: entry.lng,
      },
    }));

  return {
    pins,
    initialRegion: buildInitialRegion(pins),
  };
}
