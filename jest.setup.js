/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("react-native-worklets", () =>
  require("react-native-worklets/lib/module/mock"),
);
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("react-native-keyboard-controller", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    KeyboardProvider: ({ children }) => children,
    KeyboardAvoidingView: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({
    granted: true,
  })),
  launchImageLibraryAsync: jest.fn(async () => ({ canceled: true })),
}));

jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn(async () => ({ uri: "file:///mock/invoice.pdf" })),
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-router", () => {
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  };
  return {
    router,
    useRouter: () => router,
    useLocalSearchParams: jest.fn(() => ({})),
    useFocusEffect: jest.fn(),
    useNavigation: jest.fn(() => ({})),
    Link: ({ children }) => children,
    Stack: Object.assign(
      ({ children }) => children,
      {
        Screen: () => null,
        Protected: ({ children }) => children,
      },
    ),
  };
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const makeIconSet = (name) => {
    function Icon({ name: iconName, ...props }) {
      return React.createElement(Text, props, `${name}:${iconName}`);
    }
    return Icon;
  };
  return new Proxy(
    {},
    {
      get: (_target, iconSetName) => makeIconSet(iconSetName),
    },
  );
});
