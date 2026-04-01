import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAddEntryForm } from '../hooks/useAddEntryForm';
import { resetAppState } from '../../../shared/test-support/resetEntryRepository';

describe('useAddEntryForm', () => {
  beforeEach(() => {
    resetAppState();
  });

  it('supports create mode and edit mode initialization', async () => {
    const { result, rerender } = renderHook(
      ({ routeParams }) => useAddEntryForm(routeParams),
      {
        initialProps: {
          routeParams: { mode: 'create' },
        },
      }
    );

    expect(result.current.formState.mode).toBe('create');
    expect(result.current.formState.photos).toHaveLength(0);
    expect(result.current.formState.canSave).toBe(false);

    rerender({
      routeParams: {
        mode: 'edit',
        entryId: 'entry-1',
      },
    });

    await waitFor(() => {
      expect(result.current.formState.status).toBe('editing');
    });

    expect(result.current.formState.mode).toBe('edit');
    expect(result.current.formState.entryId).toBe('entry-1');
    expect(result.current.formState.photos).toHaveLength(2);
    expect(result.current.formState.title).toBe('神田川の散歩 2026/03/28');
    expect(result.current.formState.draftVoicePath).toBe('file:///voices/entry-1.m4a');

    await act(async () => {
      await result.current.removePhoto('photo-entry-1-2');
    });

    expect(result.current.formState.photos).toHaveLength(1);
  });
});
