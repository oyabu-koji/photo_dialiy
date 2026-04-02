/* global jest */

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: {
      install: jest.fn(),
    },
    GestureHandlerRootView: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const initialMetrics = {
    frame: { x: 0, y: 0, width: 320, height: 640 },
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const SafeAreaInsetsContext = React.createContext(initialMetrics.insets);
  const SafeAreaFrameContext = React.createContext(initialMetrics.frame);

  return {
    __esModule: true,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    SafeAreaProvider: ({ children }) =>
      React.createElement(
        SafeAreaFrameContext.Provider,
        { value: initialMetrics.frame },
        React.createElement(
          SafeAreaInsetsContext.Provider,
          { value: initialMetrics.insets },
          React.createElement(View, null, children)
        )
      ),
    SafeAreaView: ({ children, ...props }) => React.createElement(View, props, children),
    useSafeAreaInsets: () => initialMetrics.insets,
    useSafeAreaFrame: () => initialMetrics.frame,
    initialWindowMetrics: initialMetrics,
  };
});

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({
    granted: true,
  })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: true,
    assets: [],
  })),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({
    granted: true,
  })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: {
      latitude: 35.68,
      longitude: 139.76,
    },
  })),
  reverseGeocodeAsync: jest.fn(async () => [
    {
      name: 'テスト地点',
    },
  ]),
}));

jest.mock('expo-av', () => {
  class MockRecording {
    async prepareToRecordAsync() {}

    async startAsync() {}

    async stopAndUnloadAsync() {}

    getURI() {
      return 'file:///voices/mock-recording.m4a';
    }
  }

  const sound = {
    async getStatusAsync() {
      return {
        isLoaded: true,
        isPlaying: false,
      };
    },
    async playAsync() {},
    async pauseAsync() {},
    async unloadAsync() {},
    setOnPlaybackStatusUpdate() {},
  };

  return {
    Audio: {
      requestPermissionsAsync: jest.fn(async () => ({
        granted: true,
      })),
      setAudioModeAsync: jest.fn(async () => undefined),
      Recording: MockRecording,
      RecordingOptionsPresets: {
        HIGH_QUALITY: {},
      },
      Sound: {
        createAsync: jest.fn(async () => ({
          sound,
        })),
      },
    },
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { Pressable, View } = require('react-native');

  const MapView = ({ children, ...props }) => React.createElement(View, props, children);

  const Marker = ({ children, onPress, ...props }) =>
    React.createElement(
      Pressable,
      {
        ...props,
        accessibilityRole: 'button',
        onPress,
      },
      children
    );

  const Callout = ({ children, onPress, ...props }) =>
    React.createElement(
      Pressable,
      {
        ...props,
        accessibilityRole: 'button',
        onPress,
      },
      children
    );

  return {
    __esModule: true,
    default: MapView,
    Callout,
    Marker,
  };
});

jest.mock('react-native-image-viewing', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');

  function MockImageViewing({
    HeaderComponent,
    imageIndex = 0,
    images = [],
    onImageIndexChange,
    onRequestClose,
    visible,
  }) {
    if (!visible) {
      return null;
    }

    return React.createElement(
      View,
      {
        testID: 'entry-photo-lightbox-viewer',
      },
      HeaderComponent ? React.createElement(HeaderComponent, { imageIndex }) : null,
      React.createElement(Text, { testID: 'entry-photo-lightbox-image-count' }, images.length),
      React.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          onPress: () => onImageIndexChange?.(Math.min(images.length - 1, imageIndex + 1)),
          testID: 'mock-lightbox-next',
        },
        React.createElement(Text, null, 'Next')
      ),
      React.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          onPress: () => onRequestClose?.(),
          testID: 'mock-lightbox-dismiss',
        },
        React.createElement(Text, null, 'Dismiss')
      )
    );
  }

  return {
    __esModule: true,
    default: MockImageViewing,
  };
});
