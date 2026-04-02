import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import {
  createEntryRepositorySeed,
  getEntryDetailAggregate,
  saveEntryDraft,
} from '../../entries/repositories/entryRepository';
import { MapScreen } from '../screens/MapScreen';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('MapScreen', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('shows a callout and opens the entry detail route', async () => {
    const onOpenEntry = jest.fn();
    const { getByTestId, queryByText } = render(<MapScreen onOpenEntry={onOpenEntry} />);

    await waitFor(() => {
      expect(getByTestId('map-marker-entry-1')).toBeTruthy();
    });

    expect(queryByText('地図で振り返る')).toBeNull();
    fireEvent.press(getByTestId('map-marker-entry-1'));
    expect(getByTestId('map-selection-chip')).toBeTruthy();

    fireEvent.press(getByTestId('map-callout-entry-1'));

    expect(onOpenEntry).toHaveBeenCalledWith('entry-1');
  });

  it('shows an empty state when no entries have coordinates', async () => {
    const seed = createEntryRepositorySeed();
    seed.entries = seed.entries.map((entry) => ({
      ...entry,
      lat: null,
      lng: null,
    }));
    seed.photos = seed.photos.map((photo) => ({
      ...photo,
      lat: null,
      lng: null,
    }));
    resetAppState(seed);

    const { getByTestId, getByText } = render(<MapScreen onOpenEntry={jest.fn()} />);

    await waitFor(() => {
      expect(getByText('位置情報付きイベントがまだありません')).toBeTruthy();
    });

    expect(getByTestId('map-empty-overlay')).toBeTruthy();
  });

  it('reloads map data when the refreshKey changes', async () => {
    const onOpenEntry = jest.fn();
    const { getAllByText, getByTestId, rerender } = render(
      <MapScreen onOpenEntry={onOpenEntry} refreshKey={0} />
    );

    await waitFor(() => {
      expect(getByTestId('map-marker-entry-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-marker-entry-1'));

    expect(getAllByText('神田川の散歩 2026/03/28').length).toBeGreaterThan(0);

    const detail = await getEntryDetailAggregate('entry-1');
    await saveEntryDraft({
      mode: 'edit',
      entryId: detail.entry.id,
      eventDate: detail.entry.eventDate,
      photos: detail.photos,
      draftVoicePath: detail.entry.voicePath,
      lat: detail.entry.lat,
      lng: detail.entry.lng,
      placeName: detail.entry.placeName,
      title: '地図で更新したタイトル',
    });

    rerender(<MapScreen onOpenEntry={onOpenEntry} refreshKey={1} />);

    await waitFor(() => {
      expect(getByTestId('map-marker-entry-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-marker-entry-1'));

    await waitFor(() => {
      expect(getAllByText('地図で更新したタイトル').length).toBeGreaterThan(0);
    });
  });
});
