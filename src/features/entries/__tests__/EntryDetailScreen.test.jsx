import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { EntryDetailScreen } from '../screens/EntryDetailScreen';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('EntryDetailScreen', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('renders a read-only detail screen and exposes the Edit action only', async () => {
    const onEditEntry = jest.fn();
    const { getByTestId, getByText, queryByLabelText, queryByText } = render(
      <EntryDetailScreen entryId="entry-1" onEditEntry={onEditEntry} />
    );

    await waitFor(() => {
      expect(getByText('神田川の散歩 2026/03/28')).toBeTruthy();
    });

    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('音声メモを保存済みです。')).toBeTruthy();
    expect(getByTestId('photo-preview-photo-entry-1-1')).toBeTruthy();
    expect(queryByLabelText('イベントタイトル')).toBeNull();
    expect(queryByText('写真を追加')).toBeNull();
    expect(queryByText('更新する')).toBeNull();
    expect(queryByText('file:///voices/entry-1.m4a')).toBeNull();
    expect(queryByText('file:///photos/entry-1-cover.jpg')).toBeNull();

    fireEvent.press(getByText('Edit'));
    expect(onEditEntry).toHaveBeenCalledWith('entry-1');
  });
});
