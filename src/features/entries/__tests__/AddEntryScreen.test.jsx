import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AddEntryScreen } from '../screens/AddEntryScreen';
import { __getEntryRepositorySnapshot } from '../repositories/entryRepository';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('AddEntryScreen', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('loads edit mode values and saves updates', async () => {
    const onSaved = jest.fn();
    const { getByDisplayValue, getByTestId, getByText, queryByText } = render(
      <AddEntryScreen
        onCancel={jest.fn()}
        onSaved={onSaved}
        routeParams={{ mode: 'edit', entryId: 'entry-1' }}
      />
    );

    await waitFor(() => {
      expect(getByDisplayValue('神田川の散歩 2026/03/28')).toBeTruthy();
    });

    expect(getByText('録音済みの音声メモがあります。')).toBeTruthy();
    expect(getByTestId('photo-preview-photo-entry-1-1')).toBeTruthy();
    expect(queryByText('Edit Entry')).toBeNull();
    expect(queryByText('イベントを編集')).toBeNull();
    expect(queryByText(/位置:/)).toBeNull();
    expect(queryByText('file:///voices/entry-1.m4a')).toBeNull();
    expect(queryByText('file:///photos/entry-1-cover.jpg')).toBeNull();

    fireEvent.changeText(getByDisplayValue('神田川の散歩 2026/03/28'), '夜の散歩メモ');
    fireEvent.press(getByText('更新する'));

    await waitFor(() => {
      expect(onSaved).toHaveBeenCalled();
    });

    const snapshot = __getEntryRepositorySnapshot();
    const updatedEntry = snapshot.entries.find((entry) => entry.id === 'entry-1');

    expect(updatedEntry.title).toBe('夜の散歩メモ');
  });
});
