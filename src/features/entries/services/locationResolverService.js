import * as Location from 'expo-location';

import { resolveEntryCoordinates } from '../logic/resolveEntryCoordinates';

function formatPlaceName(lat, lng) {
  if (lat === null || lng === null) {
    return null;
  }

  return `${lat.toFixed(3)}, ${lng.toFixed(3)} 付近`;
}

async function reverseGeocode(lat, lng) {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });
    const first = results[0];

    if (!first) {
      return formatPlaceName(lat, lng);
    }

    return (
      first.name ||
      first.street ||
      first.district ||
      first.city ||
      first.subregion ||
      formatPlaceName(lat, lng)
    );
  } catch (_error) {
    return formatPlaceName(lat, lng);
  }
}

export async function resolveLocationFromPhotos(photos) {
  const photoCoordinates = resolveEntryCoordinates(photos);

  if (photoCoordinates.lat !== null && photoCoordinates.lng !== null) {
    return {
      ...photoCoordinates,
      placeName: await reverseGeocode(photoCoordinates.lat, photoCoordinates.lng),
    };
  }

  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    return {
      lat: null,
      lng: null,
      placeName: null,
    };
  }

  const currentPosition = await Location.getCurrentPositionAsync({});
  const coordinates = {
    lat: currentPosition.coords.latitude,
    lng: currentPosition.coords.longitude,
  };

  return {
    ...coordinates,
    placeName: await reverseGeocode(coordinates.lat, coordinates.lng),
  };
}
