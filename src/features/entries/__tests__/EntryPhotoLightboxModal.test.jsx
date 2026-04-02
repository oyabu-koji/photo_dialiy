import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { createEntryRepositorySeed } from '../repositories/entryRepository';
import { EntryPhotoLightboxModal } from '../components/EntryPhotoLightboxModal';

describe('EntryPhotoLightboxModal', () => {
  it('opens at the requested index and updates the visible counter', () => {
    const seed = createEntryRepositorySeed();
    const photos = seed.photos.filter((photo) => photo.entryId === 'entry-1');
    const { getByTestId, getByText } = render(
      <EntryPhotoLightboxModal
        initialIndex={1}
        onRequestClose={jest.fn()}
        photos={photos}
        visible
      />
    );

    expect(getByTestId('entry-photo-lightbox-viewer')).toBeTruthy();
    expect(getByText('2 / 2')).toBeTruthy();

    fireEvent.press(getByTestId('mock-lightbox-next'));

    expect(getByText('2 / 2')).toBeTruthy();
  });

  it('uses the same close callback for the explicit button and dismiss gesture', () => {
    const seed = createEntryRepositorySeed();
    const photos = seed.photos.filter((photo) => photo.entryId === 'entry-1');
    const onRequestClose = jest.fn();
    const { getByTestId } = render(
      <EntryPhotoLightboxModal
        initialIndex={0}
        onRequestClose={onRequestClose}
        photos={photos}
        visible
      />
    );

    fireEvent.press(getByTestId('entry-photo-lightbox-close'));
    fireEvent.press(getByTestId('mock-lightbox-dismiss'));

    expect(onRequestClose).toHaveBeenCalledTimes(2);
  });
});
