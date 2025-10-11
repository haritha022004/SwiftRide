import '@testing-library/jest-dom';

// Suppress-specific -warnings
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      args[0].includes("React Router Future Flag Warning") ||
      args[0].includes("punycode module is deprecated")
    ) return;
    originalWarn(...args);
  };
});

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0]?.toString() || "";
    if (
      msg.includes("not wrapped in act") ||
      msg.includes("Network Error") ||
      msg.includes("API failed") ||
      msg.includes("react-test-renderer is deprecated") ||
      msg.includes("punycode module is deprecated")
    ) return;
    originalError(...args);
  };
});

// Global fetch mock for each test
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]), // return mock data
      text: () => Promise.resolve(""),
    })
  );
});

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  jest.resetModules();
  if (global.fetch && global.fetch.mockRestore) {
    global.fetch.mockRestore();
  }
});

// Restore console after all tests
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
