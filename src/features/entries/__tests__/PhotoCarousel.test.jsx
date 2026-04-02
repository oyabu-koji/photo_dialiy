import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { createEntryRepositorySeed } from '../repositories/entryRepository';
import { PhotoCarousel } from '../components/PhotoCarousel';

describe('PhotoCarousel', () => {
  it('opens the tapped photo index through the provided callback', () => {
    const seed = createEntryRepositorySeed();
    const photos = seed.photos.filter((photo) => photo.entryId === 'entry-1');
    const onPhotoPress = jest.fn();
    const { getByTestId } = render(<PhotoCarousel onPhotoPress={onPhotoPress} photos={photos} />);

    fireEvent.press(getByTestId('photo-trigger-photo-entry-1-2'));

    expect(onPhotoPress).toHaveBeenCalledWith(1);
  });
});
