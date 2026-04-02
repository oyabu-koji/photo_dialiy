import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { createEntryRepositorySeed } from '../repositories/entryRepository';
import { EntryDetailScreen } from '../screens/EntryDetailScreen';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('EntryDetailScreen', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('renders a read-only detail screen, opens the photo lightbox, and keeps the Edit action only', async () => {
    const onEditEntry = jest.fn();
    const { getByTestId, getByText, queryByLabelText, queryByText, queryByTestId } = render(
      <EntryDetailScreen entryId="entry-1" onEditEntry={onEditEntry} />
    );

    await waitFor(() => {
      expect(getByText('神田川の散歩 2026/03/28')).toBeTruthy();
    });

    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('音声メモを保存済みです。')).toBeTruthy();
    expect(getByTestId('entry-location-map')).toBeTruthy();
    expect(getByTestId('photo-preview-photo-entry-1-1')).toBeTruthy();
    expect(queryByLabelText('イベントタイトル')).toBeNull();
    expect(queryByText('Entry Detail')).toBeNull();
    expect(queryByText('写真を追加')).toBeNull();
    expect(queryByText('更新する')).toBeNull();
    expect(queryByText(/sync:/)).toBeNull();
    expect(queryByText('file:///voices/entry-1.m4a')).toBeNull();
    expect(queryByText('file:///photos/entry-1-cover.jpg')).toBeNull();

    fireEvent.scroll(getByTestId('entry-detail-scroll'), {
      nativeEvent: {
        contentOffset: {
          x: 0,
          y: 180,
        },
      },
    });

    fireEvent.press(getByTestId('photo-trigger-photo-entry-1-1'));
    expect(getByTestId('entry-photo-lightbox-viewer')).toBeTruthy();
    expect(getByText('1 / 2')).toBeTruthy();

    fireEvent.press(getByTestId('mock-lightbox-next'));
    expect(getByText('2 / 2')).toBeTruthy();

    fireEvent.press(getByTestId('entry-photo-lightbox-close'));
    await waitFor(() => {
      expect(queryByTestId('entry-photo-lightbox-viewer')).toBeNull();
    });
    expect(getByTestId('entry-detail-scroll').props.nativeID).toBe(
      'entry-detail-scroll-restored-180'
    );

    fireEvent.press(getByTestId('photo-trigger-photo-entry-1-1'));
    expect(getByText('1 / 2')).toBeTruthy();

    fireEvent.press(getByTestId('mock-lightbox-dismiss'));
    await waitFor(() => {
      expect(queryByTestId('entry-photo-lightbox-viewer')).toBeNull();
    });

    fireEvent.press(getByText('Edit'));
    expect(onEditEntry).toHaveBeenCalledWith('entry-1');
  });

  it('shows a compact fallback when the entry has no coordinates', async () => {
    const seed = createEntryRepositorySeed();
    seed.entries = seed.entries.map((entry) =>
      entry.id === 'entry-1'
        ? {
            ...entry,
            lat: null,
            lng: null,
            placeName: null,
          }
        : entry
    );
    resetAppState(seed);

    const { getByTestId, getByText, queryByTestId } = render(
      <EntryDetailScreen entryId="entry-1" onEditEntry={jest.fn()} />
    );

    await waitFor(() => {
      expect(getByText('神田川の散歩 2026/03/28')).toBeTruthy();
    });

    expect(getByTestId('entry-location-fallback')).toBeTruthy();
    expect(getByText('位置情報なし')).toBeTruthy();
    expect(queryByTestId('entry-location-map')).toBeNull();
  });
});
