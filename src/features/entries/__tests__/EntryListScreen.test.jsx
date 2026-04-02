import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { EntryListScreen } from '../screens/EntryListScreen';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('EntryListScreen', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('shows a media-first timeline with a floating create action', async () => {
    const onCreateEntry = jest.fn();
    const onOpenEntry = jest.fn();
    const { getByTestId, getByText, queryByText } = render(
      <EntryListScreen onCreateEntry={onCreateEntry} onOpenEntry={onOpenEntry} />
    );

    await waitFor(() => {
      expect(getByTestId('entry-card-entry-1')).toBeTruthy();
    });

    expect(getByText('神田川の散歩 2026/03/28')).toBeTruthy();
    expect(getByText('2026/03/28 / 神田川の散歩')).toBeTruthy();
    expect(getByTestId('create-entry-fab')).toBeTruthy();
    expect(queryByText('Photo Diary')).toBeNull();
    expect(queryByText('イベント一覧')).toBeNull();
    expect(queryByText('2枚')).toBeNull();

    fireEvent.press(getByTestId('create-entry-fab'));
    expect(onCreateEntry).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('entry-card-entry-1'));
    expect(onOpenEntry).toHaveBeenCalledWith('entry-1');
  });
});
