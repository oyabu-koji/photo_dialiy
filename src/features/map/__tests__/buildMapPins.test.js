import { buildMapPins } from '../logic/buildMapPins';

describe('buildMapPins', () => {
  it('filters entries without coordinates and computes a region', () => {
    const { pins, initialRegion } = buildMapPins([
      {
        id: 'entry-1',
        title: '位置あり 1',
        eventDate: '2026-03-28T09:15:00.000Z',
        placeName: '神田川',
        coverPhotoUri: 'file:///photos/entry-1.jpg',
        lat: 35.702124,
        lng: 139.759421,
      },
      {
        id: 'entry-2',
        title: '位置なし',
        eventDate: '2026-03-29T09:15:00.000Z',
        placeName: null,
        coverPhotoUri: null,
        lat: null,
        lng: null,
      },
      {
        id: 'entry-3',
        title: '位置あり 2',
        eventDate: '2026-03-25T06:40:00.000Z',
        placeName: '日本橋',
        coverPhotoUri: 'file:///photos/entry-3.jpg',
        lat: 35.683212,
        lng: 139.774098,
      },
    ]);

    expect(pins).toHaveLength(2);
    expect(pins.map((pin) => pin.id)).toEqual(['entry-1', 'entry-3']);
    expect(initialRegion).not.toBeNull();
    expect(initialRegion.latitude).toBeCloseTo(35.692668, 5);
    expect(initialRegion.longitude).toBeCloseTo(139.7667595, 5);
    expect(initialRegion.latitudeDelta).toBeGreaterThan(0);
    expect(initialRegion.longitudeDelta).toBeGreaterThan(0);
  });

  it('returns null region when no valid coordinates exist', () => {
    const { pins, initialRegion } = buildMapPins([
      {
        id: 'entry-1',
        title: '位置なし',
        eventDate: '2026-03-28T09:15:00.000Z',
        placeName: null,
        coverPhotoUri: null,
        lat: null,
        lng: null,
      },
    ]);

    expect(pins).toEqual([]);
    expect(initialRegion).toBeNull();
  });
});
