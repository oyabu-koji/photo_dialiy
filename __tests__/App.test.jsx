import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';

describe('App', () => {
  it('renders the bootstrap copy', () => {
    const { getByText } = render(<App />);

    expect(getByText('Photo Diary')).toBeTruthy();
    expect(getByText('Expo managed workflow is ready.')).toBeTruthy();
  });
});
