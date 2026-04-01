import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { createNavigationContainerRef } from '@react-navigation/native';

import App from '../App';
import { AppNavigator } from '../src/app/navigation/AppNavigator';
import {
  getEntryDetailAggregate,
  saveEntryDraft,
} from '../src/features/entries/repositories/entryRepository';
import { resetAppState } from '../src/shared/test-support/resetEntryRepository';

describe('App', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('switches to the map tab and opens detail from a map callout', async () => {
    const { getByTestId, getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('イベント一覧')).toBeTruthy();
    });

    fireEvent.press(getByText('Map'));

    await waitFor(() => {
      expect(getByText('地図で振り返る')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-marker-entry-1'));

    await waitFor(() => {
      expect(getByTestId('map-callout-entry-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-callout-entry-1'));

    await waitFor(() => {
      expect(getByText('Entry Detail')).toBeTruthy();
    });
  });

  it('moves from detail view to edit mode through the Edit action', async () => {
    const { getByTestId, getByText, getByDisplayValue } = render(<App />);

    await waitFor(() => {
      expect(getByText('イベント一覧')).toBeTruthy();
    });

    fireEvent.press(getByTestId('entry-card-entry-1'));

    await waitFor(() => {
      expect(getByText('Entry Detail')).toBeTruthy();
    });

    fireEvent.press(getByText('Edit'));

    await waitFor(() => {
      expect(getByText('イベントを編集')).toBeTruthy();
    });

    expect(getByDisplayValue('神田川の散歩 2026/03/28')).toBeTruthy();
  });

  it('reloads the timeline after returning from detail', async () => {
    const navigationRef = createNavigationContainerRef();
    const { getByTestId, getByText } = render(<AppNavigator navigationRef={navigationRef} />);

    await waitFor(() => {
      expect(getByText('イベント一覧')).toBeTruthy();
    });

    fireEvent.press(getByTestId('entry-card-entry-1'));

    await waitFor(() => {
      expect(getByText('Entry Detail')).toBeTruthy();
    });

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
      title: '詳細から戻った後の一覧タイトル',
    });

    await act(async () => {
      navigationRef.goBack();
    });

    await waitFor(() => {
      expect(getByText('詳細から戻った後の一覧タイトル')).toBeTruthy();
    });
  });

  it('reloads the map after returning from detail', async () => {
    const navigationRef = createNavigationContainerRef();
    const { getByTestId, getByText } = render(<AppNavigator navigationRef={navigationRef} />);

    await waitFor(() => {
      expect(getByText('イベント一覧')).toBeTruthy();
    });

    fireEvent.press(getByText('Map'));

    await waitFor(() => {
      expect(getByText('地図で振り返る')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-marker-entry-1'));
    fireEvent.press(getByTestId('map-callout-entry-1'));

    await waitFor(() => {
      expect(getByText('Entry Detail')).toBeTruthy();
    });

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
      title: '詳細から戻った後の地図タイトル',
    });

    await act(async () => {
      navigationRef.goBack();
    });

    await waitFor(() => {
      expect(getByText('地図で振り返る')).toBeTruthy();
    });

    fireEvent.press(getByTestId('map-marker-entry-1'));

    await waitFor(() => {
      expect(getByText('詳細から戻った後の地図タイトル')).toBeTruthy();
    });
  });
});
