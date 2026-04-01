import * as ImagePicker from 'expo-image-picker';

let photoSequence = 0;

function readExifCoordinate(exif, latitudeKey, longitudeKey) {
  const latitude = exif?.[latitudeKey];
  const longitude = exif?.[longitudeKey];

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return {
      lat: latitude,
      lng: longitude,
    };
  }

  return {
    lat: null,
    lng: null,
  };
}

export async function pickPhotos() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('写真ライブラリへのアクセスを許可してください');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    mediaTypes: ['images'],
    exif: true,
    quality: 1,
  });

  if (result.canceled) {
    return [];
  }

  const mappedAssets = result.assets.map((asset, index) => {
    const nextSequence = photoSequence + index + 1;
    const coordinates = readExifCoordinate(asset.exif, 'GPSLatitude', 'GPSLongitude');

    return {
      id: asset.assetId || `draft-photo-${nextSequence}`,
      entryId: 'draft',
      localUri: asset.uri,
      originalFilename: asset.fileName || null,
      width: asset.width ?? null,
      height: asset.height ?? null,
      lat: coordinates.lat,
      lng: coordinates.lng,
      takenAt: asset.exif?.DateTimeOriginal || asset.exif?.DateTime || null,
      sortOrder: photoSequence + index,
    };
  });

  photoSequence += mappedAssets.length;

  return mappedAssets;
}

export function __resetPhotoPickerService() {
  photoSequence = 0;
}
